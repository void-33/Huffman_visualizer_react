import React, { useState } from 'react';
import { decodeData } from './utils';

const Decoder = () => {
  const [uploadedTree, setUploadedTree] = useState(null);
  const [encodedString, setEncodedString] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const { tree } = data;

        if (!tree) {
          setError('Invalid file format. Missing Huffman tree.');
          return;
        }

        setUploadedTree(tree);
        setError('');
      } catch (err) {
        setError('Failed to parse the file. Please ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleDecode = () => {
    if (!uploadedTree || !encodedString) {
      setError('Please upload a Huffman tree and provide an encoded string.');
      return;
    }

    try {
      const decoded = decodeData(encodedString, uploadedTree);
      setDecodedText(decoded);
      setError('');
    } catch (err) {
      setError('Failed to decode the string. Please check the tree and encoded string.');
    }
  };

  return (
    <div className="decoder-container">
      <h1>Huffman Decoder</h1>
      <div>
        <h2>Upload Huffman Tree File</h2>
        <input type="file" accept=".json" onChange={handleFileUpload} />
      </div>
      <div>
        <h2>Encoded String</h2>
        <textarea
          value={encodedString}
          onChange={(e) => setEncodedString(e.target.value)}
          rows={4}
        ></textarea>
      </div>
      <div>
        <button onClick={handleDecode}>Decode</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h2>Decoded Text</h2>
        <textarea
          value={decodedText}
          readOnly
          rows={4}
        ></textarea>
      </div>
    </div>
  );
};

export default Decoder;