using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using Cinema_API.Services;
using Cinema_API.Models;

namespace Cinema_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public MoviesController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMovies()
        {
            var movies = await _movieService.GetMoviesAsync();
            return Ok(movies);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovie(int id)
        {
            var movie = await _movieService.GetMovieByIdAsync(id);
            if (movie == null)
                return NotFound();

            return Ok(movie);
        }

        [HttpGet("{id}/averageRating")]
        public async Task<IActionResult> GetAverageRating(int id)
        {
            var average = await _movieService.GetAverageRatingAsync(id);
            return Ok(average);
        }

        [HttpPost("{id}/rate")]
        [Authorize]
        public async Task<IActionResult> RateMovie(int id, [FromBody] RateMovieRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("You must be logged in.");

            if (request.Rating < 1 || request.Rating > 5)
                return BadRequest("Rating must be between 1 and 5.");

            var success = await _movieService.RateMovieAsync(id, userId, request.Rating);
            if (!success)
                return NotFound("Movie not found.");

            var average = await _movieService.GetAverageRatingAsync(id);
            return Ok(new { averageRating = average });
        }
    }
}
