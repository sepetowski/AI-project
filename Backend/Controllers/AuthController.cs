using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LibraryAPI.Interfaces;
using LibraryAPI.Models.DTO.Auth;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthSerivce _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthSerivce authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;

        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterReqDTO request)
        {
            try
            {
                var newUser = await _authService.CreateNewUserAsync(request);
                return Ok(newUser);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UserLoginReqDTO request)
        {
            try
            {
                var user = await _authService.LoginUserAsync(request);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("RefreshToken")]
        public async Task<IActionResult> GenerateRefreshToken([FromBody] RefreshTokenReqDTO req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var res = await _authService.GenerateRefreshTokenAsync(req.RefreshToken);

            if (res == null)
                return Unauthorized();

            return Ok(res);
        }


        [HttpGet("GetUsers")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await _authService.GetAllUsersAsync();
            return Ok(result);
        }

        [HttpPut("UpdateUser/{id:Guid}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserReqDTO req)
        {
            try
            {

            var result = await _authService.UpdateUserAsync(id, req);
           
            return Ok(result);
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
