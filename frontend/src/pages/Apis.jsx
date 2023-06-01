import { useState, useEffect } from 'react'
import { parseSummonerNames } from '../shared/utils'
import { apis } from '../shared/axios'

const getListFromArr = (arr) => {
  return (
    <>
      {arr.length > 0
        ? arr.map((item, index) => <li key={index}>{item}</li>)
        : 'no info :('}
    </>
  )
}

const getListFromObj = (obj) => {
  return (
    <>
      {obj
        ? Object.entries(obj).map(([k, v], index) => (
            <li key={index}>{`${k}: ${v}`}</li>
          ))
        : 'no info :('}
    </>
  )
}

const Apis = () => {
  const [summonerNames, setSummonerNames] = useState([])
  const [D1Info, setD1Info] = useState([])
  const [D2BasicInfo, setD2BasicInfo] = useState([])
  const [D2MatchInfo, setD2MatchInfo] = useState([])
  const [gameList, setGameList] = useState([])

  const submitHandler = (e) => {
    e.preventDefault()
  }

  const changeHandler = (e) => {
    const names = e.target.value

    const parsedNames = parseSummonerNames(names)

    setSummonerNames(parsedNames)
  }

  const clickHandler = async (e) => {
    // TODO multiSearch도 구현
    console.log(`[clickHandler] summonerNames: ${summonerNames}`)

    // singleSearch
    try {
      // 1. D1 Info 가져오기
      const res = await apis.get_depth1_info(summonerNames[0])
      setD1Info(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    async function getD2BasicInfo() {
      try {
        // 2. D2 Basic Info 가져오기
        const res = await apis.get_depth2_basic_info(D1Info.ID)
        setD2BasicInfo(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    async function getD2MatchInfo() {
      try {
        // 2. D2 Match Info 가져오기
        const res = await apis.get_depth2_match_info(D1Info.PPUID)
        setD2MatchInfo(res.data.MATCHES)
      } catch (err) {
        console.log(err)
      }
    }
    console.log(`D1Info: ${JSON.stringify(D1Info)}`)

    // TODO 동시 처리 효율성 고려하기
    getD2BasicInfo()
    getD2MatchInfo()
  }, [D1Info])

  useEffect(() => {
    console.log(`D2BasicInfo: ${JSON.stringify(D2BasicInfo)}`)
  }, [D2BasicInfo])

  useEffect(() => {
    console.log(`D2MatchInfo: ${JSON.stringify(D2MatchInfo)}`)
  }, [D2MatchInfo])

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
        <h3>소환사명</h3>
        <ul id="depth-0-info">{getListFromArr(summonerNames)}</ul>
      </section>
      <section id="depth-1">
        <h2>depth-1 by 소환사명</h2>
        <h3>소환사 관련 정보</h3>
        <ul id="depth-1-info">{getListFromObj(D1Info)}</ul>
      </section>
      <section className="depth-2">
        <h2>depth-2 by ID</h2>
        <h3>소환사 관련 기본 정보</h3>
        <ul className="depth-2-info">{getListFromObj(D2BasicInfo)}</ul>
      </section>
      <section className="depth-2">
        <h2>depth-2 by PPUID</h2>
        <h3>소환사 최근 플레이 게임 ID 정보</h3>
        <ul className="depth-2-info">{getListFromArr(D2MatchInfo)}</ul>
      </section>
      <section id="depth-3">
        <h2>depth-3</h2>
        <ul id="depth-3-info">
          <li>summonerName</li>
        </ul>
      </section>
    </>
  )
}

export default Apis
