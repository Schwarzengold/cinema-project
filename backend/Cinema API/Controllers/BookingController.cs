using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Cinema_API.Data;
using Cinema_API.Models;

namespace Cinema_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public BookingController(ApplicationDbContext context) => _context = context;

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmBooking([FromBody] BookingRequest request)
        {
            var seats = await _context.Seats
                .Where(s => request.SeatIds.Contains(s.Id) && s.SessionId == request.SessionId)
                .ToListAsync();

            if (seats.Count != request.SeatIds.Count)
                return BadRequest("Some seats were not found.");

            if (seats.Any(s => s.Status != SeatStatus.Available))
                return BadRequest("One or more seats are not available.");

            foreach (var seat in seats)
            {
                seat.Status = SeatStatus.Booked;
            }

            foreach (var seat in seats)
            {
                var ticket = new Ticket
                {
                    SeatId = seat.Id,
                    TicketType = request.TicketTypes.ContainsKey(seat.Id) ? request.TicketTypes[seat.Id] : TicketType.Adult,
                    UserId = request.UserId,
                    PurchaseTime = DateTime.UtcNow
                };
                _context.Tickets.Add(ticket);
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Booking confirmed successfully." });
        }
    }
}
