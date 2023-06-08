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

// depth 1: summonerName에서 ppu_id, 프로필 아이콘 id, 소환사 레벨, 최근 게임 시점 추출
async function getD1Info(summonerName) {
  try {
    const res = await axios.get(
      `${base.SERVER_KR}/lol/summoner/v4/summoners/by-name/${summonerName}/?api_key=${base.API_KEY}`
    );

    return {
      summoner_info: {
        id: res.data.id,
        ppu_id: res.data.puuid,
        profile_icon_id: res.data.profileIconId,
        summoner_level: res.data.summonerLevel,
        revision_date: res.data.revisionDate,
      },
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
async function getD2BasicInfo(id) {
  try {
    const res = await axios.get(
      `${base.SERVER_KR}/lol/league/v4/entries/by-summoner/${id}?api_key=${base.API_KEY}`
    );

    let flex_info = {};
    let solo_info = {};

    res.data.forEach((queue) => {
      const { queueType, tier, rank, wins, losses, leaguePoints, inactive } =
        queue;

      // 승률 계산
      const win_rate =
        wins + losses === 0 ? 0 : ((wins / (wins + losses)) * 100).toFixed(2);

      let queue_info = {
        tier,
        rank,
        wins,
        losses,
        league_points: leaguePoints,
        win_rate,
        is_active: inactive,
      };

      const isFlex = /FLEX/.test(queueType); // 자유랭크인지 확인
      if (isFlex) {
        flex_info = queue_info;
      } else {
        solo_info = queue_info;
      }
    });

    return {
      flex_info,
      solo_info,
    };
  } catch (err) {
    console.log(err);
  }
}

app.get("/depth2BasicInfo", async (req, res) => {
  const id = req.query.id;
  const D2BasicInfo = await getD2BasicInfo(id);
  res.json(D2BasicInfo);
});

// TODO [n, n+count) 사이로 변경
// depth 2: PPUID에서 최근 [n번째, n+개수) 사이 게임 ID 추출
async function getD2MatchInfo(ppuId) {
  const START = 0;
  const COUNT = 10;

  try {
    const res = await axios.get(
      `${base.SERVER_ASIA}/lol/match/v5/matches/by-puuid/${ppuId}/ids?start=${START}&count=${COUNT}&api_key=${base.API_KEY}`
    );

    return {
      match_id_list: res.data,
    };
  } catch (err) {
    console.log(err);
  }
}

app.get("/depth2MatchInfo", async (req, res) => {
  const ppuId = req.query.ppuId;
  const D2MatchInfo = await getD2MatchInfo(ppuId);
  res.json(D2MatchInfo);
});

// depth 3: 각 GAMEID에서 해당 게임 정보 추출
async function getD3MatchInfo(MATCH_ID) {
  try {
    const res = await axios.get(
      `${base.SERVER_ASIA}/lol/match/v5/matches/${MATCH_ID}?api_key=${base.API_KEY}`
    );

    return {
      MATCH_INFO: res.data,
    };
  } catch (err) {
    console.log(err);
  }
}

app.get("/depth3MatchInfo", async (req, res) => {
  const MATCH_ID = req.query.matchId;
  const TARGET_SUMMONER_ID = req.query.targetSummonerId;
  const SPELL_DICT = {
    1: "summonerBoost",
    3: "summonerExhaust",
    4: "summonerFlash",
    6: "summonerHaste",
    7: "summonerHeal",
    11: "summonerSmite",
    12: "summonerTeleport",
    13: "summonerMana",
    14: "summonerDot",
    21: "summonerBarrier",
    30: "summonerPoroRecall",
    31: "summonerPoroThrow",
    32: "summonerSnowball",
    39: "summonerSnowURFSnowball_Mark",
    54: "summoner_UltBookPlaceholder",
    55: "summoner_UltBookSmitePlaceholder",
  };

  const response = await getD3MatchInfo(MATCH_ID);

  const INFO = response?.MATCH_INFO.info;
  if (INFO === undefined) {
    return;
  }

  let players = []; // [team1P1, team1P2, team1P3, team1P4, team1P5, team2P1, team2P2, team2P3, team2P4, team2P5]
  let total_golds = [0, 0]; // [team1, team2]
  let total_kills = [0, 0]; // [team1, team2]

  for (let i = 0; i < INFO.participants.length; i++) {
    let participantDto = INFO.participants[i];
    let player_info = {
      summoner: {
        name: participantDto.summonerName,
        id: participantDto.summonerId,
      },
      win: participantDto.win === 1,
      champion: {
        id: participantDto.championId,
        name: participantDto.championName,
        level: participantDto.champLevel,
      },
      in_game_index: {
        KDA: {
          kills: participantDto.kills,
          deaths: participantDto.deaths,
          assists: participantDto.assists,
        },
        gold: participantDto.goldEarned,
        damage: {
          to_champion: participantDto.totalDamageDealtToChampions,
          total: participantDto.totalDamageDealt,
        },
        wards: {
          control: participantDto.challenges.controlWardsPlaced,
          placed: participantDto.wardsplaced,
          killed: participantDto.wardskilled,
        },
        CS: {
          // 수정 필요 - CS란 무엇인가? (미니언 + 정글몹 + 적 와드?)
          total: participantDto.totalMinionsKilled,
          per_minute:
            participantDto.totalMinionsKilled / (INFO.gameDuration / 6000),
        },
      },
      rune: participantDto.perks.styles[0].selections[0].perk,
      rune_style: participantDto.perks.styles[0].style,
      spells: [
        SPELL_DICT[participantDto.summoner1Id],
        SPELL_DICT[participantDto.summoner2Id],
      ],
      items: [
        participantDto.item0,
        participantDto.item1,
        participantDto.item2,
        participantDto.item3,
        participantDto.item4,
        participantDto.item5,
        participantDto.item6,
      ], // 총 7개
    };

    players.push(player_info);

    if (participantDto.teamId === 100) {
      // team1
      total_golds[0] += parseInt(player_info.in_game_index.gold);
      total_kills[0] += parseInt(player_info.in_game_index.KDA.kills);
    } else {
      // team2
      total_golds[1] += parseInt(player_info.in_game_index.gold);
      total_kills[1] += parseInt(player_info.in_game_index.KDA.kills);
    }
  }

  let target_summoner = players.filter(
    (player) => player.summoner.id === TARGET_SUMMONER_ID
  )[0];

  const summoners = players.map((player) => ({
    summoner_name: player.summoner_name,
    champion: player.champion,
  }));

  const summarizedInfo = {
    game_creation: INFO.gameCreation,
    game_duration: INFO.gameDuration,
    target_summoner,
    summoners,
  };

  const extraInfo = {
    team1_index: {
      bardon_kills: INFO.teams[0].objectives.baron.kills,
      dragon_kills: INFO.teams[0].objectives.dragon.kills,
      tower_kills: INFO.teams[0].objectives.tower.kills,
    },
    team2_index: {
      baron_kills: INFO.teams[1].objectives.baron.kills,
      dragon_kills: INFO.teams[1].objectives.dragon.kills,
      tower_kills: INFO.teams[1].objectives.tower.kills,
    },
    total_golds,
    total_kills,
    players,
  };

  const D3MatchInfo = {
    summarized_info: summarizedInfo,
    extra_info: extraInfo,
  };

  res.json(D3MatchInfo);
});

app.listen(4000, function () {
  console.log(
    "CORS-enabled web server listening on port http://localhost:4000"
  );
}); // localhost:4000
