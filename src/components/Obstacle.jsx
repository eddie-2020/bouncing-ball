import React from 'react';

const Obstacle = ({ position, width, height }) => {
  return (
    <div
      className="bg-red-500 absolute"
      style={{
        top: position.y + 'px',
        left: position.x + 'px',
        width: width + 'px',
        height: height + 'px',
      }}
    ></div>
  );
};

export default Obstacle;
