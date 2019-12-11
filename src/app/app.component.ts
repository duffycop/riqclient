import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from './services/user.service';
import { User } from './models/user';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit{
  public title = 'APP';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit(){
    this.alertRegister = null;
    this.errorMessage = null;
    var errorMessage;
    //Conseguir datos del usuario identificado
    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if(!this.identity || !this.identity._id){
          this.errorMessage = 'El usuario o la contraseña son incorrectos';
        }else{
          // Crear elemento en el localstorage para tener al usuario sesion

          localStorage.setItem('identity', JSON.stringify(identity));

          // Conseguir token para enviar en cada peticion http

                  this._userService.signup(this.user, 'true').subscribe(
                    response => {
                      let token = response.token;
                      this.token = token;

                      if(this.token.length <= 0){
                        this.errorMessage = "El token no se ha generado correctamente";
                      }else{
                        // Crear elemento en el localstorage para tener token disponible
                        localStorage.setItem('token', token);
                        this.user = new User('','','','','','ROLE_USER','');

                      }
                    },
                    error => {
                      var errorMessage = <any>error;
                      if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        this.errorMessage = body.message;
                        console.log(error);
                      }
                    }
                  );
        }
      },
      error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }

  onSubmitRegister(){
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'Registrado correctamente, inicia sesion con '+this.user_register.email;
          this.user_register = new User('','','','','','ROLE_USER','');
        }
      },
      error => {
        var alertMessage = <any>error;
        if(alertMessage != null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
          }
        }
    );
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
  }

}
