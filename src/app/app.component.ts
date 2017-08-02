import {Component} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  loggedIn = false;

  constructor(private authService: AuthenticationService) {
    this.authService.af.auth.onAuthStateChanged(auth => {
      this.loggedIn = !isNullOrUndefined(auth);
    });
  }

  logout() {
    this.authService.logout();
  }

  print() {
    window.print();
  }

}
