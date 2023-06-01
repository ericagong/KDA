var express = require("express");
var cors = require("cors");

const axios = require("axios");

var app = express();

app.use(cors());

const API_KEY = "RGAPI-7e59f636-b3c4-4b1e-aac1-a15c21d7bbda";

async function getSummonerPUUID(summonerName) {
  try {
    const res = await axios.get(
      `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}/?api_key=${API_KEY}`
    );
    console.log(res.data);
    return res.data.puuid;
  } catch (err) {
    console.log(err);
  }
}

// GET past 5 Games by Summoner Name
// GET localhost:4000/past5Games
app.get("/past5Games", async (req, res) => {
  const summonerName = req.query.summonerName; // PUUID
  // PUUID
  const PUUID = await getSummonerPUUID(summonerName);
  console.log(`PUUID: ${PUUID}`);

  const API_CALL = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${PUUID}/ids?start=0&count=5&api_key=${API_KEY}`;

  try {
    // get API_CALL
    // its going to give us a list of game IDs
    const res = await axios.get(API_CALL);

    // a list of game ID strings
    const GAME_IDs = res.data;

    console.log(`GAME_IDs: ${GAME_IDs}`);

    // loop through the list of game IDs
    // at each game ID, get the information (kda, cs, etc)
    var MATCHED_DATA_ARRAY = [];
    for (var i = 0; i < GAME_IDs.length; i++) {
      const matchID = GAME_IDs[i];
      const res = await axios.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${API_KEY}`
      );
      const MATCH_DATA = res.data;
      MATCHED_DATA_ARRAY.push(MATCH_DATA);
    }

    console.log(`MATCHED_DATA_ARRAY: ${MATCHED_DATA_ARRAY}`);
  } catch (err) {
    console.log(err);
  }

  // save info above in array, give an array as JSON response to client
  // [Game1Obh, Game2Obj, Game3Obj, Game4Obj, Game5Obj]
  res.json(MATCHED_DATA_ARRAY); // sent to client
});

app.listen(4000, function () {
  console.log(
    "CORS-enabled web server listening on port http://localhost:4000"
  );
}); // localhost:4000
