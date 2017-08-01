import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  loggedIn: Boolean = false;

  constructor(private authService: AuthenticationService, private router: Router) {
    this.authService.af.auth.onAuthStateChanged((auth) => {
        this.loggedIn = (auth !== null);
        if (auth == null) {
          this.router.navigate(['login']);
        } else {
          this.router.navigate(['']);
        }
      }
    );
  }

  logout() {
    this.authService.logout();
  }

  print() {
    window.print();
  }

  ngOnInit(): void {
  }


}
