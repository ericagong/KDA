const calcTime = (timestamp) => {
  const today = new Date()
  const playedDate = new Date(timestamp)
  const timeDiff = today.getTime() - playedDate.getTime()

  const monthDiff = parseInt(timeDiff / (1000 * 3600 * 24 * 30))
  const dayDiff = parseInt(timeDiff / (1000 * 3600 * 24))
  const hourDiff = parseInt(timeDiff / (1000 * 3600))
  const minuteDiff = parseInt(timeDiff / (1000 * 60))

  if (monthDiff > 0) return `${monthDiff}달 전`
  if (dayDiff > 0) return `${dayDiff}일 전`
  if (hourDiff > 0) return `${hourDiff}시간 전`
  if (minuteDiff > 0) return `${minuteDiff}분 전`
  else return `방금 전`
}

const calcDuration = (timeInSec) => {
  const minutes = parseInt(timeInSec / 60)
  const seconds = timeInSec % 60

  if (minutes === 0) return `${seconds}초`
  if (seconds === 0) return `${minutes}분`
  return `${minutes}분 ${seconds}초`
}

const MatchSummary = ({ game_creation, game_duration }) => {
  const getSummonerChampionInfo = (summoner) => {
    return (
      <>
        <div>
          <div>
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/13.11.1/img/champion/${summoner.CHAMPION.NAME}.png`}
              alt="summoner-champion-img"
            />
            <div className="summoner-champion-level">
              {summoner.CHAMPION.LEVEL}
            </div>
          </div>
          <div>
            <img
              src={`https://opgg-static.akamaized.net/meta/images/lol/spell/${summoner.SPELLS[0]}.png`}
              alt="summoner-spell-img"
            />
            <img
              src={`https://opgg-static.akamaized.net/meta/images/lol/spell/${summoner.SPELLS[1]}.png`}
              alt="summoner-spell-img"
            />
          </div>
          <div>
            <img
              src={`https://opgg-static.akamaized.net/meta/images/lol/perk/${summoner.RUNE}.png`}
              alt="summoner-rune-style-img"
            />
            <img
              src={`https://opgg-static.akamaized.net/meta/images/lol/perkStyle/${summoner.RUNE_STYLE}.png`}
              alt="summoner-rune-style-img"
            />
          </div>
          <div>
            <div>{summoner.INGAME_INDEX.KDA.KILL}</div>
            <div>{summoner.INGAME_INDEX.KDA.DEATH}</div>
            <div>{summoner.INGAME_INDEX.KDA.ASSIST}</div>
          </div>
        </div>
        <div>
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
      <div>
        <div>
          <div>{`게임 시작 시간: ${calcTime(game_creation)}`}</div>
          <div>{`게임 진행 시간: ${calcDuration(game_duration)}`}</div>
        </div>
      </div>
    </>
  )
}

export default MatchSummary
