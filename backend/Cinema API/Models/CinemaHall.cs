using System.Collections.Generic;

namespace Cinema_API.Models
{
    public class CinemaHall
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TotalRows { get; set; }
        public int SeatsPerRow { get; set; }
        public ICollection<Session> Sessions { get; set; }
    }
}
