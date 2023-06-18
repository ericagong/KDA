import styled from 'styled-components'

// TODO summary mode와 detail mode에 따라 다르게 렌더링
const KDAIndex = ({ type = 'detail', KDA }) => {
  const { kills, deaths, assists, kill_participations, score } = KDA

  return (
    <Container>
      <KDASection type={type}>
        <span>{`${kills}`}</span>
        <span>{`${deaths}`}</span>
        <span>{`${assists}`}</span>
        {type === 'detail' && <div>{`(${kill_participations})`}</div>}
      </KDASection>
      <ScoreSection>
        <div>{`${score}:1 평점`}</div>
      </ScoreSection>
    </Container>
  )
}

export default KDAIndex

const Container = styled.div`
  box-sizing: border-box;

  padding: 10px 10px;
  width: 110px;
`

const KDASection = styled.div`
  font-size: ${(props) => (props.type === 'summary' ? '22px' : '12px')};
  font-weight: ${(props) => (props.type === 'summary' ? '700' : '400')};

  span:nth-child(2n + 1) {
    color: #fff;
  }

  span:nth-child(2n) {
    color: #e84057;
  }

  span::after {
    content: '/';
    color: #b7b7c9;
    margin: 0 8px;
  }

  span:last-child::after {
    content: '';
  }
`

const ScoreSection = styled.div`
  text-align: center;
`
