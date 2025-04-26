import React, { useEffect, useState } from "react";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import { TaskManager, BaseTask, Priority } from "./TaskManager";

const App: React.FC = () => {
  const [taskManager] = useState(() => new TaskManager());
  const [tasks, setTasks] = useState<BaseTask[]>(() => taskManager.getAllTasks());
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleTasksUpdate = (updatedTasks: BaseTask[]) => {
      setTasks(updatedTasks);
    };

    taskManager.addListener(handleTasksUpdate);
    return () => taskManager.removeListener(handleTasksUpdate);
  }, [taskManager]);

  const addNewTask = (title: string, priority: Priority) => {
    const trimmedTitle = title.trim();
    
    if (trimmedTitle.length === 0) {
      setError("Task title cannot be empty");
      return false;
    }

    if (taskManager.isTaskExists(trimmedTitle)) {
      setError("This task already exists");
      return false;
    }

    try {
      taskManager.addTask(trimmedTitle, priority);
      setError("");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task");
      return false;
    }
  };

  const markTaskCompleted = (id: string) => {
    taskManager.toggleTaskCompletion(id);
  };

  const removeTask = (id: string) => {
    taskManager.removeTask(id);
  };

  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('default', { month: 'short' }).toUpperCase();
  const year = today.getFullYear();
  const dayName = today.toLocaleString('default', { weekday: 'long' }).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="flex items-baseline">
                <span className="text-6xl font-light text-gray-700">{day}</span>
                <div className="ml-2 flex flex-col">
                  <span className="text-gray-500 font-medium">{month}</span>
                  <span className="text-gray-400">{year}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-gray-500">{dayName}</span>
            </div>
          </div>

          <TaskList
            tasks={tasks}
            markTaskCompleted={markTaskCompleted}
            removeTask={removeTask}
          />
        </div>

        <div className="fixed bottom-8 right-8">
          <AddTask addNewTask={addNewTask} error={error} setError={setError} />
        </div>
      </div>
    </div>
  );
};

export default App;
