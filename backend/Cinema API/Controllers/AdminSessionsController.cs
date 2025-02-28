using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema_API.Data;
using Cinema_API.Models;

namespace Cinema_API.Controllers
{
    [Route("api/admin/sessions")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminSessionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminSessionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSessions([FromQuery] int movieId)
        {
            var sessions = await _context.Sessions
                .Where(s => s.MovieId == movieId)
                .ToListAsync();

            return Ok(sessions);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSession([FromBody] Session session)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var movie = await _context.Movies.FindAsync(session.MovieId);
            if (movie == null)
                return BadRequest("Movie does not exist.");

            var hall = await _context.CinemaHalls.FindAsync(session.CinemaHallId);
            if (hall == null)
                return BadRequest("Cinema hall does not exist.");
            _context.Sessions.Add(session);
            await _context.SaveChangesAsync();
            await GenerateSeatsForSession(session.Id, hall.TotalRows, hall.SeatsPerRow);

            return Ok(session);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSession(int id, [FromBody] Session updatedSession)
        {
            var session = await _context.Sessions.FindAsync(id);
            if (session == null)
                return NotFound("Session not found.");

            session.MovieId = updatedSession.MovieId;
            session.CinemaHallId = updatedSession.CinemaHallId;
            session.StartTime = updatedSession.StartTime;
            session.AdultPrice = updatedSession.AdultPrice;
            session.ChildPrice = updatedSession.ChildPrice;
            session.DisabledPrice = updatedSession.DisabledPrice;

            await _context.SaveChangesAsync();
            return Ok(session);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            var session = await _context.Sessions.FindAsync(id);
            if (session == null)
                return NotFound("Session not found.");

            _context.Sessions.Remove(session);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Session deleted successfully." });
        }

        private async Task GenerateSeatsForSession(int sessionId, int totalRows, int seatsPerRow)
        {
            var seats = new List<Seat>();
            for (int row = 1; row <= totalRows; row++)
            {
                for (int seatNum = 1; seatNum <= seatsPerRow; seatNum++)
                {
                    seats.Add(new Seat
                    {
                        Row = row,
                        Number = seatNum,
                        Status = SeatStatus.Available,
                        SessionId = sessionId
                    });
                }
            }
            _context.Seats.AddRange(seats);
            await _context.SaveChangesAsync();
        }
    }
}
