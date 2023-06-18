import { getRecentImageURL, getTime } from '../../shared/utils'

const Profile = ({ profile_icon_id, summoner_level = 0, revision_date }) => {
  return (
    <>
      <h4>Profile</h4>
      <div className="profile-container">
        <div className="summoner-info-container">
          <div className="summoner-profile-icon">
            {profile_icon_id && (
              <img
                src={getRecentImageURL('profile_icon_id', profile_icon_id)}
                alt="profile-icon"
              />
            )}
            <div className="summoner-level">{`소환사 레벨: ${summoner_level}`}</div>
            <div className="summoner-revision-date">{`최근 변경일: ${getTime(
              revision_date,
            )}`}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
