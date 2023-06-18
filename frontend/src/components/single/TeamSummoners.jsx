import { getRecentImageURL } from '../../shared/utils'
import styled from 'styled-components'

const TeamSummoners = ({ team, me }) => {
  const getTeamSummoners = (team) => {
    return team.map((summoner, idx) => {
      return (
        <Summoner key={idx}>
          <SquareImage
            src={getRecentImageURL('champion', summoner.championName)}
            alt={`champion_${summoner.championName}_img`}
          />
          <Name isMe={me.id === summoner.summonerId}>
            {summoner.summonerName}
          </Name>
        </Summoner>
      )
    })
  }

  return <Container>{getTeamSummoners(team)}</Container>
}

export default TeamSummoners

const Container = styled.div`
  margin-left: 10px;
`

const Summoner = styled.div`
  display: flex;
  gap: 5px;
  height: 24px;
`

const SquareImage = styled.img`
  display: block;

  box-sizing: border-box;

  margin: 1px 0;
  border-radius: 4px;
  width: 22px;
  height: 22px;
  background: #1c1c1f;
`

const Name = styled.div`
  color: ${(props) => (props.isMe ? '#fff' : 'inherit')};

  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`
