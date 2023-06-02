import { useState, useEffect } from 'react'
import useDidMountEffect from '../hooks/useDidMountEffect'
import {
  parseSummonerNames,
  getListFromArr,
  getListFromObj,
  timeCalculator,
} from '../shared/utils'
import { apis } from '../shared/axios'
import { nanoid } from 'nanoid'

const getSimpleSearchFromArr = (arr) => {
  return (
    <>
      {arr?.length > 0
        ? arr.map((data, index) => {
            return (
              <>
                <h4 key={nanoid()}>{`Game ${index + 1}`}</h4>
                <ul className="depth-3-info">
                  <details>
                    <summary>요약 보기</summary>
                    {getListFromObj(data.SUMMARIZED_INFO)}
                  </details>
                  <details>
                    <summary>상세 보기</summary>
                    {getListFromObj(data.EXTRA_INFO)}
                  </details>
                </ul>
              </>
            )
          })
        : 'no info :('}
    </>
  )
}

const Apis = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [summonerNames, setSummonerNames] = useState([])
  const [D1Info, setD1Info] = useState({})
  const [D2BasicInfo, setD2BasicInfo] = useState({})
  const [D2MatchInfo, setD2MatchInfo] = useState([])
  const [D3MatchesInfo, setD3MatchesInfo] = useState([])
  const [times, setTimes] = useState({})

  const submitHandler = (e) => {
    e.preventDefault()
  }

  const changeHandler = (e) => {
    const names = e.target.value

    const parsedNames = parseSummonerNames(names)

    setIsLoading(true)
    setSummonerNames(parsedNames)
  }

  const clickHandler = async (e) => {
    // TODO multiSearch도 구현
    console.log(`[clickHandler] summonerNames: ${summonerNames}`)

    // singleSearch
    try {
      // 1. D1 Info 가져오기
      const start = new Date()
      const res = await apis.get_depth1_info(summonerNames[0])
      const end = new Date()
      setTimes({ ...times, D1: timeCalculator(start, end) })

      console.log(`[clickHandler] res.data: ${JSON.stringify(res.data)}`)

      setD1Info(res.data)
      setIsLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  // CHECK D2Basic 미반영 이슈 -> 해결 (useState 파이프라이닝)
  useDidMountEffect(() => {
    async function getD2BasicInfo() {
      try {
        // TODO D2Basic Time 미반영 이슈
        // 2-A. D2 Basic Info 가져오기
        const start = new Date()
        const res = await apis.get_depth2_basic_info(D1Info.ID)
        const end = new Date()

        setTimes((prev) => ({ ...prev, D2Basic: timeCalculator(start, end) }))

        setD2BasicInfo(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    async function getD2MatchInfo() {
      try {
        // 2-B. D2 Match Info 가져오기
        const start = new Date()
        const res = await apis.get_depth2_match_info(D1Info.PPUID)
        const end = new Date()

        setTimes((prev) => ({ ...prev, D2Match: timeCalculator(start, end) }))

        setD2MatchInfo(res.data.MATCHES)
      } catch (err) {
        console.log(err)
      }
    }

    console.log(`D1Info Changed: ${JSON.stringify(D1Info)}
			Call getD2BasicInfo(),
			Call getD2MatchInco()
		`)

    // TODO 동시 처리 효율성 고려하기
    getD2BasicInfo()
    getD2MatchInfo()
  }, [D1Info])

  useDidMountEffect(() => {
    async function getMatchesInfo() {
      try {
        // 2. D3 각 게임별 Match Info 가져오기
        const start = new Date()
        const matchInfoList = []
        for (let i = 0; i < D2MatchInfo.length; i++) {
          const res = await apis.get_depth3_match_info(
            D2MatchInfo[i],
            D1Info.ID,
          )
          matchInfoList.push(res.data)
        }

        const end = new Date()
        setTimes((prev) => ({ ...prev, D3Match: timeCalculator(start, end) }))

        setD3MatchesInfo(matchInfoList)
      } catch (err) {
        console.log(err)
      }
    }

    console.log(`D2MatchInfo Changed: ${JSON.stringify(D2MatchInfo)}
			Call getMatchInfo
		`)

    getMatchesInfo()
  }, [D2MatchInfo])

  useEffect(() => {
    console.log(`
			[useEffect]
				times: ${JSON.stringify(times)}
				D1Info: ${JSON.stringify(D1Info)}
				D2BasicInfo: ${JSON.stringify(D2BasicInfo)}
				D2MatchInfo: ${JSON.stringify(D2MatchInfo)}
				D3MatchesInfo: ${JSON.stringify(D3MatchesInfo)}
		`)
  }, [D3MatchesInfo])

  return (
    <>
      <h1>Check APIs</h1>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="summoner1, summoner2, ..."
          style={{ width: 300 }}
          onChange={changeHandler}
        />
        <button onClick={clickHandler}>call apis</button>
      </form>
      <section id="depth-0">
        <h2>depth-0 by 검색어</h2>
        <h3>{`검색 소환자명 parsing`}</h3>
        <ul id="depth-0-info">{getListFromArr(summonerNames)}</ul>
      </section>
      <section id="depth-1">
        <h2>depth-1 by 소환사명</h2>
        <h3>{`소환사 관련 정보 (소요시간: ${times.D1} ms)`}</h3>
        {isLoading ? (
          <>Loading...</>
        ) : (
          <ul id="depth-1-info">{getListFromObj(D1Info)}</ul>
        )}
      </section>
      <section className="depth-2">
        <h2>depth-2 by ID</h2>
        <h3>{`소환사 관련 기본 정보 (소요시간: ${times.D2Basic} ms)`}</h3>
        {isLoading ? (
          <>Loading...</>
        ) : (
          <ul className="depth-2-info">{getListFromObj(D2BasicInfo)}</ul>
        )}
      </section>
      <section className="depth-2">
        <h2>depth-2 by PPUID</h2>
        <h3>{`소환사 최근 플레이 게임 ID 정보 (소요시간: ${times.D2Match} ms)`}</h3>
        {isLoading ? (
          <>Loading...</>
        ) : (
          <ul className="depth-2-info">{getListFromArr(D2MatchInfo)}</ul>
        )}
      </section>
      <section id="depth-3">
        <h2>depth-3</h2>
        <h3>{`소환사 최근 10게임 요약 정보 (소요시간: ${times.D3Match} ms)`}</h3>
        {isLoading ? (
          <>Loading...</>
        ) : (
          <>{getSimpleSearchFromArr(D3MatchesInfo)}</>
        )}
      </section>
    </>
  )
}

export default Apis
