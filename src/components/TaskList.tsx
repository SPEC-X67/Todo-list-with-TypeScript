import React from "react";
import TaskItem from "./TaskItem";
import { BaseTask } from "../TaskManager";

type TaskListProps = {
  tasks: BaseTask[];
  markTaskCompleted: (id: string) => void;
  removeTask: (id: string) => void;
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  markTaskCompleted,
  removeTask,
}) => {
  return (
    <div className="divide-y divide-gray-100">
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No tasks for today</p>
        </div>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.getId()}
            task={task}
            markCompleted={() => markTaskCompleted(task.getId())}
            removeTask={() => removeTask(task.getId())}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
