export const getCategoryCandidates = (category) => {
  if (!category) return [];

  const normalized = String(category).trim();
  if (!normalized) return [];

  return [normalized];
};
