export interface Task {
  id: number;
  title: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
}

export let tasks: Task[] = [];
