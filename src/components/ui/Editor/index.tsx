// @ts-nocheck
import React, { memo, useEffect, useRef, useState } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { tools } from "./tools";

type EditorProps = {
  data: OutputData | undefined;
  onChange: (data: OutputData | undefined) => void;
  setEditorInstance: (editorInstance: EditorJS | null) => void;
  editorblock: string;
};

const Editor = ({ data, onChange, setEditorInstance, editorblock }: EditorProps) => {
  const ref = useRef();

  //Initialize editorjs
  useEffect(() => {
    //Initialize editorjs if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorblock,
        placeholder: "Write something here...",
        tools: tools,
        /*  data: data, */
        async onChange(api, event) {
          const data = await api.saver.save();
          console.log(data);
          /* onChange(data); */
        },
      });
      ref.current = editor;
    }

    //Add a return function to handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  return <div id={editorblock} />;
};

export default memo(Editor);
