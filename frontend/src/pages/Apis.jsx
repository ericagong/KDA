import { useState } from 'react'
import SingleSearch from './SingleSearch'
import MultiSearch from './MultiSearch'

const Apis = () => {
  const [tab, setTab] = useState('Single-Search')

  const toggleSearchModeHandler = () => {
    if (tab === 'Single-Search') setTab('Multi-Search')
    else setTab('Single-Search')
  }

  return (
    <>
      <h1>{`Check ${tab} APIs`}</h1>
      <button onClick={toggleSearchModeHandler}>Change search mode!</button>
      {tab === 'Single-Search' ? <SingleSearch /> : <MultiSearch />}
    </>
  )
}

export default Apis
