import { getRecentImageURL } from '../../shared/utils'
import styled from 'styled-components'

const ItemList = ({ items, win }) => {
  const getItems = (items) => {
    return items.map((item, idx) => {
      if (item === 0) {
        return <EmptyImage win={win} />
      } else {
        return (
          <SquareImage
            key={idx}
            src={getRecentImageURL('item', item)}
            alt={`item_${item}_img`}
          />
        )
      }
    })
  }

  return <Container>{getItems(items)}</Container>
}

export default ItemList

const Container = styled.div`
  display: flex;
`

const SquareImage = styled.img`
  display: block;

  box-sizing: border-box;

  margin: 3px 0 0 3px;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  background: #1c1c1f;
`

const EmptyImage = styled.div`
  box-sizing: border-box;

  margin: 3px 0 0 3px;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  background: ${(props) => (props.win ? '#28344E' : '#59343B')};
`
