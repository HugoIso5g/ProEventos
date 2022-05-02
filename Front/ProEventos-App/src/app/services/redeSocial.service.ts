import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { RedesSociais } from '@app/models/RedesSociais';

@Injectable({
  providedIn: 'root'
})
export class RedeSocialService {

  baseURL = environment.apiUrl + 'api/RedeSociais';

  constructor(private http: HttpClient) { }
  /**
   *
   * @param origem precisa passar palestrante ou evento
   * @param id pode ser eventoId ou palestrantreId
   * @returns Observable<RedeSocial[]>
   */
  public getRedesSociais(origem : string, id: number) : Observable<RedesSociais[]>{
    let URL =
    id === 0
    ? `${this.baseURL}/${origem}`
    : `${this.baseURL}/${origem}/${id}`;
    return this.http.get<RedesSociais[]>(URL).pipe(take(1));
  }
   /**
   *
   * @param origem precisa passar palestrante ou evento
   * @param id pode ser eventoId ou palestrantreId
   * @returns Observable<RedeSocial[]>
   */
    public saveRedesSociais(
      origem : string,
      id: number,
      redesSociais : RedesSociais[])
      : Observable<RedesSociais[]>
    {
      let URL =
      id === 0
      ? `${this.baseURL}/${origem}`
      : `${this.baseURL}/${origem}/${id}`;

      return this.http.put<RedesSociais[]>(URL,redesSociais).pipe(take(1));
    }

     /**
   *
   * @param origem precisa passar palestrante ou evento
   * @param id pode ser eventoId ou palestrantreId
   * @returns Observable<RedeSocial[]>
   */
      public deleteRedeSocial(
        origem : string,
        id: number,
        redeSocialId : number)
        : Observable<any>
      {
        let URL =
        id === 0
        ? `${this.baseURL}/${origem}/${redeSocialId}`
        : `${this.baseURL}/${origem}/${id}/${redeSocialId}`;

        return this.http.delete(URL).pipe(take(1));
      }

}
