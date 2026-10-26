import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InscricaoService, Inscricao } from '../../services/inscricao.service';

@Component({
  selector: 'app-detalhes-inscricao',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="detalhes-container">
      @if (inscricao) {
        <h2>Detalhes da Inscrição</h2>
        <div class="info-grupo">
          <p><strong>Nome Completo:</strong> {{ inscricao.nomeCompleto }}</p>
          <p><strong>E-mail:</strong> {{ inscricao.email }}</p>
          <p><strong>Data de Nascimento:</strong> {{ formatarData(inscricao.dataNascimento) }}</p>
          <p><strong>Idade na Prova:</strong> {{ inscricao.idadeNaProva }} anos</p>
          <p><strong>Categoria:</strong> {{ inscricao.categoria }}</p>
          <p><strong>Percurso Escolhido:</strong> {{ inscricao.distancia === 'KM_5' ? '5 km' : '10 km' }}</p>
        </div>

        <div class="acoes">
          <button (click)="editar()" class="btn btn-alerta">Editar Inscrição</button>
          <a routerLink="/inscricoes" class="btn btn-secundario">Voltar à Lista</a>
        </div>
      } @else {
        <div class="alerta-nao-encontrado">
          <h2>Inscrição Não Encontrada</h2>
          <p>Não foi encontrada nenhuma inscrição com o e-mail informado.</p>
          <a routerLink="/inscricoes" class="btn btn-primary">Voltar à Lista</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .detalhes-container { max-width: 600px; margin: 0 auto; padding: 1.5rem; border: 1px solid #ccc; border-radius: 8px; background: #fff; }
    .info-grupo p { margin-bottom: 0.8rem; font-size: 1.1rem; }
    .acoes { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .alerta-nao-encontrado { text-align: center; }
    .btn { padding: 0.6rem 1.2rem; border-radius: 4px; border: none; cursor: pointer; text-decoration: none; display: inline-block; }
    .btn-primary { background: #0066cc; color: #fff; }
    .btn-secundario { background: #6c757d; color: #fff; }
    .btn-alerta { background: #ffc107; color: #000; }
  `]
})
export class DetalhesInscricaoComponent implements OnInit {
  private service = inject(InscricaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  inscricao?: Inscricao;

  ngOnInit(): void {
    const paramEmail = this.route.snapshot.paramMap.get('email');
    if (paramEmail) {
      const emailDecodificado = decodeURIComponent(paramEmail);
      this.inscricao = this.service.buscarPorEmail(emailDecodificado);
    }
  }

  formatarData(dataIso: string): string {
    if (!dataIso) return '';
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  editar(): void {
    if (this.inscricao) {
      this.router.navigate(['/inscricoes', encodeURIComponent(this.inscricao.email), 'editar']);
    }
  }
}