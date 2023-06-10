import { getRecentImageURL, calcTime } from '../../shared/utils'
import styled from 'styled-components'

// TODO 전적갱신 버튼 구현
const Profile = ({
  summonerName,
  profile_icon_id,
  summoner_level = 0,
  revision_date,
}) => {
  return (
    <Container>
      <IconSection>
        {profile_icon_id && (
          <Icon
            src={getRecentImageURL('profileIconId', profile_icon_id)}
            alt="profile-icon"
          />
        )}
        {summoner_level && <Level>{summoner_level}</Level>}
      </IconSection>
      <InfoSection>
        <Name>{summonerName}</Name>
        <div>{`최근 게임 진행: ${calcTime(revision_date)}`}</div>
        <Button>전적 갱신</Button>
      </InfoSection>
    </Container>
  )
}

export default Profile

// TODO background-color 제거
const Container = styled.div`
  display: flex;
  gap: 15px;
  box-sizing: border-box;

  padding: 20px 0%;

  background: #31313c;
`

const IconSection = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`

const Icon = styled.img`
  width: 100%;
  height: 100%;

  border-radius: 10px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.19);
`

const Level = styled.span`
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);

  padding: 0px 15px;
  border-radius: 10px;

  line-height: 20px;

  background: rgba(32, 45, 55, 0.8);
  color: #fff;
`

const InfoSection = styled.div`
  width: 80%;
`

const Name = styled.div`
  font-size: 25px;
  font-weight: 700;
  color: #fff;
`

const Button = styled.button`
  padding: 0px 13px;
  border: none;
  border-radius: 5px;
  height: 40px;

  background: rgba(121, 121, 122, 0.937);

  font-size: 14px;
  color: #fff;

  :hover {
    cursor: pointer;
    background: #490ee8;

    border: none;
    transition: 0.3s;
  }
`
