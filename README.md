# Projeto de Aptidão — 5ª Corrida Solidária

Sistema web para gerenciamento de inscrições da 5ª Corrida Solidária da Vila Esperança, desenvolvido com Angular.

## Funcionalidades

- Cadastro de participantes.
- Listagem e consulta de inscrições.
- Edição e cancelamento de inscrições.
- Validação de idade, categoria e distância.
- Impedimento de inscrições com e-mail duplicado.
- Armazenamento local dos dados no navegador.

## Tecnologias

- Angular
- TypeScript
- HTML e CSS
- LocalStorage

## Pré-requisitos

Antes de começar, instale:

- Node.js compatível com Angular 22.
- npm.
- Git, caso queira clonar o repositório.

## Como executar o projeto

### 1. Baixe o projeto

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta criada:

```bash
cd Projeto-de-Aptidao-Memora
```

**Importante:** execute os próximos comandos na pasta que contém o arquivo `package.json`, junto do `angular.json` e da pasta `src`.

Se houver duas pastas com o mesmo nome, entre na pasta interna que contém esses arquivos.

### 2. Instale as dependências

```bash
npm install
```

Esse comando instala as dependências necessárias para executar o projeto.

### 3. Inicie a aplicação

```bash
npm start
```

Abra o navegador no endereço:

http://localhost:4200

## Testes e compilação

Para executar os testes:

```bash
npm test
```

Para compilar o projeto:

```bash
npm run build
```

## Estrutura do projeto

```text
src/
└── app/
    ├── dominio/
    ├── pages/
    │   ├── detalhes-inscricao/
    │   ├── form-inscricao/
    │   ├── lista-inscricoes/
    │   └── nao-encontrado/
    ├── services/
    ├── app.config.ts
    ├── app.routes.ts
    ├── app.html
    └── app.ts
```

## Observações

- Os dados das inscrições são armazenados no LocalStorage do navegador.
- Os dados ficam no navegador utilizado e não são sincronizados automaticamente entre computadores.
- Para executar o projeto em outro computador, é necessário instalar as dependências com `npm install`.

## Evento

**5ª Corrida Solidária da Vila Esperança**

- Data: 14 de março de 2027.
- Percursos: 5 km e 10 km.

