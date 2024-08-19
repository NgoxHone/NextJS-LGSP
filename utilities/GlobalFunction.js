export const getTimestampRanges = () => {
  // Lấy thời điểm hiện tại
  const now = new Date();

  // Lấy thời điểm bắt đầu của hôm nay (00:00:00 hôm nay)
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  // Lấy thời điểm bắt đầu của hôm qua (00:00:00 hôm qua)
  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  ).getTime();

  const endOfYesterday = startOfToday - 1;
  const endOfToday = now.getTime();

  return {
    today: {
      gte: startOfToday,
      lt: endOfToday,
    },
    yesterday: {
      gte: startOfYesterday,
      lt: endOfYesterday,
    },
  };
};

export function formatTimestampToDate(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}
