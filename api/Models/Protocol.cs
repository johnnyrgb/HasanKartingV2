namespace api.Models
{
    public partial class Protocol
    {
        public Protocol() { }
        public int Id { get; set; }
        public int RaceId { get; set; }
        public int UserId { get; set; }
        public int CarId { get; set; }
        public TimeOnly? CompletionTime { get; set; }
        public virtual Race? Race { get; set; } 
        public virtual User? User { get; set; } 
        public virtual Car? Car { get; set; }
    }
}
