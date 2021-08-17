import { environment } from './../../../../environments/environment.prod';
import { LoteService } from './../../../services/lote.service';

import { EventoService } from 'src/app/services/evento.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray,
  FormBuilder,
  FormGroup,
  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Evento } from '@app/models/Evento';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Lote } from '@app/models/Lote';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  modalRef? : BsModalRef;
  eventoId? : any = null;
  evento = {} as Evento;
  estadoSalvar? : string = 'post';
  loteAtual  = {id:0,nome:'',indice:0};
  form! : FormGroup;
  imagemURL = 'assets/upload-cloud.png';
  file? : File;

  get f() : any {
    return this.form.controls;
  }

  get lotes () : FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get modoEditar () : boolean {
    return this.estadoSalvar == 'put';
  }

  get bsConfig() : any {
    return {
      adaptivePosition : true,
      dateInputFormat : 'DD/MM/YYYY hh:mm',
      containerClass : 'theme-default',
      showWeekNumbers:false
    };
  }

  get bsConfigLote() : any {
    return {
      adaptivePosition : true,
      dateInputFormat : 'DD/MM/YYYY',
      containerClass : 'theme-default',
      showWeekNumbers:false
    };
  }


  constructor(private fb : FormBuilder,
              private localeService : BsLocaleService,
              private router : ActivatedRoute,
              private eventoService : EventoService,
              private spinner : NgxSpinnerService,
              private toastr : ToastrService,
              private redirectRouter : Router,
              private loteService : LoteService,
              private modalService : BsModalService,
  ) {
    this.localeService.use('pt-br');
   }

/**
* @author Hugo
* @info Carrega o evento da API.
*/
  public carregarEvento() : void {

    const eventoParam = this.router.snapshot.paramMap.get('id');
    this.eventoId = eventoParam;

    if(+this.eventoId !== null && +this.eventoId !== 0){
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+this.eventoId).subscribe(
        (evento : Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
          if(this.evento.imagemURL !== '')
          {
            this.imagemURL = environment.apiUrlImage+this.evento.imagemURL;
          }
          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criarLote(lote));
          })
          //this.carregarLotes();
        },
        (error : any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar evento');
          console.log(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

  public carregarLotes() : void {
    this.loteService.getLotesByEventoId(+this.eventoId).subscribe(
      (lotesRetorno : Lote[]) => {
        lotesRetorno.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        });
      },
      (error) => {
        this.toastr.error('Error ao carregar os lotes do evento');
        console.log(error);
      },
    ).add(() => this.spinner.hide());
  }

  ngOnInit() {
    this.carregarEvento();
    this.validation();
  }

  public returnTituloLote(nome : string) : string {
   return nome === null || nome === ''?'Nome do Lote': nome;
  }
  public validation() : void {

    this.form = this.fb.group({
        tema        : ['', Validators.required],
        local       : ['',[Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
        dataEvento  : ['', Validators.required],
        qtdPessoas  : ['',[Validators.required,Validators.max(120000)]],
        imagemURL   : [''],
        telefone    : ['', Validators.required],
        email       : ['',[Validators.required,Validators.email]],
        lotes       : this.fb.array([])
    });
  }

  adcionarLote () : void {
   (this.lotes).push(this.criarLote({id:0} as Lote));
  }

  criarLote(lote:Lote) : FormGroup {
      return this.fb.group({
        id  : [lote.id,Validators.required],
        nome  : [lote.nome,Validators.required],
        preco  : [lote.preco,Validators.required],
        dataInicio  : [lote.dataInicio,Validators.required],
        dataFim  : [lote.dataFim,Validators.required],
        quantidade  : [lote.quantidade,Validators.required]
      });
  }

  public mudarValorData(value:Date , indice : number,field : string) : void {
    this.lotes.value[indice][field] = value;
  }

  public resetForm() : void {
    this.form.reset();
  }

  public salvarAlteracao() : void {
    this.spinner.show();
    if(this.form.valid){

      this.evento = (this.estadoSalvar === 'post')
          ? {...this.form.value}
          : {id: this.evento.id,...this.form.value};

      this.eventoService[this.estadoSalvar=='post'? 'post' : 'put'](this.evento).subscribe(
        (eventoRetorno: Evento) => {
          this.toastr.success('Evento salvo com sucesso!','Successo');
          this.redirectRouter.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
        },
        (error : any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Erro ao salvar o evento','Erro');
        },
        () => {this.spinner.hide()},
      );

    }
  }

  public salvarLote() : void {
    if(this.form.controls.lotes.valid)
    {
        this.spinner.show();
        this.loteService.saveLote(+this.eventoId,this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success('Lotes salvos com sucesso!');
           // this.lotes.reset();
          },
          (error) => {
            this.toastr.error('Error ao tentar salvar lotes');
            console.log(error);
          },
        ).add(() => this.spinner.hide());
    }
  }

  public removerLote(template : TemplateRef<any>,
                      indice : number) : void {

    this.loteAtual.id = this.lotes.get(indice + '.id')?.value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome')?.value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template,{class:'modal-sm'});

  }

  confirmDeleteLote() : void{
    this.modalRef?.hide();
    this.spinner.show();

    this.loteService.deleteLote(+this.eventoId,this.loteAtual.id)
    .subscribe(
      () => {
        this.toastr.success('Lote deletado com sucesso');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error) => {
        console.log(error);
        this.toastr.error(`Erro ao deletar o lote  ${this.loteAtual.nome}`);
      },
    ).add(() => this.spinner.hide());
  }
  declineDeleteLote() : void{
    this.modalRef?.hide();
  }

  onFileChange(e : any) : void{
    const reader = new FileReader();

    reader.onload = (event : any ) => this.imagemURL = event.target.result;

    this.file = e.target.files;

    reader.readAsDataURL(e.target.files[0]);

    this.uploadImagem();
  }

  uploadImagem() : void {

    this.spinner.show();
    this.eventoService.postUpload(+this.eventoId,this.file).subscribe(
      () => {
        this.carregarEvento();
        this.toastr.success('Sucesso','Imagem atualizada com sucesso!');
      },
      (error:any) => {
        this.toastr.error('Error','Não foi possivel fazer o upload do arquivo');
        console.log(error);
      },
    ).add(() => this.spinner.hide());

  }

}
