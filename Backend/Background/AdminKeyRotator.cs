using LibraryAPI.Data;
using LibraryAPI.Interfaces;
using LibraryAPI.Models.Domain;
using LibraryAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace LibraryAPI.Background
{
    public sealed class AdminKeyRotator : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IAdminKeyService _keyService;
        private readonly ILogger<AdminKeyRotator> _logger;
        private readonly AdminKeyRotationOptions _options;
        private readonly AdminKeyRotationCoordinator _coordinator;

        public AdminKeyRotator(
            IServiceScopeFactory scopeFactory,
            ILogger<AdminKeyRotator> logger,
            IOptions<AdminKeyRotationOptions> options,
            AdminKeyRotationCoordinator coordinator,
            IAdminKeyService keyService)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            _options = options.Value;
            _coordinator = coordinator;
            _keyService = keyService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("AdminKeyRotator service started at {Time}. Interval: {Interval} minutes, Key size: {KeyBytes} bytes",
                DateTimeOffset.UtcNow, _options.Interval.TotalMinutes, _options.KeyBytes);

            await EnsureHasKeyAsync(stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var (now, nextAt) = await GetNowAndNextAsync(stoppingToken);
                    var delay = nextAt - now;
                    if (delay < TimeSpan.Zero) delay = TimeSpan.Zero;

                    _logger.LogInformation("Next admin key rotation scheduled at {NextTime} (in {DelayMinutes:F2} minutes).", nextAt, delay.TotalMinutes);

                    using var linked = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken, _coordinator.Token);
                    try
                    {
                        await Task.Delay(delay, linked.Token);
                    }
                    catch (OperationCanceledException) when (!stoppingToken.IsCancellationRequested)
                    {
                        _logger.LogDebug("Admin key rotation delay was canceled due to external reset (manual rotation likely triggered).");
                        continue;
                    }

                    _logger.LogInformation("Performing scheduled admin key rotation at {Time}.", DateTimeOffset.UtcNow);
                    await _keyService.RotateNowAsync(stoppingToken);
                    _logger.LogInformation("Admin key rotation completed successfully at {Time}.", DateTimeOffset.UtcNow);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    _logger.LogInformation("AdminKeyRotator is shutting down gracefully at {Time}.", DateTimeOffset.UtcNow);
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "AdminKeyRotator encountered an error. Retrying in 10 seconds.");
                    try
                    {
                        await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
                    }
                    catch
                    {
                        // ignore if cancellation requested
                    }
                }
            }

            _logger.LogInformation("AdminKeyRotator stopped at {Time}.", DateTimeOffset.UtcNow);
        }

        private async Task EnsureHasKeyAsync(CancellationToken ct)
        {
            _logger.LogDebug("Ensuring admin role has a valid key...");

            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataContext>();
            var adminRole = await db.Roles.FirstOrDefaultAsync(r => r.UserRole == UserRole.Admin, ct);

            if (adminRole is null)
            {
                _logger.LogWarning("Admin role not found during EnsureHasKeyAsync(). Skipping initialization.");
                return;
            }

            if (string.IsNullOrEmpty(adminRole.RoleKey))
            {
                _logger.LogWarning("Admin role has no key set. Generating a new one immediately.");
                await _keyService.RotateNowAsync(ct);
            }
            else if (adminRole.RoleKeyValidUntilUtc is null)
            {
                var now = DateTimeOffset.UtcNow;
                adminRole.RoleKeyUpdatedAtUtc ??= now;
                adminRole.RoleKeyValidUntilUtc = now.Add(_options.Interval);
                await db.SaveChangesAsync(ct);
                _logger.LogInformation("Admin key had no expiration date. Set valid-until to {ValidUntil}.", adminRole.RoleKeyValidUntilUtc);
            }
            else
            {
                _logger.LogDebug("Admin key already exists and is valid until {ValidUntil}.", adminRole.RoleKeyValidUntilUtc);
            }
        }

        private async Task<(DateTimeOffset now, DateTimeOffset nextAt)> GetNowAndNextAsync(CancellationToken ct)
        {
            var now = DateTimeOffset.UtcNow;
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataContext>();
            var adminRole = await db.Roles.FirstOrDefaultAsync(r => r.UserRole == UserRole.Admin, ct);

            if (adminRole?.RoleKeyValidUntilUtc is { } nextAt)
            {
                _logger.LogDebug("Fetched next rotation time from DB: {NextAt}", nextAt);
                return (now, nextAt);
            }

            _logger.LogWarning("No valid key expiration found in DB. Rotating immediately.");
            return (now, now);
        }
    }
}
