import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import Swal from 'sweetalert2';

interface StickyNote {
  title: string;
  description: string;
  color: string;
  status: 'pendiente' | 'en-progreso' | 'completada';
  createdAt: string; // Fecha de creación
}

interface DeletedNote {
  title: string;
  createdAt: string;
  deletedAt: string;
  duration: string;
}

@Component({
  standalone: true,
  selector: 'app-sticky-note',
  templateUrl: './sticky-interface.component.html',
  styleUrls: ['./sticky-interface.component.scss'],
  imports: [CommonModule, FormsModule, SidebarComponent]
})
export class StickyInterfaceComponent implements OnInit {
  colors: string[] = ['yellow', 'blue', 'green', 'purple', 'pink'];
  colorIndex: number = 0;
  notes: StickyNote[] = [];
  deletedNotes: DeletedNote[] = []; // Lista de tareas eliminadas
  completedTasks: DeletedNote[] = []; // Registro permanente de tareas completadas
  quote: string = '';
  author: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadNotes();
    this.loadDeletedNotes();
    this.getQuotes();
}

saveCompletedTasks(): void {
  localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
}

loadCompletedTasks(): void {
  const savedCompletedTasks = localStorage.getItem('completedTasks');
  if (savedCompletedTasks) {
    this.completedTasks = JSON.parse(savedCompletedTasks);
  }
}

  addNote(): void {
    const newNote: StickyNote = {
      title: 'TITULO',
      description: 'Descripción',
      color: this.colors[this.colorIndex],
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    };
    this.notes.push(newNote);
    this.colorIndex = (this.colorIndex + 1) % this.colors.length;

    this.saveNotes();
  }

  deleteNote(index: number): void {
    const note = this.notes[index];


    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará la tarea de forma permanente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Solo registrar la nota si está en estado "completada"
            if (note.status === 'completada') {
                const deletedNote: DeletedNote = {
                    title: note.title,
                    createdAt: note.createdAt,
                    deletedAt: new Date().toISOString(),
                    duration: this.calculateDuration(note.createdAt),
                };

                this.deletedNotes.push(deletedNote); // Guardar nota eliminada
            }

            this.notes.splice(index, 1); // Eliminar la nota de la lista activa
            this.saveNotes();
            this.saveDeletedNotes();

            Swal.fire(
                'Eliminada',
                'La tarea ha sido eliminada con éxito.',
                'success'
            );
        }
    });
}




  saveNotes(): void {
    localStorage.setItem('stickyNotes', JSON.stringify(this.notes));
  }

  loadNotes(): void {
    const savedNotes = localStorage.getItem('stickyNotes');
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
  }

  saveDeletedNotes(): void {
    localStorage.setItem('deletedNotes', JSON.stringify(this.deletedNotes));
  }

  loadDeletedNotes(): void {
    const savedDeletedNotes = localStorage.getItem('deletedNotes');
    if (savedDeletedNotes) {
      this.deletedNotes = JSON.parse(savedDeletedNotes);
    }
  }

  calculateDuration(createdAt: string): string {
    const createdDate = new Date(createdAt);
    const deletedDate = new Date();
    const duration = deletedDate.getTime() - createdDate.getTime();

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} hrs ${minutes} min`;
  }

  updateTitle(note: StickyNote, event: FocusEvent): void {
    const target = event.target as HTMLElement;
    if (target) {
      note.title = target.innerText;
      this.saveNotes();
    }
  }


  getQuotes() {
    // Obtener la cita aleatoria
    fetch('https://cors-anywhere.herokuapp.com/https://zenquotes.io/api/random')
      .then((response) => response.json())
      .then((quote) => {
        const originalQuote = quote[0].q; // Cita en inglés
        const author = quote[0].a;

        // Traducir la cita usando la API de DeepL
        const deeplApiUrl = 'https://api-free.deepl.com/v2/translate';
        const deeplApiKey = '5e3bb00b-328e-41f4-8e6c-1cb204cf9c4c:fx'; // Reemplaza con tu clave de API de DeepL

        // Configurar los parámetros de la solicitud
        const params = new URLSearchParams();
        params.append('auth_key', deeplApiKey);
        params.append('text', originalQuote);
        params.append('target_lang', 'ES'); // Traducir a español

        fetch(deeplApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        })
          .then((response) => response.json())
          .then((translation) => {
            console.log('Respuesta de la API de DeepL:', translation);

            // Verificar si la respuesta tiene el texto traducido
            if (translation && translation.translations && translation.translations[0]) {
              this.quote = translation.translations[0].text; // Texto traducido
            } else {
              this.quote = 'No se pudo obtener la traducción.';
            }
            this.author = author;
          })
          .catch((error) => {
            console.error('Error traduciendo la cita con DeepL:', error);
            this.quote = 'No se pudo obtener la traducción debido a un error.';
            this.author = author;
          });
      })
      .catch((error) => {
        console.error('Error obteniendo la cita:', error);
        this.quote = 'No se pudo obtener la cita.';
        this.author = 'Desconocido';
      });
  }


  updateDescription(note: StickyNote, event: FocusEvent): void {
    const target = event.target as HTMLElement;
    if (target) {
      note.description = target.innerText;
      this.saveNotes();
    }
  }
}

