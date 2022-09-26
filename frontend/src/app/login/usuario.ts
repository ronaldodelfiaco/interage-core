export class Usuario {
  private _login!: string;
  private _id_organograma!: number;
  private _id!: number;
  private _password!: string;
  private _dashboard!: string;
  private _ultimoLogin!: Date;
  private _permissao!: string;
  private _token!: string;
  private _id_pessoa!: number;
  private _responsavel_membro!: number;
  private _apelido!: string;
  private _telefone!: string;
  private _ddd!: number;
  private _possui_carteira_cli!: boolean;
  private _nome!: string;
  private _permissoes!: Array<any>;

  public get permissoes(): Array<any> {
    return this._permissoes;
  }
  public set permissoes(value: Array<any>) {
    this._permissoes = value;
  }

  public get nome(): string {
    return this._nome;
  }
  public set nome(value: string) {
    this._nome = value;
  }

  public get possui_carteira_cli(): boolean {
    return this._possui_carteira_cli;
  }
  public set possui_carteira_cli(value: boolean) {
    this._possui_carteira_cli = value;
  }

  public get ddd(): number {
    return this._ddd;
  }
  public set ddd(value: number) {
    this._ddd = value;
  }

  public get telefone(): string {
    return this._telefone;
  }
  public set telefone(value: string) {
    this._telefone = value;
  }

  public get apelido(): string {
    return this._apelido;
  }
  public set apelido(value: string) {
    this._apelido = value;
  }

  public get responsavel_membro(): number {
    return this._responsavel_membro;
  }
  public set responsavel_membro(value: number) {
    this._responsavel_membro = value;
  }

  public get id_pessoa(): number {
    return this._id_pessoa;
  }
  public set id_pessoa(value: number) {
    this._id_pessoa = value;
  }

  public get token(): string {
    return this._token;
  }
  public set token(value: string) {
    this._token = value;
  }

  public get permissao(): string {
    return this._permissao;
  }
  public set permissao(value: string) {
    this._permissao = value;
  }

  public get ultimoLogin(): Date {
    return this._ultimoLogin;
  }
  public set ultimoLogin(value: Date) {
    this._ultimoLogin = value;
  }

  public get dashboard(): string {
    return this._dashboard;
  }
  public set dashboard(value: string) {
    this._dashboard = value;
  }

  public get login(): string {
    return this._login;
  };
  public set login(value: string) {
    this._login = value;
  };

  public get password(): string {
    return this._password;
  };
  public set password(value: string) {
    this._password = value;
  };

  public get id(): number {
    return this._id;
  };
  public set id(value: number) {
    this._id = value;
  };

  public get id_organograma(): number {
    return this._id_organograma;
  };
  public set id_organograma(value: number) {
    this._id_organograma = value;
  };

}
