import { getTime } from '../../shared/utils'

const Profile = ({ PROFILE_ICON_ID, SUMMONER_LEVEL, REVISION_DATE }) => {
  return (
    <>
      <h4>Profile</h4>
      <div className="profile-container">
        <div className="summoner-info-container">
          <div className="summoner-profile-icon">
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/13.11.1/img/profileicon/${PROFILE_ICON_ID}.png`}
              alt="profile-icon"
            />
            <div className="summoner-level">{`소환사 레벨: ${SUMMONER_LEVEL}`}</div>
            <div className="summoner-revision-date">{`최근 변경일: ${getTime(
              REVISION_DATE,
            )}`}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
