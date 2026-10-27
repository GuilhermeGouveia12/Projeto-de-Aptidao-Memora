import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nao-encontrado',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="box-404">
      <h2>Página Não Encontrada</h2>
      <p>O caminho informado não existe no sistema.</p>
      <a routerLink="/inscricoes" class="btn btn-primary">Voltar para a Lista de Inscrições</a>
    </div>
  `,
  styles: [`
    .box-404 { text-align: center; padding: 3rem 1rem; }
    .box-404 h2 { font-size: 2rem; margin-bottom: 1rem; color: #dc3545; }
    .btn { padding: 0.6rem 1.2rem; border-radius: 4px; border: none; cursor: pointer; text-decoration: none; display: inline-block; }
    .btn-primary { background: #0066cc; color: #fff; }
  `]
})
export class NaoEncontradoComponent {}