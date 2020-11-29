import React from 'react';
import { Graph } from 'react-d3-graph';

export default function ComponentsGraph({ plate, renderMatrix }) {
  if (!plate || !renderMatrix) {
    return null;
  }
  const myConfig = {
    automaticRearrangeAfterDropNode: true,
    node: {
      color: 'tomato',
      size: 3000,
      highlightStrokeColor: 'blue',
      fontSize: 22,
      highlightFontSize: 22,
      fontColor: 'white',
      labelPosition: 'center',
    },
    link: {
      highlightColor: 'lightblue',
      fontSize: 22,
      highlightFontSize: 22,
      type: 'CURVE_SMOOTH',
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
    showName: `c-${name}`,
    name,
    outputs: [],
  }));

  allComponents.forEach((component) => {
    const findC = components.find((c) => c.name === component.name);

    if (findC) {
      const indexOfFoundC = components.findIndex((c) => c.name === component.name);

      components[indexOfFoundC].outputs.push({
        showName: component.output.trim(),
        name: `${findC.name}:${component.output.trim()}`,
        node: component.nodeName.trim(),
        component: findC.name,
      });
    }
  });

  const outputs = components.map((c) => c.outputs).flat();
  const nodes = outputs
    .map((c) => c.node)
    .flat()
    .unique();
  console.log({ components, outputs, nodes });

  const links = [];

  outputs.forEach((o) => {
    links.push({ source: o.name, target: o.node });
    links.push({ source: o.component, target: o.name });
  });

  const renderComponents = components?.map((c) => ({
    id: c.name,
    symbolType: 'square',
    label: c.showName,
    color: 'hotpink',
  }));
  const renderNodes = nodes?.map((n) => ({
    id: n,
    symbolType: 'circle',
    color: 'brown',
  }));
  const renderOutputs = outputs?.map((o) => ({
    id: o.name,
    symbolType: 'cross',
    color: 'seagreen',
  }));

  const graph = {
    nodes: [...renderComponents, ...renderNodes, ...renderOutputs],
    links,
  };

  const renderGraph = <Graph id="graph-id" data={graph} config={myConfig} />;

  return (
    plate && (
      <div className="z-depth-3 graph">
        <h3>Schema</h3>
        {renderGraph}
      </div>
    )
  );
}
