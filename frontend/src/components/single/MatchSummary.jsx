import { getRecentImageURL } from '../../shared/utils'

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

const MatchSummary = ({
  game_creation,
  game_duration,
  target_summoner,
  summoners,
}) => {
  const {
    win,
    summoner: me,
    champion,
    rune,
    rune_style,
    spells,
    items,
    indexes,
  } = target_summoner
  const { KDA, kill_participations, control_wards, CS } = indexes
  const { blue_team, red_team } = summoners

  const getTeamSummoners = (team) => {
    return team.map((summoner, idx) => {
      return (
        <div key={idx}>
          <img
            src={getRecentImageURL('champion', summoner.championName)}
            alt={`champion_${summoner.championName}_img`}
          />
          <div>{summoner.summonerName}</div>
          {me.id === summoner.summonerId && <div>me</div>}
        </div>
      )
    })
  }

  return (
    <>
      <div>
        <h5>Summary</h5>
        <div>
          <div>솔랭</div>
          <div>{`게임 시작 시간: ${calcTime(game_creation)}`}</div>
          <div>{win ? '승리' : '패배'}</div>
          <div>{`게임 진행 시간: ${calcDuration(game_duration)}`}</div>
        </div>
        <div>
          <div>
            <img
              src={getRecentImageURL('champion', champion.name)}
              alt={`champion_${champion.name}_img`}
            />
            <div>{champion.level}</div>
          </div>
          <div>
            <img
              src={getRecentImageURL('rune', rune)}
              alt={`rune_${rune}_img`}
            />
            <img
              src={getRecentImageURL('runeStyle', rune_style)}
              alt={`rune_${rune_style}_img`}
            />
          </div>
          <div>
            {spells.map((spell, idx) => (
              <img
                key={idx}
                src={getRecentImageURL('spell', spell)}
                alt={`spell_${spell}_img`}
              />
            ))}
          </div>
          <div>
            {items.map((item, idx) => (
              <img
                key={idx}
                src={getRecentImageURL('item', item)}
                alt={`item_${item}_img`}
              />
            ))}
          </div>
        </div>
        <div>
          <div>
            <div>{`K ${KDA.kills}`}</div>
            <div>{`D ${KDA.deaths}`}</div>
            <div>{`A ${KDA.assists}`}</div>
          </div>
          <div>{`킬관여 ${kill_participations}`}</div>
          <div>{`제어 와드 ${control_wards}`}</div>
          <div>{`CS ${CS.total} (${CS.per_minute})`}</div>
        </div>
        <div>
          {getTeamSummoners(blue_team)}
          {getTeamSummoners(red_team)}
        </div>
      </div>
    </>
  )
}

export default MatchSummary
