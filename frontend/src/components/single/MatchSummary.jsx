import { getTime } from '../../shared/utils'

const MatchSummary = ({
  GAME_CREATION,
  GAME_DURATION,
  TARGET_SUMMONER,
  SUMMONERS,
}) => {
  const getSummonerChampionInfo = (summoner) => {
    return (
      <>
        <div className="match-summary-middle-top summoner-champion">
          <div className="summoner-champion-image-container">
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/13.11.1/img/champion/${summoner.CHAMPION.NAME}.png`}
              alt="summoner-champion-img"
            />
            <div className="summoner-champion-level">
              {summoner.CHAMPION.LEVEL}
            </div>
          </div>
          <div className="summoner-spells">
            <img
              src={`https://opgg-static.akamaized.net/meta/images/lol/spell/${summoner.SPELLS[0]}.png`}
              alt="summoner-spell-img"
            />
            <img
              src={`https://opgg-static.akamaized.net/meta/images/lol/spell/${summoner.SPELLS[1]}.png`}
              alt="summoner-spell-img"
            />
          </div>
          <div className="summoner-rune">
            <img
              src={`https://opgg-static.akamaized.net/meta/images/lol/perk/${summoner.RUNE}.png`}
              alt="summoner-rune-style-img"
            />
            <img
              src={`https://opgg-static.akamaized.net/meta/images/lol/perkStyle/${summoner.RUNE_STYLE}.png`}
              alt="summoner-rune-style-img"
            />
          </div>
          <div className="summoner-kda">
            <div className="summoner-kda-kills">
              {summoner.INGAME_INDEX.KDA.KILL}
            </div>
            <div className="summoner-kda-deaths">
              {summoner.INGAME_INDEX.KDA.DEATH}
            </div>
            <div className="summoner-kda-assists">
              {summoner.INGAME_INDEX.KDA.ASSIST}
            </div>
          </div>
        </div>
        <div className="match-summary-middle-bottom summoner-items">
          {summoner.ITEMS.map((itemID) => {
            return (
              <img
                src={`https://opgg-static.akamaized.net/meta/images/lol/item/${itemID}.png`}
                alt="summoner-item-img"
              />
            )
          })}
        </div>
      </>
    )
  }

  return (
    <>
      <div className="match-summary">
        <div className="match-summary-left">
          <div className="match-summary-left-top game-creatrion">{`게임 시작 시간: ${getTime(
            GAME_CREATION,
          )}`}</div>
          <div className="match-summary-left-bottom game-duration">{`게임 진행 시간: ${getTime(
            GAME_DURATION,
          )}`}</div>
        </div>
      </div>
    </>
  )
}

export default MatchSummary
