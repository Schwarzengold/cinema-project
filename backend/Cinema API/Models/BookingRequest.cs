using System.Collections.Generic;

namespace Cinema_API.Models
{
    public class BookingRequest
    {
        public int SessionId { get; set; }
        public List<int> SeatIds { get; set; }
        public Dictionary<int, TicketType> TicketTypes { get; set; }
        public string UserId { get; set; }
    }
}
