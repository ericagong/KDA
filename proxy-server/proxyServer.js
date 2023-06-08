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

    // console.log(
    //   `[getD1Info]
    // 		ID: ${res.data.id},
    // 		PPUID: ${res.data.puuid},
    // 		PROFILE_ICON_ID: ${res.data.profileIconId},
    // 		SUMMONER_LEVEL: ${res.data.summonerLevel}
    // 		REVISION_DATE: ${res.data.revisionDate},
    // `
    // );

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

    let queueInfo = {};

    res.data.forEach((queue) => {
      const { queueType, tier, rank, wins, losses, leaguePoints, inactive } =
        queue;
      // 승률 계산
      // TODO NaN 처리
      const WIN_RATE = (wins / (wins + losses)) * 100;
      const key = /FLEX/.test(queueType) ? "FLEX" : "SOLO";
      queueInfo[key] = {
        QUEUE_TYPE: key,
        TIER: tier,
        RANK: rank,
        WINS: wins,
        LOSSES: losses,
        LEAGUE_POINTS: leaguePoints,
        WIN_RATE,
        INACTIVE: inactive,
      };
    });

    return queueInfo;
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
  const COUNT = 10;

  try {
    const res = await axios.get(
      `${base.SERVER_ASIA}/lol/match/v5/matches/by-puuid/${PPUID}/ids?start=${START}&count=${COUNT}&api_key=${base.API_KEY}`
    );

    // console.log(
    //   `[getD2MatchInfo]
    // 		MATCHES: ${res.data}
    // `
    // );

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

    // console.log(
    //   `[getD3MatchInfo]
    // 		MATCH_INFO: ${JSON.stringify(res.data)}
    // `
    // );

    return {
      MATCH_INFO: res.data,
    };
  } catch (err) {
    console.log(err);
  }
}

app.get("/depth3MatchInfo", async (req, res) => {
  const MATCHID = req.query.MATCHID;
  const TARGET_SUMMONER_ID = req.query.TARGET_SUMMONER_ID;

  const response = await getD3MatchInfo(MATCHID);

  const INFO = response.MATCH_INFO.info;

  let PLAYERS = []; // [team1P1, team1P2, team1P3, team1P4, team1P5, team2P1, team2P2, team2P3, team2P4, team2P5]
  let TOTAL_GOLDS = [0, 0]; // [team1, team2]
  let TOTAL_KILLS = [0, 0]; // [team1, team2]

  for (let i = 0; i < INFO.participants.length; i++) {
    let participantDto = INFO.participants[i];
    let PLAYER_INFO = {
      SUMMONER: {
        NAME: participantDto.summonerName,
        ID: participantDto.summonerId,
      },
      WIN: participantDto.win === 1,
      CHAMPION: {
        ID: participantDto.championId,
        NAME: participantDto.championName,
        LEVEL: participantDto.champLevel,
      },
      INGAME_INDEX: {
        KDA: {
          KILL: participantDto.kills,
          DEATH: participantDto.deaths,
          ASSIST: participantDto.assists,
        },
        GOLD: participantDto.goldEarned,
        DAMAGE: {
          TO_CHAMPION: participantDto.totalDamageDealtToChampions,
          TOTAL: participantDto.totalDamageDealt,
        },
        WARDS: {
          CONTROL: participantDto.challenges.controlWardsPlaced,
          PLACED: participantDto.wardsplaced,
          KILLED: participantDto.wardskilled,
        },
        CS: {
          // 수정 필요 - CS란 무엇인가? (미니언 + 정글몹 + 적 와드?)
          TOTAL: participantDto.totalMinionsKilled,
          PER_MINUTE:
            participantDto.totalMinionsKilled / (INFO.gameDuration / 6000),
        },
      },
      RUNES: participantDto.perks.styles[0].selections.map(
        (selection) => selection.perk
      ), // 총 4개
      SPELLS: participantDto.perks.styles[1].selections.map(
        (selection) => selection.perk
      ), // 총 4개
      ITEMS: [
        participantDto.item0,
        participantDto.item1,
        participantDto.item2,
        participantDto.item3,
        participantDto.item4,
        participantDto.item5,
        participantDto.item6,
      ], // 총 7개
    };

    PLAYERS.push(PLAYER_INFO);

    if (participantDto.teamId === 100) {
      // team1
      TOTAL_GOLDS[0] += parseInt(PLAYER_INFO.INGAME_INDEX.GOLD);
      TOTAL_KILLS[0] += parseInt(PLAYER_INFO.INGAME_INDEX.KDA.KILL);
    } else {
      // team2
      TOTAL_GOLDS[1] += parseInt(PLAYER_INFO.INGAME_INDEX.GOLD);
      TOTAL_KILLS[1] += parseInt(PLAYER_INFO.INGAME_INDEX.KDA.KILL);
    }
  }

  const TARGET_SUMMONER = PLAYERS.filter(
    (player) => player.SUMMONER.ID === TARGET_SUMMONER_ID
  )[0];

  const SUMMONERS = PLAYERS.map((player) => ({
    SUMMONER_NAME: player.SUMMONER_NAME,
    CHAMPION: player.CHAMPION,
  }));

  const summarizedInfo = {
    GAME_CREATOION: INFO.gameCreation,
    GAME_DURATION: INFO.gameDuration,
    TARGET_SUMMONER,
    SUMMONERS,
  };

  const extraInfo = {
    TEAM1_INDEX: {
      BARON_KILLS: INFO.teams[0].objectives.baron.kills,
      DRAGON_KILLS: INFO.teams[0].objectives.dragon.kills,
      TOWER_KILLS: INFO.teams[0].objectives.tower.kills,
    },
    TEAM2_INDEX: {
      BARON_KILLS: INFO.teams[1].objectives.baron.kills,
      DRAGON_KILLS: INFO.teams[1].objectives.dragon.kills,
      TOWER_KILLS: INFO.teams[1].objectives.tower.kills,
    },
    TOTAL_GOLDS,
    TOTAL_KILLS,
    PLAYERS,
  };

  const D3MatchInfo = {
    SUMMARIZED_INFO: summarizedInfo,
    EXTRA_INFO: extraInfo,
  };

  res.json(D3MatchInfo);
});

app.listen(4000, function () {
  console.log(
    "CORS-enabled web server listening on port http://localhost:4000"
  );
}); // localhost:4000
