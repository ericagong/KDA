import { useState } from 'react'
import { parseSummonerNames } from '../shared/utils'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import styled from 'styled-components'

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

  const searchSummonerNameHandler = async () => {
    if (summonerNames.length === 0) {
      alert('소환사 이름을 입력해주세요.')
      return
    }

    const searchMode =
      summonerNames.length > 1 ? SEARCH_MODE.MULTI : SEARCH_MODE.SINGLE

    if (searchMode === SEARCH_MODE.SINGLE) {
      navigate(`/singlesearch/${summonerNames[0]}`)
    } else {
      // TODO multisearch 구현
      navigate(`/multisearch/${summonerNames.join(',')}`)
    }
  }

  return (
    <Container onSubmit={preventSubmitHandler}>
      <LeftSection>
        <Label>Search</Label>
        <Input
          type="text"
          placeholder="소환사명, 소환사명, ..."
          onChange={changeSummonerNameHandler}
        />
      </LeftSection>
      <Button
        onClick={searchSummonerNameHandler}
        disabled={summonerNames.length === 0}
      >
        <FaSearch color="#fff" size="20" />
      </Button>
    </Container>
  )
}

export default SearchBar

const Container = styled.form`
  display: flex;
  box-sizing: border-box;

  justify-content: space-around;
  align-items: center;
  margin: 0 auto;

  width: 800px;
  height: 70px;

  border-radius: 5px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.19);
  background-color: #31313c;

  color: white;
`

const LeftSection = styled.div`
  width: calc(100% - 140px);
`

const Label = styled.div`
  margin-bottom: 10px;
`

const Input = styled.input`
  width: 100%;
  border: none;
  background: inherit;
  color: #fff;

  outline: none;
`

const Button = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  background-color: transparent;

  :hover {
    cursor: pointer;
  }
`
