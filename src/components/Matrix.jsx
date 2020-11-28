/* eslint-disable no-undef */
import React from 'react';
import { v4 as uuid } from 'uuid';

// eslint-disable-next-line no-extend-native
Array.prototype.unique = function () {
  let arr = [];
  for (let i = 0; i < this.length; i++) {
    if (!arr.includes(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
};

export default function Matrix({ renderMatrix }) {
  if (!renderMatrix) {
    return null;
  }

  const renderMatrixBody = renderMatrix?._data.map((row) => {
    return (
      <tr key={uuid()}>
        {row.map((cell) => (
          <th key={uuid()}>{cell}</th>
        ))}
      </tr>
    );
  });

  return (
    <div className="z-depth-3 matrix">
      <h3>R Matrix</h3>

      {renderMatrix && (
        <table className="highlight centered">
          <tbody>{renderMatrixBody}</tbody>
        </table>
      )}
    </div>
  );
}
