import { useState } from 'react'
import { parseSummonerNames } from '../shared/utils'
import { useNavigate } from 'react-router-dom'

const SEARCH_MODE = {
  SINGLE: 'single',
  MULTI: 'multi',
}

const SearchBar = () => {
  const navigate = useNavigate()
  const [summonerNames, setSummonerNames] = useState([])

  const preventSubmitHandler = (e) => {
    e.preventDefault()
  }

  const changeSummonerNameHandler = (e) => {
    const names = e.target.value

    const parsedNames = parseSummonerNames(names)

    setSummonerNames(parsedNames)
  }

  const searchSummonerNameHandler = () => {
    if (summonerNames.length === 0) {
      alert('소환사 이름을 입력해주세요.')
      return
    }

    const searchMode =
      summonerNames.length > 1 ? SEARCH_MODE.MULTI : SEARCH_MODE.SINGLE

    if (searchMode === SEARCH_MODE.SINGLE) {
      navigate('/singlesearch', {
        state: { summonerName: summonerNames[0] },
      })
    } else {
      navigate('/multisearch', {
        state: { summonerNames: summonerNames },
      })
    }
  }

  return (
    <>
      <form onSubmit={preventSubmitHandler}>
        <input
          type="text"
          placeholder="summoner1, summoner2, ..."
          style={{ width: 300 }}
          onChange={changeSummonerNameHandler}
        />
        <button
          onClick={searchSummonerNameHandler}
          disabled={summonerNames.length === 0}
        >
          검색
        </button>
      </form>
    </>
  )
}

export default SearchBar
