import { useLocation } from 'react-router-dom'
import SearchBar from '../components/SearchBar'

const MultiSearch = () => {
  const location = useLocation()

  console.log(location.state.summonerNames)

  return (
    <>
      <h2>MultiSearch Page</h2>
      <SearchBar />
    </>
  )
}

export default MultiSearch
