import React from 'react';

export default function ComponentsList({ data }) {
  return data && <div className="components-list">{data && <code>{data}</code>}</div>;
}
