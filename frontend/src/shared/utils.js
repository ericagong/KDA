import { nanoid } from "nanoid";

export const parseSummonerNames = (names) => {
  const parsedNames = names
    .split(",")
    .map((name) => name.trim())
    .filter((name) => !!name);

  return parsedNames;
};

export const getListFromArr = (arr) => {
  return (
    <>
      {arr?.length > 0
        ? arr.map((item) => <li key={nanoid()}>{item}</li>)
        : "no info :("}
    </>
  );
};

export const getListFromObj = (obj) => {
  return (
    <>
      {obj && JSON.stringify(obj) !== "{}"
        ? Object.entries(obj).map(([k, v]) => {
            if (typeof v === "object") {
              return (
                <li key={nanoid()}>
                  {k}
                  <ul key={nanoid()}>{getListFromObj(v)}</ul>
                </li>
              );
            } else return <li key={nanoid()}>{`${k}: ${v}`}</li>;
          })
        : "no info :("}
    </>
  );
};

export const timeCalculator = (start, end) => {
  return end - start;
};
