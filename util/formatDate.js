export const formatDate = (iso) => {
  const date = new Date(iso);
  const options = { day: "numeric", month: "short", year: "numeric" };

  return date.toLocaleDateString(undefined, options);
};