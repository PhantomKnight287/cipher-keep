import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const fromNow = (time: string | Date, withoutSuffix?: boolean) =>
  dayjs(time).fromNow(withoutSuffix);
