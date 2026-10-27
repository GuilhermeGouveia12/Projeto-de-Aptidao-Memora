
import { Injectable, signal, computed } from '@angular/core';

import {
  Distancia,
  Categoria,
  avaliarInscricao,
  normalizarEmail
} from '../dominio/inscricao.regras';

export interface Inscricao {
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
  distancia: Distancia;
  idadeNaProva: number;
  categoria: Categoria;
}

export interface ResultadoOperacao {
  sucesso: boolean;
  erro?: string;
}

const STORAGE_KEY = 'corrida.inscricoes.v1';

@Injectable({
  providedIn: 'root'
})
export class InscricaoService {
  // Inicialize o sinal de erro antes de carregar o armazenamento.
  readonly erroStorage = signal(false);

  private readonly inscricoesSignal =
    signal<Inscricao[]>(this.carregarDoStorage());

  readonly inscricoes = this.inscricoesSignal.asReadonly();

  readonly totalInscritos = computed(
    () => this.inscricoesSignal().length
  );

  readonly total5k = computed(
    () => this.inscricoesSignal()
      .filter(i => i.distancia === 'KM_5').length
  );

  readonly total10k = computed(
    () => this.inscricoesSignal()
      .filter(i => i.distancia === 'KM_10').length
  );

  private carregarDoStorage(): Inscricao[] {
    try {
      const dados = localStorage.getItem(STORAGE_KEY);

      if (dados === null) {
        return [];
      }

      const parsed: unknown = JSON.parse(dados);

      if (!Array.isArray(parsed)) {
        this.erroStorage.set(true);
        return [];
      }

      return parsed as Inscricao[];
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
    const emailNormalizado = normalizarEmail(email);

    return this.inscricoesSignal().find(
      i => normalizarEmail(i.email) === emailNormalizado
    );
  }

  cadastrar(dados: {
    nomeCompleto: string;
    email: string;
    dataNascimento: string;
    distancia: Distancia;
  }): ResultadoOperacao {
    const nome = this.normalizarNome(dados.nomeCompleto);
    const email = normalizarEmail(dados.email);

    const erroCampos = this.validarCampos(
      nome,
      email,
      dados.dataNascimento
    );

    if (erroCampos) {
      return { sucesso: false, erro: erroCampos };
    }

    if (this.buscarPorEmail(email)) {
      return {
        sucesso: false,
        erro: 'Este e-mail já possui uma inscrição ativa.'
      };
    }

    const avaliacao = avaliarInscricao(
      dados.dataNascimento,
      dados.distancia
    );

    if (!avaliacao.aceita || avaliacao.categoria === null) {
      return {
        sucesso: false,
        erro: this.obterMensagemErro(avaliacao.erro)
      };
    }

    const novaInscricao: Inscricao = {
      nomeCompleto: nome,
      email,
      dataNascimento: dados.dataNascimento,
      distancia: dados.distancia,
      idadeNaProva: avaliacao.idadeNaProva,
      categoria: avaliacao.categoria
    };

    const novaLista = [
      ...this.inscricoesSignal(),
      novaInscricao
    ];

    if (!this.salvar(novaLista)) {
      return {
        sucesso: false,
        erro: 'Não foi possível salvar a inscrição. Verifique o armazenamento do navegador.'
      };
    }

    return { sucesso: true };
  }

  editar(
    email: string,
    dados: {
      nomeCompleto: string;
      dataNascimento: string;
      distancia: Distancia;
    }
  ): ResultadoOperacao {
    const emailNormalizado = normalizarEmail(email);

    const listaAtual = this.inscricoesSignal();

    const index = listaAtual.findIndex(
      i => normalizarEmail(i.email) === emailNormalizado
    );

    if (index === -1) {
      return {
        sucesso: false,
        erro: 'Inscrição não encontrada.'
      };
    }

    const nome = this.normalizarNome(dados.nomeCompleto);

    const erroCampos = this.validarCampos(
      nome,
      emailNormalizado,
      dados.dataNascimento
    );

    if (erroCampos) {
      return { sucesso: false, erro: erroCampos };
    }

    const avaliacao = avaliarInscricao(
      dados.dataNascimento,
      dados.distancia
    );

    if (!avaliacao.aceita || avaliacao.categoria === null) {
      return {
        sucesso: false,
        erro: this.obterMensagemErro(avaliacao.erro)
      };
    }

    const listaAtualizada = [...listaAtual];

    listaAtualizada[index] = {
      ...listaAtual[index],
      nomeCompleto: nome,
      dataNascimento: dados.dataNascimento,
      distancia: dados.distancia,
      idadeNaProva: avaliacao.idadeNaProva,
      categoria: avaliacao.categoria
    };

    if (!this.salvar(listaAtualizada)) {
      return {
        sucesso: false,
        erro: 'Não foi possível salvar as alterações.'
      };
    }

    return { sucesso: true };
  }

  cancelar(email: string): ResultadoOperacao {
    const emailNormalizado = normalizarEmail(email);
    const listaAtual = this.inscricoesSignal();

    const existe = listaAtual.some(
      i => normalizarEmail(i.email) === emailNormalizado
    );

    if (!existe) {
      return {
        sucesso: false,
        erro: 'Inscrição não encontrada.'
      };
    }

    const novaLista = listaAtual.filter(
      i => normalizarEmail(i.email) !== emailNormalizado
    );

    if (!this.salvar(novaLista)) {
      return {
        sucesso: false,
        erro: 'Não foi possível cancelar a inscrição.'
      };
    }

    return { sucesso: true };
  }

  private normalizarNome(nome: string): string {
    return nome.trim().replace(/\s+/g, ' ');
  }

  private validarCampos(
    nome: string,
    email: string,
    nascimento: string
  ): string | null {
    if (nome.length < 3 || nome.length > 100) {
      return 'O nome completo deve ter entre 3 e 100 caracteres.';
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email)) {
      return 'Informe um endereço de e-mail válido.';
    }

    if (!this.dataNascimentoValida(nascimento)) {
      return 'Informe uma data de nascimento válida, anterior a hoje.';
    }

    return null;
  }

  private dataNascimentoValida(data: string): boolean {
    const formato = /^\d{4}-\d{2}-\d{2}$/;

    if (!formato.test(data)) {
      return false;
    }

    const [ano, mes, dia] = data.split('-').map(Number);

    const dataConvertida = new Date(Date.UTC(ano, mes - 1, dia));

    if (
      dataConvertida.getUTCFullYear() !== ano ||
      dataConvertida.getUTCMonth() !== mes - 1 ||
      dataConvertida.getUTCDate() !== dia
    ) {
      return false;
    }

    const hoje = new Date();

    const hojeFormatado = [
      hoje.getFullYear(),
      String(hoje.getMonth() + 1).padStart(2, '0'),
      String(hoje.getDate()).padStart(2, '0')
    ].join('-');

    return data < hojeFormatado;
  }

  private obterMensagemErro(erro: string | null): string {
    if (erro === 'IDADE_MINIMA') {
      return 'Inscrição recusada: a idade mínima para participar é 14 anos.';
    }

    if (erro === 'DISTANCIA_NAO_PERMITIDA') {
      return 'Inscrição recusada: o percurso de 10 km exige idade mínima de 18 anos.';
    }

    return 'Inscrição inválida segundo o regulamento.';
  }
}
