import React from 'react';
import Tree from 'react-d3-tree';

const convertToTreeData = (node) => {
  if (!node) return {};

  return {
    name: node.char ? `${node.char || ''}: ${node.freq}` : `${node.freq}`,
    children: [
      node.left && convertToTreeData(node.left),
      node.right && convertToTreeData(node.right),
    ].filter(Boolean),
  };
};

const HuffmanTree = ({ root }) => {
  const treeData = convertToTreeData(root);

  return (
    <div style={{ width: '100%', height: '100%', border: '2px solid #333', backgroundColor: '#f9f9f9' }}>
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: 300, y: 200 }}
        pathFunc="straight"
        nodeSize={{ x: 200, y: 200 }}
        separation={{ siblings: 1, nonSiblings: 1 }}
        renderCustomNodeElement={({ nodeDatum, toggleNode }) => (
          <g>
            <circle r={40} fill="#add8e6" stroke="#a9a9a9" strokeWidth="2" onClick={toggleNode} />
            <text
              fill="#484747c7"
              strokeWidth="0"
              x={0}
              y={5}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="32"
            >
              {nodeDatum.name}
            </text>
          </g>
        )}
      />
    </div>
  );
};

export default HuffmanTree;