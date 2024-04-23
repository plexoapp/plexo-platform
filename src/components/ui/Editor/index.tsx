// @ts-nocheck
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { Box, useMantineTheme } from "@mantine/core";
import React, { memo, useEffect, useRef } from "react";
import { tools } from "./tools";

type EditorProps = {
  onChangeData: (data: OutputData | undefined) => void;
  onEditorInstanceChange: (editorInstance: EditorJS | null) => void;
  editorId: string; //Id único del editor
  data?: OutputData;
};

const Editor = ({ onChangeData, onEditorInstanceChange, editorId, data }: EditorProps) => {
  const theme = useMantineTheme();
  const EditorRef = useRef<EditorJS | null>(null);

  //Initialize editorjs
  useEffect(() => {
    //Initialize editorjs if we don't have a reference
    if (!EditorRef.current) {
      const editor = new EditorJS({
        holder: editorId,
        placeholder: "Write something here...",
        tools: tools,
        data: data || undefined,
        async onChange(api, event) {
          const changeData = await api.saver.save();
          onChangeData(changeData);
        },
        onReady: () => {
          onEditorInstanceChange(editor);
        },
      });

      EditorRef.current = editor;
    }

    //Add a return function to handle cleanup
    return () => {
      if (EditorRef.current && EditorRef.current.destroy) {
        onEditorInstanceChange(null);
        EditorRef.current.destroy();
      }
    };
  }, []);

  return (
    <Box
      id={editorId}
      className={theme.colorScheme === "dark" ? "dark-mode" : ""}
      pl={48}
      sx={{
        "@media (max-width: 650px)": {
          paddingLeft: 0,
        },
      }}
    />
  );
};

export default memo(Editor);
