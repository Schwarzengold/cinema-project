using System;

namespace Cinema_API.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string BannerUrl { get; set; }
        public string TrailerUrl { get; set; }
        public DateTime ReleaseDate { get; set; }
    }
}
