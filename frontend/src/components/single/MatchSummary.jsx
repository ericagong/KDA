import ChampRuneSpell from './ChampRuneSpell'
import ItemList from './ItemList'
import KDAIndex from './KDAIndex'
import { calcTime, calcDuration } from '../../shared/utils'
import styled from 'styled-components'
import TeamSummoners from './TeamSummoners'

const MatchSummary = ({
  game_creation,
  game_duration,
  target_summoner,
  summoners,
}) => {
  const {
    win,
    summoner: me,
    champion,
    rune,
    rune_style,
    spells,
    items,
    indexes,
  } = target_summoner
  const { KDA, control_wards, CS } = indexes
  const { blue_team, red_team } = summoners

  return (
    <Conatiner win={win}>
      <LeftSection>
        <LeftTopSection win={win}>
          <Rank win={win}>솔랭</Rank>
          <div>{`${calcTime(game_creation)}`}</div>
        </LeftTopSection>
        <Section>
          <BoldText>{win ? '승리' : '패배'}</BoldText>
          <div>{`${calcDuration(game_duration)}`}</div>
        </Section>
      </LeftSection>
      <MiddleSection>
        <MiddleTopSection>
          <ChampRuneSpell
            champion={champion}
            rune={rune}
            rune_style={rune_style}
            spells={spells}
          />
          <KDAIndex type="summary" KDA={KDA} />
          <IndexSection win={win}>
            <div>{`킬관여 ${KDA.kill_participations}`}</div>
            <div>{`제어 와드 ${control_wards}`}</div>
            <div>{`CS ${CS.total} (${CS.per_minute})`}</div>
          </IndexSection>
        </MiddleTopSection>
        <Section>
          <ItemList items={items} win={win} />
        </Section>
      </MiddleSection>
      <RightSection>
        <TeamSummoners team={blue_team} me={me} />
        <TeamSummoners team={red_team} me={me} />
      </RightSection>
    </Conatiner>
  )
}

export default MatchSummary

const Conatiner = styled.div`
  display: flex;
  gap: 20px;

  padding: 10px;
  margin: 10px 0;

  background: ${(props) => (props.win ? '#28344E' : '#59343B')};
`

const BoldText = styled.div`
  font-weight: 700;
`

const Rank = styled(BoldText)`
  color: ${(props) => (props.win ? '#5383E8' : '#E84057')};
`

const LeftSection = styled.div`
  flex: 1;
`

const Section = styled.div`
  border: none;
`

const LeftTopSection = styled(Section)`
  border-bottom: ${(props) =>
    props.win ? '1.5px solid #2F436E' : '1.5px solid #703c47'};
`

const MiddleSection = styled.div`
  flex: 5;
`

const MiddleTopSection = styled.div`
  display: flex;
  padding-top: 5px;
`

const IndexSection = styled.div`
  margin-left: 70px;
  padding-left: 10px;
  border-left: ${(props) =>
    props.win ? '1.5px solid #2F436E' : '1.5px solid #703c47'};

  div:first-child {
    color: #e84057;
  }
`

const RightSection = styled.div`
  display: flex;
  flex: 4;
`
