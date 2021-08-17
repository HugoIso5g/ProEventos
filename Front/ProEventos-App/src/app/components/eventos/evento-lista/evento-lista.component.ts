import { environment } from '@environments/environment';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef!: BsModalRef;
  public eventos : Evento[] = [];
  public eventosFiltrados :  Evento[]  = [];
  public eventoId : number = 0;

  public larguraImagem : number = 150;
  public margemImagem : number = 2;
  public mostrarImagem :boolean = true;

  private _filtroLista : string = "";

  public get filtroLista(){
    return this._filtroLista;
  }

  public set filtroLista(value:string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public filtrarEventos(filtrarPor: string ) :  Evento[]
  {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento:{ tema: string;local:string }) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(
      private eventoService : EventoService,
      private modalService: BsModalService,
      private toastr : ToastrService,
      private spinner : NgxSpinnerService,
      private router:Router
    ) {}

  public ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
  }

  public alterarImagem() : void {
    this.mostrarImagem = !this.mostrarImagem;
  }

  public getEventos() : void {

    this.eventoService.getEventos().subscribe({
      next: (eventos : Evento[]) =>{
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error : any) =>{
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os eventos')
      },
       complete: () => this.spinner.hide()
    });
  }

  openModal(event : any ,template: TemplateRef<any>,eventoId : number) : void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
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
