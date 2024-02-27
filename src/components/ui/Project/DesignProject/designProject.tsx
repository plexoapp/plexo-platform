import {
  Group,
  Modal,
  Text,
  Textarea,
  Button,
  Stack,
  useMantineTheme,
  UnstyledButton,
  Box,
  Grid,
  Tooltip,
  ActionIcon,
  Collapse,
} from "@mantine/core";
import { Barbell, BuildingStore, Music, Plus, Robot } from "tabler-icons-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { IconSparkles } from "@tabler/icons-react";
import { useToggle } from "@mantine/hooks";
import ProjectTasks, { ProjectTask } from "./projectTasks";
import { TaskStatus } from "integration/graphql";

type DesignProjectProps = {
  designProjectOpened: boolean;
  setDesignProjectOpened: (designProjectOpened: boolean) => void;
};

const projectsList = [
  {
    icon: BuildingStore,
    title: "Ecommerce",
    description: "Ecommerce platform for a clothing store using MedusaJS.",
  },
  {
    icon: Robot,
    title: "Chat Bot",
    description: "A chatbot employing AI for enhanced user engagement.",
  },
  {
    icon: Barbell,
    title: "Landing Page for Gym",
    description: "Landing Page designed to captivate gym visitors.",
  },
  {
    icon: Music,
    title: "Music API",
    description: "API designed to retrieve music seamlessly from various sources.",
  },
];

const suggestedTasks = [
  {
    title: "Suggested task 1",
    status: TaskStatus.InProgress,
    lead: null,
  },
  {
    title: "Suggested task 2",
    status: TaskStatus.Done,
    lead: null,
  },
];

const DesignProject = ({ designProjectOpened, setDesignProjectOpened }: DesignProjectProps) => {
  const theme = useMantineTheme();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [showTasks, toggleTasks] = useToggle([false, true]);

  const projects = projectsList.map(project => (
    <Grid.Col key={project.title} xs={12} sm={6}>
      <UnstyledButton
        onClick={() => {
          setName(project.title);
          setDescription(project.description);
        }}
        py={16}
        px={20}
        sx={{
          borderRadius: theme.radius.sm,
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1],
          },
        }}
      >
        <Group>
          <project.icon size={24} color={theme.colors.brand[6]} />
          <Box sx={{ flex: 1 }}>
            <Text size="sm">{project.title}</Text>
            <Text size="xs" color="dimmed">
              {project.description}
            </Text>
          </Box>
        </Group>
      </UnstyledButton>
    </Grid.Col>
  ));

  const addSuggestedTasks = () => {
    !showTasks && toggleTasks();
    setTasks([
      ...suggestedTasks.map(task => ({
        id: uuidv4(),
        title: task.title,
        status: task.status,
        lead: task.lead,
        origin: "suggested",
      })),
      ...tasks,
    ]);
  };

  const resetInitialValues = () => {
    setName("");
    setDescription("");
    setTasks([]);
    showTasks && toggleTasks();
  };

  return (
    <Modal
      overlayProps={{
        color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.5,
        transitionProps: {
          transition: "slide-up",
        },
      }}
      size={"lg"}
      opened={designProjectOpened}
      onClose={() => {
        setDesignProjectOpened(false);
        resetInitialValues();
      }}
      shadow="md"
      title={
        <Group spacing={8}>
          <Text size={"sm"}>Describe your project</Text>
        </Group>
      }
    >
      <Stack spacing={theme.spacing.xs} pb={"md"}>
        <Textarea
          autosize
          minRows={1}
          data-autoFocus
          placeholder="Project name"
          value={name}
          onChange={e => setName(e.target.value)}
          size="sm"
          variant="filled"
          styles={theme => ({
            input: {
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1],
            },
          })}
        />
        <Textarea
          autosize
          minRows={2}
          data-autoFocus
          placeholder="Project Description: Provide details about the objectives, requirements, and characteristics of the project."
          value={description}
          onChange={e => setDescription(e.target.value)}
          size="sm"
          variant="filled"
          styles={theme => ({
            input: {
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1],
            },
          })}
        />
        <Text size="xs" /* color="dimmed" */>Or choose one of the following:</Text>
        <Grid>{projects}</Grid>

        <Group position="apart">
          <Text lineClamp={1} size={"sm"} /* color={"dimmed"} */>
            Add or generate tasks
          </Text>
          <Group spacing={5}>
            <Tooltip label="Add task" position="bottom">
              <ActionIcon
                disabled={name.length ? false : true}
                onClick={() => toggleTasks()}
                /* onClick={() => {
                    setTaskId(task?.id);
                setNewTaskOpened(true);
                  }} */
              >
                <Plus size={16} />
              </ActionIcon>
            </Tooltip>

            <Tooltip withinPortal label="Generate tasks with AI" position="bottom">
              <ActionIcon
                variant="light"
                color={"brand"}
                disabled={name.length ? false : true}
                onClick={() => addSuggestedTasks()}
              >
                <IconSparkles size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Stack>
      <Collapse in={showTasks} transitionDuration={500}>
        <ProjectTasks tasks={tasks} setTasks={setTasks} />
      </Collapse>
      <Group
        pt={"md"}
        position="right"
        sx={{
          borderTopWidth: 1,
          borderTopStyle: "solid",
          borderTopColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2],
        }}
      >
        <Button
          compact
          variant="default"
          onClick={() => {
            setDesignProjectOpened(false);
            resetInitialValues();
          }}
        >
          Cancel
        </Button>
        <Button
          compact
          variant="filled"
          disabled={name.length ? false : true}
          /* loading={createProject.fetching} */
          onClick={() => {
            console.log({ name, description });
            /* onCreateProject(); */
          }}
        >
          Create project
        </Button>
      </Group>
    </Modal>
  );
};

export default DesignProject;
