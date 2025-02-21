using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema_API.Data;
using Cinema_API.Models;

namespace Cinema_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SessionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSessions([FromQuery] int movieId)
        {
            var sessions = await _context.Sessions
                .Include(s => s.CinemaHall) 
                .Where(s => s.MovieId == movieId)
                .ToListAsync();

            return Ok(sessions);
        }

        [HttpGet("{sessionId}/seats")]
        public async Task<IActionResult> GetSeats(int sessionId)
        {
            var seats = await _context.Seats
                .Where(seat => seat.SessionId == sessionId)
                .ToListAsync();
            return Ok(seats);
        }
    }
}
