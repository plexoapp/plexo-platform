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
  Collapse,
} from "@mantine/core";
import { Barbell, BuildingStore, Music, Robot } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { IconSparkles } from "@tabler/icons-react";
import { useToggle } from "@mantine/hooks";
import ProjectTasks, { ProjectTask } from "./projectTasks";
import { SuggestProjectDocument } from "integration/graphql";
import { useQuery } from "urql";
import { useActions } from "lib/hooks/useActions";
import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { statusName } from "components/ui/Task/status";

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

const parseTasks = (tasks: ProjectTask[], projectId: string) => {
  return tasks.map(task => {
    return {
      title: task.title,
      description: task.description,
      status: statusName(task.status),
      leadId: task.lead?.id,
      projectId: projectId,
    };
  });
};

const DesignProject = ({ designProjectOpened, setDesignProjectOpened }: DesignProjectProps) => {
  const theme = useMantineTheme();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [showTasks, toggleTasks] = useToggle([false, true]);
  const [showExamples, toggleExamples] = useToggle([false, true]);
  const { createProject, fetchCreateProject, createTasks, fetchCreateTasks } = useActions();

  const [
    { data: projectSuggestionData, fetching: isLoadingProjectSuggestion },
    fetchProjectSuggestion,
  ] = useQuery({
    pause: true,
    query: SuggestProjectDocument,
    variables: {
      input: {
        title: name,
        description: description,
        generateTasksNumber: 3,
      },
    },
  });

  const projectSuggestion = async () => {
    fetchProjectSuggestion();
  };

  useEffect(() => {
    if (projectSuggestionData) {
      const res = projectSuggestionData;

      setName(res?.suggestNextProject.name || name);
      setDescription(res?.suggestNextProject.description || description);

      if (res?.suggestNextProject?.tasks?.length) {
        setTasks([
          ...res?.suggestNextProject?.tasks?.map(task => ({
            id: uuidv4(),
            title: task.title,
            description: task.description,
            status: task.status,
            lead: null,
            origin: "suggested",
          })),
          ...tasks,
        ]);
        toggleTasks(true);
      }
    }
  }, [projectSuggestionData]);

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

  const resetInitialValues = () => {
    setName("");
    setDescription("");
    setTasks([]);
    showTasks && toggleTasks();
  };

  useEffect(() => {
    description.length ? toggleExamples(false) : toggleExamples(true);
  }, [description]);

  const onCreateProject = async () => {
    const res = await fetchCreateProject({
      input: {
        name: name,
        description: description,
      },
    });

    if (res.data) {
      SuccessNotification("Project created!", `${res.data.createProject.name} created`);

      if (res.data.createProject.id) {
        await onCreateTasks(res.data.createProject.id);
      }
    }
    if (res.error) {
      ErrorNotification(res.error.message);
    }
  };

  const onCreateTasks = async (id: string) => {
    const res = await fetchCreateTasks({
      input: {
        tasks: parseTasks(tasks, id),
      },
    });

    if (res.data) {
      SuccessNotification("Tasks created!", `${res.data.createTasks.length} tasks created`);
      resetInitialValues();
      setDesignProjectOpened(false);
    }
    if (res.error) {
      ErrorNotification(res.error.message);
    }
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
      <Stack spacing={theme.spacing.xs}>
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

        <Collapse in={showExamples} transitionDuration={500}>
          <Stack spacing={theme.spacing.xs}>
            <Text size="xs">Or choose one of the following:</Text>
            <Grid>{projects}</Grid>
          </Stack>
        </Collapse>

        <Collapse in={showTasks} transitionDuration={500}>
          <ProjectTasks tasks={tasks} setTasks={setTasks} name={name} description={description} />
        </Collapse>
        <Group position="right">
          <Tooltip withinPortal label="Design project with AI" position="bottom">
            <Button
              compact
              variant="light"
              color={"brand"}
              leftIcon={<IconSparkles size={16} />}
              disabled={description.length ? false : true}
              onClick={projectSuggestion}
              loading={isLoadingProjectSuggestion}
            >
              Design project
            </Button>
          </Tooltip>
        </Group>
      </Stack>

      <Group
        mt={"md"}
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
        <Tooltip withinPortal label="Create project and tasks" position="bottom">
          <Button
            compact
            variant="filled"
            disabled={name.length && description.length && tasks.length ? false : true}
            loading={createProject.fetching || createTasks.fetching ? true : false}
            onClick={() => onCreateProject()}
          >
            Create project
          </Button>
        </Tooltip>
      </Group>
    </Modal>
  );
};

export default DesignProject;
