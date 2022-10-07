import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../shared/services/local-storage.service';
import SHA1 from '../shared/services/SHA1';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  usuario: Usuario = new Usuario();
  usuarioTO: FormGroup;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private localStorage: LocalStorageService,
    private auth: AuthService,
  ) {
    this.usuarioTO = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })
  }

  // ngAfterViewChecked() {
  //   // document.querySelector('.form-content').classList.remove('animation-login');
  //   document.querySelector('.form-content').classList.add('animation-login');
  // }

  ngOnInit(): void {
    if (this.auth.checkAutenticacao()) {
      let usuarioLogado = this.localStorage.get('usuarioLogado') as Usuario;
      this.router.navigate(['eventos']);
    }
    else {
      this.auth.logout();
    }
  }

  async onSubmit() {
    this.usuario.login = this.usuarioTO.value.login;
    this.usuario.password = SHA1(this.usuarioTO.value.password);

    const res: any = await this.auth.autenticacao(this.usuario);
    if (res.error) {
      this.toastrService.error(res.error);
      this.usuarioTO.value.password = '';
      this.router.navigate(['/login']);
    }
    else {
      let usuarioLogado = res.resposta;
      this.router.navigate(['eventos']);
    }
  }
}
