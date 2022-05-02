using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Persistence.Models;

namespace ProEventos.Persistence.Contratos
{
    public interface IEventoPersist
    {
        //EVENTOS
         Task<PageList<Evento>> GetAllEventosAsync(int userId ,PageParams pageParams, bool includePalestrantes = false);
         Task<Evento> GetAllEventosByIdAsync(int userId ,int EventoId,bool includePalestrantes = false);
  
    }
}