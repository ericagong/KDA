export const getRecentImageURL = (type, payload) => {
  if (payload === undefined) return "";
  switch (type) {
    case "profile_icon_id":
      return `http://ddragon.leagueoflegends.com/cdn/13.11.1/img/profileicon/${payload}.png`;
    case "tier":
      return `https://opgg-static.akamaized.net/images/medals_new/${payload}.png`;
    case "champion":
      return `https://opgg-static.akamaized.net/meta/images/lol/champion/${payload}.png?image=c_crop,h_103,w_103,x_9,y_9/q_auto,f_webp,w_96&v=1686296929496`;
    case "rune":
      return `https://opgg-static.akamaized.net/meta/images/lol/perk/${payload}.png?image=q_auto,f_webp,w_44&v=1686296929496`;
    case "runeStyle":
      return `https://opgg-static.akamaized.net/meta/images/lol/perkStyle/${payload}.png?image=q_auto,f_webp,w_44&v=1686296929496`;
    case "spell":
      return `https://opgg-static.akamaized.net/meta/images/lol/spell/${payload}.png?image=q_auto,f_webp,w_44&v=1686296929496`;
    case "item":
      return `https://opgg-static.akamaized.net/meta/images/lol/item/${payload}.png?image=q_auto,f_webp,w_44&v=1686296929496`;
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
