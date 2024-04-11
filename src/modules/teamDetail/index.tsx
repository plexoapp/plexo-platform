import {
  ActionIcon,
  Box,
  CopyButton,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { Copy, Dots } from "tabler-icons-react";

import { TeamById } from "lib/types";
import { TeamMenu } from "components/ui/Team/menu";
import { MemberSelectorByTeam } from "components/ui/Project/members";
import { ProjectsSelectorByTeam } from "components/ui/Team/projects";
import { TitleForm } from "./Form";
import { VisibilitySelectorByTeam } from "components/ui/Team/visibility";

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

type TeamDetailProps = {
  team: TeamById | undefined;
  isLoading: boolean;
};

const TeamDetailPageContent = ({ team, isLoading }: TeamDetailProps) => {
  const { classes } = useStyles();

  return (
    <Group p={"md"} sx={{ alignItems: "baseline" }}>
      <Stack maw={860} mx="auto" h={"100%"} sx={{ flexGrow: 1 }}>
        <Stack spacing={10}>
          <Group position="apart" className={classes.headerSections}>
            {isLoading ? (
              <Skeleton width={50} height={8} />
            ) : (
              <Text size={"sm"} color={"dimmed"}>
                {team?.prefix ? team.prefix : "TM-001"}
              </Text>
            )}

            <TeamMenu team={team}>
              <ActionIcon radius={"sm"} size={"xs"} disabled={team?.id ? false : true}>
                <Dots size={18} />
              </ActionIcon>
            </TeamMenu>
          </Group>
          {isLoading ? (
            <Box className={classes.propsBar}>
              <Skeleton height={20} />
            </Box>
          ) : (
            <Group spacing={5} className={classes.propsBar}>
              <MemberSelectorByTeam team={team} />
              <ProjectsSelectorByTeam team={team} />
              <VisibilitySelectorByTeam team={team} type="button" />
            </Group>
          )}
        </Stack>

        <Divider />
        <TitleForm team={team} isLoading={isLoading} />
      </Stack>

      <Divider orientation="vertical" className={classes.propsSection} />

      <Stack miw={320} maw={400} className={classes.propsSection}>
        <Group className={classes.headerSections}>
          <CopyButton value={team?.id} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy project ID"} position="top">
                <ActionIcon
                  size={"xs"}
                  radius={"sm"}
                  onClick={copy}
                  disabled={team?.id ? false : true}
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
            Members
          </Text>
          {isLoading ? <Skeleton height={26} width={100} /> : <MemberSelectorByTeam team={team} />}
        </Group>
        <Group>
          <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
            Projects
          </Text>
          {isLoading ? (
            <Skeleton height={26} width={100} />
          ) : (
            <ProjectsSelectorByTeam team={team} />
          )}
        </Group>
        <Group>
          <Text w={90} lineClamp={1} size={"sm"} color={"dimmed"}>
            Visibility
          </Text>
          {isLoading ? (
            <Skeleton height={26} width={100} />
          ) : (
            <VisibilitySelectorByTeam team={team} type="button" />
          )}
        </Group>
      </Stack>
    </Group>
  );
};

export default TeamDetailPageContent;
