using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cinema_API.Models
{
    public class MovieRating
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }  

        [Required]
        public int MovieId { get; set; }

        [Range(1, 5)]
        public int RatingValue { get; set; }
    }
}
