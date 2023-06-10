import { getRecentImageURL } from '../../shared/utils'
import styled from 'styled-components'

const Rank = ({ type, tier, rank, league_points, wins, losses, win_rate }) => {
  return (
    <Container>
      <h4>{`${type} 랭크`}</h4>
      <div className="queue-index-container">
        <img
          src={getRecentImageURL('tier', tier?.toLowerCase())}
          alt="tier-img"
        />
        <div className="season-tier">{`티어: ${tier} ${rank}`}</div>
        <div className="season-league-points">{`리그 포인트: ${league_points}`}</div>
        <div className="season-wins-loses">{`${wins}승 ${losses}패`}</div>
        <div className="season-win-rate">{`승률: ${win_rate}%`}</div>
      </div>
    </Container>
  )
}

export default Rank

const Container = styled.div`
  width: 332px;
  background: #fff;

  line-height: 35px;
  font-size: 14px;
`
