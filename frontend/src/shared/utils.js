export const getRecentImageURL = (type, payload) => {
  if (payload === undefined) return "";
  switch (type) {
    case "profile_icon_id":
      return `http://ddragon.leagueoflegends.com/cdn/13.11.1/img/profileicon/${payload}.png`;
    case "tier":
      return `https://opgg-static.akamaized.net/images/medals_new/${payload}.png`;
    default:
      return "";
  }
};

export const getTime = (timeStampInMs) => {
  return new Date(timeStampInMs).toLocaleString();
};

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
        ? arr.map((item, idx) => <li key={`${item}_${idx}`}>{item}</li>)
        : "no info :("}
    </>
  );
};

export const getListFromObj = (obj) => {
  return (
    <>
      {obj && JSON.stringify(obj) !== "{}"
        ? Object.entries(obj).map(([k, v], idx) => {
            if (typeof v === "object") {
              return (
                <li key={`${k}_${v}_${idx}`}>
                  {k}
                  <ul key={`ul_${k}_${v}_${idx}`}>{getListFromObj(v)}</ul>
                </li>
              );
            } else return <li key={`${k}_${v}_${idx}`}>{`${k}: ${v}`}</li>;
          })
        : "no info :("}
    </>
  );
};

export const flatArrGetListFromObj = (arr) => {
  return (
    <>
      {arr?.length > 0
        ? arr.map((item, idx) => (
            <>
              <ul key={`ul_${item}_${idx}`}>
                {`Summoner ${idx}`}
                {getListFromObj(item)}
              </ul>
            </>
          ))
        : "no info :("}
    </>
  );
};

export const timeCalculator = (start, end) => {
  return end - start;
};
