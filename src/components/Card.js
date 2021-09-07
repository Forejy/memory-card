import { useState, Fragment } from 'react'

function Card(props) {
  const [name] = useState(props.name);
  const [src] = useState(props.image);

  return (
    <Fragment>
      {(
        <Fragment>
          <article className="Deck__card" onClick= { () => props.onClick(name) }>
            <div className="Deck__card__name">{ name }</div>
            <img src={ src } className="Deck__card__img" alt="pokemon" />
          </article>
        </Fragment>
      )}
    </Fragment>
    )
}

export default Card