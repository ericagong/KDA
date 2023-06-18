import { getRecentImageURL } from '../../shared/utils'
import styled from 'styled-components'

const Rank = ({ type, tier, rank, league_points, wins, losses, win_rate }) => {
  return (
    <Container>
      <Type>{`${type} 랭크`}</Type>
      <InfoSection>
        <LeftSection>
          <Icon
            src={getRecentImageURL('tier', tier?.toLowerCase())}
            alt={`tier_${tier}-img`}
          />
        </LeftSection>
        <MiddleSection>
          <Tier>{`${tier} ${rank}`}</Tier>
          <div>{`${league_points} LP`}</div>
        </MiddleSection>
        <RightSection>
          <div>{`${wins}승 ${losses}패`}</div>
          <div>{`승률: ${win_rate}%`}</div>
        </RightSection>
      </InfoSection>
    </Container>
  )
}

export default Rank

const Container = styled.div`
  width: 332px;

  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.19);

  background: #31313c;

  line-height: 35px;
  font-size: 14px;
`

const Type = styled.div`
  padding: 0 10px;
  border-bottom: 1px solid #000;
`

const InfoSection = styled.div`
  display: flex;
  padding: 10px 10px;
  gap: 10px;
  height: 72px;
`

const LeftSection = styled.div`
  flex: 1;
`

const Tier = styled.div`
  font-size: 18px;
  color: #fff;
  font-weight: 700;
`

const Icon = styled.img`
  height: 100%;

  background: #2828306c;
  border-radius: 50%;
`

const MiddleSection = styled.div`
  flex: 2;
`

const RightSection = styled.div`
  flex: 2;
  text-align: right;
`
