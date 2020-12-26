/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import './App.css';
import Matrix from './components/Matrix';
import ReadingBlock from './components/ReadingBlock';
import ComponentsGraph from './components/ComponentsGraph';

function App() {
  const [plate, setPlate] = useState(null);
  const [fileData, setFileData] = useState('');

  const handleReadFile = (event) => {
    const fileData = event.target.result.trim();
    const data = fileData.split(';').filter((d) => d);
    const plate = data
      .map((item) => {
        if (item) {
          const nodeRow = item.split(' ').filter((i) => i);
          const nodeName = nodeRow[0].trim();
          const components = nodeRow.splice(1);

          return {
            name: nodeName,
            components: components.map((component) => ({
              name: component.split('(')[0],
              nodeName,
              output: component.split('(')[1].replace(')', '').replace("'", ''),
            })),
          };
        }

        return null;
      })
      .filter((t) => t);

    setPlate(null);
    setPlate(plate);
    setFileData(data);
  };

  const handleFileChange = (event) => {
    const sourceFile = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = handleReadFile;
    fileReader.readAsText(sourceFile);
  };

  const [renderQMatrix, setRenderQMatrix] = useState(null);

  useEffect(() => {
    if (!plate) {
      return;
    }

    const allNodesNames = plate.map((node) => node.name).filter((t) => t);
    const allComponentsNames = plate
      .map((node) => node.components.map((component) => component.name))
      .flat()
      .unique();
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

    setRenderQMatrix(RMatrix);

    return () => {
      setRenderQMatrix(null);
    };
  }, [plate]);

  console.log({renderQMatrix, plate})

  return (
    <>
      <div className="app">
        <ReadingBlock fileData={fileData} handleFileChange={handleFileChange}  />

        <div className="results">
          <Matrix renderMatrix={renderQMatrix} />
          <ComponentsGraph renderMatrix={renderQMatrix} plate={plate} />
        </div>
      </div>
    </>
  );
}

export default App;
