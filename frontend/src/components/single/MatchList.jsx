import MatchSummary from './MatchSummary'

const MatchList = ({ MATCH_INFO_LIST }) => {
  const matchList = MATCH_INFO_LIST.map((matchInfo) => {
    return (
      <>
        <MatchSummary {...matchInfo.SUMMARIZED_INFO} />
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
