import { environment } from '@environments/environment';
import { UserUpdate } from './../../../models/Identity/UserUpdate';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  public usuario = {} as UserUpdate;
  public file: File;
  public imagemURL = '';


  public get ehPalestrante() : boolean {
    return this.usuario.funcao === 'Palestrante';
  }

  constructor(
    private spinner : NgxSpinnerService,
    private toaster : ToastrService,
    private accountService : AccountService,
    ) { }

  ngOnInit() {}

  public getFormValue(usuario: UserUpdate) : void {
    this.usuario = usuario;
    if(this.usuario.imagemURL)
      this.imagemURL = environment.apiUrl + `resources/perfil/${this.usuario.imagemURL}`;
    else
      this.imagemURL = './assets/img/perfil.png';
  }

  onFileChange(e : any) : void{
    const reader = new FileReader();

    reader.onload = (event : any ) => this.imagemURL = event.target.result;

    this.file = e.target.files;

    reader.readAsDataURL(e.target.files[0]);

    this.uploadImagem();
  }

  private uploadImagem(): void {

    this.spinner.show();
    this.accountService
    .postUpload(this.file)
    .subscribe(
      () => this.toaster.success('Imagem atualizada com Sucesso', 'Sucesso!'),
      (error : any) => {
        this.toaster.error('Erro ao fazer upload de imagem' , 'Erro!');
        console.log(error);
      }
    )
    .add(
      () => {this.spinner.hide()}
    );

  }

}
