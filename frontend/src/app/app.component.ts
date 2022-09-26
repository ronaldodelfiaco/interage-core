import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  hasLogado: Observable<boolean>;

  constructor(private router: Router, private auth: AuthService) {
    this.hasLogado = this.auth.estaLogado();
  }

  ngOnInit(): void {
    this.hasLogado.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }
  title = 'interage-core';
}
