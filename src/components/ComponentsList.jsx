import React from 'react';

export default function ComponentsList({ data }) {
  return data && <div className="z-depth-1 components-list">{data && <code>{data}</code>}</div>;
}
