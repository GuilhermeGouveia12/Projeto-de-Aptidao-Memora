import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'inscricoes', pathMatch: 'full' },
  { 
    path: 'inscricoes', 
    loadComponent: () => import('./pages/lista-inscricoes/lista-inscricoes.component').then(m => m.ListaInscricoesComponent) 
  },
  { 
    path: 'inscricoes/nova', 
    loadComponent: () => import('./pages/form-inscricao/form-inscricao.component').then(m => m.FormInscricaoComponent) 
  },
  { 
    path: 'inscricoes/:email/editar', 
    loadComponent: () => import('./pages/form-inscricao/form-inscricao.component').then(m => m.FormInscricaoComponent) 
  },
  { 
    path: 'inscricoes/:email', 
    loadComponent: () => import('./pages/detalhes-inscricao/detalhes-inscricao.component').then(m => m.DetalhesInscricaoComponent) 
  },
  { 
    path: '**', 
    loadComponent: () => import('./pages/nao-encontrado/nao-encontrado.component').then(m => m.NaoEncontradoComponent) 
  }
];