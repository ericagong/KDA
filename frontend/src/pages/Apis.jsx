import { useState } from 'react'
import { parseSummonerNames } from '../shared/utils'
import { apis } from '../shared/axios'

const Apis = () => {
  const [summonerNames, setSummonerNames] = useState([])
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
    // TODO depth-1 api 호출
    console.log(summonerNames)
    try {
      const res = await apis.single_search(summonerNames[0])
      console.log(res)
      setGameList(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  console.log(gameList)

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
        <h2>depth-0</h2>
        <h3>소환사명</h3>
        <ul id="depth-0-info">
          {summonerNames.length > 0
            ? summonerNames.map((name, index) => <li key={index}>{name}</li>)
            : 'no summoner names'}
        </ul>
      </section>
      <section id="depth-1">
        <h2>depth-1</h2>
        <ul id="depth-1-info">
          <li>summonerName</li>
        </ul>
      </section>
      <section id="depth-2">
        <h2>depth-2</h2>
        <ul id="depth-2-info">
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
