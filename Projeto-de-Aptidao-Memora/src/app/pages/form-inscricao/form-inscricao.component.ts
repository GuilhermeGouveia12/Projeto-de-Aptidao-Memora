import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InscricaoService } from '../../services/inscricao.service';
import { Distancia } from '../../dominio/inscricao.regras';

@Component({
  selector: 'app-form-inscricao',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="form-container">
      <h2>{{ modoEdicao ? 'Editar Inscrição' : 'Nova Inscrição' }}</h2>

      @if (mensagemErroGeral) {
        <div class="alerta-erro">{{ mensagemErroGeral }}</div>
      }

      <form (ngSubmit)="salvar()">
        <div class="campo">
          <label for="nomeCompleto">Nome Completo *</label>
          <input 
            type="text" 
            id="nomeCompleto" 
            [(ngModel)]="nomeCompleto" 
            name="nomeCompleto" 
            required
            minlength="3"
            maxlength="100"
            placeholder="Digite seu nome completo"
          />
        </div>

        <div class="campo">
          <label for="email">E-mail *</label>
          <input 
            type="email" 
            id="email" 
            [(ngModel)]="email" 
            name="email" 
            required 
            [disabled]="modoEdicao"
            placeholder="seu.email@exemplo.com"
          />
          @if (modoEdicao) {
            <small class="aviso-imutavel">O e-mail é a identificação e não pode ser alterado na edição.</small>
          }
        </div>

        <div class="campo">
          <label for="dataNascimento">Data de Nascimento *</label>
          <input 
            type="date" 
            id="dataNascimento" 
            [(ngModel)]="dataNascimento" 
            name="dataNascimento" 
            required
          />
        </div>

        <div class="campo">
          <label for="distancia">Percurso *</label>
          <select id="distancia" [(ngModel)]="distancia" name="distancia" required>
            <option value="KM_5">5 km</option>
            <option value="KM_10">10 km</option>
          </select>
        </div>

        <div class="form-acoes">
          <button type="submit" class="btn btn-primary">Salvar</button>
          <a routerLink="/inscricoes" class="btn btn-secundario">Cancelar</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container { max-width: 500px; margin: 0 auto; padding: 1.5rem; border: 1px solid #ccc; border-radius: 8px; background: #fff; }
    .campo { margin-bottom: 1.2rem; display: flex; flex-direction: column; }
    .campo label { font-weight: bold; margin-bottom: 0.3rem; }
    .campo input, .campo select { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
    .campo input:disabled { background-color: #e9ecef; cursor: not-allowed; }
    .aviso-imutavel { font-size: 0.8rem; color: #6c757d; margin-top: 0.2rem; }
    .alerta-erro { background: #f8d7da; color: #721c24; padding: 0.8rem; border-radius: 4px; margin-bottom: 1rem; }
    .form-acoes { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .btn { padding: 0.6rem 1.2rem; border-radius: 4px; border: none; cursor: pointer; text-decoration: none; text-align: center; }
    .btn-primary { background: #0066cc; color: #fff; }
    .btn-secundario { background: #6c757d; color: #fff; }
  `]
})
export class FormInscricaoComponent implements OnInit {
  private service = inject(InscricaoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  modoEdicao = false;
  emailOriginal = '';

  nomeCompleto = '';
  email = '';
  dataNascimento = '';
  distancia: Distancia = 'KM_5';

  mensagemErroGeral = '';

  ngOnInit(): void {
    const paramEmail = this.route.snapshot.paramMap.get('email');
    if (paramEmail) {
      this.modoEdicao = true;
      this.emailOriginal = paramEmail;
      
      const inscricao = this.service.buscarPorEmail(this.emailOriginal);
      if (inscricao) {
        this.nomeCompleto = inscricao.nomeCompleto;
        this.email = inscricao.email;
        this.dataNascimento = inscricao.dataNascimento;
        this.distancia = inscricao.distancia;
      } else {
        this.mensagemErroGeral = 'Inscrição não encontrada para edição.';
      }
    }
  }

  salvar(): void {
    this.mensagemErroGeral = '';

    // Validação básica de obrigatoriedade e tamanho de nome
    const nomeLimpo = this.nomeCompleto.trim().replace(/\s+/g, ' ');
    if (nomeLimpo.length < 3 || nomeLimpo.length > 100) {
      this.mensagemErroGeral = 'O nome completo deve conter entre 3 e 100 caracteres.';
      return;
    }

    if (!this.dataNascimento) {
      this.mensagemErroGeral = 'A data de nascimento é obrigatória.';
      return;
    }

    if (this.modoEdicao) {
      const res = this.service.editar(this.emailOriginal, {
        nomeCompleto: this.nomeCompleto,
        dataNascimento: this.dataNascimento,
        distancia: this.distancia
      });

      if (res.sucesso) {
        this.router.navigate(['/inscricoes']);
      } else {
        this.mensagemErroGeral = res.erro || 'Erro ao atualizar inscrição.';
      }
    } else {
      if (!this.email) {
        this.mensagemErroGeral = 'O e-mail é obrigatório.';
        return;
      }

      const res = this.service.cadastrar({
        nomeCompleto: this.nomeCompleto,
        email: this.email,
        dataNascimento: this.dataNascimento,
        distancia: this.distancia
      });

      if (res.sucesso) {
        this.router.navigate(['/inscricoes']);
      } else {
        this.mensagemErroGeral = res.erro || 'Erro ao realizar cadastro.';
      }
    }
  }
}