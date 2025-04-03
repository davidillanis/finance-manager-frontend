import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertService } from './alert.service';
import { UserService } from './user.service';
import { UserEntity } from '../model/user-entity';
import { FirebaseUserDTO } from '../util/dto/firebase-user-dto';

import { getAdditionalUserInfo, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;

  constructor(
    private firebaseAuthenticationService: AngularFireAuth,
    private ngZone: NgZone,
    private alertService: AlertService,
    private userService: UserService,
  ) {
    this.firebaseAuthenticationService.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        try {
          localStorage.setItem('user', 'null');
        } catch (error) { }
      }
    });

  }

  loginGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((result) => {
        const additionalUserInfo = getAdditionalUserInfo(result);
        const isNewUser = additionalUserInfo?.isNewUser;
        if (isNewUser) {
          let userEntity: UserEntity = { id: '', firstName: result.user.displayName, lastName: null, imageUrl: null, registrationDate: null, role: 'USER' }
          this.userService.createUser(userEntity, result.user.uid).subscribe(() => {
            this.observeUserState();
            this.alertService.successfulCallback("Inicio de session", ()=>location.reload());
          })
        } else {
          this.alertService.successfulCallback("Inicio de session", ()=>location.reload());
        }
        this.alertService.successfulCallback('Inicio de sesión exitoso: ', ()=>location.reload())
      })
      .catch((error) => {
        this.alertService.error('Error al iniciar sesión con Google:' + error)
      });
  }

  signInEmailPassword(email: string, password: string) {
    return this.firebaseAuthenticationService.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.observeUserState();
        this.alertService.successfulCallback("Inicio de sesión", ()=>location.reload());
      })
      .catch((error) => this.alertService.error(error.message));
  }

  signUpEmailAndPassword(email: string, password: string, name: string) {
    return this.firebaseAuthenticationService
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userData = userCredential.user;
        let uid = userCredential.user?.uid;
        if (uid) {
          let userEntity: UserEntity = { id: '', firstName: name, lastName: null, imageUrl: null, registrationDate: null, role: 'USER' }
          this.userService.createUser(userEntity, uid).subscribe(() => {
            this.observeUserState();
            this.alertService.successfulCallback("User created", ()=>location.reload());
          })
        }
      })
      .catch((error) => {
        this.alertService.warning(error);
      });
  }

  recoveryPassword(email: string) {
    let message = '';
    this.firebaseAuthenticationService
      .sendPasswordResetEmail(email)
      .then(() => {
        message =
          'Te hemos enviado un enlace de recuperación a tu correo electrónico.';
      })
      .catch((error) => {
        console.error('Error al enviar el enlace de recuperación:', error);
        message = 'Hubo un error al enviar el enlace. Intenta nuevamente.';
      });
  }

  observeUserState() {
    this.firebaseAuthenticationService.authState.subscribe((userState) => {
      userState && this.ngZone.run(() => { });
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  logOut() {
    return this.firebaseAuthenticationService.signOut().then(() =>{
      localStorage.removeItem('user');
      this.alertService.successfulCallback("Log Out", ()=>location.reload());
    });
  }

  logOutConfig(title: string,text: string,icon: SweetAlertIcon,color: string, confirmButtonText: string = 'Continuar',timer: number = 1600, onClose: () => void = () => { } ){
    return this.firebaseAuthenticationService.signOut().then(() =>{
      localStorage.removeItem('user');
      this.alertService.alertCallback(title, text, icon, color, confirmButtonText, timer, onClose);
    });
  }

  getUser(): FirebaseUserDTO | null {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'null') {
      const parsedUser: FirebaseUserDTO = JSON.parse(storedUser);
      return parsedUser;
    }
    return null;
  }


}
