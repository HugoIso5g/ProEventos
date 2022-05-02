import { Palestrante } from './Palestrante';
import { Evento } from './Evento';

export interface RedesSociais {

   id : number;
   nome : string;
   url : string;
   eventoId : number;
   palestranteId : number
}
