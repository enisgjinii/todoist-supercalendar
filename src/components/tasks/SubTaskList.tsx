
import { TaskItem } from "./TaskItem";

interface SubTaskListProps {
  tasks: any[];
  parentId: string;
  project: any;
  token: string;
}

export const SubTaskList = ({ tasks, parentId, project, token }: SubTaskListProps) => {
  const subtasks = tasks.filter(task => task.parent_id === parentId);
  
  if (!subtasks.length) return null;
  
  return (
    <div className="ml-8 mt-4 space-y-4 border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
      {subtasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          project={project}
          token={token}
          isSubtask
          allTasks={tasks}
        />
      ))}
    </div>
  );
};
