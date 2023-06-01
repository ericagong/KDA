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
async function getD1Info(summonerName) {
  try {
    const res = await axios.get(
      `${base.SERVER_KR}/lol/summoner/v4/summoners/by-name/${summonerName}/?api_key=${base.API_KEY}`
    );

    console.log(
      `[getD1Info]
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
  const D1Info = await getD1Info(summonerName);
  res.json(D1Info);
});

// depth2: ID에서 해당 소환사의 tier, rank, 승/패, LP 추출 + 승률 계산
async function getD2BasicInfo(ID) {
  try {
    const res = await axios.get(
      `${base.SERVER_KR}/lol/league/v4/entries/by-summoner/${ID}?api_key=${base.API_KEY}`
    );

    const { tier, rank, wins, losses, leaguePoints, inactive } = res.data[0];

    console.log(
      `[getD2BasicInfo]
				TIER: ${tier},
				RANK: ${rank},
				WINS: ${wins},
				LOSSES: ${losses},
				LEAGUE_POINTS: ${leaguePoints},
				INACTIVE: ${inactive},
		`
    );

    // 승률 계산
    // TODO NaN 처리
    const WIN_RATE = (wins / (wins + losses)) * 100;

    return {
      TIER: tier,
      RANK: rank,
      WINS: wins,
      LOSSES: losses,
      LEAGUE_POINTS: leaguePoints,
      WIN_RATE,
      INACTIVE: inactive,
    };
  } catch (err) {
    console.log(err);
  }
}

app.get("/depth2BasicInfo", async (req, res) => {
  const ID = req.query.ID;
  const D2BasicInfo = await getD2BasicInfo(ID);
  res.json(D2BasicInfo);
});

// TODO n -> n+count 사이로 변경
// depth 2: PPUID에서 최근 [n번째, n+개수) 사이 게임 ID 추출
async function getD2MatchInfo(PPUID) {
  const START = 0;
  const COUNT = 5;
  try {
    const res = await axios.get(
      `${base.SERVER_ASIA}/lol/match/v5/matches/by-puuid/${PPUID}/ids?start=${START}&count=${COUNT}&api_key=${base.API_KEY}`
    );

    console.log(
      `[getD2MatchInfo]
				MATCHES: ${res.data}
		`
    );

    return {
      MATCHES: res.data,
    };
  } catch (err) {
    console.log(err);
  }
}

app.get("/depth2MatchInfo", async (req, res) => {
  const PPUID = req.query.PPUID;
  const D2MatchInfo = await getD2MatchInfo(PPUID);
  res.json(D2MatchInfo);
});

// depth 3: 각 GAMEID에서 해당 게임 정보 추출
async function getD3MatchInfo(MATCHID) {
  try {
    const res = await axios.get(
      `${base.SERVER_ASIA}/lol/match/v5/matches/${MATCHID}?api_key=${base.API_KEY}`
    );

    console.log(
      `[getD3MatchInfo]
				MATCH_INFO: ${JSON.stringify(res.data)}
		`
    );

    return {
      MATCH_INFO: res.data,
    };
  } catch (err) {
    console.log(err);
  }
}

app.get("/depth3MatchInfo", async (req, res) => {
  const MATCHID = req.query.MATCHID;
  const D3MatchInfo = await getD3MatchInfo(MATCHID);
  res.json(D3MatchInfo);
});

app.listen(4000, function () {
  console.log(
    "CORS-enabled web server listening on port http://localhost:4000"
  );
}); // localhost:4000
