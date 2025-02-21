using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema_API.Data;
using Cinema_API.Models;
using Cinema_API.Services;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Cinema_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAppEmailSender _emailSender;
        private readonly UserManager<ApplicationUser> _userManager;

        public BookingController(
            ApplicationDbContext context,
            IAppEmailSender emailSender,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _emailSender = emailSender;
            _userManager = userManager;
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmBooking([FromBody] BookingRequest request)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found in token.");
            }

            var seats = await _context.Seats
                .Where(s => request.SeatIds.Contains(s.Id) && s.SessionId == request.SessionId)
                .Include(s => s.Session)
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
                var ticketType = request.TicketTypes.ContainsKey(seat.Id)
                    ? request.TicketTypes[seat.Id]
                    : TicketType.Adult;

                var ticket = new Ticket
                {
                    SeatId = seat.Id,
                    TicketType = ticketType,
                    UserId = userId,
                    PurchaseTime = DateTime.UtcNow
                };
                _context.Tickets.Add(ticket);
            }

            await _context.SaveChangesAsync();
            await SendConfirmationEmailAsync(userId, seats);

            return Ok(new { Message = "Booking confirmed successfully." });
        }

        private async Task SendConfirmationEmailAsync(string userId, System.Collections.Generic.List<Seat> bookedSeats)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return; 
            var session = bookedSeats.FirstOrDefault()?.Session;
            if (session == null) return;

            await _context.Entry(session).Reference(s => s.Movie).LoadAsync();
            var movieTitle = session.Movie?.Title ?? "Unknown Movie";
            var emailBody = BuildEmailBody(movieTitle, session, bookedSeats);
            await _emailSender.SendEmailAsync(
                user.Email,
                "Your Ticket Confirmation",
                emailBody
            );
        }

        private string BuildEmailBody(string movieTitle, Session session, System.Collections.Generic.List<Seat> seats)
        {
            var seatList = string.Join(", ", seats.Select(s => $"Row {s.Row}, Seat {s.Number}"));

            return $@"
                <h2>Thank you for your purchase!</h2>
                <p><strong>Movie:</strong> {movieTitle}</p>
                <p><strong>Date/Time:</strong> {session.StartTime}</p>
                <p><strong>Your Seats:</strong> {seatList}</p>
                <p>Enjoy the show!</p>
            ";
        }
    }
}
