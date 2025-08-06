// src/App.js
import React from 'react';
import ProductPage from './components/ProductPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Veritas Review System</h1>
      </header>
      <main>
        <ProductPage />
      </main>
    </div>
  );
}

export default App;