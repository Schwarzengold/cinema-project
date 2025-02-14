using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Cinema_API.Models;
using Cinema_API.Services;

namespace Cinema_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IAppEmailSender _emailSender;

        public AccountController(UserManager<ApplicationUser> userManager,
                                 SignInManager<ApplicationUser> signInManager,
                                 IAppEmailSender emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmationLink = Url.Action(nameof(ConfirmEmail), "Account", new { userId = user.Id, token }, Request.Scheme);
                await _emailSender.SendEmailAsync(model.Email, "Email Confirmation",
                    $"Please confirm your account by clicking this link: <a href='{confirmationLink}'>Confirm</a>");
                return Ok(new { Message = "Registration successful. Please check your email to confirm your account." });
            }
            return BadRequest(result.Errors);
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return BadRequest("Invalid user id");

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
                return Ok("Email confirmed successfully!");
            return BadRequest("Email confirmation error");
        }

    }
}
