using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Models;

namespace ProEventos.Persistence
{
    public class EventoPersist : IEventoPersist
    {
        private readonly ProEventosContext _context;
        public EventoPersist(ProEventosContext context)
        {
            this._context = context;
           // _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public async Task<PageList<Evento>> GetAllEventosAsync(int userId , PageParams pageParams ,bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedesSociais);

            if( includePalestrantes ){
                query = query.Include(e => e.PalestranteEventos)
                             .ThenInclude(pe => pe.Palestrantre);
            }

            query = query.AsNoTracking()
            .Where(e => (e.Tema.ToLower().Contains(pageParams.Term.ToLower()) ||
                         e.Local.ToLower().Contains(pageParams.Term.ToLower())) &&
                        e.UserId == userId)

            .OrderBy(e => e.Id);

            return await PageList<Evento>.CreateAsync(query,pageParams.PageNumber,pageParams.PageSize);
        }


        public async Task<Evento> GetAllEventosByIdAsync(int userId ,  int EventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedesSociais);

            if( includePalestrantes ){
                query = query.Include(e => e.PalestranteEventos)
                             .ThenInclude(pe => pe.Palestrantre);
            }

            query = query.AsNoTracking().OrderBy(e => e.Id)
            .Where(e => e.Id == EventoId && e.UserId == userId);

            return await query.FirstOrDefaultAsync();
        }
    }
}