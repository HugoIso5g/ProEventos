import { environment } from '@environments/environment';
import { PaginatedResult, Pagination } from './../../../models/Pagination';
import { Palestrante } from './../../../models/Palestrante';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PalestranteService } from './../../../services/palestrante.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss']
})
export class PalestranteListaComponent implements OnInit {

  public palestrantes : Palestrante[] = [];
  public eventoId : number = 0;
  public pagination = {} as Pagination;

  constructor(
    private palestranteService : PalestranteService,
    private modalService: BsModalService,
    private toastr : ToastrService,
    private spinner : NgxSpinnerService,
    private router:Router
  ) { }

  termoBuscaChanged: Subject<string> = new Subject<string>();

  ngOnInit() {
    this.pagination = {
      currentPage : 1,
      itemsPerPage : 3,
      totalItems: 1,
    } as Pagination;

    this.carregarPalestrantes();
  }

  public getImagemURL(imagemName : string) : string{
    if(imagemName)
    return imagemName = environment.apiUrl + `resources/perfil/${imagemName}`;
    else
    return './assets/img/perfil.png';
  }

  public carregarPalestrantes() : void {
    this.spinner.show();
    this.palestranteService.getPalestrantes(this.pagination.currentPage,this.pagination.itemsPerPage).subscribe(
      (response : PaginatedResult<Palestrante[]>) =>{

        this.palestrantes = response.result;
        this.pagination = response.pagination;
      },
      (error : any) =>{
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os palestrantes')
      }
    ).add(() => this.spinner.hide());
  }

  public filtrarPalestrantes(palestrante: any ) :  void
  {
    if(this.termoBuscaChanged.observers.length === 0)
    {
      this.termoBuscaChanged.pipe(debounceTime(1500)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.palestranteService.getPalestrantes(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filtrarPor
            ).subscribe(
              (response : PaginatedResult<Palestrante[]>) =>{
                this.palestrantes = response.result;
                this.pagination = response.pagination;
              },
              (error : any) =>{
                this.spinner.hide();
                this.toastr.error('Erro ao carregar os eventos')
              }
            )
            .add(() => this.spinner.hide());
            }
          )
    }

    this.termoBuscaChanged.next(palestrante.value);
  }
}
