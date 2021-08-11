import { Evento } from './Evento';
import { RedesSociais } from './RedesSociais';

export interface Palestrante {

    id : number;
    nome : string;
    miniCurriculo : string;
    imagemURL : string;
    telefone : string;
    email : string;
    redesSociais : RedesSociais[];
    palestranteEventos : Evento[];

}
