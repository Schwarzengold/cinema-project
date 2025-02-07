using System;
using System.Collections.Generic;
using System.Linq;
using Cinema_API.Models;

namespace Cinema_API.Data
{
    public static class DataSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            if (!context.Movies.Any())
            {
                var movies = new List<Movie>
                {
                    new Movie {
                        Title = "The Adventure Begins",
                        Description = "An epic journey.",
                        BannerUrl = "https://st2.depositphotos.com/1105977/9877/i/450/depositphotos_98775856-stock-photo-retro-film-production-accessories-still.jpg",
                        TrailerUrl = "https://st2.depositphotos.com/1105977/9877/i/450/depositphotos_98775856-stock-photo-retro-film-production-accessories-still.jpg",
                        ReleaseDate = DateTime.UtcNow.AddDays(-10)
                    },
                    new Movie {
                        Title = "Mystery of the Night",
                        Description = "A thrilling mystery.",
                        BannerUrl = "https://st2.depositphotos.com/1105977/9877/i/450/depositphotos_98775856-stock-photo-retro-film-production-accessories-still.jpg",
                        TrailerUrl = "https://st2.depositphotos.com/1105977/9877/i/450/depositphotos_98775856-stock-photo-retro-film-production-accessories-still.jpg",
                        ReleaseDate = DateTime.UtcNow.AddDays(-5)
                    },
                    new Movie {
                        Title = "Future World",
                        Description = "A sci-fi adventure.",
                        BannerUrl = "https://st2.depositphotos.com/1105977/9877/i/450/depositphotos_98775856-stock-photo-retro-film-production-accessories-still.jpg",
                        TrailerUrl = "https://st2.depositphotos.com/1105977/9877/i/450/depositphotos_98775856-stock-photo-retro-film-production-accessories-still.jpg",
                        ReleaseDate = DateTime.UtcNow.AddDays(-2)
                    }
                };

                context.Movies.AddRange(movies);
                context.SaveChanges();

                var hall1 = new CinemaHall { Name = "Main Hall", TotalRows = 5, SeatsPerRow = 10 };
                var hall2 = new CinemaHall { Name = "VIP Hall", TotalRows = 3, SeatsPerRow = 8 };

                context.CinemaHalls.AddRange(hall1, hall2);
                context.SaveChanges();

                foreach (var movie in movies)
                {
                    var session1 = new Session { MovieId = movie.Id, CinemaHallId = hall1.Id, StartTime = DateTime.UtcNow.AddHours(2) };
                    var session2 = new Session { MovieId = movie.Id, CinemaHallId = hall2.Id, StartTime = DateTime.UtcNow.AddHours(3) };
                    context.Sessions.AddRange(session1, session2);
                    context.SaveChanges();

                    CreateSeatsForSession(context, session1, hall1.TotalRows, hall1.SeatsPerRow);
                    CreateSeatsForSession(context, session2, hall2.TotalRows, hall2.SeatsPerRow);
                }
            }
        }

        private static void CreateSeatsForSession(ApplicationDbContext context, Session session, int totalRows, int seatsPerRow)
        {
            var seats = new List<Seat>();
            for (int row = 1; row <= totalRows; row++)
            {
                for (int seatNum = 1; seatNum <= seatsPerRow; seatNum++)
                {
                    seats.Add(new Seat
                    {
                        Row = row,
                        Number = seatNum,
                        Status = SeatStatus.Available,
                        SessionId = session.Id
                    });
                }
            }
            context.Seats.AddRange(seats);
            context.SaveChanges();
        }
    }
}
