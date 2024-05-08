import { Paper, Stack, Text, useMantineTheme } from "@mantine/core";

export type TextMessageProps = {
  id: string;
  type: string;
  role: string;
  message: string;
  createdAt: string;
};

const TextMessage = ({ message }: { message: TextMessageProps }) => {
  const theme = useMantineTheme();
  const assistantDarkBg =
    theme.colorScheme === "dark" ? theme.colors.brand[9] : theme.colors.green[1];
  const userLightBg = theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3];

  return (
    <Stack spacing={"xs"}>
      <Paper
        key={message.id}
        w={250}
        p="sm"
        sx={{
          backgroundColor: message.role == "assistant" ? assistantDarkBg : userLightBg,
          alignSelf: `${message.role == "assistant" ? "flex-start" : "flex-end"}`,
        }}
      >
        <Text
          fz={"sm"}
          color={theme.colorScheme === "dark" ? "white" : theme.colors.dark[6]}
          sx={{
            wordWrap: "break-word",
          }}
        >
          {message.message}
        </Text>
      </Paper>
      <Text fz={"xs"} c={"dimmed"} align={message.role == "assistant" ? "left" : "right"}>
        {message.createdAt}
      </Text>
    </Stack>
  );
};

export default TextMessage;
