import React, { useState } from 'react';
import { Graph } from 'react-d3-graph';

// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
// }

export default function ComponentsGraph({ plate, renderMatrix }) {
  if (!plate || !renderMatrix) {
    return null;
  }
  const myConfig = {
    automaticRearrangeAfterDropNode: true,
    height: 400,
    node: {
      color: 'lightgreen',
      size: 1800,
      highlightStrokeColor: 'blue',
      fontSize: 20,
      highlightFontSize: 20,
      fontColor: 'white',
      labelPosition: 'center',
    },
    link: {
      highlightColor: 'lightblue',
      fontSize: 20,
      highlightFontSize: 20,
    },
    d3: {
      alphaTarget: 0.3,
      gravity: -201,
      linkLength: 300,
      linkStrength: 1,
      disableLinkForce: false,
    },
  };

  const allComponents = plate.map((node) => node.components).flat();
  const components = [...new Set(allComponents.map((component) => component.name))].map((name) => ({
    name,
    outputs: [],
  }));

  allComponents.forEach((component) => {
    const findC = components.find((c) => c.name === component.name);

    if (findC) {
      const indexOfFoundC = components.findIndex((c) => c.name === component.name);

      components[indexOfFoundC].outputs.push({ output: component.output.trim(), node: component.nodeName.trim() });
    }
  });

  const links = [];

  for (let i = renderMatrix._size[0]; i > 1; i--) {
    for (let j = i; j > 1; j--) {
      if (renderMatrix._data[i][j - 1] > 0) {
        const s = renderMatrix._data[0][j - 1];
        const t = renderMatrix._data[i][0];

        links.push({ source: s, target: t });
      }
    }
  }

  const graph = {
    nodes: components?.map((c, index) => ({
      id: c.name,
      // x: getRandomInt(1, 800),
      // y: getRandomInt(1, 800),
      symbolType: 'square',
    })),
    links,
  };

  const renderGraph = (
    <Graph
      id="graph-id"
      data={graph}
      config={myConfig}
    />
  );

  return (
    plate && (
      <div className="z-depth-3 graph">
        <h3>Graph</h3>

        {renderGraph}
      </div>
    )
  );
}
