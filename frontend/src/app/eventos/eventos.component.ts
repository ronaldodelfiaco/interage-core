import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, merge, of as observableOf, startWith, switchMap } from 'rxjs';
import { Usuario } from '../login/usuario';
import { ConnectHTTPService as ConnectHTTP } from '../shared/services/connect-http.service';
import { LocalStorageService as LocalStorage } from '../shared/services/local-storage.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements AfterViewInit {
  usuarioLogado: Usuario;
  usuarioLogadoSupervisor: boolean;
  tableData: Array<any>;
  data: any;
  totalEventos: number | undefined;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;
  displayedColumns: string[] = ['id', 'tempo', 'motivo', 'cliente'];
  eventos: any;

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private connectHTTP: ConnectHTTP, private toastrService: ToastrService, private localStorage: LocalStorage, private router: Router) {
    this.usuarioLogado = this.localStorage.get('usuarioLogado') as Usuario;
    this.usuarioLogadoSupervisor = this.usuarioLogado.dashboard === "supervisor" || this.usuarioLogado.dashboard === "admin";
  }

  async ngAfterViewInit(): Promise<boolean> {
    if (!this.localStorage.get('usuarioLogado')) {
      return true;
    }

    // this.eventos = await this.connectHTTP.callService({
    //   service: 'genericCRUD',
    //   paramsService: {
    //     table: 'view_eventos',
    //   }
    // });

    // this.eventos = this.eventos.resposta.body.rows;
    // console.log(8, this.eventos);

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.connectHTTP.getEventosPage(
            { service: 'executaSQL' },
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          ).pipe(catchError(() => observableOf(null)))
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          console.log(data);

          return data?.body.table;
        })
      )
      .subscribe(data => (this.data = data));
    this.connectHTTP.getCountEventos({ service: 'executaSQL' }).subscribe(data => this.totalEventos = data.body.table[0].count);

    return false;
  }
}
