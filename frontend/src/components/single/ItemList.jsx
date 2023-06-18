import { getRecentImageURL } from '../../shared/utils'

const ItemList = ({ items }) => {
  return (
    <>
      {items.map((item, idx) => (
        <img
          key={idx}
          src={getRecentImageURL('item', item)}
          alt={`item_${item}_img`}
        />
      ))}
    </>
  )
}

export default ItemList
