import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../../../services/account.service';
import { User } from './../../../models/Identity/User';
import { ValidatorField } from './../../../helpers/ValidatorField';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {

  user = {} as User;
  form!: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  constructor(public fb: FormBuilder,
    private accountService : AccountService,
    private router : Router,
    private toast : ToastrService) {}

  ngOnInit(): void {
    this.validation();
  }

  private validation(): void {

    const formOptions : AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password','confirmePassword')
    };

    this.form = this.fb.group({
      primeiroNome: ['', Validators.required],
      ultimoNome: ['', Validators.required],
      email: ['',
        [Validators.required,Validators.email]
      ],
      userName: ['', Validators.required],
      password: ['',
        [Validators.required,Validators.minLength(4)]
      ],
      confirmePassword: ['', Validators.required],
    },formOptions);
  }

  register() : void {
    this.user  = { ...this.form.value};
    this.accountService.register(this.user).subscribe(
      () => this.router.navigateByUrl('/dashboard'),
      (error : any) => this.toast.error(error.error)
    )
  }
}
