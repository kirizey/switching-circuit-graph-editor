/* eslint-disable no-undef */
import React from 'react';
import { v4 as uuid } from 'uuid';

export default function CMatrix({ components, nodes, outputs }) {
  if (!components || !nodes || !outputs) {
    return null;
  }

  const outputsList = outputs
    .map((c) => c.showName)
    .unique()
    .sort((a, b) => a - b);
  const componentsList = components.map((c) => c.name).unique();
  const matrix = math.matrix(math.zeros([outputsList.length, componentsList.length]));
  const nodesNumbers = components
    .map((c) => c.nodeName)
    .unique()
    .map((n, index) => ({ [n]: index + 1 }));
  const nodesNumbersEnum = {};
  nodesNumbers.forEach((nn) => {
    nodesNumbersEnum[Object.keys(nn)[0]] = Object.values(nn)[0];
  });

  matrix._data.forEach((_, index) => {
    matrix._data[index].unshift(`el:${componentsList[index]}`);
  });
  matrix._data.unshift(['', ...outputsList.map(o => `o:${o}`)]);

  let currentIterator = 1;
  const nodeCursors = {};

  outputsList.forEach((o, i) => {
    componentsList.forEach((c, j) => {
      const foundComp = components.find((comp) => comp.output === o && c === comp.name);

      if (foundComp) {
        if (nodeCursors[foundComp.nodeName]) {
          matrix._data[i + 1][j + 1] = nodeCursors[foundComp.nodeName].iterator;
        } else {
          nodeCursors[foundComp.nodeName] = { iterator: currentIterator };
          matrix._data[i + 1][j + 1] = currentIterator;
          currentIterator++;
        }
      }
    });
  });

  console.log({ matrix, outputsList, componentsList, nodesNumbersEnum });

  const renderMatrixBody = matrix?._data.map((row) => (
    <tr key={uuid()}>
      {row.map((cell) => (
        <th key={uuid()}>{cell}</th>
      ))}
    </tr>
  ));

  return (
    <>
      <div className="z-depth-3 matrix">
        <h3>C Matrix</h3>

        {
          <table className="highlight centered">
            <tbody>{renderMatrixBody}</tbody>
          </table>
        }
      </div>
    </>
  );
}
