// Priority type definition
export type Priority = "High" | "Medium" | "Low";

interface BaseTaskData {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface PriorityTaskData extends BaseTaskData {
  priority: Priority;
}

// Base Task class
export abstract class BaseTask {
  protected title: string;
  protected isCompleted: boolean;
  private id: string;

  constructor(title: string, isCompleted: boolean = false, id?: string) {
    this.title = title;
    this.isCompleted = isCompleted;
    this.id = id || Math.random().toString(36).substring(2, 15);
  }

  public getId(): string {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public isTaskCompleted(): boolean {
    return this.isCompleted;
  }

  public complete(): void {
    this.isCompleted = true;
  }

  public uncomplete(): void {
    this.isCompleted = false;
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      isCompleted: this.isCompleted
    };
  }

  abstract getDisplayTitle(): string;
}

// Simple Task class
export class SimpleTask extends BaseTask {
  constructor(title: string, isCompleted: boolean = false, id?: string) {
    super(title, isCompleted, id);
  }

  public getDisplayTitle(): string {
    return this.title;
  }
}

// Priority Task class
export class PriorityTask extends BaseTask {
  protected priority: Priority;

  constructor(title: string, priority: Priority, isCompleted: boolean = false, id?: string) {
    super(title, isCompleted, id);
    this.priority = priority;
  }

  public getPriority(): Priority {
    return this.priority;
  }

  public setPriority(priority: Priority): void {
    this.priority = priority;
  }

  public getDisplayTitle(): string {
    return `${this.title} (${this.priority})`;
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
      priority: this.priority
    };
  }
}

// Task Manager class
export class TaskManager {
  private tasks: BaseTask[] = [];
  private listeners: ((tasks: BaseTask[]) => void)[] = [];

  constructor() {
    this.loadTasksFromLocalStorage();
  }

  private saveTasksToLocalStorage(): void {
    const tasksData = this.tasks.map(task => task.toJSON());
    localStorage.setItem('tasks', JSON.stringify(tasksData));
  }

  private loadTasksFromLocalStorage(): void {
    const tasksData = localStorage.getItem('tasks');
    if (tasksData) {
      const parsedTasks = JSON.parse(tasksData) as (BaseTaskData | PriorityTaskData)[];
      this.tasks = parsedTasks.map((taskData) => {
        if ('priority' in taskData) {
          return new PriorityTask(
            taskData.title, 
            taskData.priority, 
            taskData.isCompleted, 
            taskData.id
          );
        } else {
          return new SimpleTask(
            taskData.title, 
            taskData.isCompleted, 
            taskData.id
          );
        }
      });
      this.notifyListeners();
    }
  }

  public addTask(title: string, priority: Priority): void {
    const task = new PriorityTask(title, priority);
    this.tasks.push(task);
    this.saveTasksToLocalStorage();
    this.notifyListeners();
  }

  public getAllTasks(): BaseTask[] {
    return [...this.tasks];
  }

  public toggleTaskCompletion(id: string): void {
    const task = this.tasks.find(task => task.getId() === id);
    if (task) {
      if (task.isTaskCompleted()) {
        task.uncomplete();
      } else {
        task.complete();
      }
      this.saveTasksToLocalStorage();
      this.notifyListeners();
    }
  }

  public removeTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.getId() !== id);
    this.saveTasksToLocalStorage();
    this.notifyListeners();
  }

  public isTaskExists(title: string): boolean {
    return this.tasks.some(task => task.getTitle().toLowerCase() === title.toLowerCase());
  }

  public addListener(listener: (tasks: BaseTask[]) => void): void {
    this.listeners.push(listener);
  }

  public removeListener(listener: (tasks: BaseTask[]) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getAllTasks()));
  }

  public getAllTaskDisplayTitles(): string[] {
    return this.tasks.map(task => task.getDisplayTitle());
  }

  public getPriorityTasks(): PriorityTask[] {
    return this.tasks.filter((task): task is PriorityTask => task instanceof PriorityTask);
  }
}