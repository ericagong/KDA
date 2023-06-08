const QueueSummary = ({
  QUEUE_TYPE,
  TIER,
  RANK,
  LEAGUE_POINTS,
  WINS,
  LOSSES,
  WIN_RATE,
}) => {
  return (
    <>
      <h4>{`${QUEUE_TYPE} RANK`}</h4>
      <div className="queue-index-container">
        <div className="season-tier">{`티어: ${TIER} ${RANK}`}</div>
        <div className="season-league-points">{`리그 포인트: ${LEAGUE_POINTS}`}</div>
        <div className="season-wins-loses">{`${WINS}승 ${LOSSES}패`}</div>
        <div className="season-win-rate">{`승률: ${WIN_RATE?.toFixed(
          2,
        )}%`}</div>
      </div>
    </>
  )
}

export default QueueSummary
