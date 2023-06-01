export const parseSummonerNames = (names) => {
  const parsedNames = names
    .split(",")
    .map((name) => name.trim())
    .filter((name) => !!name);

  return parsedNames;
};
