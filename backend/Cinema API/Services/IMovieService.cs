using Cinema_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cinema_API.Services
{
    public interface IMovieService
    {
        Task<IEnumerable<Movie>> GetMoviesAsync();
        Task<Movie> GetMovieByIdAsync(int id);
        Task<double> GetAverageRatingAsync(int movieId);
        Task<bool> RateMovieAsync(int movieId, string userId, int rating);
    }
}
