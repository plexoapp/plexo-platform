// @ts-nocheck
import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { tools } from "./tools";
import { Box, useMantineTheme } from "@mantine/core";

type EditorProps = {
  onChange: (data: OutputData | undefined) => void;
  onEditorInstanceChange: (editorInstance: EditorJS | null) => void;
  editorblock: string; //Id único del editor
};

const Editor = ({ onChange, onEditorInstanceChange, editorblock }: EditorProps) => {
  const theme = useMantineTheme();
  const EditorRef = useRef();

  //Initialize editorjs
  useEffect(() => {
    //Initialize editorjs if we don't have a reference
    if (!EditorRef.current) {
      const editor = new EditorJS({
        holder: editorblock,
        placeholder: "Write something here...",
        tools: tools,

        async onChange(api, event) {
          const data = await api.saver.save();
          console.log(data);
          onChange(data);
        },
      });
      EditorRef.current = editor;
    }
    onEditorInstanceChange(EditorRef.current);

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
      id={editorblock}
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
