import { BrowserRouter, Routes, Route } from "react-router-dom";

import Apis from "./pages/Apis";
import Main from "./pages/Main";
import SingleSearch from "./pages/SingleSearch";
import MultiSearch from "./pages/MultiSearch";
import NotFound from "./pages/NotFound";

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dev">
          <Route path="apis" element={<Apis />} />
        </Route>
        <Route path="/" element={<Main />} />
        <Route path="/singlesearch/:summonerName" element={<SingleSearch />} />
        <Route path="/multisearch/:summonerNames" element={<MultiSearch />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
