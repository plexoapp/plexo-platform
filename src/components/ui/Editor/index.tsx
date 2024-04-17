// @ts-nocheck
import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { tools } from "./tools";

type EditorProps = {
  onChange: (data: OutputData | undefined) => void;
  onEditorInstanceChange: (editorInstance: EditorJS | null) => void;
  editorblock: string;
};

const Editor = ({ onChange, onEditorInstanceChange, editorblock }: EditorProps) => {
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

  return <div id={editorblock} />;
};

export default memo(Editor);
