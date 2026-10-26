import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InscricaoService, Inscricao } from '../../services/inscricao.service';

@Component({
  selector: 'app-lista-inscricoes',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="acoes-topo">
      <h2>Inscrições Realizadas</h2>
      <a routerLink="/inscricoes/nova" class="btn btn-primary">+ Nova Inscrição</a>
    </div>

    @if (service.inscricoes().length === 0) {
      <p class="mensagem-vazia">Nenhuma inscrição cadastrada até o momento.</p>
    } @else {
      <div class="grid-cards">
        @for (item of service.inscricoes(); track item.email) {
          <div class="card-inscricao">
            <h3>{{ item.nomeCompleto }}</h3>
            <p><strong>E-mail:</strong> {{ item.email }}</p>
            <p><strong>Nascimento:</strong> {{ formatarData(item.dataNascimento) }}</p>
            <p><strong>Idade na Prova:</strong> {{ item.idadeNaProva }} anos</p>
            <p><strong>Categoria:</strong> {{ item.categoria }}</p>
            <p><strong>Percurso:</strong> {{ item.distancia === 'KM_5' ? '5 km' : '10 km' }}</p>

            <div class="card-acoes">
              <button (click)="verDetalhes(item.email)" class="btn btn-secundario">Detalhes</button>
              <button (click)="editar(item.email)" class="btn btn-alerta">Editar</button>
              <button (click)="cancelar(item.email)" class="btn btn-perigo">Cancelar</button>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .acoes-topo { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .card-inscricao { border: 1px solid #ccc; border-radius: 8px; padding: 1rem; background: #fff; }
    .card-acoes { display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap; }
    .btn { padding: 0.5rem 1rem; border-radius: 4px; border: none; cursor: pointer; text-decoration: none; display: inline-block; }
    .btn-primary { background: #0066cc; color: #fff; }
    .btn-secundario { background: #6c757d; color: #fff; }
    .btn-alerta { background: #ffc107; color: #000; }
    .btn-perigo { background: #dc3545; color: #fff; }
  `]
})
export class ListaInscricoesComponent {
  public service = inject(InscricaoService);
  private router = inject(Router);

  // Formata a data aaaa-mm-dd para dd/mm/aaaa sem problema de fuso horário
  formatarData(dataIso: string): string {
    if (!dataIso) return '';
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  verDetalhes(email: string): void {
    this.router.navigate(['/inscricoes', encodeURIComponent(email)]);
  }

  editar(email: string): void {
    this.router.navigate(['/inscricoes', encodeURIComponent(email), 'editar']);
  }

  cancelar(email: string): void {
    if (confirm(`Deseja realmente cancelar a inscrição do e-mail "${email}"?`)) {
      this.service.cancelar(email);
    }
  }
}