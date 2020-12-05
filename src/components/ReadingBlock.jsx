import React from 'react';
import ComponentsList from './ComponentsList';

export default function ReadingBlock(props) {
  const {fileData, handleFileChange} = props

  return (
    <div className="z-depth-3 files">
      <h3>Выберите файл</h3>
      <div className="file-field input-field">
        <input onChange={handleFileChange} type="file" />
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>

      <ComponentsList data={fileData} />
    </div>
  );
}
