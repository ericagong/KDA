import styled from 'styled-components'

const PageLayout = ({ children }) => {
  return <Container>{children}</Container>
}

export default PageLayout

const Container = styled.div`
  margin: auto;

  width: 80%;
  min-width: 1080px;

  padding: 50px 0;

  /* background-color: #fff; */
`
