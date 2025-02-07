using System.Threading.Tasks;

namespace Cinema_API.Services
{
    public interface IAppEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}
