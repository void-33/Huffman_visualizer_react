import React from 'react';
import Tree from 'react-d3-tree';

// Helper function to convert Huffman Tree to a format compatible with react-d3-tree
const convertToTreeData = (node) => {
  if (!node) return {};

  return {
    name: node.char ? `${node.char || ''}: ${node.freq}`: `${node.freq}`, // Node label
    children: [
      node.left && convertToTreeData(node.left), // Left child
      node.right && convertToTreeData(node.right), // Right child
    ].filter(Boolean), // Remove null/undefined children
  };
};

const HuffmanTree = ({ root }) => {
  const treeData = convertToTreeData(root);

  return (
    <div style={{ width: '100%', height: '100%', border: '2px solid #333', backgroundColor: '#f9f9f9' }}>
      <Tree
        data={treeData}
        orientation="vertical" // Tree orientation (vertical or horizontal)
        translate={{ x: 300, y: 200 }} // Adjust the position of the tree
        pathFunc="straight" // Line style (straight, diagonal, or curved)
        nodeSize={{ x: 200, y: 200 }} // Spacing between nodes
        separation={{ siblings: 1, nonSiblings: 1 }} // Spacing between sibling and non-sibling nodes

        renderCustomNodeElement={({ nodeDatum, toggleNode }) => {
            // Calculate the position for the 0/1 labels
          const isLeftChild = nodeDatum.parent?.children?.[0] === nodeDatum;
          const isRightChild = nodeDatum.parent?.children?.[1] === nodeDatum;
        return ( <g>
            {/* Circle for the node */}
            <circle r={40} fill="#add8e6" stroke="#a9a9a9" strokeWidth="2" onClick={toggleNode} />
            {/* Text inside the circle */}
            <text
              fill="#484747c7"
              strokeWidth="0"
              x={0} // Center the text horizontally
              y={5} // Adjust vertical alignment
              textAnchor="middle" // Center the text
              alignmentBaseline="middle" // Center the text vertically
              fontSize="32"
            >
              {nodeDatum.name}
            </text>
          </g>
        )}
    }
      />
    </div>
  );
};

export default HuffmanTree;
