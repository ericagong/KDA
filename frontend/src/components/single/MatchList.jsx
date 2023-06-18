import MatchSummary from './MatchSummary'
import MatchDetail from './MatchDetail'

// TODO 클릭 시 MatchDetail 나오도록 Match 컴포넌트 생성
const MatchList = ({ matchInfoList }) => {
  const matchList = matchInfoList.map((matchInfo) => {
    return (
      <>
        <MatchSummary {...matchInfo.summarized_info} />
        {/* <MatchDetail {...matchInfo.extra_info} /> */}
      </>
    )
  })

  return <>{matchList}</>
}

export default MatchList
