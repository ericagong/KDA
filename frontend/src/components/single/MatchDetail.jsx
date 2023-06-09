import ChampRuneSpell from './ChampRuneSpell'
import KDAIndex from './KDAIndex'
import ItemList from './ItemList'

const MatchDetail = ({
  targetSummonerId,
  my_team,
  enemy_team,
  my_team_index,
  enemy_team_index,
}) => {
  const getPlayerInfo = (player) => {
    const { summary, extra } = player
    const { summonerName, summonerId } = summary
    const { indexes, ...champRunSpells } = extra
    const { KDA, damage, wards, CS, items } = indexes

    return (
      <>
        <div>
          <ChampRuneSpell {...champRunSpells} />
          <div>{summonerName}</div>
          {targetSummonerId === summonerId && <div>target!</div>}
          <div>
            <KDAIndex KDA={KDA} />
          </div>
          <div>
            <div>{`챔피언에게 가한 피해량: ${damage.to_champion}`}</div>
            <div>{`총 피해량: ${damage.total}`}</div>
          </div>
          <div>
            <div>{`받은 피해량: ${damage.taken}`}</div>
          </div>
          <div>
            <div>{`제어 와드: ${wards.control}`}</div>
            <div>{`와드 설치: ${wards.placed}`}</div>
            <div>{`와드 제거: ${wards.killed}`}</div>
          </div>
          <div>
            <div>{`CS: ${CS.total} (분당 ${CS.per_minute})`}</div>
          </div>
          <div>
            <ItemList items={items} />
          </div>
        </div>
      </>
    )
  }

  const getTeamInfo = (team) => {
    const { win, players } = team
    return (
      <>
        <div>{win === 1 ? '승리' : '패배'}</div>
        {players.map((player, idx) => {
          return <div key={idx}>{getPlayerInfo(player)}</div>
        })}
      </>
    )
  }

  const getObjectStatistics = (baronKills, dragonKills, towerKills) => {
    return (
      <>
        <div>{`baron kills: ${baronKills}`}</div>
        <div>{`dragon kills: ${dragonKills}`}</div>
        <div>{`tower kills: ${towerKills}`}</div>
      </>
    )
  }

  const getStatistcs = (myTeamIndex, enemyTeamIndex) => {
    return (
      <>
        <div>
          {getObjectStatistics(
            myTeamIndex.baron_kills,
            myTeamIndex.dragon_kills,
            myTeamIndex.tower_kills,
          )}
          <div>
            <div>{`${myTeamIndex.total_kills} vs ${enemyTeamIndex.total_kills}`}</div>
            <div>{`${myTeamIndex.total_golds} vs ${enemyTeamIndex.total_golds}`}</div>
          </div>
          {getObjectStatistics(
            enemyTeamIndex.baron_kills,
            enemyTeamIndex.dragon_kills,
            enemyTeamIndex.tower_kills,
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <h5>MatchDetail</h5>
      <div>{getTeamInfo(my_team)}</div>
      <div>{getStatistcs(my_team_index, enemy_team_index)}</div>
      <div>{getTeamInfo(enemy_team)}</div>
    </>
  )
}

export default MatchDetail
