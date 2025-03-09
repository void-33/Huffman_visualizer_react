import React, { useState } from 'react';
import './App.css';
import { getCharCounts, buildHuffmanTree, generateHuffmanCodes, encodeData, countBits } from './utils';
import HuffmanTree from './HuffmanTree';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [huffmanTree, setHuffmanTree] = useState(null);
  const [huffmanCodes, setHuffmanCodes] = useState({});
  const [encodedData, setEncodedData] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [encodedBits, setEncodedBits] = useState(0);
  const [treeRoot, setTreeRoot] = useState(null);
  const [binaryString, setBinaryString] = useState('');
  const [huffmanEncodedString, setHuffmanEncodedString] = useState('');

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);

    // Reset all states if the input is empty
    if (text === '') {
      setHuffmanTree(null);
      setHuffmanCodes({});
      setEncodedData('');
      setCharCount(0);
      setEncodedBits(0);
      setTreeRoot(null);
      setBinaryString('');
      setHuffmanEncodedString('');
      return;
    }

    // For standard binary encoding (ASCII)
    const binary = text.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0'); // Convert to 8-bit binary
    }).join(' ');

    // Store the binary string for display
    setBinaryString(binary);

    const counts = getCharCounts(text);
    const tree = buildHuffmanTree(counts);
    const codes = generateHuffmanCodes(tree);
    const encoded = encodeData(text, codes);
    const totalBits = countBits(encoded);

    // Create a space-separated Huffman encoded string
    const huffmanString = text.split('').map(char => codes[char]).join(' ');

    setCharCount(text.length);
    setHuffmanTree(tree);
    setHuffmanCodes(codes);
    setEncodedData(encoded);
    setEncodedBits(totalBits);
    setTreeRoot(tree);
    setHuffmanEncodedString(huffmanString);
  };

  return (
    <div className="container">
      {/* Left Section */}
      <div className="left-section">
        <h1>Huffman Visualizer</h1>

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
      </div>

      {/* Right Section (Huffman Tree) */}
      <div className="right-section">
        {treeRoot ? (
          <HuffmanTree root={treeRoot} />
        ) : (
          <div className="placeholder">
            No input provided. Please type some text to visualize the Huffman Tree.
          </div>
        )}
      </div>
    </div>
  );
};

export default App;