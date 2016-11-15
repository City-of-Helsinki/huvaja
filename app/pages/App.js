import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';

function App({ children }) {
  return (
    <div className="app">
      <DocumentTitle title="Huonevarausjärjestelmä" />
      {children}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.element,
};

export default App;
