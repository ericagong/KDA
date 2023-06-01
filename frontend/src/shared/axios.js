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
  get_depth2_basic_info: (ID) =>
    api.get(`/depth2BasicInfo`, { params: { ID } }),
  get_depth2_match_info: (PPUID) =>
    api.get(`/depth2MatchInfo`, { params: { PPUID } }),
  get_depth3_match_info: (MATCHID) =>
    api.get(`/depth3MatchInfo`, { params: { MATCHID } }),
};
