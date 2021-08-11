import { Palestrante } from './Palestrante';
import { Evento } from './Evento';

export interface RedesSociais {

   id : number;
   nome : string;
   URL : string;
   eventoId : number;
   palestranteId : number
}
