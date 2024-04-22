import { Paper, useMantineTheme } from "@mantine/core";
import dynamic from "next/dynamic";
import EditorJS, { OutputData } from "@editorjs/editorjs";

type EditorInputProps = {
  setData: (data: OutputData | undefined) => void;
  setEditorInstance: (editorInstance: EditorJS | null) => void;
  editorId: string;
  data?: OutputData | undefined;
};

const Editor = dynamic(import("./index"), { ssr: false });

export const EditorInput = ({ setData, setEditorInstance, editorId, data }: EditorInputProps) => {
  const theme = useMantineTheme();

  return (
    <Paper
      p={"sm"}
      sx={{
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "transparent",
        border: `1px solid ${
          theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]
        }`,
        "&:focus-within": {
          borderColor: theme.colors.brand[6],
        },
      }}
    >
      <Editor
        onChangeData={setData}
        onEditorInstanceChange={setEditorInstance}
        editorId={editorId}
        data={data}
      />
    </Paper>
  );
};
