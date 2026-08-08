
export const createSlug = ({ title, id }: { title: string; id: string }) => {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .substring(0, 50);
  return `${slug}-${id}`;
};