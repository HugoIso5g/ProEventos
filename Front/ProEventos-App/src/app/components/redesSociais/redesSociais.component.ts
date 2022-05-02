import { AbstractControl } from '@angular/forms';
import { RedeSocialService } from './../../services/redeSocial.service';
import { ToastrService } from 'ngx-toastr';
import { RedesSociais } from './../../models/RedesSociais';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-redesSociais',
  templateUrl: './redesSociais.component.html',
  styleUrls: ['./redesSociais.component.scss']
})
export class RedesSociaisComponent implements OnInit {

  modalRef : BsModalRef;
  @Input() eventoId = 0;
  public formRS : FormGroup;
  public redeSocialAtual = { id : 0, nome : '', indice: 0 };

  public get redesSociais () : FormArray {
    return this.formRS.get('redesSociais') as FormArray;
  }

  constructor(
    private fb : FormBuilder,
    private spinner : NgxSpinnerService,
    private toastr : ToastrService,
    private redeSocialService : RedeSocialService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.carregarRedesSociais(this.eventoId);
    this.validation();
  }

  public validation() : void {
    this.formRS = this.fb.group({
      redesSociais : this.fb.array([])
    });
  }
  public retornaTitulo(nome : string) : string {
    return nome === null || nome === ''?'Rede Social ': nome;
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public carregarRedesSociais(id : number = 0) : void {
    let origem = 'palestrante';
    if(this.eventoId !== 0) origem = 'evento';

    this.spinner.show();

    this.redeSocialService
    .getRedesSociais(origem,id)
    .subscribe(
      (redeSocialRetorno : RedesSociais[]) => {
        redeSocialRetorno.forEach((redeSocial) => {
          this.redesSociais.push(this.criarRedeSocial(redeSocial));
        })
      },
      (error:any) => {
        this.toastr.error('Erro ao carregar rede social','Error');
        console.log(error);
      }
    ).add(() => {this.spinner.hide()});
  }

  adicionarRedeSocial () : void {
    (this.redesSociais).push(this.criarRedeSocial({id:0} as RedesSociais));
  }

  criarRedeSocial(redeSocial:RedesSociais) : FormGroup {
    return this.fb.group({
      id  : [redeSocial.id],
      nome  : [redeSocial.nome,Validators.required],
      url  : [redeSocial.url,Validators.required],
    });
}


  public salvarRedesSociais() : void {

    let origem = 'palestrante';
    if(this.eventoId !== 0) origem = 'evento';

    if(this.formRS.controls.redesSociais.valid)
    {
        this.spinner.show();
        this.redeSocialService.saveRedesSociais(origem,this.eventoId ,this.formRS.value.redesSociais)
        .subscribe(
          () => {
            this.toastr.success('Redes Sociais foram salvas com sucesso!');
           // this.lotes.reset();
          },
          (error) => {
            this.toastr.error('Error ao tentar salvar as Redes Sociais');
            console.log(error);
          },
        ).add(() => this.spinner.hide());
    }
  }

  public removerRedeSocial(template : TemplateRef<any>,indice : number) : void {

    this.redeSocialAtual.id = this.redesSociais.get(indice + '.id')?.value;
    this.redeSocialAtual.nome = this.redesSociais.get(indice + '.nome')?.value;
    this.redeSocialAtual.indice = indice;

    this.modalRef = this.modalService.show(template,{class:'modal-sm'});

  }

  confirmDeleteRedeSocial() : void{
    let origem = 'palestrante';
    if(this.eventoId !== 0) origem = 'evento';

    this.modalRef?.hide();
    this.spinner.show();

    this.redeSocialService
    .deleteRedeSocial(origem ,this.eventoId,this.redeSocialAtual.id)
    .subscribe(
    () => {
    this.toastr.success('Rede Social deletado com sucesso');
    this.redesSociais.removeAt(this.redeSocialAtual.indice);
    },
    (error) => {
    console.log(error);
    this.toastr.error(`Erro ao deletar a Rede Social :  ${this.redeSocialAtual.nome}`);
    },
    ).add(() => this.spinner.hide());
  }

  declineDeleteRedeSocial() : void{
      this.modalRef?.hide();
  }

}
