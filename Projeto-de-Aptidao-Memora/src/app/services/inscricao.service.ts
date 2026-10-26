import { Injectable, signal, computed } from '@angular/core';
import { 
  Distancia, 
  avaliarInscricao, 
  normalizarEmail 
} from '../dominio/inscricao.regras';

export interface Inscricao {
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
  distancia: Distancia;
  idadeNaProva: number;
  categoria: string;
}

const STORAGE_KEY = 'corrida.inscricoes.v1';

@Injectable({
  providedIn: 'root'
})
export class InscricaoService {
  private inscricoesSignal = signal<Inscricao[]>(this.carregarDoStorage());
  public erroStorage = signal<boolean>(false);

  readonly inscricoes = this.inscricoesSignal.asReadonly();

  // Contadores automáticos / reativos
  readonly totalInscritos = computed(() => this.inscricoesSignal().length);
  readonly total5k = computed(() => this.inscricoesSignal().filter(i => i.distancia === 'KM_5').length);
  readonly total10k = computed(() => this.inscricoesSignal().filter(i => i.distancia === 'KM_10').length);

  private carregarDoStorage(): Inscricao[] {
    try {
      const dados = localStorage.getItem(STORAGE_KEY);
      if (!dados) return [];
      const parsed = JSON.parse(dados);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      this.erroStorage.set(true);
      return [];
    }
  }

  private salvar(lista: Inscricao[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
      this.inscricoesSignal.set(lista);
      this.erroStorage.set(false);
      return true;
    } catch {
      this.erroStorage.set(true);
      return false;
    }
  }

  buscarPorEmail(email: string): Inscricao | undefined {
    const normal = normalizarEmail(email);
    return this.inscricoesSignal().find(i => normalizarEmail(i.email) === normal);
  }

  cadastrar(dados: { nomeCompleto: string; email: string; dataNascimento: string; distancia: Distancia }): { sucesso: boolean; erro?: string } {
    const emailNorm = normalizarEmail(dados.email);
    if (this.buscarPorEmail(emailNorm)) {
      return { sucesso: false, erro: 'Este e-mail já possui uma inscrição ativa.' };
    }

    const avaliacao = avaliarInscricao(dados.dataNascimento, dados.distancia);
    if (!avaliacao.aceita) {
      return { sucesso: false, erro: this.obterMensagemErro(avaliacao.erro) };
    }

    // Trata múltiplos espaços internos e nas pontas
    const nomeTratado = dados.nomeCompleto.trim().replace(/\s+/g, ' ');

    const novaInscricao: Inscricao = {
      nomeCompleto: nomeTratado,
      email: emailNorm,
      dataNascimento: dados.dataNascimento,
      distancia: dados.distancia,
      idadeNaProva: avaliacao.idadeNaProva!,
      categoria: avaliacao.categoria!
    };

    const novaLista = [...this.inscricoesSignal(), novaInscricao];
    this.salvar(novaLista);
    return { sucesso: true };
  }

  editar(email: string, dados: { nomeCompleto: string; dataNascimento: string; distancia: Distancia }): { sucesso: boolean; erro?: string } {
    const emailNorm = normalizarEmail(email);
    const index = this.inscricoesSignal().findIndex(i => normalizarEmail(i.email) === emailNorm);
    
    if (index === -1) {
      return { sucesso: false, erro: 'Inscrição não encontrada.' };
    }

    const avaliacao = avaliarInscricao(dados.dataNascimento, dados.distancia);
    if (!avaliacao.aceita) {
      return { sucesso: false, erro: this.obterMensagemErro(avaliacao.erro) };
    }

    const nomeTratado = dados.nomeCompleto.trim().replace(/\s+/g, ' ');

    const listaAtualizada = [...this.inscricoesSignal()];
    listaAtualizada[index] = {
      ...listaAtualizada[index],
      nomeCompleto: nomeTratado,
      dataNascimento: dados.dataNascimento,
      distancia: dados.distancia,
      idadeNaProva: avaliacao.idadeNaProva!,
      categoria: avaliacao.categoria!
    };

    this.salvar(listaAtualizada);
    return { sucesso: true };
  }

  cancelar(email: string): void {
    const emailNorm = normalizarEmail(email);
    const novaLista = this.inscricoesSignal().filter(i => normalizarEmail(i.email) !== emailNorm);
    this.salvar(novaLista);
  }

  private obterMensagemErro(erro: string | null): string {
    if (erro === 'IDADE_MINIMA') return 'Inscrição recusada: A idade mínima para participar é 14 anos.';
    if (erro === 'DISTANCIA_NAO_PERMITIDA') return 'Inscrição recusada: O percurso de 10 km é exclusivo para participantes com 18 anos ou mais.';
    return 'Inscrição inválida segundo o regulamento.';
  }
}