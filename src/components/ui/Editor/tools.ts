// @ts-nocheck
import { ToolConstructable, ToolSettings } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import SimpleImage from "@editorjs/simple-image";
import AttachesTool from "@editorjs/attaches";
import Table from "@editorjs/table";
import Checklist from "@editorjs/checklist";

export const tools: {
  [toolName: string]: ToolConstructable | ToolSettings<any>;
} = {
  header: {
    class: Header,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  code: Code,
  linkTool: LinkTool,
  // image: Image,
  simpleImage: SimpleImage,
  attaches: {
    class: AttachesTool,
    /* config: {
      endpoint: "http://localhost:8008/uploadFile",
    }, */
  },
  table: Table,
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
};
