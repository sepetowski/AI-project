using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminKeyFieldsToRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "RoleKeyUpdatedAtUtc",
                table: "Roles",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "RoleKeyValidUntilUtc",
                table: "Roles",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("6884f7d7-ad1f-4101-8df3-7a6fa7387d81"),
                columns: new[] { "RoleKeyUpdatedAtUtc", "RoleKeyValidUntilUtc" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("f7248fc3-2585-4efb-8d1d-1c555f4087f6"),
                columns: new[] { "RoleKeyUpdatedAtUtc", "RoleKeyValidUntilUtc" },
                values: new object[] { null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RoleKeyUpdatedAtUtc",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "RoleKeyValidUntilUtc",
                table: "Roles");
        }
    }
}
