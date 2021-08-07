using System;
using System.Threading.Tasks;
using Back.src.ProEventos.Application.Contratos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;

        public EventoService(IGeralPersist geralPersist, IEventoPersist eventoPersist)
        {
            _eventoPersist = eventoPersist;
            _geralPersist = geralPersist;
        }

        public async Task<Evento> AddEventos(Evento model)
        {
            try
            {
                _geralPersist.Add<Evento>(model);

                if(await _geralPersist.SaveChangesAsync())
                {
                    return await _eventoPersist.GetAllEventosByIdAsync(model.Id,false);
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Evento> UpdateEvento(int eventoId, Evento model)
        {
            try
            {
                var evento = await _eventoPersist.GetAllEventosByIdAsync(eventoId,false);
                if( evento == null) throw new Exception("Evento nao encontrado");

                model.Id = evento.Id;

                _geralPersist.Update(model);

                if(await _geralPersist.SaveChangesAsync())
                {
                    return await _eventoPersist.GetAllEventosByIdAsync(model.Id,false);
                }

                return null;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteEvento(int eventoId)
        {
             try
            {
                var evento = await _eventoPersist.GetAllEventosByIdAsync(eventoId,false);
                if( evento == null) throw new Exception("Evento nao encontrado");

                _geralPersist.Delete(evento);
                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                var eventos  = await _eventoPersist.GetAllEventosAsync(includePalestrantes);
                if ( eventos == null ) return null;

                return eventos;
            }
            catch (Exception ex)
            {
                 throw new Exception(ex.Message);
            }
        }

        public async Task<Evento> GetAllEventosByIdAsync(int EventoId, bool includePalestrantes = false)
        {
            try
            {
                var eventos  = await _eventoPersist.GetAllEventosByIdAsync(EventoId,includePalestrantes);
                if ( eventos == null ) return null;

                return eventos;
            }
            catch (Exception ex)
            {
                 throw new Exception(ex.Message);
            }
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
           try
            {
                var eventos  = await _eventoPersist.GetAllEventosByTemaAsync(tema,includePalestrantes);
                if ( eventos == null ) return null;

                return eventos;
            }
            catch (Exception ex)
            {
                 throw new Exception(ex.Message);
            }
        }

    }
}