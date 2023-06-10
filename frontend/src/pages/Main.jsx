import SearchBar from '../components/SearchBar'
import styled from 'styled-components'

const Main = () => {
  return (
    <Container>
      <SearchBar />
    </Container>
  )
}

export default Main

const Container = styled.div`
  margin: auto;

  width: 80%;
  min-width: 1080px;

  padding: 50px 0;
`
