import React, { useState } from 'react';
import { Graph } from 'react-d3-graph';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

const myConfig = {
  automaticRearrangeAfterDropNode: true,
  nodeHighlightBehavior: true,
  node: {
    color: 'lightgreen',
    size: 600,
    highlightStrokeColor: 'blue',
    fontSize: 16,
    highlightFontSize: 22,
    fontColor: 'white',
  },
  link: {
    highlightColor: 'lightblue',
    fontSize: 16,
    highlightFontSize: 22,
  },
};

export default function ComponentsGraph({ plate, renderMatrix }) {
  if (!plate || !renderMatrix) {
    return null;
  }

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

  const links = []
  
  for (let i = renderMatrix._size[0]; i > 1; i--) {
    for (let j = i; j >  1; j--) {
      if (renderMatrix._data[i][j-1]>0) {
        const s = renderMatrix._data[0][j-1];
        const t = renderMatrix._data[i][0];

        links.push({source: s, target: t})
      }
    } 
  }

  console.log(links);
  

  const graph = {
    nodes: components?.map((c, index) => ({
      id: c.name,
      x: getRandomInt(1, 800),
      y: getRandomInt(1, 800),
      symbolType: 'square',
    })),
    links,
  };


  const renderGraph = (
    <Graph
      id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
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
