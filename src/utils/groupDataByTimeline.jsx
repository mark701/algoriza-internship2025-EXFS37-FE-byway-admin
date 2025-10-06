
import { parseISO, format } from "date-fns";
 export const groupDataByTimeline= (data, timeline)=> {
  const grouped = {};

  data.forEach((item) => {
    const date = parseISO(item.createDateAndTime);
    const label = timeline === "thisMonth" ? format(date, "d") : format(date, "MMM");
    grouped[label] = (grouped[label] || 0) + item.total;
  });

  // Sort labels
  const labels =
    timeline === "thisMonth"
      ? Object.keys(grouped).sort((a, b) => Number(a) - Number(b))
      : Object.keys(grouped);

  return { grouped, labels };
}

