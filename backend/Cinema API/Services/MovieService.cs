using Cinema_API.Data;
using Cinema_API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cinema_API.Services
{
    public class MovieService : IMovieService
    {
        private readonly ApplicationDbContext _context;

        public MovieService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Movie>> GetMoviesAsync()
        {
            return await _context.Movies.ToListAsync();
        }

        public async Task<Movie> GetMovieByIdAsync(int id)
        {
            return await _context.Movies.FindAsync(id);
        }

        public async Task<double> GetAverageRatingAsync(int movieId)
        {
            var ratings = await _context.MovieRatings
                .Where(r => r.MovieId == movieId)
                .ToListAsync();

            if (!ratings.Any())
                return 0.0;

            return ratings.Average(r => r.RatingValue);
        }

        public async Task<bool> RateMovieAsync(int movieId, string userId, int rating)
        {
            var movieExists = await _context.Movies.AnyAsync(m => m.Id == movieId);
            if (!movieExists) return false;

            var existingRating = await _context.MovieRatings
                .FirstOrDefaultAsync(r => r.MovieId == movieId && r.UserId == userId);

            if (existingRating == null)
            {
                var ratingRecord = new MovieRating
                {
                    UserId = userId,
                    MovieId = movieId,
                    RatingValue = rating
                };
                _context.MovieRatings.Add(ratingRecord);
            }
            else
            {
                existingRating.RatingValue = rating;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
