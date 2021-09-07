import { useState, Fragment } from 'react';
import { generateKey } from './Utilities'
import '../styles/Deck.scss'
import Deck from './Deck';
import StyledHeader from './Header'

function Game(props) {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [clickedCards, setClickedCards] = useState([]);
  const [key, setKey] = useState(generateKey());
  const [turn, setTurn] = useState(1);
  const [max, setMax] = useState(4);

  const handleBestScore = (currentScore) => {
    if (currentScore > bestScore) {
      setBestScore(currentScore);
    }
  }

  const gameReset = () => {
    setTurn(1);
    setMax(4);
    setScore(0);
    setClickedCards([])
    setKey(generateKey())
  }

  const gameNextTurn = () => {
    setTurn(turn + 1);
    setMax(max + 2);
    setScore(0);
    setClickedCards([])
    setKey(generateKey());
  }

  const handleClick = (name) => {
    if (!clickedCards.includes(name)) {
      let tempAry = clickedCards.slice();
      tempAry.push(name);

      setScore(tempAry.length);
      handleBestScore(tempAry.length);
      if (tempAry.length === max) {
        gameNextTurn();
      }
      else {
        setClickedCards(tempAry);
      }
    } else {
      gameReset()
    }
  }

  return (
    <Fragment>
      <StyledHeader bestScore= { bestScore } score= {score }></StyledHeader>
      <section className="Deck">
        <Deck key={ key } onClick={ handleClick } deckLen={ max }/>
      </section>
    </Fragment>

  )
}

export default Game