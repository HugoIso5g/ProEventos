import { User } from './models/Identity/User';
import { Component } from '@angular/core';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  constructor(public accountService : AccountService) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() : void {
    let user : any;

    if(localStorage.getItem('user'))
      user = JSON.parse(localStorage.getItem('user') ?? '{}');
    else
      user = null;

    if(user)
      this.accountService.setCurrentUser(user);
  }
}
