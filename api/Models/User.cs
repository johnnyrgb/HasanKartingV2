using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public partial class User : IdentityUser<int>
    {
        public User() 
        {
            Protocols = new HashSet<Protocol>();
        }

        public virtual ICollection<Protocol> Protocols { get; set; }
    }
}
