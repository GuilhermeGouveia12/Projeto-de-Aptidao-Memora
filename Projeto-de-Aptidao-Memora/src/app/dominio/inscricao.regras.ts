
export type Distancia = 'KM_5' | 'KM_10';

export type Categoria =
  | 'JUVENIL'
  | 'ADULTO'
  | 'MASTER'
  | 'SENIOR';

export type ErroRegulamento =
  | 'IDADE_MINIMA'
  | 'DISTANCIA_NAO_PERMITIDA';

export interface AvaliacaoInscricao {
  aceita: boolean;
  idadeNaProva: number;
  categoria: Categoria | null;
  erro: ErroRegulamento | null;
}

export const DATA_DA_PROVA = '2027-03-14';


/**
 * Converte o e-mail para minúsculas e remove espaços das pontas.
 * Garante que "Ana.Souza@Email.COM" e "ana.souza@email.com" sejam iguais.
 */
export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Calcula a idade exata no dia da prova (14/03/2027).
 * Se a pessoa fizer aniversário no dia da prova, já conta a nova idade.
 */
export function calcularIdade(nascimento: string, referencia: string = DATA_DA_PROVA): number {
  const [anoNasc, mesNasc, diaNasc] = nascimento.split('-').map(Number);
  const [anoRef, mesRef, diaRef] = referencia.split('-').map(Number);

  let idade = anoRef - anoNasc;
  // Se ainda não fez aniversário no ano da prova, subtrai 1 ano
  if (mesRef < mesNasc || (mesRef === mesNasc && diaRef < diaNasc)) {
    idade--;
  }
  return idade;
}

/**
 * Valida as regras do regulamento (Art. 6º):
 * 1. Idade mínima de 14 anos.
 * 2. Percurso de 10 km exige no mínimo 18 anos.
 * 3. Categorias: Juvenil (14-17), Adulto (18-39), Master (40-59), Sênior (60+).
 */
export function avaliarInscricao(
  nascimento: string,
  distancia: Distancia,
  dataProva: string = DATA_DA_PROVA
): AvaliacaoInscricao {
  const idade = calcularIdade(nascimento, dataProva);

  // Regra de precedência: Primeiro checa idade mínima global
  if (idade < 14) {
   return {
  aceita: false,
  idadeNaProva: idade,
  categoria: null,
  erro: 'IDADE_MINIMA'
};
  }

  // Depois checa a restrição de 10 km
  if (distancia === 'KM_10' && idade < 18) {
    return {
  aceita: false,
  idadeNaProva: idade,
  categoria: null,
  erro: 'DISTANCIA_NAO_PERMITIDA'
};
  }

  // Determina a categoria
  let categoria: Categoria;
  if (idade <= 17) {
    categoria = 'JUVENIL';
  } else if (idade <= 39) {
    categoria = 'ADULTO';
  } else if (idade <= 59) {
    categoria = 'MASTER';
  } else {
    categoria = 'SENIOR';
  }

  return {
    aceita: true,
    idadeNaProva: idade,
    categoria,
    erro: null
  };
}
