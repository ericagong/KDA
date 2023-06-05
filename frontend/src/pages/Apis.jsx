import { useState } from 'react'
import SingleSearchApis from './SingleSearchApis'
import MultiSearchApis from './MultiSearchApis'

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
      {tab === 'Single-Search' ? <SingleSearchApis /> : <MultiSearchApis />}
    </>
  )
}

export default Apis
