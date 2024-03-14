import {
  Button,
  Kbd,
  Menu,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
  MantineTheme,
  Checkbox,
  createStyles,
  Group,
  Divider,
  ActionIcon,
} from "@mantine/core";
import { ProjectVisibility } from "integration/graphql";
import { Forbid2 } from "tabler-icons-react";
import { useState, useEffect } from "react";

import { ProjectById } from "lib/types";

import { useActions } from "lib/hooks/useActions";

import { ErrorNotification, SuccessNotification } from "lib/notifications";

const useStyles = createStyles(theme => ({
  checkbox: {
    width: "100%",
  },
}));

export const visibilityIcon = (
  theme: MantineTheme,
  visibility?: ProjectVisibility,
  size: string | number | undefined = 18
) => {
  switch (visibility) {
    case "NONE":
      return <Forbid2 size={size} color={theme.colors.gray[6]} />;
    case "PUBLIC":
      return <Forbid2 size={size} color={theme.colors.gray[6]} />;
    case "PRIVATE":
      return <Forbid2 size={size} color={theme.colors.gray[6]} />;
    case "INTERNAL":
      return <Forbid2 size={size} color={theme.colors.gray[6]} />;
    default:
      return <></>;
  }
};

export const visibilityLabel = (visibility?: ProjectVisibility) => {
  switch (visibility) {
    case "NONE":
      return "None";
    case "PUBLIC":
      return "Public";
    case "PRIVATE":
      return "Private";
    case "INTERNAL":
      return "Internal";
  }

  return "No visibility";
};

export const visibilityName = (visibility: ProjectVisibility | undefined) => {
  switch (visibility) {
    case "NONE":
      return ProjectVisibility.None;
    case "PUBLIC":
      return ProjectVisibility.Public;
    case "PRIVATE":
      return ProjectVisibility.Private;
    case "INTERNAL":
      return ProjectVisibility.Internal;
  }
};

const visibilityOrder = (a: ProjectVisibility, b: ProjectVisibility) => {
  const order = [
    ProjectVisibility.None,
    ProjectVisibility.Public,
    ProjectVisibility.Private,
    ProjectVisibility.Internal,
  ];

  const indexA = order.indexOf(a);
  const indexB = order.indexOf(b);

  return indexA - indexB;
};

type VisibilityCheckboxProps = {
  visibilityFilters: string[];
  setVisibilityFilters: (visibilityFilters: string[]) => void;
};

export const ProjectVisibilityCheckboxGroup = ({
  visibilityFilters,
  setVisibilityFilters,
}: VisibilityCheckboxProps) => {
  const { classes, theme } = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [visibilityOptions, setVisibilityOptions] = useState<ProjectVisibility[]>([]);

  useEffect(() => {
    const visibilityValues = Object.values(ProjectVisibility);
    setVisibilityOptions(
      visibilityValues
        .sort(visibilityOrder)
        .filter(item => item.includes(searchValue.toUpperCase()))
    );
  }, [searchValue]);

  return (
    <>
      <TextInput
        placeholder="Visibility"
        variant="unstyled"
        value={searchValue}
        onChange={event => setSearchValue(event.currentTarget.value)}
      />
      <Divider />
      <Checkbox.Group mt={10} value={visibilityFilters} onChange={setVisibilityFilters}>
        {visibilityOptions.map(visibility => {
          return (
            <Checkbox
              key={visibility}
              size="xs"
              pb={15}
              value={visibility}
              label={
                <Group spacing={5}>
                  {visibilityIcon(theme, visibility)}
                  {visibilityLabel(visibility)}
                </Group>
              }
              classNames={{
                body: classes.checkbox,
                labelWrapper: classes.checkbox,
              }}
            />
          );
        })}
      </Checkbox.Group>
    </>
  );
};

type GenericVisibilityMenuProps = {
  children: React.ReactNode;
  onSelect?: (visibility: ProjectVisibility) => void;
  project?: ProjectById;
};

export const GenericVisibilityProjectMenu = ({
  children,
  onSelect,
  project,
}: GenericVisibilityMenuProps) => {
  const theme = useMantineTheme();
  const { fetchUpdateProject } = useActions();
  const [searchValue, setSearchValue] = useState("");
  const [visibilityOptions, setVisibilityOptions] = useState<ProjectVisibility[]>([]);

  useEffect(() => {
    const visibilityValues = Object.values(ProjectVisibility);
    setVisibilityOptions(
      visibilityValues
        .sort(visibilityOrder)
        .filter(item => item.includes(searchValue.toUpperCase()))
    );
  }, [searchValue]);

  const onUpdateTeamVisibility = async (visivility: ProjectVisibility) => {
    const res = await fetchUpdateProject({
      id: project?.id,
      input: {
        visibility: visibilityName(visivility),
      },
    });

    if (res.data) {
      SuccessNotification("Visibility updated", res.data.updateProject.name);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  return (
    <Menu shadow="md" width={180} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Change visibility" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <TextInput
          placeholder="Change Visibility..."
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
          rightSection={<Kbd px={8}>S</Kbd>}
        />
        <Menu.Divider />
        {visibilityOptions.map(visibility => {
          return (
            <Menu.Item
              key={visibility}
              icon={visibilityIcon(theme, visibility)}
              onClick={() => {
                onSelect && onSelect(visibility);
                project && onUpdateTeamVisibility(visibility);
              }}
            >
              {visibilityLabel(visibility)}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

type VisibilitySelectorProps = {
  visibility: ProjectVisibility;
  setVisibility: (visibility: ProjectVisibility) => void;
  type: "icon" | "button";
};

export const VisibilitySelector = ({
  visibility,
  setVisibility,
  type,
}: VisibilitySelectorProps) => {
  const theme = useMantineTheme();

  return (
    <GenericVisibilityProjectMenu onSelect={s => setVisibility(s)}>
      {type == "icon" ? (
        <ActionIcon variant="transparent" radius={"sm"}>
          {visibilityIcon(theme, visibility)}
        </ActionIcon>
      ) : (
        <Button
          compact
          variant="light"
          color={"gray"}
          leftIcon={visibilityIcon(theme, visibility, 18)}
        >
          <Text size={"xs"}>{visibilityLabel(visibility)}</Text>
        </Button>
      )}
    </GenericVisibilityProjectMenu>
  );
};

type VisibilitySelectorByTeamProps = {
  project: ProjectById | undefined;
  type: "icon" | "button";
  iconVariant?: "light";
};

export const VisibilitySelectorByProject = ({
  project,
  type,
  iconVariant,
}: VisibilitySelectorByTeamProps) => {
  const theme = useMantineTheme();

  return (
    <GenericVisibilityProjectMenu project={project}>
      {type == "icon" ? (
        <ActionIcon variant={iconVariant ? iconVariant : "transparent"} radius={"sm"}>
          {visibilityIcon(theme, project?.visibility)}
        </ActionIcon>
      ) : (
        <Button
          compact
          variant="light"
          color={"gray"}
          leftIcon={visibilityIcon(theme, project?.visibility)}
        >
          <Text size={"xs"}>{visibilityLabel(project?.visibility)}</Text>
        </Button>
      )}
    </GenericVisibilityProjectMenu>
  );
};
