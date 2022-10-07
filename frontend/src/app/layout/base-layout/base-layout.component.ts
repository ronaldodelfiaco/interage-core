import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';
import { Usuario } from 'src/app/login/usuario';
import { ConnectHTTPService } from 'src/app/shared/services/connect-http.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent {
  opened: boolean;

  hasLogado: Observable<boolean>;
  usuarioLogado: Usuario;
  nomeUsuario: string = 'Usuário';
  // TROCA DADOS SERVIDOR TROCAR NUMERO DA VERSÃO
  versaoSistema: string;
  versaoTeste: boolean;
  counterEvents: number;
  sub: any;

  events: string[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private connectHTTP: ConnectHTTPService,
    private localStorage: LocalStorageService,
    // private checkPermissaoRecurso: CheckPermissaoRecurso
  ) {
    this.hasLogado = this.auth.estaLogado();
    this.usuarioLogado = this.localStorage.get('usuarioLogado') as Usuario;
    this.getCounterEvents();
    this.versaoSistema = 'T.2.1.22';
    this.versaoTeste = true;
  }

  async getCounterEvents() {
    let self = this;
    let res = await this.auth.getCounterEvents();
    if (!this.sub)
      this.sub = res.subscribe(o => {
        self.counterEvents = o;
      });
  }

  logout() {
    this.auth.logout();
  }

  openPage(page: string, event: any) {
    event.preventDefault();
    event.stopPropagation();
    setTimeout((_: any) => {
      this.router.navigate([page]);
    }, 100);
  }

  abrirCadastroPessoa() {
    window.open(`/pessoas/${this.usuarioLogado.id_pessoa}`, '_blank')
  }

  // temPermissao(recurso: any) {
  //   return this.checkPermissaoRecurso.usuarioLocadoAcessaRecurso(recurso)
  // }
}
