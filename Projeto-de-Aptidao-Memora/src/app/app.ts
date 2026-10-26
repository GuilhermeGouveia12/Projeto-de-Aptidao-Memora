import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InscricaoService } from './services/inscricao.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  public service = inject(InscricaoService);
}