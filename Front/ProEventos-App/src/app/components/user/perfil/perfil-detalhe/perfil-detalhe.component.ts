import { PalestranteService } from './../../../../services/palestrante.service';
import { ValidatorField } from './../../../../helpers/ValidatorField';
import { UserUpdate } from './../../../../models/Identity/UserUpdate';
import { FormGroup, AbstractControlOptions, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountService } from './../../../../services/account.service';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, Output ,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss']
})
export class PerfilDetalheComponent implements OnInit {

  @Output() changeFormValue = new EventEmitter();

  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  constructor(
    public fb: FormBuilder,
    public accountService: AccountService,
    public palestranteService: PalestranteService,
    private router: Router,
    private toaster: ToastrService,
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
    this.verificaForm();
  }

  private verificaForm() : void {
    this.form.valueChanges.subscribe(() =>this.changeFormValue.emit({... this.form.value}));
  }

  private carregarUsuario() : void {
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userRetorno : UserUpdate)=>{
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toaster.success('Usuário Carregado', 'Sucesso');
      },
      (error : any)=>{
        console.log(error);
        this.toaster.error(error.message);
        this.router.navigate(['/dashboard']);
      }
    )
    .add(() => { this.spinner.hide() });
  }

  private validation() : void
  {

    const formOptions : AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password','confirmePassword')
    };

    this.form = this.fb.group({
      userName : [''],
      imagemURL : [''],
      titulo : ['NaoInformado',Validators.required],
      primeiroNome : ['',Validators.required],
      ultimoNome: ['',Validators.required] ,
      email : ['',[Validators.required,Validators.email]],
      phoneNumber: ['',Validators.required] ,
      descricao: ['',Validators.required] ,
      funcao : ['NaoInformado',Validators.required] ,
      password : ['',[Validators.minLength(4), Validators.nullValidator]] ,
      confirmePassword : ['',Validators.nullValidator]
    },formOptions);

  }

  onSubmit(): void {
    this.atualizarUsuario();
  }

  public atualizarUsuario(){
    this.userUpdate = { ...this.form.value};
    this.spinner.show();

    if(this.f.funcao.value === 'Palestrante'){
      this.palestranteService.post().subscribe(
        () => this.toaster.success('Função palestrante ativada!', 'Sucesso'),
        (error) => {
          this.toaster.error('A função palestrante nao pode ser Ativada','Error');
          console.error(error);
        }
      )
    }

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => this.toaster.success('Usuário atualizado!','Sucesso'),
      (error : any) => {
        this.toaster.error(error.error);
        console.log(error);
      }
    )
    .add(() => {this.spinner.hide()});
  }

  public resetForm() : void
  {
    this.form.reset();
  }
}
