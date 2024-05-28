import React, { useState } from 'react';

const ReadMore = ({ content, maxLength }) => {
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  return (
    <div>
      <div>
        {isTruncated ? (
          <p>{`${content.slice(0, maxLength)} ...`}</p>
        ) : (
          <p>{content}</p>
        )}
      </div>
      {content.length > maxLength && (
        <button onClick={toggleTruncate}>
          {isTruncated ? 'Read More' : 'Read Less'}
        </button>
      )}
    </div>
  );
};

export default ReadMore;
