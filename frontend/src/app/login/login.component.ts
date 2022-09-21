import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import SHA1 from '../shared/services/SHA1';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  usuario = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
  })

  onSubmit(): void {
    this.usuario.value.login = this.usuario.value.login;
    typeof this.usuario.value.password !== 'string' ? console.log('Algo deu errado na senha') // só sera ativo se de alguma forma password for null ou indefinido
      : this.usuario.value.password = SHA1(this.usuario.value.password);

    
  }
}
