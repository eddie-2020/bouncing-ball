import React from 'react';

const Ball = ({ position, radius }) => {
  return (
    <div
      className="bg-green-500 h-[40px] w-[40px] rounded-full absolute"
      style={{
        top: position.y - radius + 'px',
        left: position.x - radius + 'px',
      }}
    ></div>
  );
};

export default Ball;
