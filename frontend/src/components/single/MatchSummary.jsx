import { getRecentImageURL } from '../../shared/utils'
import ChampRuneSpell from './ChampRuneSpell'
import ItemList from './ItemList'
import KDAIndex from './KDAIndex'

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
  const { KDA, control_wards, CS } = indexes
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
          <ChampRuneSpell
            champion={champion}
            rune={rune}
            rune_style={rune_style}
            spells={spells}
          />
          <div>
            <ItemList items={items} />
          </div>
        </div>
        <div>
          <KDAIndex KDA={KDA} />
          <div>{`킬관여 ${KDA.kill_participations}`}</div>
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
