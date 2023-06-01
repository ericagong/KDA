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
  single_search: (summonerName) =>
    api.get(`/past5Games`, { params: { summonerName } }),
};
