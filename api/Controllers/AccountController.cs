using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly UserManager<IdentityUser<int>> _userManager;
        private readonly SignInManager<IdentityUser<int>> _signInManager;
        private readonly RoleManager<IdentityRole<int>> _roleManager;

        public AccountController(UserManager<IdentityUser<int>> userManager, SignInManager<IdentityUser<int>> signInManager, RoleManager<IdentityRole<int>> roleManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _signInManager = signInManager;
        }


        // POST api/<AccountController>
        [HttpPost]
        [Route("api/Account/register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                User user = new()
                {
                    Email = model.Email,
                    UserName = model.UserName,
                };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, false);
                    var temp = await _userManager.FindByNameAsync(user.UserName);
                    if (temp != null)
                        await _userManager.AddToRoleAsync(temp, "Racer");
                    return Ok(new { message = $"Гонщик {user.UserName} создан!" });
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                    var errorMessage = new
                    {
                        message = "Гонщик не создан!",
                        error = ModelState.Values.SelectMany(e => e.Errors.Select(e => e.ErrorMessage)),
                    };
                    return Created("", errorMessage.ToString());
                }
            }

            else
            {
                var errorMessage = new
                {
                    message = "Введены неверные данные",
                    error = ModelState.Values.SelectMany(e => e.Errors.Select(e => e.ErrorMessage)),
                };
                return Created("", errorMessage.ToString());
            }
        }

        [HttpPost]
        [Route("api/Account/login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, false);
                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync(model.UserName);
                    if (user != null)
                        return Ok(new { message = "Выполнен вход", userName = user.UserName });
                    else
                        return BadRequest();
                }
                else
                {
                    ModelState.AddModelError("", "Неверные логин и (или) пароль");
                    var errorMessage = new
                    {
                        message = "Вход не выполнен",
                        error = ModelState.Values.SelectMany(e => e.Errors.Select(e => e.ErrorMessage)),
                    };
                    return Created("", errorMessage);
                }
            }
            else
            {
                var errorMessage = new
                {
                    message = "Вход не выполнен",
                    error = ModelState.Values.SelectMany(e => e.Errors.Select(e => e.ErrorMessage)),
                };
                return Created("", errorMessage);
            }
        }

        [HttpPost]
        [Route("api/Account/logout")]
        public async Task<IActionResult> Logout()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null)
                return Unauthorized(new { message = "Вы гость" });
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Выполнен выход", userName = user.UserName });
        }

        [HttpGet]
        [Route("api/Account/isauthenticated")]
        public async Task<IActionResult> isAuthenticated()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null)
                return Unauthorized(new { message = "Пожалуйста, выполните войдите или зарегистрируйтесь" });
            return Ok(new { message = "Сессия активна", userName = user.UserName });
        }
    }
}
