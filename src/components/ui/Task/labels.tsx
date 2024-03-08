import {
  Button,
  Checkbox,
  Kbd,
  Menu,
  TextInput,
  Tooltip,
  Text,
  Avatar,
  Box,
  Group,
  ColorSwatch,
  Divider,
  createStyles,
  ScrollArea,
  Skeleton,
} from "@mantine/core";
import { ChangeEvent, useEffect, useState } from "react";
import { Tag } from "tabler-icons-react";

import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { useActions } from "lib/hooks/useActions";
import { Label, TaskById } from "lib/types";

import { usePlexoContext } from "context/PlexoContext";

const useStyles = createStyles(theme => ({
  checkbox: {
    width: "100%",
  },
  checkboxBody: {
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
    paddingLeft: 12,
  },
  checkboxInner: {
    width: 20,
    height: 20,
  },
  checkboxInput: {
    width: "100%",
    height: "100%",
  },
}));

export const LabelIcon = () => {
  return <Tag size={16} />;
};

type GenericLabelsMenuProps = {
  children: React.ReactNode;
  selectedLabels?: string[];
  setSelectedLabels?: (selectedLabels: string[]) => void;
};

export const LabelColor = (labels: string[]) => {
  const { labelsData } = usePlexoContext();

  const colors: Label[] = labelsData
    ? labelsData?.filter((label: Label) => labels.includes(label.id))
    : [];

  if (labels.length) {
    return (
      <Avatar.Group spacing="sm">
        {colors.map(c => {
          return (
            <Avatar
              key={c.id}
              sx={{
                height: 10,
                width: 18,
                minWidth: 10,
                backgroundColor: "transparent",
                border: "hidden",
              }}
              styles={{
                placeholder: {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Box w={10} h={10} sx={{ borderRadius: "50%", backgroundColor: `${c.color}` }}></Box>
            </Avatar>
          );
        })}
      </Avatar.Group>
    );
  }

  return (
    <Group>
      <LabelIcon />
    </Group>
  );
};

export const LabelNameBtn = (labels: string[]) => {
  const { labelsData } = usePlexoContext();
  const data = labelsData ? labelsData?.filter((label: Label) => labels.includes(label.id)) : [];

  if (labels.length == 1) {
    const labelName = data.filter((label: Label) => labels.includes(label.id));
    return labelName[0].name;
  }

  if (labels.length > 1) {
    return `${labels.length} labels`;
  }

  return "Label";
};

type LabelCheckboxProps = {
  labelsFilters: string[];
  setLabelsFilters: (labelsFilters: string[]) => void;
};

export const LabelCheckboxGroup = ({ labelsFilters, setLabelsFilters }: LabelCheckboxProps) => {
  const { classes, theme } = useStyles();
  const { labelsData } = usePlexoContext();
  const [searchValue, setSearchValue] = useState("");
  const [labelsOptions, setLabelsOptions] = useState<Label[]>([]);

  useEffect(() => {
    if (labelsData) {
      setLabelsOptions(
        labelsData?.filter((item: Label) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue]);

  return (
    <>
      <TextInput
        placeholder="Label"
        variant="unstyled"
        value={searchValue}
        onChange={event => setSearchValue(event.currentTarget.value)}
      />
      <Divider />
      <Checkbox.Group mt={10} value={labelsFilters} onChange={setLabelsFilters}>
        {labelsOptions.map(label => (
          <Checkbox
            key={label.id}
            size="xs"
            pb={15}
            value={label.id}
            label={
              <Group spacing={12}>
                <ColorSwatch color={label.color as string} size={10} />
                <Text>{label.name}</Text>
              </Group>
            }
            classNames={{
              body: classes.checkbox,
              labelWrapper: classes.checkbox,
            }}
          />
        ))}
      </Checkbox.Group>
    </>
  );
};

const GenericLabelsMenu = ({
  children,
  selectedLabels,
  setSelectedLabels,
}: GenericLabelsMenuProps) => {
  const { labelsData } = usePlexoContext();
  const [searchValue, setSearchValue] = useState("");
  const [labelsOptions, setLabelsOptions] = useState<Label[]>([]);

  useEffect(() => {
    if (labelsData) {
      setLabelsOptions(
        labelsData?.filter((item: Label) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [labelsData, searchValue]);

  return (
    <Menu shadow="md" closeOnItemClick={false} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Change labels" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <TextInput
          placeholder="Change labels..."
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
          rightSection={<Kbd px={8}>L</Kbd>}
        ></TextInput>
        <Menu.Divider />
        <Checkbox.Group mt={10} value={selectedLabels} onChange={setSelectedLabels}>
          {labelsOptions.map(label => (
            <Menu.Item key={label.id} p={0}>
              <Checkbox
                size="xs"
                value={label.id}
                label={
                  <Group spacing={12}>
                    <ColorSwatch color={label.color as string} size={10} />
                    <Text>{label.name}</Text>
                  </Group>
                }
                styles={{
                  body: {
                    width: "100%",
                    padding: 10,
                    alignItems: "center",
                  },
                  labelWrapper: {
                    width: "100%",
                  },
                }}
              />
            </Menu.Item>
          ))}
        </Checkbox.Group>
      </Menu.Dropdown>
    </Menu>
  );
};

type LabelsByTaskMenuProps = {
  children: React.ReactNode;
  task?: TaskById;
};

const LabelsByTaskMenu = ({ children, task }: LabelsByTaskMenuProps) => {
  const { classes } = useStyles();
  const { labelsData, isLoadingLabels } = usePlexoContext();
  const { fetchUpdateTask } = useActions();
  const [searchValue, setSearchValue] = useState("");
  const [labelsOptions, setLabelsOptions] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  useEffect(() => {
    if (labelsData) {
      setLabelsOptions(
        labelsData?.filter((item: Label) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [labelsData, searchValue]);

  useEffect(() => {
    if (task && task.labels) {
      const labelsIds = task.labels.map(a => a.id as string);

      setSelectedLabels(labelsIds);
    }
  }, [task]);

  const onUpdateTaskLabels = async (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.currentTarget;
    setSelectedLabels(
      checked ? [...selectedLabels, value] : selectedLabels.filter(a => a !== value)
    );

    const res = await fetchUpdateTask({
      id: task?.id,
      input: {
        labels: {
          add: checked ? [value] : [],
          remove: checked ? [] : [value],
        },
      },
    });

    if (res.data) {
      SuccessNotification("Labels updated", res.data.updateTask.title);
    }
    if (res.error) {
      ErrorNotification();
    }
  };

  return (
    <Menu shadow="md" closeOnItemClick={false} position="bottom-start" withinPortal>
      <Menu.Target>
        <Tooltip label="Add labels" position="bottom">
          {children}
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <TextInput
          placeholder="Change labels..."
          variant="filled"
          value={searchValue}
          onChange={event => setSearchValue(event.currentTarget.value)}
          rightSection={<Kbd px={8}>L</Kbd>}
        ></TextInput>
        <Menu.Divider />
        <ScrollArea.Autosize mah={250}>
          {isLoadingLabels ? (
            <Skeleton height={36} radius="sm" />
          ) : (
            <Box mt={10}>
              {labelsOptions.map(label => {
                return (
                  <Menu.Item key={label.id}>
                    <Checkbox
                      size="xs"
                      value={label.id}
                      label={
                        <Group spacing={12}>
                          <ColorSwatch color={label.color as string} size={10} />
                          <Text>{label.name}</Text>
                        </Group>
                      }
                      checked={selectedLabels.includes(label.id)}
                      onChange={event => onUpdateTaskLabels(event)}
                      classNames={{
                        body: classes.checkboxBody,
                        label: classes.checkboxLabel,
                        inner: classes.checkboxInner,
                        input: classes.checkboxInput,
                      }}
                    />
                  </Menu.Item>
                );
              })}
            </Box>
          )}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
};

type LabelsSelectorProps = {
  selectedLabels: string[];
  setSelectedLabels: (selectedLabels: string[]) => void;
};

export const LabelsSelector = ({ selectedLabels, setSelectedLabels }: LabelsSelectorProps) => {
  return (
    <GenericLabelsMenu selectedLabels={selectedLabels} setSelectedLabels={setSelectedLabels}>
      <Button compact variant="light" color={"gray"} leftIcon={LabelColor(selectedLabels)}>
        <Text size={"xs"}>{LabelNameBtn(selectedLabels)}</Text>
      </Button>
    </GenericLabelsMenu>
  );
};

export const LabelsSelectorBytask = ({ task }: { task: TaskById | undefined }) => {
  const labels = task ? task.labels.map(l => l.id as string) : [];

  return (
    <LabelsByTaskMenu task={task}>
      <Button compact variant="light" color={"gray"} leftIcon={LabelColor(labels)}>
        <Text size={"xs"}>{LabelNameBtn(labels)}</Text>
      </Button>
    </LabelsByTaskMenu>
  );
};
