import React, { useEffect, useState } from "react";
import './App.scss';

const Pokedex = require("pokeapi-js-wrapper")


const getIDS = function(length) {
  const maxPkmons = 800;
  const min = Math.floor(Math.random() * maxPkmons);
  const max = min + length;
  const ids = Array(length)

  console.log("getIDS, min: " + min)
  console.log("getIDS, length: " + length)

  for(let i = 0, j = min; i < length; i++, j++) {
    ids[i] = j;
  }
  return ids;
}

const fetchData = async function(ids) {
  const P = new Pokedex.Pokedex();
  let deck = [];

  console.log("createDeck, ids: " + ids);
  for (let i = 0, len = ids.length; i < len; i++) {
    try {
      console.log("createDeck: " + i)
      const pokemon = await P.getPokemonByName(ids[i]);
      const id = await pokemon.id;
      const name = await pokemon.name;
      const image = await pokemon.sprites.other['official-artwork'].front_default;
      deck.push({ id: id, name: name, image: image });
    }
    catch (error) { return error }
  }

  return deck
}

const loadDeck = async function (deckLen) {
  console.log("loadDeck")
  const ids = getIDS(deckLen);
  const deck = await fetchData(ids);

  return(deck);
}

function Card(props) {
  const [name, setName] = useState(props.name);
  const [src, setSrc] = useState(props.image);
  const [key, setKey] = useState(null);
  // const [index, setIndex] = useState(null);

  // let temp = index + props.index;

  console.log(key);

  // useEffect(() => {
  //   setName(props.name)
  //   setSrc(props.image)
  // }, [props])

  // useEffect(() => {
  //   setIndex(props.index)
  // }, [props.index])

  // console.log(name, "with index: ", index)

  const showRender = () => {
    console.log("Card useEffect, name/image: ", props.name, "/", props.image);
    return true
  }

  // function () {
  //   props.onclick(name);
  // }

  return (
    <React.Fragment>
      {(
        // showRender() &&
        <React.Fragment>
          <article className="Deck__card" onClick= { () => props.onClick(name) }>
            <div className="Deck__card__name">{ name }</div>
            <img src={ src } className="Deck__card__img" alt="pokemon" />
          </article>
        </React.Fragment>
      )}
    </React.Fragment>
    )

}


function showError(error) {
  return (
    <div>Error happened : { error.message }</div>
  )
}

function showLoading(nbr) {
  let ret = [];
  for(let k = 1; k <= nbr; k++) {
    ret.push(<div className="Deck__loading">LOADING</div>)
  }
  return ret;
}

function generateKey(previousKey) {
  let key = Math.floor(1000000 * Math.random());
  if (previousKey !== undefined) {
    while (key === previousKey){
      key = Math.floor(1000000 * Math.random());
    }
  }
  return  key;
}

function ShuffleArray(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function Deck(props) {
  const deckLen = props.deckLen;
  const [deck, setDeck] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(null);
  console.log("cards, loading: ", isLoading)

  useEffect(() => {
    async function fetchData() {
    try {
      console.log("fetchData");
      const data = await loadDeck(deckLen);
      if (data && data.message)
        throw new Error(data)
      data.map((elem) => { return {...elem, key: generateKey()} })
      setDeck(data);
      setIsLoading(false);
      console.log();
      console.log("after fetchData");
    }
    catch (err) {
      console.log(err)
      setServerError(err)
      setIsLoading(false);
    }
  }
  fetchData();
  }, [])

  const handleClick = (name) => {
    console.log("passing args for event: ", name);
    props.onClick(name);
    let shuffledDeck = ShuffleArray(deck);
    shuffledDeck = shuffledDeck.map((elem) => {
      elem.key = generateKey(elem.key);
      return elem })
    setDeck(shuffledDeck);
    console.log("Shuffled, deck: ", deck)
  }

  let showCards =  function() {
    let ret = [];
    console.log("Showcard 1")
    deck.forEach( (card) => {
      ret.push(<Card key={ card.key } name={ card.name } image={ card.image } onClick= { handleClick } />)
    })
    console.log("showCards: ", ret)
    return ret
  }

  const checkReRender = () => {
    console.log("Render, deck: ", deck);
    return true
  }

  const showState = () => {
    console.log("isLoading: ", isLoading, "/serverError: ", serverError, "/Deck: ", deck)
  }

  return (
  <React.Fragment>
    {
    (
    showState() &&
    isLoading &&
      <React.Fragment>
      { showLoading(deckLen) }
    </React.Fragment>
    ) || (
      serverError && showError(serverError)
    ) || (
      checkReRender() && deck &&
      <React.Fragment>
        { showCards() }
      </React.Fragment>
    )}
  </React.Fragment>
  )
}

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
    console.log("<Game> gameReset");
    setTurn(1);
    setMax(4);
    setScore(0);
    setClickedCards([])
    setKey(generateKey())
  }

  const gameNextTurn = () => {
    console.log("<Game> gameNextTurn");
    setTurn(turn + 1);
    setMax(max + 2);
    setScore(0);
    setClickedCards([])
    setKey(generateKey());
  }

  const handleClick = (name) => {
    console.log(clickedCards)

    if (!clickedCards.includes(name)) {
      let tempAry = clickedCards.slice();
      tempAry.push(name);

      console.log("<Game>tempAry: ", tempAry);

      setScore(tempAry.length);
      handleBestScore(tempAry.length);
      if (tempAry.length === max) {
        gameNextTurn();
      }
      setClickedCards(tempAry);
    } else {
      gameReset()
    }
  }

  return (
    <React.Fragment>
      <Header bestScore= { bestScore } score= {score }></Header>
      <section className="Deck">
        <Deck key={ key } onClick={ handleClick } deckLen={ max }/>
      </section>
    </React.Fragment>

  )
}

function Header(props) {
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

function App() {
  return (
    <section>
      <header>

      </header>
      <section className="Board">
        <Game />
      </section>
    </section>
  );
}

export default App;