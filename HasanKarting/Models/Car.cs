namespace api.Models
{
    public partial class Car
    {
        public Car()
        {
            Protocols = new HashSet<Protocol>();
        }
        public int Id { get; set; }
        public string Manufacturer { get; set; } = null!;
        public string Model { get; set; } = null!;
        public int Power { get; set; }
        public double Mileage { get; set; }
        public double Weight { get; set; }
        public virtual ICollection<Protocol> Protocols { get; set; }
    }
}
