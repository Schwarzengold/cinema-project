using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Cinema_API.Models
{
    public class Session
    {
        public int Id { get; set; }

        [Required] 
        public int MovieId { get; set; }
        public Movie? Movie { get; set; }

        [Required]
        public int CinemaHallId { get; set; }
        public CinemaHall? CinemaHall { get; set; }

        public DateTime StartTime { get; set; }

        public ICollection<Seat>? Seats { get; set; }
    }
}
