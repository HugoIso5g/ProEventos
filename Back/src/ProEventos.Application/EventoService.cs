using System;
using System.Threading.Tasks;
using Back.src.ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Persistence.Contratos;
using ProEventos.Domain;
using AutoMapper;
using ProEventos.Persistence.Models;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;
        private readonly IMapper _mapper;

        public EventoService(IGeralPersist geralPersist,
                             IEventoPersist eventoPersist,
                             IMapper mapper)
        {
            _mapper = mapper;
            _eventoPersist = eventoPersist;
            _geralPersist = geralPersist;
        }

        public async Task<EventoDto> AddEventos(int userId ,EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);
                evento.UserId = userId;

                _geralPersist.Add<Evento>(evento);

                if (await _geralPersist.SaveChangesAsync())
                {
                    var eventoRetorno = await _eventoPersist.GetAllEventosByIdAsync(userId,evento.Id, false);
                    return _mapper.Map<EventoDto>(eventoRetorno);
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> UpdateEvento(int userId ,int eventoId, EventoDto model)
        {
            try
            {
                var evento = await _eventoPersist.GetAllEventosByIdAsync(userId,eventoId, false);
                if (evento == null) throw new Exception("Evento nao encontrado");

                model.Id = evento.Id;
                model.UserId = userId;

                _mapper.Map(model,evento);

                _geralPersist.Update<Evento>(evento);

                if (await _geralPersist.SaveChangesAsync())
                {
                    var eventoRetorno = await _eventoPersist.GetAllEventosByIdAsync(userId,evento.Id, false);

                    return _mapper.Map<EventoDto>(eventoRetorno);
                }

                return null;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteEvento(int userId ,int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetAllEventosByIdAsync(userId,eventoId, false);
                if (evento == null) throw new Exception("Evento nao encontrado");

                _geralPersist.Delete(evento);
                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PageList<EventoDto>> GetAllEventosAsync(int userId ,PageParams pageParams, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(userId, pageParams , includePalestrantes);
                if (eventos == null) return null;

                 var resultado  = _mapper.Map<PageList<EventoDto>>(eventos);

                 resultado.CurrentPage  = eventos.CurrentPage;
                 resultado.TotalPages   = eventos.TotalPages;
                 resultado.PageSize     = eventos.PageSize;
                 resultado.TotalCount   = eventos.TotalCount;

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> GetAllEventosByIdAsync(int userId, int EventoId, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosByIdAsync(userId,EventoId, includePalestrantes);
                if (eventos == null) return null;

                var resultado  = _mapper.Map<EventoDto>(eventos);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}