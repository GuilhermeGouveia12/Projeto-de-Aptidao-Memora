import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'inscricoes', pathMatch: 'full' },
  { 
    path: 'inscricoes', 
    loadComponent: () => import('./pages/lista-inscricoes/lista-inscricoes.component').then(m => m.ListaInscricoes) 
  },
  { 
    path: 'inscricoes/nova', 
    loadComponent: () => import('./pages/form-inscricao/form-inscricao').then(m => m.FormInscricao) 
  },
  { 
    path: 'inscricoes/:email/editar', 
    loadComponent: () => import('./pages/form-inscricao/form-inscricao').then(m => m.FormInscricao) 
  },
  { 
    path: 'inscricoes/:email', 
    loadComponent: () => import('./pages/detalhes-inscricao/detalhes-inscricao').then(m => m.DetalhesInscricao) 
  },
  { 
    path: '**', 
    loadComponent: () => import('./pages/nao-encontrado/nao-encontrado.component').then(m => m.NaoEncontrado) 
  }
];