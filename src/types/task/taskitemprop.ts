import type { Label } from "../label";
import type { Task } from "./task";

export interface TaskItemProps {
  task: Task;
  userId: number;
  labelAvailable: Label[];
};
