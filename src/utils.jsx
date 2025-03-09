// Huffman Encoding Utility Functions

export function getCharCounts(data) {
    const counts = {};
    for (let char of data) {
      counts[char] = counts[char] ? counts[char] + 1 : 1;
    }
    return counts;
  }
  
  export function buildHuffmanTree(counts) {
    let nodes = Object.keys(counts).map(key => ({ char: key, freq: counts[key], left: null, right: null }));
    
    while (nodes.length > 1) {
      nodes = nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift();
      const right = nodes.shift();
  
      const newNode = {
        char: null,
        freq: left.freq + right.freq,
        left,
        right
      };
  
      nodes.push(newNode);
    }
  
    return nodes[0];
  }
  
  export function generateHuffmanCodes(node, prefix = '', codes = {}) {
    if (node.char !== null) {
      codes[node.char] = prefix;
    } else {
      if (node.left) generateHuffmanCodes(node.left, prefix + '0', codes);
      if (node.right) generateHuffmanCodes(node.right, prefix + '1', codes);
    }
    return codes;
  }
  
  export function encodeData(data, codes) {
    return data.split('').map(char => codes[char]).join('');
  }
  
  export function countBits(encodedData) {
    return encodedData.length;
  }
  