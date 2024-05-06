using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class LoginViewModel
    {
        [Required]
        [Display(Name = "Имя пользователя")]
        public string Username { get; set; } = null!;
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Пароль")]
        public string Password { get; set; } = null!;
        [Display(Name="Запомнить")]
        public bool RememberMe { get; set; }
    }
}
