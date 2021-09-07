import '../styles/Header.scss'

function StyledHeader(props) {
  const { score, bestScore } = props;
  return(
    <header className="GameHeader">
      <section className="Subheader">
        <div>
          Score: { score }
        </div>
        <div>
          Best Score: { bestScore }
        </div>
      </section>
    </header>
  )
}

export default StyledHeader