export interface StickyNote {
  title: string;
  description: string;
  color: string;
  status: 'pendiente' | 'en-progreso' | 'completada';
}
