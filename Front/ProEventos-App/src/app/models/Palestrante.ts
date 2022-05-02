import { Evento } from './Evento';
import { UserUpdate } from './Identity/UserUpdate';
import { RedesSociais } from './RedesSociais';

export interface Palestrante {
    id : number;
    miniCurriculo : string;
    user: UserUpdate;
    redesSociais : RedesSociais[];
    palestranteEventos : Evento[];

}
