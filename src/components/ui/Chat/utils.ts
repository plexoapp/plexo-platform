import dayjs from "dayjs";

export const formateDate = (date: Date) => {
  return dayjs(date).format("MMMM DD, YYYY HH:mm A");
};
