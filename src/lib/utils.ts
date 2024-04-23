import { OutputData } from "@editorjs/editorjs";
import dayjs from "dayjs";

export const DateLabel = (date: Date | null, label?: string) => {
  return date ? dayjs(date).format("DD MMM") : label;
};

export const validateDate = (date: string) => {
  const taskDate = new Date(date);
  return taskDate.getTime() === 0 ? null : taskDate;
};

export const parseJsonDesc = (description: string): OutputData | undefined => {
  const time = new Date().getTime();

  try {
    return JSON.parse(description);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        time: time,
        blocks: [
          {
            id: "1",
            type: "paragraph",
            data: {
              text: description,
            },
          },
        ],
        version: "2.29.1",
      };
    } else {
      console.error("Error parsing JSON:", error);
    }
  }

  return undefined;
};
