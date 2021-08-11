import { RedesSociais } from './RedesSociais';
import { Palestrante } from './Palestrante';
import { Lote } from './Lote';

export interface Evento {

  id : number;
  local : string;
  dataEvento : Date;
  tema : string;
  qtdPessoas : number;
  imagemURL : string;
  telefone : string;
  email : string;
  lotes : Lote[];
  redesSociais : RedesSociais[];
  palestranteEventos : Palestrante[];
}
