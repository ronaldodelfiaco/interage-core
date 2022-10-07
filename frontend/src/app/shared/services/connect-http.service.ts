import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SortDirection } from "@angular/material/sort";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Usuario } from "../../login/usuario";
import { LocalStorageService } from "./local-storage.service";

// var localSevidor = "http://88.99.35.190:3000/" //Producao
var localSevidor = environment.urlApi;  //Local
//var localSevidor =  "http://192.168.100.74:3010/" //MCPRO

interface optionsCallService {
  service: string
  paramsService?: any,
  host?: string,
  naoExigeToken?: boolean
}

interface retObjectCallService {
  error?: string
  resposta: object
}

interface Eventos {
  id_pessoa_criou: number,
  id_evento_pai: number,
  id_evento_anterior: number,
  id_campanha: number,
  listar_seus_eventos: boolean,
  id_motivo: number,
  id_status_evento: number,
  id: number,
  dt_criou: Date,
  dt_prevista_resolucao: Date,
  dt_para_exibir: Date,
  id_pessoa_organograma: number,
  id_usuario: number,
  id_pessoa_receptor: number,
  id_prioridade: number,
  dt_visualizou: Date,
  id_pessoa_visualizou: number,
  dt_resolvido: Date,
  id_pessoa_resolveu: number,
  id_resp_motivo: number,
  id_predicao: number,
  id_canal: number,
  id_telefone: number,
  id_objecao: number,
  excedeu_tentativas: boolean,
  id_proposta: number,
  tempo_gasto_resolveu_ss: number,
  campanha: string,
  pessoa_visualizou: string,
  tempo_gasto_resolveu: string,
  motivo: string,
  telefone: string,
  status: string,
  status_evento_cor_stringo: string,
  status_evento_icone: string,
  pessoa_resolveu: string,
  pessoa_criou: string,
  exigi_aviso_leitura: string,
  observacao_origem: string,
  observacao_retorno: string,
  tipodestino: string,
  complemento_resposta: string,
  destino: string,
  resposta_motivo: string,
  tempo: string,
  cliente: string,
  predicao: string,
  prioridade: string,
  objecao: string,
  canal: string,
}

interface BancoEventos {
  message: string;
  body: {
    table: Eventos[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class ConnectHTTPService {
  localStorage: LocalStorageService = new LocalStorageService();
  config: void;

  constructor(private _httpClient: HttpClient) { }

  getCountEventos(options: optionsCallService): Observable<any> {
    if (!options.naoExigeToken) {
      const usuarioLogado = this.localStorage.get('usuarioLogado') as Usuario;
      if (usuarioLogado != undefined) {
        options.paramsService = {
          ...options.paramsService,
          // id_usuario: usuarioLogado.id,
          // token: usuarioLogado.token
          id_usuario: 44,
          token: usuarioLogado.token
        }
      }
    }

    const paramsService = this._trataParamsService(options.paramsService);
    const url = `${environment.urlApi}${options.service}${paramsService}`;
    const body = `sql=select count(id) from view_eventos`;

    return this._httpClient.post(encodeURI(url),
      body,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  getEventosPage(options: optionsCallService, sort: string, order: SortDirection, page: number): Observable<BancoEventos> {
    if (!options.naoExigeToken) {
      const usuarioLogado = this.localStorage.get('usuarioLogado') as Usuario;
      if (usuarioLogado != undefined) {
        options.paramsService = {
          ...options.paramsService,
          // id_usuario: usuarioLogado.id,
          // token: usuarioLogado.token
          id_usuario: 44,
          token: usuarioLogado.token
        }
      }
    }

    const paramsService = this._trataParamsService(options.paramsService)

    const url = `${environment.urlApi}${options.service}${paramsService}`;
    // const requestUrl = `${href}&sort=${sort}&order=${order}&page=${page + 1}`;
    const body = `sql=select * from view_eventos ORDER BY ${sort} ${order} LIMIT 10 OFFSET ${10 * page}`;

    return this._httpClient.post<BancoEventos>(encodeURI(url),
      body,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  getUser(options: optionsCallService): Promise<retObjectCallService> | retObjectCallService {
    return new Promise((resolve, reject) => {
      //TROCA DADOS SERVIDOR
      const host = localSevidor;

      const service = options.service;

      let url = `${host}${service}`;

      if (!options.naoExigeToken) {
        let usuarioLogado = this.localStorage.get('usuarioLogado') as Usuario;
        if (usuarioLogado != undefined) {
          options.paramsService = {
            ...options.paramsService,
            id_usuario: usuarioLogado.id,
            token: usuarioLogado.token
          }
        }
      }

      if (options.paramsService) {
        const paramsService = this._trataParamsService(options.paramsService)
        url = `${url}${paramsService}`
      }
      const xhttp = new XMLHttpRequest()

      xhttp.onload = function () {
        const selfXhttp = this;
        if (selfXhttp.status === 200) {
          if (!selfXhttp.responseText) return resolve({ resposta: {} })
          else resolve({ resposta: JSON.parse(selfXhttp.responseText).usuarioLogado, error: '' })
        } else if (selfXhttp.status === 401) {
          console.log(selfXhttp.responseText);

          resolve({ resposta: {}, error: selfXhttp.responseText === 'object' ? JSON.parse(selfXhttp.responseText) : selfXhttp.responseText })
        }
      }

      xhttp.onerror = (e) => {
        reject(e)
      }

      xhttp.open("GET", url)
      xhttp.send()
    })
  }

  callService(options: optionsCallService): Promise<retObjectCallService> | retObjectCallService {
    return new Promise((resolve, reject) => {
      //TROCA DADOS SERVIDOR
      const host = localSevidor;

      const service = options.service;

      let url = `${host}${service}`;

      if (!options.naoExigeToken) {
        let usuarioLogado = this.localStorage.get('usuarioLogado') as Usuario;
        if (usuarioLogado != undefined) {
          options.paramsService = {
            ...options.paramsService,
            id_usuario: usuarioLogado.id,
            token: usuarioLogado.token
          }
        }
      }

      if (options.paramsService) {
        const paramsService = this._trataParamsService(options.paramsService)
        url = `${url}${paramsService}`
      }
      const xhttp = new XMLHttpRequest()

      xhttp.onload = function () {
        const selfXhttp = this;
        if (selfXhttp.status === 200) {
          if (!selfXhttp.responseText) return resolve({ resposta: {} })
          else resolve({ resposta: JSON.parse(selfXhttp.responseText), error: '' })
        } else if (selfXhttp.status === 401) {
          console.log(selfXhttp.responseText);

          resolve({ resposta: {}, error: selfXhttp.responseText === 'object' ? JSON.parse(selfXhttp.responseText) : selfXhttp.responseText })
        }
      }

      xhttp.onerror = (e) => {
        reject(e)
      }

      xhttp.open("GET", url)
      xhttp.send()
    })
  }

  // send file em json
  sendFile(options: optionsCallService): Promise<retObjectCallService> | retObjectCallService {

    if (!options.paramsService.arquivo) return { error: 'É necessário enviar o arquivo.', resposta: {} };

    const arquivo = options.paramsService.arquivo;

    return new Promise((resolve, reject) => {

      //TROCA DADOS SERVIDOR
      const host = options.host || localSevidor;

      const service = options.service

      let url = `${host}${service}`

      if (!options.naoExigeToken) {
        let usuarioLogado = this.localStorage.get('usuarioLogado') as Usuario;
        if (usuarioLogado != undefined) {
          options.paramsService = {
            id_usuario: usuarioLogado.id,
            token: usuarioLogado.token
          }
        }
      }

      if (options.paramsService) {
        const paramsService = this._trataParamsService(options.paramsService)
        url = `${url}${paramsService}`
      }
      const xhttp = new XMLHttpRequest()

      xhttp.onload = function () {
        const selfXhttp = this
        if (selfXhttp.status === 200) {
          resolve({ resposta: JSON.parse(selfXhttp.responseText) })
        } else if (selfXhttp.status === 401) {
          resolve({ resposta: {}, error: selfXhttp.responseText })
        }
      }
      xhttp.onerror = (e) => {
        reject(e)
      }
      //console.log('url', url )

      xhttp.open("POST", encodeURI(url), true);
      xhttp.setRequestHeader("Content-Type", "application/json")
      xhttp.send(JSON.stringify(arquivo))
    })
  }

  uploadFiles(options: optionsCallService): Promise<retObjectCallService> | retObjectCallService {
    if (!options.paramsService.arquivo) return { error: 'É necessário enviar o arquivo.', resposta: {} };

    const arquivo = options.paramsService.arquivo;

    return new Promise((resolve, reject) => {

      //TROCA DADOS SERVIDOR
      const host = options.host || localSevidor;

      const service = options.service

      let url = `${host}${service}`

      if (!options.naoExigeToken) {
        let usuarioLogado = this.localStorage.get('usuarioLogado') as Usuario;
        if (usuarioLogado != undefined) {
          options.paramsService = {
            id_usuario: usuarioLogado.id,
            token: usuarioLogado.token
          }
        }
      }

      if (options.paramsService) {
        const paramsService = this._trataParamsService(options.paramsService)
        url = `${url}${paramsService}`
      }
      const xhttp = new XMLHttpRequest()

      xhttp.onload = function () {
        const selfXhttp = this
        if (selfXhttp.status === 200) {
          resolve({ resposta: JSON.parse(selfXhttp.responseText) })
        } else if (selfXhttp.status === 401) {
          resolve({ resposta: {}, error: selfXhttp.responseText })
        }
      }
      xhttp.onerror = (e) => {
        reject(e)
      }

      xhttp.open("POST", encodeURI(url), true);
      xhttp.setRequestHeader("Content-Type", "application/json")
      xhttp.send(JSON.stringify(arquivo))
    })
  }

  _trataParamsService(paramsService: any): string {
    return "?" + Object.keys(paramsService).map((o) => {
      return `${o}=${paramsService[o]}`
    }).join('&')
  }

  postHHTP(options: optionsCallService): Promise<retObjectCallService> | retObjectCallService {

    if (!options.paramsService.arquivo) return { error: 'É necessário enviar o arquivo.', resposta: {} };

    return new Promise((resolve, reject) => {

      //TROCA DADOS SERVIDOR
      const host = options.host || localSevidor;

      const service = options.service

      const arquivo = options.paramsService.arquivo;

      let url = `${host}${service}`

      if (!options.naoExigeToken) {
        let usuarioLogado = this.localStorage.get('usuarioLogado') as Usuario;
        if (usuarioLogado != undefined) {
          options.paramsService = {
            //...options.paramsService,
            id_usuario: usuarioLogado.id,
            token: usuarioLogado.token
          }
        }
      }


      // var formData = new FormData();

      // formData.append("file", options.paramsService.arquivo);

      // delete options.paramsService.arquivo
      if (options.paramsService) {
        const paramsService = this._trataParamsService(options.paramsService)
        url = `${url}${paramsService}`
      }
      const xhttp = new XMLHttpRequest()

      xhttp.onload = function () {
        const selfXhttp = this
        if (selfXhttp.status === 200) {
          resolve({ resposta: JSON.parse(selfXhttp.responseText) })
        } else if (selfXhttp.status === 401) {
          resolve({ resposta: {}, error: selfXhttp.responseText })
        }
      }
      xhttp.onerror = (e) => {
        reject(e)
      }
      // xhttp.setRequestHeader("Content-Type","multipart/form-data");
      xhttp.open("POST", encodeURI(url), true)
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify({
        "codigo_associado": 3280,
        "codigo_situacao_boleto": 1
      }))
    })
  }
}
