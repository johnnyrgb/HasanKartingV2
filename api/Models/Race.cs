namespace api.Models
{
    public partial class Race
    {
        public Race()
        {
            Protocols = new HashSet<Protocol>();
        }
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public virtual ICollection<Protocol> Protocols { get; set; }

    }
}
