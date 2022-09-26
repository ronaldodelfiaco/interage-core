import { Usuario } from './usuario';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConnectHTTPService } from '../shared/services/connect-http.service';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router, private localStorage: LocalStorageService, private connectHTTP: ConnectHTTPService) {
    let self = this;
    let tm: any;
    this.initConfig();
    document.addEventListener("mousemove", () => {
      if (tm) clearTimeout(tm);
      tm = setTimeout(() => {
        self.validaAutenticacao();
      }, 1000 * 5)
    });
  }

  usuarioLogado: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this._getTokenLogadoLocalStorage());
  counterEvents: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  usuarioLogadoObject: any;
  setInterval: any;
  config: any;

  async getCounterEvents() {
    return this.counterEvents;
  }

  async initConfig() {
    // ler paramentros de configuração
    // let config = await this.connectHTTP.callService({
    //   service: 'getConfiguracao',
    //   paramsService: {
    //     nomeConfiguracao: 'tempoDealertaDeEventos'
    //   }
    // }) as any;
    // this.config = config.resposta[0].valor;
    this.config = 30000;
    if (this.usuarioLogadoObject) {
      this.ativaGetEventos(parseInt(this.config));
    }
  }

  async ativaGetEventos(timer: number) {
    let self = this;
    let res = self.connectHTTP.callService({
      service: 'genericCRUD',
      paramsService: {
        id_usuario: self.usuarioLogadoObject.id,
        token: this._getTokenLogadoLocalStorage,
        table: 'eventos'
      }
    }) as any;
    // let counter = res.resposta[0].count as number;
    // this.counterEvents.next(counter);
    this.setInterval = setInterval(async () => {

      //      if (!self.usuarioLogadoObject) return clearInterval(self.setInterval);
      if (!this.getUsuarioLogadoLocalStorage()) return clearInterval(self.setInterval);

      let res = await self.connectHTTP.callService({
        service: 'genericCRUD',
        paramsService: {
          id_usuario: self.usuarioLogadoObject.id,
          token: this._getTokenLogadoLocalStorage,
          table: 'eventos'
        }
      }) as any;

      // let counter = res.resposta[0].count as number;
      // this.counterEvents.next(counter);
    }, timer)
  }

  estaLogado(): Observable<boolean> {
    return this.usuarioLogado.asObservable();
  }

  async autenticacao(usuario: Usuario) {
    try {
      const usuarioLogado = await this.connectHTTP.callService({
        service: 'login',
        naoExigeToken: true,
        paramsService: {
          login: usuario.login,
          senha: usuario.password,
        }
      })

      this.usuarioLogadoObject = usuarioLogado.resposta;
      console.log(this.usuarioLogadoObject);
      this.localStorage.set('usuarioLogado', usuarioLogado.resposta)
      this._setValidadeToken();
      this.ativaGetEventos(parseInt(this.config));
      this.usuarioLogado.next(true)
      return usuarioLogado;
    }
    catch (e) {
      return e;
    }
  }

  checkAutenticacao() {
    return this._getDataExpiracao() && this._getDataExpiracao().getTime() > new Date().getTime();
  }

  validaAutenticacao() {
    if (this.getUsuarioLogadoLocalStorage()) {
      if (this._getDataExpiracao().getTime() >= new Date().getTime()) {
        this._setValidadeToken();
      }
      else {
        this.logout();
      }
    }
  }

  _getDataExpiracao(): Date {
    if (this.usuarioLogadoObject && this.usuarioLogadoObject.token)
      return this.localStorage.get(this.usuarioLogadoObject.token as string) as Date;
    return new Date();
  }
  _setValidadeToken() {
    let validadeToken = new Date(new Date().getTime() + (1000 * 60 * 30))
    if (this.usuarioLogadoObject && this.usuarioLogadoObject.token)
      this.localStorage.set(this.usuarioLogadoObject.token, validadeToken)
  }

  async logout() {
    let usuarioLogado = this.getUsuarioLogadoLocalStorage();
    if (usuarioLogado) {
      await this.connectHTTP.callService({
        service: 'logout',
        naoExigeToken: true,
        paramsService: {
          token: usuarioLogado.token,
          id_usuario: usuarioLogado.id
        }
      })
      //this.counterEvents.next(0);
      this.localStorage?.remove('usuarioLogado', 'object')
    }
    this.router.navigate(['login']);
  }

  getUsuarioLogadoLocalStorage() {
    return this.localStorage.get('usuarioLogado') as Usuario;
  }

  _getTokenLogadoLocalStorage() {
    console.log(this.usuarioLogadoObject);
    if (!this.usuarioLogadoObject) this.usuarioLogadoObject = this.getUsuarioLogadoLocalStorage();
    if (this.usuarioLogadoObject)
      return this.localStorage.get(this.usuarioLogadoObject.token);
  }
}
