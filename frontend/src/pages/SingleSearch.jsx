import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import SearchBar from '../components/SearchBar'

const SingleSearch = () => {
  const location = useLocation()
  const [summonerName, setSummonerName] = useState(location.state.summonerName)

  console.log(summonerName)

  return (
    <>
      <h2>SingleSearch Page</h2>
      <SearchBar />
    </>
  )
}

export default SingleSearch
