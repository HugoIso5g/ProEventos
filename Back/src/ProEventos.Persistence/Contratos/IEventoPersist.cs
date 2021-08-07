using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface IEventoPersist
    {
        //EVENTOS
         Task<Evento[]> GetAllEventosByTemaAsync(string tema,bool includePalestrantes = false);
         Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false);
         Task<Evento> GetAllEventosByIdAsync(int EventoId,bool includePalestrantes = false);
  
    }
}