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
  const matchId = req.query.matchId;
  const targetSummonerId = req.query.targetSummonerId;

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

  const response = await getD3MatchInfo(matchId);

  const INFO = response?.MATCH_INFO.info;

  if (INFO === undefined) {
    return;
  }

  // teamId 100: blue, 200: red
  let blueTeam = {
    win: 0,
    players: [],
    total_golds: 0,
    total_kills: 0,
  };
  let redTeam = {
    win: 0,
    players: [],
    total_golds: 0,
    total_kills: 0,
  };
  let target_summoner = {};
  let target_team_id = 100;

  for (let i = 0; i < INFO.participants.length; i++) {
    let participantDto = INFO.participants[i];
    let {
      summonerName,
      summonerId,
      teamId,
      win,
      championId,
      championName,
      champLevel,
      kills,
      deaths,
      assists,
      goldEarned,
      totalDamageDealtToChampions,
      totalDamageDealt,
      totalDamageTaken,
      totalMinionsKilled,
      wardsPlaced,
      wardsKilled,
      visionWardsBoughtInGame,
      item0,
      item1,
      item2,
      item3,
      item4,
      item5,
      item6,
      perks,
      summoner1Id,
      summoner2Id,
    } = participantDto;

    let player_info = {
      summary: {
        summonerName,
        summonerId,
        championName,
        win, // 1 = 승리, 0 = 패배
      },
      extra: {
        champion: {
          name: championName,
          id: championId,
          level: champLevel,
        },
        rune: perks.styles[0].selections[0].perk,
        rune_style: perks.styles[0].style,
        spells: [SPELL_DICT[summoner1Id], SPELL_DICT[summoner2Id]],
        indexes: {
          KDA: {
            kills,
            deaths,
            assists,
            score:
              deaths === 0
                ? "Perfect"
                : ((kills + assists) / deaths).toFixed(2),
            kill_participations: 0, // 팀 전체 킬 수 계산 후 변경
          },
          damage: {
            to_champion: totalDamageDealtToChampions,
            total: totalDamageDealt,
            taken: totalDamageTaken,
          },
          wards: {
            control: visionWardsBoughtInGame,
            placed: wardsPlaced,
            killed: wardsKilled,
          },
          CS: {
            total: totalMinionsKilled,
            per_minute: (totalMinionsKilled / (INFO.gameDuration / 60)).toFixed(
              1
            ),
          },
          items: [item0, item1, item2, item3, item4, item5, item6], // 총 7개
        },
      },
    };

    if (teamId === 100) {
      // teamBlue
      blueTeam.players.push(player_info);
      blueTeam.win = win;
      blueTeam.total_golds += goldEarned;
      blueTeam.total_kills += kills;
    } else {
      redTeam.players.push(player_info);
      redTeam.win = win;
      redTeam.total_golds += goldEarned;
      redTeam.total_kills += kills;
    }

    if (summonerId === targetSummonerId) {
      target_team_id = teamId;
      target_summoner = {
        win: win, // 1 = 승리, 0 = 패배
        summoner: {
          name: summonerName,
          id: summonerId,
        },
        champion: {
          name: championName,
          level: champLevel,
        },
        rune: perks.styles[0].selections[0].perk,
        rune_style: perks.styles[0].style,
        spells: [SPELL_DICT[summoner1Id], SPELL_DICT[summoner2Id]],
        items: [item0, item1, item2, item3, item4, item5, item6],
        indexes: {
          KDA: {
            kills,
            deaths,
            assists,
            score:
              deaths === 0
                ? "Perfect"
                : ((kills + assists) / deaths).toFixed(2),
          },
          kill_participations: 0, // 팀 전체 킬 수 계산 후 변경
          control_wards: visionWardsBoughtInGame,
          CS: {
            total: totalMinionsKilled,
            per_minute: (totalMinionsKilled / (INFO.gameDuration / 60)).toFixed(
              1
            ),
          },
        },
      };
    }
  }

  // 킬관여율 반영
  for (let i = 0; i < blueTeam.players.length; i++) {
    if (blueTeam.total_kills === 0) continue;
    else {
      blueTeam.players[i].extra.indexes.KDA.kill_participations =
        parseInt(
          ((blueTeam.players[i].summary.kills +
            blueTeam.players[i].summary.assists) /
            blueTeam.total_kills) *
            100
        ) + "%";
    }
  }
  for (let i = 0; i < redTeam.players.length; i++) {
    if (redTeam.total_kills === 0) continue;
    else {
      redTeam.players[i].extra.indexes.KDA.kill_participations =
        parseInt(
          ((redTeam.players[i].summary.kills +
            redTeam.players[i].summary.assists) /
            redTeam.total_kills) *
            100
        ) + "%";
    }
  }

  let summoners = {
    blue_team: blueTeam.players.map((player) => player.summary),
    red_team: redTeam.players.map((player) => player.summary),
  };

  const summarizedInfo = {
    game_creation: INFO.gameCreation,
    game_duration: INFO.gameDuration,
    target_summoner,
    summoners,
  };

  let blue_team_index = {
    bardon_kills: INFO.teams[0].objectives.baron.kills,
    dragon_kills: INFO.teams[0].objectives.dragon.kills,
    tower_kills: INFO.teams[0].objectives.tower.kills,
    total_kills: blueTeam.total_kills,
    total_golds: blueTeam.total_golds,
  };
  let red_team_index = {
    baron_kills: INFO.teams[1].objectives.baron.kills,
    dragon_kills: INFO.teams[1].objectives.dragon.kills,
    tower_kills: INFO.teams[1].objectives.tower.kills,
    total_kills: redTeam.total_kills,
    total_golds: redTeam.total_golds,
  };

  let myTeam = target_team_id === 100 ? blueTeam : redTeam;
  let enemyTeam = target_team_id === 100 ? redTeam : blueTeam;
  let myTeamIndex = target_team_id === 100 ? blue_team_index : red_team_index;
  let enemyTeamIndex =
    target_team_id === 100 ? red_team_index : blue_team_index;

  const extraInfo = {
    my_team: myTeam,
    enemy_team: enemyTeam,
    my_team_index: myTeamIndex,
    enemy_team_index: enemyTeamIndex,
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
