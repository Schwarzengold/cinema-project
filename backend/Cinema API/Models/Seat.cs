namespace Cinema_API.Models
{
    public enum SeatStatus
    {
        Available,
        Reserved,
        Booked
    }

    public class Seat
    {
        public int Id { get; set; }
        public int Row { get; set; }
        public int Number { get; set; }
        public SeatStatus Status { get; set; }
        public int SessionId { get; set; }
        public Session Session { get; set; }
    }
}
