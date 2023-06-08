import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apis } from '../shared/axios'
import useDidMountEffect from '../hooks/useDidMountEffect'
import SearchBar from '../components/SearchBar'
import Profile from '../components/single/Profile'
import QueueSummary from '../components/single/QueueSummary'

const SingleSearch = () => {
  const params = useParams()
  const [summonerName, setSummonerName] = useState(params.summonerName)
  const [summonerInfo, setSummonerInfo] = useState({})
  const [flexInfo, setFlexInfo] = useState([])
  const [soloInfo, setSoloInfo] = useState([])
  const [matchIdList, setMatchIdList] = useState([])
  const [matchInfoList, setMatchInfoList] = useState([])

  useEffect(() => {
    const getSummonerInfo = async () => {
      try {
        const res = await apis.get_depth1_info(summonerName)
        console.log(`[getSummonerInfo] res.data: ${JSON.stringify(res.data)}`)
        setSummonerInfo(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getSummonerInfo()
  }, [summonerName])

  useDidMountEffect(() => {
    const getSeasonInfo = async () => {
      try {
        const res = await apis.get_depth2_basic_info(summonerInfo.ID)
        console.log(`[getSeasonInfo] res.data: ${JSON.stringify(res.data)}`)
        const { FLEX, SOLO } = res.data
        setFlexInfo(FLEX)
        setSoloInfo(SOLO)
      } catch (err) {
        console.log(err)
      }
    }
    async function getMatchIdList() {
      try {
        const res = await apis.get_depth2_match_info(summonerInfo.PPUID)

        console.log(
          `[getMatchIdList] res.data: ${JSON.stringify(res.data.MATCHES)}`,
        )

        setMatchIdList((prev) => [...prev, ...res.data.MATCHES])
      } catch (err) {
        console.log(err)
      }
    }

    console.log(`** Changed summonerInfo: ${JSON.stringify(summonerInfo)}
  		Call getSeasonInfo(),
  		Call getMatchIdList()
  	`)

    // state 간 연관성 없어 race condition 고려 안함
    getSeasonInfo()
    getMatchIdList()
  }, [summonerInfo])

  useDidMountEffect(() => {
    const getMatchInfoList = async () => {
      try {
        const matchInfoList = await Promise.all(
          matchIdList.map(async (matchID) => {
            const res = await apis.get_depth3_match_info(
              matchID,
              summonerInfo.ID,
            )
            return res.data
          }),
        )

        // const matchInfoList = []
        // for (let i = 0; i < D2MatchInfo.length; i++) {
        //   const res = await apis.get_depth3_match_info(
        //     D2MatchInfo[i],
        //     D1Info.ID,
        //   )
        //   matchInfoList.push(res.data)
        // }
        console.log(
          `[getMatchInfoList] matchInfoList: ${JSON.stringify(matchInfoList)}`,
        )

        setMatchInfoList((prev) => [...prev, ...matchInfoList])
      } catch (err) {
        console.log(err)
      }
    }

    console.log(`** matchIDList Changed: ${JSON.stringify(matchIdList)}
  		Call getMatchInfoList
  	`)

    getMatchInfoList()
  }, [matchIdList])

  return (
    <>
      <h2>SingleSearch Page</h2>
      <SearchBar />
      <Profile {...summonerInfo} />
      <QueueSummary {...flexInfo} />
      <QueueSummary {...soloInfo} />
    </>
  )
}

export default SingleSearch
