using System.Threading.Tasks;
using ProEventos.Application.Dtos;
using ProEventos.Persistence.Models;

namespace Back.src.ProEventos.Application.Contratos
{
    public interface IEventoService
    {
        Task<EventoDto> AddEventos(int userId , EventoDto model);
        Task<EventoDto> UpdateEvento(int userId ,int eventoId,EventoDto model);
        Task<bool> DeleteEvento(int userId ,int eventoId);

        Task<PageList<EventoDto>> GetAllEventosAsync(int userId ,PageParams pageParams, bool includePalestrantes = false);
        Task<EventoDto> GetAllEventosByIdAsync(int userId ,int EventoId,bool includePalestrantes = false);

    }
}