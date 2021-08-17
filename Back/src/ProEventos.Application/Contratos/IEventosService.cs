using System.Threading.Tasks;
using ProEventos.Application.Dtos;

namespace Back.src.ProEventos.Application.Contratos
{
    public interface IEventoService
    {
        Task<EventoDto> AddEventos(EventoDto model);
        Task<EventoDto> UpdateEvento(int eventoId,EventoDto model);
        Task<bool> DeleteEvento(int eventoId);

        Task<EventoDto[]> GetAllEventosByTemaAsync(string tema,bool includePalestrantes = false);
        Task<EventoDto[]> GetAllEventosAsync(bool includePalestrantes = false);
        Task<EventoDto> GetAllEventosByIdAsync(int EventoId,bool includePalestrantes = false);

    }
}