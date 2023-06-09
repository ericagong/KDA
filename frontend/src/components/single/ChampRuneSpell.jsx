import { getRecentImageURL } from '../../shared/utils'

const ChampRuneSpell = ({ champion, rune, rune_style, spells }) => {
  return (
    <>
      <div>
        <img
          src={getRecentImageURL('champion', champion.name)}
          alt={`champion_${champion.name}_img`}
        />
        <div>{champion.level}</div>
      </div>
      <div>
        <img src={getRecentImageURL('rune', rune)} alt={`rune_${rune}_img`} />
        <img
          src={getRecentImageURL('runeStyle', rune_style)}
          alt={`rune_${rune_style}_img`}
        />
      </div>
      <div>
        {spells.map((spell, idx) => (
          <img
            key={idx}
            src={getRecentImageURL('spell', spell)}
            alt={`spell_${spell}_img`}
          />
        ))}
      </div>
    </>
  )
}

export default ChampRuneSpell
