using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public DateTime? DataEvento { get; set; }

        [Required(ErrorMessage ="O campo {0} é obrigatório")]
        [MinLength(3,ErrorMessage ="{0} deve ter no mínimo 4 caracteres"),
         MaxLength(50,ErrorMessage ="{0} deve ter no máximo 50 caracteres")]
        public string Tema { get; set; }

        [Display(Name ="Quantidade-Pessoa")]
        [Range(1,120000,ErrorMessage ="{0} não pode ser menor que 1 e maior que 1200000")]
        public int QtdPessoas { get; set; }
       
        public string ImagemURL { get; set; }
        [Phone(ErrorMessage ="O campo {0} está com numero invalido")]
        [Required(ErrorMessage ="O campo {0} é obrigatório")]
        public string Telefone { get; set; }

        [Required(ErrorMessage ="O campo {0} é obrigatório")]
        [Display(Name ="e-mail")]
        [EmailAddress(ErrorMessage =" O campo {0} precisa ser um e-mail válido")]
        public string Email { get; set; }
        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> PalestranteEventos {get; set;}
    }
}