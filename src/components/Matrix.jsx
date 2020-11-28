/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
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

export default function Matrix({ plate }) {
  const [renderMatrix, setRenderMatrix] = useState(null);
  const [componentsNames, setComponentsNames] = useState(null);

  useEffect(() => {
    if (!plate) {
      return;
    }

    const allNodesNames = plate.map((node) => node.name).filter((t) => t);
    const allComponentsNames = plate
      .map((node) => node.components.map((component) => component.name))
      .flat()
      .unique();
    setComponentsNames(allComponentsNames);

    const QMatrix = math.matrix(math.zeros([allComponentsNames.length, allNodesNames.length]));
    plate.forEach((node, j) => {
      node.components.forEach((component) => {
        const i = allComponentsNames.indexOf(component.name);
        QMatrix._data[i][j] = 1;
      });
    });

    const RMatrix = math.multiply(QMatrix, math.transpose(QMatrix));
    RMatrix._data.forEach((_, index) => {
      RMatrix._data[index][index] = 0;
    });
    RMatrix._data.forEach((_, index) => {
      RMatrix._data[index].unshift(allComponentsNames[index]);
    });
    RMatrix._data.unshift(['', ...allComponentsNames]);

    setRenderMatrix(RMatrix);

    return () => {
      setRenderMatrix(null);
    };
  }, [plate]);

  if (!plate) {
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
