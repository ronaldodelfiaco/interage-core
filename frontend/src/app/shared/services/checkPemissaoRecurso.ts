import { Usuario } from "../../login/usuario";
import { LocalStorageService as LocalStorage } from "./local-storage.service";



export class CheckPermissaoRecurso {

  private localStorage: LocalStorage = new LocalStorage();
  private usuarioLogado = this.localStorage.get('usuarioLogado') as Usuario;

  usuarioLocadoAcessaRecurso(recurso: any) {
    let permissoesUsuarioLocado: any[] = [];
    (this.usuarioLogado.permissoes || []).forEach(elem => {
      permissoesUsuarioLocado.push(elem.id_recursos)
    });

    if (permissoesUsuarioLocado.indexOf(recurso) != -1) return true;
    else {
      return false;
    }
  }
}

