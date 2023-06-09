import MatchSummary from './MatchSummary'

const MatchList = ({ matchInfoList }) => {
  const matchList = matchInfoList.map((matchInfo) => {
    return (
      <>
        <MatchSummary {...matchInfo.summarized_info} />
      </>
    )
  })

  return (
    <>
      <h4>MatchList</h4>
      {matchList}
    </>
  )
}

export default MatchList
