var express = require("express");
var cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const axios = require("axios");

var app = express();

app.use(cors());

const base = {
  SERVER_KR: "https://kr.api.riotgames.com",
  SERVER_ASIA: "https://asia.api.riotgames.com",
  API_KEY: process.env.RIOT_API_KEY,
};

// depth 1: summonerName에서 PPUID, 프로필 아이콘 ID, 소환사 레벨, 최근 게임 시점 추출
async function getSummonerInfo(summonerName) {
  try {
    const res = await axios.get(
      `${base.SERVER_KR}/lol/summoner/v4/summoners/by-name/${summonerName}/?api_key=${base.API_KEY}`
    );

    console.log(
      `[getSummonerInfo]
				ID: ${res.data.id},
				PPUID: ${res.data.puuid},
				PROFILE_ICON_ID: ${res.data.profileIconId},
				SUMMONER_LEVEL: ${res.data.summonerLevel}
				REVISION_DATE: ${res.data.revisionDate},
		`
    );

    return {
      ID: res.data.id,
      PPUID: res.data.puuid,
      PROFILE_ICON_ID: res.data.profileIconId,
      SUMMONER_LEVEL: res.data.summonerLevel,
      REVISION_DATE: res.data.revisionDate,
    };
  } catch (err) {
    console.log(err);
  }
}

app.get("/depth1Info", async (req, res) => {
  const summonerName = req.query.summonerName;
  const summonerInfo = await getSummonerInfo(summonerName);
  res.json(summonerInfo);
});

// depth2: ID에서 해당 소환사의 tier, rank, 승/패, LP 추출

// depth 2: PPUID에서 최근 [n번째, n+개수) 사이 게임 ID 추출

// depth 3: 각 GAMEID에서 해당 게임 정보 추출

// GET past 5 Games by Summoner Name
// GET localhost:4000/past5Games
// app.get("/past5Games", async (req, res) => {
//   const summonerName = req.query.summonerName; // PUUID
//   // PUUID
//   const PUUID = await getSummonerInfo(summonerName);
//   console.log(`PUUID: ${PUUID}`);

//   const API_CALL = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${PUUID}/ids?start=0&count=5&api_key=${API_KEY}`;

//   try {
//     // get API_CALL
//     // its going to give us a list of game IDs
//     const res = await axios.get(API_CALL);

//     // a list of game ID strings
//     const GAME_IDs = res.data;

//     console.log(`GAME_IDs: ${GAME_IDs}`);

//     // loop through the list of game IDs
//     // at each game ID, get the information (kda, cs, etc)
//     var MATCHED_DATA_ARRAY = [];
//     for (var i = 0; i < GAME_IDs.length; i++) {
//       const matchID = GAME_IDs[i];
//       const res = await axios.get(
//         `https://asia.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${API_KEY}`
//       );
//       const MATCH_DATA = res.data;
//       MATCHED_DATA_ARRAY.push(MATCH_DATA);
//     }

//     console.log(`MATCHED_DATA_ARRAY: ${MATCHED_DATA_ARRAY}`);
//   } catch (err) {
//     console.log(err);
//   }

//   // save info above in array, give an array as JSON response to client
//   // [Game1Obh, Game2Obj, Game3Obj, Game4Obj, Game5Obj]
//   res.json(MATCHED_DATA_ARRAY); // sent to client
// });

app.listen(4000, function () {
  console.log(
    "CORS-enabled web server listening on port http://localhost:4000"
  );
}); // localhost:4000
