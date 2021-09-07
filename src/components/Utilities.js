const Pokedex = require("pokeapi-js-wrapper")

export function generateKey(previousKey) {
  let key = Math.floor(1000000 * Math.random());
  if (previousKey !== undefined) {
    while (key === previousKey){
      key = Math.floor(1000000 * Math.random());
    }
  }
  return  key;
}

export function showError(error) {
  return (
    <div>Error happened : { error.message }</div>
  )
}

export function showLoading(nbr) {
  let ret = [];
  for(let k = 1; k <= nbr; k++) {
    ret.push(<div className="Deck__loading">LOADING</div>)
  }
  return ret;
}

const getIDS = function(length) {
  const maxPkmons = 800;
  const min = Math.floor(Math.random() * maxPkmons);
  const ids = Array(length)

  for(let i = 0, j = min; i < length; i++, j++) {
    ids[i] = j;
  }
  return ids;
}

export const loadDeck = async function (deckLen) {
  const ids = getIDS(deckLen);
  const deck = await fetchData(ids);

  return(deck);
}

const fetchData = async function(ids) {
  const P = new Pokedex.Pokedex();
  let deck = [];

  for (let i = 0, len = ids.length; i < len; i++) {
    try {
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

export function ShuffleArray(array) {
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
