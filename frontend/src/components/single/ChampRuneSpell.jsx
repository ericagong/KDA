import { getRecentImageURL } from '../../shared/utils'
import styled from 'styled-components'

const ChampRuneSpell = ({ champion, rune, rune_style, spells }) => {
  return (
    <Container>
      <LeftSection>
        <ChampionIcon
          src={getRecentImageURL('champion', champion.name)}
          alt={`champion_${champion.name}_img`}
        />
        <Level>{champion.level}</Level>
      </LeftSection>
      <RightSection>
        <div>
          {/* spells */}
          {spells.map((spell, idx) => (
            <SquareImage
              key={idx}
              src={getRecentImageURL('spell', spell)}
              alt={`spell_${spell}_img`}
            />
          ))}
        </div>
        <div>
          {/* runes */}
          <SquareImage
            src={getRecentImageURL('rune', rune)}
            alt={`rune_${rune}_img`}
          />
          <SquareImage
            src={getRecentImageURL('runeStyle', rune_style)}
            alt={`rune_${rune_style}_img`}
          />
        </div>
      </RightSection>
    </Container>
  )
}

export default ChampRuneSpell

const Container = styled.div`
  display: flex;
  gap: 5px;
`

const LeftSection = styled.div`
  display: flex;
  position: relative;

  width: 60px;
  height: 60px;
`

const ChampionIcon = styled.img`
  width: 60px;
  height: 60px;

  border-radius: 50%;
`

const Level = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  bottom: -8px;
  right: -20px;
  transform: translateX(-50%);

  border-radius: 50%;

  width: 30px;
  height: 30px;

  background: rgba(32, 45, 55, 0.8);

  font-size: 11px;

  color: #fff;
`

const RightSection = styled.div`
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
