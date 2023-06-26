export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = { day: "numeric", month: "short", year: "numeric" };

  return date.toLocaleDateString(undefined, options);
};