import { useState, useEffect, Fragment } from 'react';
import { loadDeck, generateKey,  ShuffleArray, showError, showLoading } from './Utilities'
import Card from './Card'
import '../styles/Deck.scss'

function Deck(props) {
  const deckLen = props.deckLen;
  const [deck, setDeck] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    async function fetchData() {
    try {
      const data = await loadDeck(deckLen);
      if (data && data.message)
        throw new Error(data)
      data.map((elem) => { return {...elem, key: generateKey()} })
      setDeck(data);
      setIsLoading(false);
    }
    catch (err) {
      setServerError(err)
      setIsLoading(false);
    }
  }
  fetchData();
  }, [])

  const handleClick = (name) => {
    props.onClick(name);
    let shuffledDeck = ShuffleArray(deck);
    shuffledDeck = shuffledDeck.map((elem) => {
      elem.key = generateKey(elem.key);
      return elem
    })
    setDeck(shuffledDeck);
  }

  let showCards =  function() {
    let ret = [];
    deck.forEach( (card) => {
      ret.push(<Card key={ card.key } name={ card.name } image={ card.image } onClick= { handleClick } />)
    })
    return ret
  }

  return (
  <Fragment>
    {(
      isLoading &&
      <Fragment>
      { showLoading(deckLen) }
      </Fragment>
    ) || (
      serverError && showError(serverError)
    ) || (
      deck &&
      <Fragment>
        { showCards() }
      </Fragment>
    )}
  </Fragment>
  )
}

export default Deck