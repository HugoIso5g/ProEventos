import { Palestrante } from './../../../models/Palestrante';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PalestranteService } from './../../../services/palestrante.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { map, debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss']
})
export class PalestranteDetalheComponent implements OnInit {

  public form! : FormGroup;
  public situacaoDoForm = '';
  public corDaDescricao = '';

  constructor(
    private fb: FormBuilder,
    public palestranteService: PalestranteService,
    private toastr : ToastrService,
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit() {
    this.validation();
    this.verificaForm();
    this.carregarPalestrante();
  }

  private validation() : void {
    this.form = this.fb.group({
      miniCurriculo: ['']
    })
  }

  private carregarPalestrante() : void {
    this.palestranteService
    .getPalestrante()
    .subscribe(
        (palestrante:Palestrante) => {
          this.form.patchValue(palestrante);
        },
        (error: any) => {
          this.toastr.error('Error ao carregar o Palestrante', 'Erro');
        }
    )
    .add(() => {})
  }

  public get f() : any {
    return this.form.controls;
  }

  private verificaForm() : void {
    this.form.valueChanges
    .pipe(
      map(() => {
        this.situacaoDoForm = 'Minicurrículo está sendo Atualizado!';
        this.corDaDescricao = 'text-warning';
      }),
      debounceTime(1000),
      tap(() => this.spinner.show())
    )
    .subscribe(
      () =>{
        this.palestranteService
            .put({...this.form.value})
            .subscribe(
              () => {

                this.situacaoDoForm = 'Minicurrículo foi atualizado!';
                this.corDaDescricao = 'text-success';

                setTimeout(() => {
                  this.situacaoDoForm = 'Minicurrículo foi carregado!';
                  this.corDaDescricao = 'text-muted';
                }, 2000);

              },
              () => {
                this.toastr.error('Erro ao tentar atualizar Palestrante','Erro');
              }
            )
            .add(() => this.spinner.hide());
      })
  }

}
