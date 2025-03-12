import React, { useState } from 'react';
import './App.css';
import { getCharCounts, buildHuffmanTree, generateHuffmanCodes, encodeData, countBits } from './utils';
import HuffmanTree from './HuffmanTree';
import Decoder from './Decoder';

const App = () => {
  const [mode, setMode] = useState('encode');
  const [inputText, setInputText] = useState('');
  const [huffmanTree, setHuffmanTree] = useState(null);
  const [encodedData, setEncodedData] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [encodedBits, setEncodedBits] = useState(0);
  const [treeRoot, setTreeRoot] = useState(null);
  const [binaryString, setBinaryString] = useState('');
  const [huffmanEncodedString, setHuffmanEncodedString] = useState('');

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);

    if (text === '') {
      resetStates();
      return;
    }

    const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    setBinaryString(binary);

    const counts = getCharCounts(text);
    const tree = buildHuffmanTree(counts);
    const codes = generateHuffmanCodes(tree);
    const encoded = encodeData(text, codes);
    const totalBits = countBits(encoded);
    const huffmanString = text.split('').map(char => codes[char]).join(' ');

    setCharCount(text.length);
    setHuffmanTree(tree);
    setEncodedData(encoded);
    setEncodedBits(totalBits);
    setTreeRoot(tree);
    setHuffmanEncodedString(huffmanString);
  };

  const resetStates = () => {
    setHuffmanTree(null);
    setEncodedData('');
    setCharCount(0);
    setEncodedBits(0);
    setTreeRoot(null);
    setBinaryString('');
    setHuffmanEncodedString('');
  };

  const removeFreqandShortenKeys = (node) => {
    if (!node) return null;
    const { char, left, right } = node;
    return {
      ...(char !== null && { c:char }), //only keeps c:'char' if char is not null
      ...(left && { l: removeFreqandShortenKeys(left) }),
      ...(right && { r: removeFreqandShortenKeys(right) }),
    };
  };

  const saveTreeToFile = () => {
    if (!treeRoot) {
      alert('No Huffman tree to save!');
      return;
    }

    const refactoredTree = removeFreqandShortenKeys(treeRoot);


    const json = JSON.stringify(refactoredTree);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'huffman_tree.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <div className="mode-toggle">
        <button onClick={() => setMode('encode')}>Encode</button>
        <button onClick={() => setMode('decode')}>Decode</button>
      </div>

      {mode === 'encode' ? (
        <div className="left-section">
          <h1>Huffman Encoder</h1>
          <div>
            <h2>Input Text</h2>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              rows={4}
            ></textarea>
          </div>
          <div>
            <h2>Binary Coded String ({inputText.length * 8} bits)</h2>
            <textarea
              value={binaryString}
              readOnly
              rows={4}
            ></textarea>
          </div>
          <div>
            <h2>Huffman Coding ({encodedBits} bits)</h2>
            <textarea
              value={huffmanEncodedString}
              readOnly
              rows={4}
            ></textarea>
          </div>
          <div>
            <button onClick={saveTreeToFile}>Save Huffman Tree to File</button>
          </div>
        </div>
      ) : (
        <Decoder />
      )}

      <div className="right-section">
        {mode === 'encode' && treeRoot ? (
          <HuffmanTree root={treeRoot} />
        ) : (
          <div className="placeholder">
            {mode === 'encode'
              ? 'No input provided. Please type some text to visualize the Huffman Tree.'
              : 'Switch to Encode mode to visualize the Huffman Tree.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;