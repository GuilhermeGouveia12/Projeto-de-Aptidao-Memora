
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  InscricaoService
} from '../../services/inscricao.service';

@Component({
  selector: 'app-lista-inscricoes',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="acoes-topo">
      <h2>Inscrições Realizadas</h2>

      <a routerLink="/inscricoes/nova" class="btn btn-primary">
        + Nova Inscrição
      </a>
    </div>

    @if (service.erroStorage()) {
      <div class="alerta-erro" role="alert">
        Não foi possível acessar ou salvar os dados corretamente
        no armazenamento do navegador. Verifique os dados e tente novamente.
      </div>
    }

    <section class="resumo" aria-label="Resumo das inscrições">
      <div class="resumo-item">
        <span>Total de inscritos</span>
        <strong>{{ service.totalInscritos() }}</strong>
      </div>

      <div class="resumo-item">
        <span>Percurso de 5 km</span>
        <strong>{{ service.total5k() }}</strong>
      </div>

      <div class="resumo-item">
        <span>Percurso de 10 km</span>
        <strong>{{ service.total10k() }}</strong>
      </div>
    </section>

    @if (service.inscricoes().length === 0) {
      <div class="mensagem-vazia">
        <h3>Nenhuma inscrição cadastrada</h3>
        <p>
          As inscrições aparecerão aqui assim que um participante
          for cadastrado.
        </p>

        <a routerLink="/inscricoes/nova" class="btn btn-primary">
          Fazer primeira inscrição
        </a>
      </div>
    } @else {
      <div class="grid-cards">
        @for (item of service.inscricoes(); track item.email) {
          <article class="card-inscricao">
            <h3>{{ item.nomeCompleto }}</h3>

            <p>
              <strong>E-mail:</strong>
              {{ item.email }}
            </p>

            <p>
              <strong>Nascimento:</strong>
              {{ formatarData(item.dataNascimento) }}
            </p>

            <p>
              <strong>Idade na prova:</strong>
              {{ item.idadeNaProva }} anos
            </p>

            <p>
              <strong>Categoria:</strong>
              {{ formatarCategoria(item.categoria) }}
            </p>

            <p>
              <strong>Percurso:</strong>
              {{ item.distancia === 'KM_5' ? '5 km' : '10 km' }}
            </p>

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
    }
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .acoes-topo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }

    .resumo {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .resumo-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #fff;
    }

    .resumo-item strong {
      font-size: 1.7rem;
    }

    .grid-cards {
      display: grid;
      grid-template-columns: repeat(
        auto-fill,
        minmax(min(100%, 280px), 1fr)
      );
      gap: 1rem;
    }

    .card-inscricao {
      min-width: 0;
      overflow-wrap: anywhere;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 1rem;
      background: #fff;
    }

    .card-acoes {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .mensagem-vazia {
      padding: 2rem 1rem;
      text-align: center;
      border: 1px dashed #bbb;
      border-radius: 8px;
    }

    .alerta-erro {
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 6px;
      background: #f8d7da;
      color: #721c24;
    }

    .btn {
      padding: 0.6rem 1rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      display: inline-block;
    }

    .btn-primary {
      background: #0066cc;
      color: #fff;
    }

    .btn-secundario {
      background: #6c757d;
      color: #fff;
    }

    .btn-alerta {
      background: #ffc107;
      color: #000;
    }

    .btn-perigo {
      background: #dc3545;
      color: #fff;
    }

    @media (max-width: 600px) {
      .resumo {
        grid-template-columns: 1fr;
      }

      .acoes-topo {
        align-items: stretch;
      }

      .card-acoes .btn {
        flex: 1;
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
