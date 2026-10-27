import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InscricaoService } from '../../services/inscricao.service';

@Component({
  selector: 'app-lista-inscricoes',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="pagina-inscricoes">
      <div class="acoes-topo">
        <div class="titulo-secao">
          <span class="subtitulo">ACOMPANHAMENTO DO EVENTO</span>
          <h2>Inscrições realizadas</h2>
          <p>Confira os participantes da nossa corrida solidária.</p>
        </div>

        <a routerLink="/inscricoes/nova" class="btn btn-primary">
          <span aria-hidden="true">+</span>
          Nova inscrição
        </a>
      </div>

      @if (service.erroStorage()) {
        <div class="alerta-erro" role="alert">
          <strong>Não foi possível acessar os dados.</strong>
          <p>
            Verifique o armazenamento do navegador e tente novamente.
          </p>
        </div>
      }

      @if (service.inscricoes().length === 0) {
        <section class="mensagem-vazia">
          <div class="vazio-icone" aria-hidden="true">🏃</div>

          <span class="vazio-etiqueta">LINHA DE LARGADA</span>

          <h3>Sua corrida começa aqui!</h3>

          <p>
            Ainda não temos participantes inscritos.
            Seja o primeiro a fazer parte desta iniciativa solidária!
          </p>

          <a routerLink="/inscricoes/nova" class="btn btn-primary">
            Fazer primeira inscrição
          </a>
        </section>
      } @else {
        <div class="resultado-lista">
          <div class="resultado-cabecalho">
            <div>
              <h3>Participantes</h3>
              <p>Consulte os dados e gerencie cada inscrição.</p>
            </div>

            <span class="contador">
              {{ service.totalInscritos() }}
              {{ service.totalInscritos() === 1 ? 'inscrito' : 'inscritos' }}
            </span>
          </div>

          <div class="grid-cards">
            @for (item of service.inscricoes(); track item.email) {
              <article class="card-inscricao">
                <div class="card-topo">
                  <div class="avatar" aria-hidden="true">
                    {{ item.nomeCompleto.charAt(0).toUpperCase() }}
                  </div>

                  <span
                    class="distancia"
                    [class.distancia-5km]="item.distancia === 'KM_5'"
                    [class.distancia-10km]="item.distancia === 'KM_10'">
                    {{ item.distancia === 'KM_5' ? '5 KM' : '10 KM' }}
                  </span>
                </div>

                <h3 class="nome-participante">
                  {{ item.nomeCompleto }}
                </h3>

                <p class="email-participante">
                  {{ item.email }}
                </p>

                <div class="divisor"></div>

                <div class="dados-participante">
                  <div class="dado">
                    <span>Nascimento</span>
                    <strong>{{ formatarData(item.dataNascimento) }}</strong>
                  </div>

                  <div class="dado">
                    <span>Idade na prova</span>
                    <strong>{{ item.idadeNaProva }} anos</strong>
                  </div>

                  <div class="dado dado-categoria">
                    <span>Categoria</span>
                    <strong>{{ formatarCategoria(item.categoria) }}</strong>
                  </div>
                </div>

                <div class="card-acoes">
                  <button
                    type="button"
                    (click)="verDetalhes(item.email)"
                    class="btn btn-secundario">
                    Detalhes
                  </button>

                  <button
                    type="button"
                    (click)="editar(item.email)"
                    class="btn btn-alerta">
                    Editar
                  </button>

                  <button
                    type="button"
                    (click)="cancelar(item.email)"
                    class="btn btn-perigo">
                    Cancelar
                  </button>
                </div>
              </article>
            }
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .pagina-inscricoes {
      width: 100%;
      color: #183047;
    }

    .acoes-topo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
      margin-bottom: 30px;
    }

    .titulo-secao {
      min-width: 0;
    }

    .subtitulo,
    .vazio-etiqueta {
      display: inline-block;
      margin-bottom: 8px;
      color: #176b55;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
    }

    .titulo-secao h2 {
      margin: 0;
      color: #183047;
      font-size: clamp(24px, 3vw, 32px);
      font-weight: 850;
      letter-spacing: -0.8px;
    }

    .titulo-secao p,
    .resultado-cabecalho p {
      margin: 8px 0 0;
      color: #64748b;
      font-size: 14px;
    }

    .btn {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      min-height: 42px;
      padding: 11px 16px;
      border: 1px solid transparent;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      transition:
        background-color 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease;
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .btn-primary {
      color: #183047;
      background: #c7f36b;
      box-shadow: 0 5px 14px rgb(23 63 95 / 8%);
    }

    .btn-primary:hover {
      background: #b5e957;
      box-shadow: 0 7px 18px rgb(23 63 95 / 14%);
    }

    .btn-secundario {
      color: #ffffff;
      background: #173f5f;
    }

    .btn-secundario:hover {
      background: #24577b;
    }

    .btn-alerta {
      color: #704400;
      background: #fff0c2;
      border-color: #ffe29a;
    }

    .btn-alerta:hover {
      background: #ffe5a0;
    }

    .btn-perigo {
      color: #a52834;
      background: #fff0f0;
      border-color: #ffd9dc;
    }

    .btn-perigo:hover {
      background: #ffe0e2;
    }

    .alerta-erro {
      padding: 18px;
      margin-bottom: 24px;
      color: #842029;
      background: #fff0f0;
      border: 1px solid #ffd1d5;
      border-radius: 12px;
    }

    .alerta-erro p {
      margin: 5px 0 0;
    }

    .mensagem-vazia {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 24px;
      text-align: center;
      background: #ffffff;
      border: 1px solid #e5edf0;
      border-radius: 22px;
      box-shadow: 0 8px 28px rgb(16 42 67 / 5%);
    }

    .vazio-icone {
      display: grid;
      place-items: center;
      width: 76px;
      height: 76px;
      margin-bottom: 20px;
      background: #eff9dd;
      border-radius: 24px;
      font-size: 34px;
    }

    .vazio-etiqueta {
      margin-bottom: 10px;
    }

    .mensagem-vazia h3 {
      margin: 0;
      color: #183047;
      font-size: 24px;
      font-weight: 800;
    }

    .mensagem-vazia p {
      max-width: 460px;
      margin: 12px 0 24px;
      color: #64748b;
      line-height: 1.8;
    }

    .resultado-lista {
      width: 100%;
    }

    .resultado-cabecalho {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 18px;
    }

    .resultado-cabecalho h3 {
      margin: 0;
      font-size: 19px;
      font-weight: 800;
    }

    .contador {
      flex-shrink: 0;
      padding: 7px 12px;
      color: #176b55;
      background: #e7f7ed;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 800;
    }

    .grid-cards {
      display: grid;
      grid-template-columns: repeat(
        auto-fill,
        minmax(min(100%, 290px), 1fr)
      );
      gap: 20px;
    }

    .card-inscricao {
      min-width: 0;
      padding: 22px;
      overflow-wrap: anywhere;
      background: #ffffff;
      border: 1px solid #e5edf0;
      border-radius: 18px;
      box-shadow: 0 6px 20px rgb(16 42 67 / 4%);
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        border-color 0.2s ease;
    }

    .card-inscricao:hover {
      transform: translateY(-4px);
      border-color: #c7e8d4;
      box-shadow: 0 14px 28px rgb(16 42 67 / 9%);
    }

    .card-topo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 18px;
    }

    .avatar {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      color: #176b55;
      background: #e7f7ed;
      border: 1px solid #d1efdc;
      border-radius: 15px;
      font-size: 21px;
      font-weight: 800;
    }

    .distancia {
      padding: 7px 11px;
      border-radius: 30px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .distancia-5km {
      color: #28733b;
      background: #e5f8e8;
    }

    .distancia-10km {
      color: #a45b08;
      background: #fff1d6;
    }

    .nome-participante {
      margin: 0;
      color: #183047;
      font-size: 18px;
      font-weight: 800;
      line-height: 1.4;
    }

    .email-participante {
      margin: 5px 0 0;
      color: #64748b;
      font-size: 12px;
      overflow-wrap: anywhere;
    }

    .divisor {
      height: 1px;
      margin: 20px 0;
      background: #edf1f4;
    }

    .dados-participante {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px 12px;
    }

    .dado {
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 0;
    }

    .dado span {
      color: #7b8794;
      font-size: 11px;
      font-weight: 600;
    }

    .dado strong {
      color: #263f55;
      font-size: 13px;
      overflow-wrap: anywhere;
    }

    .dado-categoria {
      grid-column: 1 / -1;
    }

    .card-acoes {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px solid #edf1f4;
    }

    .card-acoes .btn {
      min-width: 0;
      padding: 10px 6px;
      font-size: 12px;
    }

    @media (max-width: 650px) {
      .acoes-topo {
        align-items: stretch;
        flex-direction: column;
        gap: 18px;
      }

      .acoes-topo > .btn {
        width: 100%;
      }

      .resultado-cabecalho {
        align-items: flex-start;
      }

      .grid-cards {
        grid-template-columns: 1fr;
        gap: 14px;
      }

      .card-inscricao {
        padding: 18px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .btn,
      .card-inscricao {
        transition: none;
      }

      .btn:hover,
      .card-inscricao:hover {
        transform: none;
      }
    }
  `]
})
export class ListaInscricoesComponent {
  readonly service = inject(InscricaoService);

  private readonly router = inject(Router);

  formatarData(dataIso: string): string {
    if (!dataIso) {
      return '';
    }

    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  formatarCategoria(categoria: string): string {
    const categorias: Record<string, string> = {
      JUVENIL: 'Juvenil',
      ADULTO: 'Adulto',
      MASTER: 'Master',
      SENIOR: 'Sênior'
    };

    return categorias[categoria] ?? categoria;
  }

  verDetalhes(email: string): void {
    this.router.navigate(['/inscricoes', email]);
  }

  editar(email: string): void {
    this.router.navigate(['/inscricoes', email, 'editar']);
  }

  cancelar(email: string): void {
    const confirmado = confirm(
      `Deseja realmente cancelar a inscrição de "${email}"?`
    );

    if (!confirmado) {
      return;
    }

    const resultado = this.service.cancelar(email);

    if (resultado.sucesso) {
      alert('Inscrição cancelada com sucesso!');
    } else {
      alert(resultado.erro ?? 'Não foi possível cancelar a inscrição.');
    }
  }
}