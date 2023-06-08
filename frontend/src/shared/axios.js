import axios from "axios";

const base = {
  proxy_server: "http://localhost:4000",
};

const api = axios.create({
  baseURL: base.proxy_server,
  headers: {
    // Origin: "https://developer.riotgames.com",
    "X-Riot-Token": process.env.REACT_APP_RIOT_API_KEY,
  },
});

export const apis = {
  // search
  get_depth1_info: (summonerName) =>
    api.get(`/depth1Info`, { params: { summonerName } }),
  get_depth2_basic_info: (id) =>
    api.get(`/depth2BasicInfo`, { params: { id } }),
  get_depth2_match_info: (ppuId) =>
    api.get(`/depth2MatchInfo`, { params: { ppuId } }),
  get_depth3_match_info: (matchId, targetSummonerId) =>
    api.get(`/depth3MatchInfo`, {
      params: { matchId, targetSummonerId },
    }),
};
