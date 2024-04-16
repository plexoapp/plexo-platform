import { ActionIcon } from "@mantine/core";
import { useActions } from "lib/hooks/useActions";
import { TaskChat } from ".";
import { showNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";

const ActionTaskButton = ({
  task,
  tasks,
  setTasks,
}: {
  task: TaskChat;
  tasks: TaskChat[];
  setTasks: (tasks: TaskChat[]) => void;
}) => {
  const { createTask, fetchCreateTask } = useActions();

  const onCreateTask = async (value: TaskChat) => {
    const res = await fetchCreateTask({
      input: {
        title: value.title,
      },
    });

    if (res.data) {
      const updatedTasks = [...tasks];
      const taskIndex = updatedTasks.findIndex(task => task.id === value.id);

      if (taskIndex !== -1) {
        updatedTasks[taskIndex].created = true;
        setTasks(updatedTasks);
      }

      showNotification({
        autoClose: 5000,
        title: "Task created",
        message: res.data.createTask.title,
        color: "blue",
        icon: <Check size={18} />,
      });
    }

    if (res.error) {
      showNotification({
        autoClose: 5000,
        title: "Error!",
        message: "Try again",
        color: "red",
        icon: <X size={18} />,
      });
    }
  };

  return (
    <ActionIcon
      ml={4}
      size={"sm"}
      color="brand"
      onClick={() => onCreateTask(task)}
      loading={createTask.fetching}
      disabled={task.created}
    >
      <Check size={16} />
    </ActionIcon>
  );
};

export default ActionTaskButton;
