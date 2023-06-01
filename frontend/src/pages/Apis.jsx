import { useState, useEffect } from 'react'
import { parseSummonerNames } from '../shared/utils'
import { apis } from '../shared/axios'

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
    getD2BasicInfo()
  }, [D1Info])

  console.log(`D1Info: ${D1Info}`)
  console.log(`D2BasicInfo: ${D2BasicInfo}`)

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
        <ul id="depth-0-info">
          {summonerNames.length > 0
            ? summonerNames.map((name, index) => <li key={index}>{name}</li>)
            : 'no summoner names :('}
        </ul>
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
        <ul className="depth-2-info">
          <li>summonerName</li>
        </ul>
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
