import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { BaseChartDirective } from 'ng2-charts';
import Swal from 'sweetalert2';

// Registros necesarios para Chart.js
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  DoughnutController,
} from 'chart.js';

// Registrar los elementos necesarios para Chart.js
Chart.register(ArcElement, Tooltip, Legend, Title, DoughnutController);

interface DeletedNote {
  title: string;
  createdAt: string;
  deletedAt: string;
  duration: string;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './stadistics.component.html',
  styleUrls: ['./stadistics.component.scss'],
  standalone: true,
  imports: [CommonModule, SidebarComponent, BaseChartDirective],
})
export class StadisticsComponent implements OnInit {
  deletedNotes: DeletedNote[] = [];
  completedTasks: DeletedNote[] = []; // Registro permanente de tareas completadas
  selectedTaskIndex: number | null = null; // Índice de la tarea seleccionada, o null si no hay selección

  chartData = {
    labels: ['Completadas', 'Restantes'],
    datasets: [
      {
        data: [0, 100],
        backgroundColor: ['#4CAF50', '#FFC107'],
        hoverBackgroundColor: ['#66BB6A', '#FFD54F'],
      },
    ],
  };

  chartOptions = {
    responsive: true,
    cutout: '80%',
    plugins: {
      tooltip: { enabled: true },
      legend: { display: true },
    },
  };

  ngOnInit(): void {
    this.loadDeletedNotes();

    this.updateChartData();
  }

  loadDeletedNotes(): void {
    const savedDeletedNotes = localStorage.getItem('deletedNotes');
    if (savedDeletedNotes) {
      const allDeletedNotes: DeletedNote[] = JSON.parse(savedDeletedNotes);

      // Filtrar solo las notas completadas
      this.deletedNotes = allDeletedNotes.filter(
        (note) => note.title && note.createdAt && note.deletedAt // Asegurarnos de que los campos esenciales existan
      );
    }
  }

  loadCompletedTasks(): void {
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    if (savedCompletedTasks) {
      this.completedTasks = JSON.parse(savedCompletedTasks);
    }
  }

  getTotalCompletedTasks(): number {
    return this.deletedNotes.length;
  }

  // Calcular la eficiencia con base en las notas eliminadas
  calculateEfficiency(): number {
    if (this.deletedNotes.length === 0) {
      return 0; // Si no hay tareas completadas, la eficiencia es 0
    }
    const totalHours = this.calculateTotalHours();
    return totalHours / this.deletedNotes.length;
  }

  getFormattedEfficiency(): string {
    const efficiency = this.calculateEfficiency();
    const hours = Math.floor(efficiency);
    const minutes = Math.round((efficiency - hours) * 60);
    return `${hours} hrs ${minutes} min por tarea`;
  }

  // Calcular el total de horas basado en la duración de las notas
  calculateTotalHours(): number {
    return this.deletedNotes.reduce((total, note) => {
      const durationParts = note.duration.match(/(\d+)\s*hrs\s*(\d+)?\s*min?/);
      if (durationParts) {
        const hours = parseInt(durationParts[1], 10) || 0; // Primer grupo: horas
        const minutes = parseInt(durationParts[2], 10) || 0; // Segundo grupo: minutos
        return total + hours + minutes / 60;
      }
      return total; // Si no coincide el formato, ignorar
    }, 0);
  }

  getFormattedTotalHours(): string {
    const totalHours = this.calculateTotalHours();
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours} hrs ${minutes} min`;
  }

  updateChartData(): void {
    const remaining = 100 - this.deletedNotes.length;

    this.chartData = {
      labels: ['Completadas', 'Restantes'], // Las etiquetas
      datasets: [
        {
          data: [this.deletedNotes.length, remaining], // Datos: % completado y restante
          backgroundColor: ['#4caf50', '#e0e0e0'], // Colores
          hoverBackgroundColor: ['#45a047', '#c7c7c7'], // Colores al pasar el mouse
        },
      ],
    };
  }

  onTaskClick(index: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta tarea será eliminada de la lista.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar la tarea seleccionada
        this.deletedNotes.splice(index, 1);
        localStorage.setItem('deletedNotes', JSON.stringify(this.deletedNotes));
        Swal.fire('Eliminada', 'La tarea ha sido eliminada.', 'success');
      }
    });
  }
}
