import { useState } from 'react';
import './App.css';
import Matrix from './components/Matrix';
import ComponentsList from './components/ComponentsList';

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

    setPlate(plate);
    setFileData(data);
  };

  const handleFileChange = (event) => {
    const sourceFile = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = handleReadFile;
    fileReader.readAsText(sourceFile);
  };

  return (
    <>
      <div className="app">
        <div className="files">
          <h3>Выберите файл</h3>
          <div className="file-field input-field">
            <input onChange={handleFileChange} type="file" />
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>

          <ComponentsList data={fileData} />
        </div>

        <div className="results">
          <Matrix plate={plate} />
        </div>
      </div>
    </>
  );
}

export default App;
