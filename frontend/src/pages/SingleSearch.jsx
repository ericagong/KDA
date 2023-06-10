import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apis } from '../shared/axios'
import useDidMountEffect from '../hooks/useDidMountEffect'
import Container from '../components/PageLayout'
import SearchBar from '../components/SearchBar'
import Profile from '../components/single/Profile'
import Rank from '../components/single/Rank'
import MatchList from '../components/single/MatchList'
import styled from 'styled-components'

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
        const {
          data: { summoner_info },
        } = await apis.get_depth1_info(summonerName)

        setSummonerInfo(summoner_info)
      } catch (err) {
        console.log(err)
      }
    }
    getSummonerInfo()
  }, [summonerName])

  useDidMountEffect(() => {
    const getSeasonInfo = async () => {
      try {
        const {
          data: { flex_info, solo_info },
        } = await apis.get_depth2_basic_info(summonerInfo.id)

        setFlexInfo(flex_info)
        setSoloInfo(solo_info)
      } catch (err) {
        console.log(err)
      }
    }
    async function getMatchIdList() {
      try {
        const {
          data: { match_id_list },
        } = await apis.get_depth2_match_info(summonerInfo.ppu_id)

        console.log(match_id_list)
        setMatchIdList((prev) => [...prev, ...match_id_list])
      } catch (err) {
        console.log(err)
      }
    }
    // state 간 연관성 없어 race condition 고려 안함
    getSeasonInfo()
    getMatchIdList()
  }, [summonerInfo])

  useDidMountEffect(() => {
    const getMatchInfoList = async () => {
      try {
        const matchInfoList = await Promise.all(
          matchIdList.map(async (matchId) => {
            const res = await apis.get_depth3_match_info(
              matchId,
              summonerInfo.id,
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

    getMatchInfoList()
  }, [matchIdList])

  return (
    <Container>
      <SearchBar />
      <SearchResultSection>
        <Profile summonerName={summonerName} {...summonerInfo} />
        <Rank type="자유" {...flexInfo} />
        {/* <Rank type="솔로" {...soloInfo} /> */}
        {/* <MatchList matchInfoList={matchInfoList} /> */}
      </SearchResultSection>
    </Container>
  )
}

export default SingleSearch

const SearchResultSection = styled.div`
  margin-top: 50px;

  line-height: 30px;
  font-size: 12px;
  color: #7b7a8e;
`
