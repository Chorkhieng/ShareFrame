import React from 'react';

import './Card.css';

const Card = props => {
  return (
    <div className={`card ${props.className}`} style={{width: props.width, height: props.height}}>
      {props.children}
    </div>
  );
};

export default Card;
