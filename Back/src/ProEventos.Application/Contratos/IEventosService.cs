using System.Threading.Tasks;
using ProEventos.Domain;

namespace Back.src.ProEventos.Application.Contratos
{
    public interface IEventoService
    {
        Task<Evento> AddEventos(Evento model);
        Task<Evento> UpdateEvento(int eventoId,Evento model);
        Task<bool> DeleteEvento(int eventoId);

        Task<Evento[]> GetAllEventosByTemaAsync(string tema,bool includePalestrantes = false);
        Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false);
        Task<Evento> GetAllEventosByIdAsync(int EventoId,bool includePalestrantes = false);

    }
}