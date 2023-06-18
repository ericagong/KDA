// TODO summary mode와 detail mode에 따라 다르게 렌더링
const KDAIndex = ({ type = 'summary', KDA }) => {
  const { kills, deaths, assists, kill_participations } = KDA

  return (
    <>
      <div>
        <div>{`K ${kills}`}</div>
        <div>{`D ${deaths}`}</div>
        <div>{`A ${assists}`}</div>
        <div>{`킬관여율 ${kill_participations}`}</div>
      </div>
    </>
  )
}

export default KDAIndex
