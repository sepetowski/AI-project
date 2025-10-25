namespace LibraryAPI.Models.Domain
{
    public class Role
    {
        public required Guid Id { get; set; }
        public UserRole UserRole { get; set; } 
        public string? RoleKey { get; set; }
        public DateTimeOffset? RoleKeyUpdatedAtUtc { get; set; }
        public DateTimeOffset? RoleKeyValidUntilUtc { get; set; }
    }

        public enum UserRole
    {
        Admin,
        User
    }
}
