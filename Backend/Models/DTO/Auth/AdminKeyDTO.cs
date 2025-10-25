namespace LibraryAPI.Models.DTO.Auth
{
    public class AdminKeyDTO
    {
        public string Key { get; set; } = string.Empty;
        public DateTimeOffset UpdatedAtUtc { get; set; }
        public DateTimeOffset ValidUntilUtc { get; set; }
    }
}
