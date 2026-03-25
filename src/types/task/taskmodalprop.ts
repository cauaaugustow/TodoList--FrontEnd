import type { Task } from './task';
import type { Label } from '../label';

export interface TaskModalProps {
  task?: Task;
  openModal: "info" | "edit" | "delete" | "add" | null;
  handleClose: () => void;
  userId: number;
  labelAvailable:  Label[];
}
