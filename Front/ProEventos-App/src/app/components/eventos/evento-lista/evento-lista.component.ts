import { Pagination, PaginatedResult } from './../../../models/Pagination';
import { environment } from '@environments/environment';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef!: BsModalRef;
  public eventos : Evento[] = [];
  public eventoId : number = 0;
  public pagination = {} as Pagination;

  public larguraImagem : number = 150;
  public margemImagem : number = 2;
  public mostrarImagem :boolean = true;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  public filtrarEventos(evento: any ) :  void
  {
    if(this.termoBuscaChanged.observers.length === 0)
    {
      this.termoBuscaChanged.pipe(debounceTime(1500)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.eventoService.getEventos(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filtrarPor
            ).subscribe(
              (response : PaginatedResult<Evento[]>) =>{
                this.eventos = response.result;
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

    this.termoBuscaChanged.next(evento.value);
  }

  constructor(
      private eventoService : EventoService,
      private modalService: BsModalService,
      private toastr : ToastrService,
      private spinner : NgxSpinnerService,
      private router:Router
    ) {}

  public ngOnInit(): void {
    this.pagination = {
      currentPage : 1,
      itemsPerPage : 3,
      totalItems: 1,
    } as Pagination;

    this.getEventos();
  }

  public alterarImagem() : void {
    this.mostrarImagem = !this.mostrarImagem;
  }

  public getEventos() : void {
    this.spinner.show();
    this.eventoService.getEventos(this.pagination.currentPage,this.pagination.itemsPerPage).subscribe(
      (response : PaginatedResult<Evento[]>) =>{
        console.log(response);
        this.eventos = response.result;
        this.pagination = response.pagination;
      },
      (error : any) =>{
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os eventos')
      }
    ).add(() => this.spinner.hide());
  }

  openModal(event : any ,template: TemplateRef<any>,eventoId : number) : void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

    public pageChanged(event : any): void {
      this.pagination.currentPage = event.page;
      this.getEventos();
    }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    console.log(this.eventoId);

    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result : any) => {
          console.log('result ' + result);
          this.toastr.success('O evento foi deletado com sucesso.','Deletado');
          this.getEventos();
      },
      (error : any) => {
        console.log(error);
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`);
      },
    ).add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef.hide();
  }

  detalheEvento(id:number) : void{
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  mostrarImagemUrl(imagemUrl: string):string{
    return (imagemUrl !== '')
      ?  environment.apiUrlImage+imagemUrl
      : 'assets/semImagem.png';
  }


}
