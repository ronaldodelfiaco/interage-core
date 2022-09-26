import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  constructor(private auth: AuthService,) { }

  response = this.auth._getTokenLogadoLocalStorage();

  ngOnInit(): void {
    console.log(this.response);
  }



}
