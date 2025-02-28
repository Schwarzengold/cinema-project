using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema_API.Data;
using Cinema_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Cinema_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public MoviesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetMovies()
        {
            var movies = await _context.Movies.ToListAsync();
            return Ok(movies);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
                return NotFound();

            return Ok(movie);
        }

        [HttpGet("{id}/averageRating")]
        public async Task<IActionResult> GetAverageRating(int id)
        {
            var ratings = await _context.MovieRatings
                .Where(r => r.MovieId == id)
                .ToListAsync();

            if (!ratings.Any())
                return Ok(0.0); 

            double average = ratings.Average(r => r.RatingValue);
            return Ok(average);
        }

        [HttpPost("{id}/rate")]
        [Authorize]
        public async Task<IActionResult> RateMovie(int id, [FromBody] RateMovieRequest request)
        {
            var movieExists = await _context.Movies.AnyAsync(m => m.Id == id);
            if (!movieExists)
                return NotFound("Movie not found.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("You must be logged in.");

            if (request.Rating < 1 || request.Rating > 5)
                return BadRequest("Rating must be between 1 and 5.");

            var existingRating = await _context.MovieRatings
                .FirstOrDefaultAsync(r => r.MovieId == id && r.UserId == userId);

            if (existingRating == null)
            {
                var ratingRecord = new MovieRating
                {
                    UserId = userId,
                    MovieId = id,
                    RatingValue = request.Rating
                };
                _context.MovieRatings.Add(ratingRecord);
            }
            else
            {
                existingRating.RatingValue = request.Rating;
            }

            await _context.SaveChangesAsync();
            var average = await _context.MovieRatings
                .Where(r => r.MovieId == id)
                .AverageAsync(r => r.RatingValue);

            return Ok(new { averageRating = average });
        }
    }

    public class RateMovieRequest
    {
        public int Rating { get; set; }
    }
}
