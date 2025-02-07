using System;

namespace Cinema_API.Models
{
    public enum TicketType
    {
        Adult,
        Child,
        Disabled
    }

    public class Ticket
    {
        public int Id { get; set; }
        public int SeatId { get; set; }
        public Seat Seat { get; set; }
        public TicketType TicketType { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime PurchaseTime { get; set; }
    }
}
