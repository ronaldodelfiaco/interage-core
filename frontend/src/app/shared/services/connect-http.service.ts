import { Injectable } from "@angular/core";
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

@Injectable({
  providedIn: 'root'
})
export class ConnectHTTPService {
  localStorage: LocalStorageService = new LocalStorageService();
  callService(options: optionsCallService): Promise<retObjectCallService> | retObjectCallService {
    return new Promise((resolve, reject) => {
      //TROCA DADOS SERVIDOR
      const host = options.host || localSevidor;

      const service = options.service
      let url = `${host}${service}`
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


