import dayjs from "dayjs";
import { RefObject } from "react";

export const formateDate = (date: Date) => {
  return dayjs(date).format("MMMM DD, YYYY HH:mm A");
};

export const scrollToBottom = (viewport: RefObject<HTMLDivElement>) => {
  viewport.current!.scrollTo({ top: viewport.current!.scrollHeight /* behavior: "smooth" */ });
};
