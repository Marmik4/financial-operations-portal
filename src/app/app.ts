import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Import your dashboard component (matching your exact file path)
import { DashboardComponent } from './components/dashboard/dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  // Add DashboardComponent to the imports array so Angular knows it exists
  imports: [RouterOutlet, DashboardComponent], 
  templateUrl: './app.html', 
  styleUrl: './app.css'      
})
export class AppComponent {
  title = 'financial-operations-portal';
}