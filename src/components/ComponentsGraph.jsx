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
      // type: 'CURVE_SMOOTH',
    },
    d3: {
      // linkLength: 1000,
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
        name: `${findC.name}::${component.output.trim()}`,
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
    size: 4000,
  }));
  const renderNodes = nodes?.map((n) => ({
    id: n,
    symbolType: 'circle',
    color: 'brown',
    size: 4000,
  }));
  const renderOutputs = outputs?.map((o) => ({
    id: o.name,
    symbolType: 'cross',
    color: 'seagreen',
    size: 1800,
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
        <div className="tools">
          <div>
            <p>Square - COMPONENT</p>
            <p>Circle - NODE</p>
            <p>Cross - OUTPUT</p>
          </div>

          <form action="#">
            <p>
              <label>
                <input type="checkbox" />
                <span>Param 1</span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" class="filled-in" checked="checked" />
                <span>Param 2</span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" class="filled-in" checked="checked" />
                <span>Param 3</span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" class="filled-in" checked="checked" />
                <span>Param 4</span>
              </label>
            </p>
          </form>

          <button class="run-btn waves-effect waves-light btn-large">Run algorithm</button>
        </div>
        {renderGraph}
      </div>
    )
  );
}
