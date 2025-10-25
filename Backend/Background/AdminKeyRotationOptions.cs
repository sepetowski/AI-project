
namespace LibraryAPI.Background
{
    public sealed class AdminKeyRotationOptions
    {
        public TimeSpan Interval { get; set; } = TimeSpan.FromMinutes(15);
        public int KeyBytes { get; set; } = 32;
    }
}