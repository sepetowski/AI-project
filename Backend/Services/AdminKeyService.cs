using LibraryAPI.Background;
using LibraryAPI.Data;
using LibraryAPI.Interfaces;
using LibraryAPI.Models.Domain;
using LibraryAPI.Models.DTO.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;

namespace LibraryAPI.Services
{

    public sealed class AdminKeyService : IAdminKeyService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly AdminKeyRotationOptions _options;
        private readonly AdminKeyRotationCoordinator _coordinator;
        private readonly ILogger<AdminKeyService> _logger;

        public AdminKeyService(
            IServiceScopeFactory scopeFactory,
            IOptions<AdminKeyRotationOptions> options,
            AdminKeyRotationCoordinator coordinator,
            ILogger<AdminKeyService> logger)
        {
            _scopeFactory = scopeFactory;
            _options = options.Value;
            _coordinator = coordinator;
            _logger = logger;
        }

        public async Task<AdminKeyDTO?> GetAsync(CancellationToken ct)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataContext>();

            var adminRole = await db.Roles.FirstOrDefaultAsync(r => r.UserRole == UserRole.Admin, ct);
            if (adminRole is null || adminRole.RoleKey is null)
                return null;

            return new AdminKeyDTO()
            {
                Key = adminRole.RoleKey,
                UpdatedAtUtc = adminRole.RoleKeyUpdatedAtUtc ?? DateTimeOffset.MinValue,
                ValidUntilUtc = adminRole.RoleKeyValidUntilUtc ?? DateTimeOffset.MinValue
            };
        }

        public async Task<AdminKeyDTO> RotateNowAsync(CancellationToken ct)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataContext>();

            var adminRole = await db.Roles.FirstOrDefaultAsync(r => r.UserRole == UserRole.Admin, ct);
            if (adminRole is null)
                throw new InvalidOperationException("Admin role not found.");

            var now = DateTimeOffset.UtcNow;
            var newKey = GenerateBase64UrlKey(_options.KeyBytes);
            adminRole.RoleKey = newKey;
            adminRole.RoleKeyUpdatedAtUtc = now;
            adminRole.RoleKeyValidUntilUtc = now.Add(_options.Interval);

            await db.SaveChangesAsync(ct);

            _coordinator.Reset();

            _logger.LogInformation("Admin key rotated on-demand at {Time}.", now);

            return new AdminKeyDTO()
            {
                Key = newKey,
                UpdatedAtUtc = adminRole.RoleKeyUpdatedAtUtc.Value,
                ValidUntilUtc = adminRole.RoleKeyValidUntilUtc.Value
            };
        }

        private static string GenerateBase64UrlKey(int byteLength)
        {
            var bytes = RandomNumberGenerator.GetBytes(byteLength);
            var b64 = Convert.ToBase64String(bytes).Replace('+', '-').Replace('/', '_').TrimEnd('=');
            return b64;
        }
    }
}