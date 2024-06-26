﻿using api.Models;
using api.Models.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    /// <summary>
    ///  Класс AccountController. Отвечает за регистрацию учетных записей, вход в учетную записи и выход из нее.
    ///  Также есть метод возвращения списка пользователей с ролью "Racer"
    /// </summary>
    public class AccountController : ControllerBase
    {

        private readonly UserManager<IdentityUser<int>> _userManager;
        private readonly SignInManager<IdentityUser<int>> _signInManager;
        private readonly RoleManager<IdentityRole<int>> _roleManager;
        private readonly DatabaseContext _databaseContext;

        public AccountController(UserManager<IdentityUser<int>> userManager, SignInManager<IdentityUser<int>> signInManager, RoleManager<IdentityRole<int>> roleManager, DatabaseContext databaseContext)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _signInManager = signInManager;
            _databaseContext = databaseContext;
        }

        /// <summary>
        /// Метод принимает объект RegisterViewModel, откуда берет Username, Email, Password для регистрации нового пользователя.
        /// Проверяет существование пользователя с этими данными. Если не найден, то создает нового пользователя с ролью "Racer".
        /// </summary>
        // POST api/<AccountController>
        [HttpPost]
        [Route("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var existingUserByUsername = await _userManager.FindByNameAsync(model.Username);
                var existingUserByEmail = await _userManager.FindByEmailAsync(model.Email);

                if (existingUserByUsername != null || existingUserByEmail != null)
                {
                    return StatusCode(201, new { message = "Пользователь с таким username или email уже существует" });
                }

                User user = new()
                {
                    Email = model.Email,
                    UserName = model.Username,
                };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    var temp = await _userManager.FindByNameAsync(user.UserName);
                    if (temp != null)
                    {
                        await _userManager.AddToRoleAsync(temp, "Racer");
                        return Ok(new { message = $"Гонщик {user.UserName} создан!" });
                    }
                    else
                        return BadRequest();
                }
                else
                {
                    return BadRequest();
                }
            }
            else
            {
                var errorMessage = new
                {
                    message = "Введены неверные данные",
                    error = ModelState.Values.SelectMany(e => e.Errors.Select(e => e.ErrorMessage)),
                };
                return StatusCode(202, errorMessage.ToString());
            }
        }
        /// <summary>
        /// Метод принимает объект класса LoginViewModel, откуда берет Username, Password, RememberMe и с помощью этих данных
        /// аутентифицирует пользователя. Если RememberMe = true, то устанавливаются долговременные куки, иначе -- на одну сессию.
        /// </summary>
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, false);
                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync(model.Username);
                    if (user != null)
                    {
                        var responseUser = new
                        {
                            username = user.UserName,
                            email = user.Email,
                            roles = await _userManager.GetRolesAsync(user),
                        };
                        return Ok(new { message = "Выполнен вход", responseUser });
                    }
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
        /// <summary>
        /// Метод выхода пользователя из учетной записи.
        /// </summary>
        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null)
                return Unauthorized(new { message = "Вы гость" });
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Выполнен выход", username = user.UserName });
        }
        /// <summary>
        /// Метод проверки аутентификации пользователя. Из куки получает текущего пользователя. Если null -- неаутентифицирован.
        /// </summary>
        [HttpGet]
        [Route("isauthenticated")]
        public async Task<IActionResult> isAuthenticated()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null)
                return Unauthorized(new { message = "Пожалуйста, выполните войдите или зарегистрируйтесь" });
            var responseUser = new
            {
                username = user.UserName,
                email = user.Email,
                roles = await _userManager.GetRolesAsync(user),
            };
            return Ok(responseUser);
        }
        /// <summary>
        /// Метод возвращает всех пользователей с ролью "Racer".
        /// </summary>
        [HttpGet]
        [Route("racers")]
        public async Task<IActionResult> GetAllRacers()
        {
            var users = (await _userManager.GetUsersInRoleAsync("Racer")).Select(u => new
            {
                id = u.Id,
                username = u.UserName,
                email = u.Email,
                racenumber = _databaseContext.Protocols.Count(p => p.UserId == u.Id && p.CompletionTime != null),
                winsnumber = _databaseContext.Protocols.Where(p => p.CompletionTime != null).GroupBy(p => p.RaceId).Count(g => g.Min(p => p.CompletionTime) == g.Where(p => p.UserId == u.Id && p.CompletionTime != null).First().CompletionTime),
            });
            return Ok(users);
        }
        /// <summary>
        /// Метод принимает объект класса RacerViewModel, откуда берет данные Username и Email и обновляет их для 
        /// соответствующего id пользователя.
        /// </summary>
        [HttpPut("racers/{id}")]
        public async Task<IActionResult> PutRacer(int id, [FromBody] RacerViewModel racer)
        {
            if (id != racer.id)
                return BadRequest();
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user != null)
            {
                await _userManager.SetUserNameAsync(user, racer.username);
                await _userManager.SetEmailAsync(user, racer.email);
            }
            else
            {
                return NotFound();
            }
            return NoContent();
        }
        /// <summary>
        /// 
        /// </summary>
        [HttpPost("racers")]
        public async Task<ActionResult<RacerViewModel>> Post([FromBody] RacerViewModel racer)
        {
            if (ModelState.IsValid)
            {
                var existingUserByUsername = await _userManager.FindByNameAsync(racer.username);
                var existingUserByEmail = await _userManager.FindByEmailAsync(racer.email);

                if (existingUserByUsername != null || existingUserByEmail != null)
                {
                    return StatusCode(201, new { message = "Пользователь с таким username или email уже существует" });
                }

                User user = new()
                {
                    Email = racer.email,
                    UserName = racer.username,
                };
                var result = await _userManager.CreateAsync(user, "ChangeMe1!");
                if (result.Succeeded)
                {
                    var temp = await _userManager.FindByNameAsync(user.UserName);
                    if (temp != null)
                    {
                        await _userManager.AddToRoleAsync(temp, "Racer");
                        return Ok(new { message = $"Гонщик {user.UserName} создан!" });
                    }
                    else
                        return BadRequest();
                }
                else
                {
                    return BadRequest();
                }
            }
            else
            {
                var errorMessage = new
                {
                    message = "Введены неверные данные",
                    error = ModelState.Values.SelectMany(e => e.Errors.Select(e => e.ErrorMessage)),
                };
                return StatusCode(202, errorMessage.ToString());
            }
        }
    }
}

