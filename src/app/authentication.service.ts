import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';

@Injectable()
export class AuthenticationService {

  constructor(public af: AngularFireAuth, private router: Router) {
  }

  login(email: string, password: string) {
    return this.af.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.af.auth.signOut()
      .then(() => this.router.navigate(['/login']))
      .catch(err => console.log(err));
  }

}
