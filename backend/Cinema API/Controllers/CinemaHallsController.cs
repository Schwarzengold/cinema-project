using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema_API.Data;
using Cinema_API.Models;

namespace Cinema_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CinemaHallsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CinemaHallsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllHalls()
        {
            var halls = await _context.CinemaHalls.ToListAsync();
            return Ok(halls);
        }
    }
}
