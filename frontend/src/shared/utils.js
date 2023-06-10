/**
 * 이미지 URL 관련 유틸리티 함수
 */

export const getRecentImageURL = (type, payload) => {
  if (payload === undefined) return "";
  switch (type) {
    case "profileIconId":
      return `https://opgg-static.akamaized.net/meta/images/profile_icons/profileIcon${payload}.jpg?image=q_auto,f_webp,w_auto&v=1686296929496`;
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

/**
 * 날짜 및 시간 계산 관련 유틸리티 함수
 */

export const calcTime = (timestamp) => {
  const today = new Date();
  const playedDate = new Date(timestamp);
  const timeDiff = today.getTime() - playedDate.getTime();

  const monthDiff = parseInt(timeDiff / (1000 * 3600 * 24 * 30));
  const dayDiff = parseInt(timeDiff / (1000 * 3600 * 24));
  const hourDiff = parseInt(timeDiff / (1000 * 3600));
  const minuteDiff = parseInt(timeDiff / (1000 * 60));

  if (monthDiff > 0) return `${monthDiff}달 전`;
  if (dayDiff > 0) return `${dayDiff}일 전`;
  if (hourDiff > 0) return `${hourDiff}시간 전`;
  if (minuteDiff > 0) return `${minuteDiff}분 전`;
  else return `방금 전`;
};

export const calcDuration = (timeInSec) => {
  const minutes = parseInt(timeInSec / 60);
  const seconds = timeInSec % 60;

  if (minutes === 0) return `${seconds}초`;
  if (seconds === 0) return `${minutes}분`;
  return `${minutes}분 ${seconds}초`;
};

export const getTime = (timeStampInMs) => {
  return new Date(timeStampInMs).toLocaleString();
};

/**
 * parsing 관련 유틸리티 함수
 */

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
