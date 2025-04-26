import React from "react";
import { BaseTask, PriorityTask } from "../TaskManager";

type TaskItemProps = {
  task: BaseTask;
  markCompleted: () => void;
  removeTask: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  markCompleted,
  removeTask,
}) => {
  const getPriorityDisplay = () => {
    if (task instanceof PriorityTask) {
      const priority = task.getPriority();
      return (
        <span className={`text-xs px-2 py-1 rounded-full ${
          priority === 'High' 
            ? 'bg-red-100 text-red-800' 
            : priority === 'Medium'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {priority}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="group flex items-center py-3">
      <button
        onClick={markCompleted}
        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0
          ${task.isTaskCompleted()
            ? 'border-emerald-400 bg-emerald-400' 
            : 'border-gray-300'
          }`}
      >
        {task.isTaskCompleted() && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      
      <span className={`ml-3 flex-1 ${task.isTaskCompleted() ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
        {task.getTitle()}
      </span>

      <div className="flex items-center space-x-2">
        {getPriorityDisplay()}
        
        <button
          onClick={removeTask}
          className="opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-gray-600 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
