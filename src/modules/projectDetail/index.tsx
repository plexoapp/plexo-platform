import {
  Group,
  Stack,
  Text,
  Divider,
  ActionIcon,
  MediaQuery,
  Box,
  createStyles,
  CopyButton,
  Tooltip,
  Skeleton,
  ScrollArea,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Copy, Dots, LayoutSidebar } from "tabler-icons-react";

import { LeadSelectorByProject } from "components/ui/Project/lead";
import { MemberSelectorByProject } from "components/ui/Project/members";
import { TeamSelectorByProject } from "components/ui/Project/team";
import { ProjectMenu } from "components/ui/Project/menu";
import { usePlexoContext } from "context/PlexoContext";
import { ProjectById } from "lib/types";
import { useActions } from "lib/hooks/useActions";
import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { validateDate } from "lib/utils";
import { TitleForm } from "./Form";
import { DateGenericSelector } from "components/ui/DateGenericSelector";
import { StatusSelectorByProject } from "components/ui/Project/status";
import { VisibilitySelectorByProject } from "components/ui/Project/visibility";

type ProjectDetailProps = {
  project: ProjectById | undefined;
  isLoading: boolean;
};

const useStyles = createStyles(theme => ({
  propsSection: {
    [theme.fn.smallerThan("lg")]: {
      display: "none",
    },
  },
  propsBar: {
    display: "none",
    [theme.fn.smallerThan("lg")]: {
      display: "flex",
    },
  },
  headerSections: {
    height: 22,
  },
}));

const ProjectDetailContent = ({ project, isLoading }: ProjectDetailProps) => {
  const { classes, theme } = useStyles();
  const { fetchUpdateProject } = useActions();
  const { setNavBarOpened } = usePlexoContext();

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);

  const onUpdateProjectDueDate = async (date: Date | null) => {
    const res = await fetchUpdateProject({
      id: project?.id,
      input: {
        dueDate: date === null ? new Date(0) : date,
      },
    });
    if (res.data) {
      SuccessNotification("Due date updated", res.data.updateProject.name);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  const onUpdateProjectStartDate = async (date: Date | null) => {
    const res = await fetchUpdateProject({
      id: project?.id,
      input: {
        startDate: date === null ? new Date(0) : date,
      },
    });
    if (res.data) {
      SuccessNotification("Start date updated", res.data.updateProject.name);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  useEffect(() => {
    if (project) {
      setDueDate(validateDate(project.dueDate));
      setStartDate(validateDate(project.startDate));
    }
  }, [project]);

  const handleDueDateChange = (date: Date | null) => {
    setDueDate(date);
    onUpdateProjectDueDate(date);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    onUpdateProjectStartDate(date);
  };

  return (
    <Stack h={"100vh"}>
      <Group
        h={73}
        px={20}
        sx={{
          borderBottom: `1px solid ${
            theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
          }`,
        }}
      >
        <MediaQuery largerThan="md" styles={{ display: "none" }}>
          <ActionIcon onClick={() => setNavBarOpened(true)}>
            <LayoutSidebar size={16} />
          </ActionIcon>
        </MediaQuery>
        <Text>Project</Text>
      </Group>
      <Group px={20} sx={{ alignItems: "baseline" }}>
        <ScrollArea offsetScrollbars type="hover" sx={{ flex: 1, height: "calc(100vh - 90px)" }}>
          <Stack m={"auto"} maw={860}>
            <Stack spacing={10}>
              <Group position="apart" className={classes.headerSections}>
                {isLoading ? (
                  <Skeleton width={50} height={8} />
                ) : (
                  <Text size={"sm"} color={"dimmed"}>
                    {project?.prefix ? project.prefix : "PR-001"}
                  </Text>
                )}

                <ProjectMenu project={project}>
                  <ActionIcon radius={"sm"} size={"xs"} disabled={project?.id ? false : true}>
                    <Dots size={18} />
                  </ActionIcon>
                </ProjectMenu>
              </Group>
              {isLoading ? (
                <Box className={classes.propsBar}>
                  <Skeleton height={20} />
                </Box>
              ) : (
                <Group spacing={5} className={classes.propsBar}>
                  <StatusSelectorByProject project={project} type="button" />
                  <LeadSelectorByProject project={project} />
                  <MemberSelectorByProject project={project} />
                  <TeamSelectorByProject project={project} />
                  <VisibilitySelectorByProject project={project} type="button" />
                  <DateGenericSelector
                    placeholder={"Set start date"}
                    date={startDate}
                    onChange={handleStartDateChange}
                  />
                  <DateGenericSelector
                    placeholder={"Set due date"}
                    date={dueDate}
                    onChange={handleDueDateChange}
                  />
                </Group>
              )}
            </Stack>

            <Divider />
            <TitleForm project={project} isLoading={isLoading} />
          </Stack>
        </ScrollArea>
        <Divider orientation="vertical" className={classes.propsSection} />

        <Stack miw={320} maw={400} className={classes.propsSection}>
          <Group className={classes.headerSections}>
            <CopyButton value={project?.id} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy project ID"} position="top">
                  <ActionIcon
                    size={"xs"}
                    radius={"sm"}
                    onClick={copy}
                    disabled={project?.id ? false : true}
                  >
                    <Copy size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
          <Divider />
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Status
            </Text>
            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <StatusSelectorByProject project={project} type="button" />
            )}
          </Group>
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Lead
            </Text>
            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <LeadSelectorByProject project={project} />
            )}
          </Group>
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Members
            </Text>
            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <MemberSelectorByProject project={project} />
            )}
          </Group>
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Teams
            </Text>
            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <TeamSelectorByProject project={project} />
            )}
          </Group>
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Visibility
            </Text>
            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <VisibilitySelectorByProject project={project} type="button" />
            )}
          </Group>

          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Start Date
            </Text>

            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <DateGenericSelector
                placeholder={"Set start date"}
                date={startDate}
                onChange={handleStartDateChange}
              />
            )}
          </Group>
          <Group>
            <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
              Due Date
            </Text>

            {isLoading ? (
              <Skeleton height={26} width={100} />
            ) : (
              <DateGenericSelector
                placeholder={"Set due date"}
                date={dueDate}
                onChange={handleDueDateChange}
              />
            )}
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

export default ProjectDetailContent;
