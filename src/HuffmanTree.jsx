import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const HuffmanTree = ({ root }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!root) return;

    // Clear the SVG before rendering
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Set up SVG dimensions
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 25, right: 0, bottom: 20, left: width / 2 };

    // Create a group for the tree
    const zoomG = svg.append('g');
    const svgG = zoomG.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Enable zooming
    svg.call(
      d3.zoom().on('zoom', (event) => {
        zoomG.attr('transform', event.transform);
      })
    );

    // Node dimensions and spacing
    const rectLeafDim = { width: 50, height: 30 };
    const nonLeafNodes = { radius: 20 };
    const horizontalSeparation = 16;
    const verticalSeparation = 50;

    // Create a tree layout
    const treeLayout = d3.tree()
      .nodeSize([rectLeafDim.width + horizontalSeparation, rectLeafDim.height + verticalSeparation])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.5));

    // Convert the root data to a hierarchy
    const rootHierarchy = d3.hierarchy(root, (d) => {
      const children = [];
      if (d.left) children.push(d.left);
      if (d.right) children.push(d.right);
      return children;
    });

    const treeData = treeLayout(rootHierarchy); // Apply the tree layout
    const links = treeData.links(); // Get the links (edges)
    const nodes = treeData.descendants(); // Get the nodes

    // Draw the branches (edges)
    const branches = svgG.selectAll('line')
      .data(links)
      .enter();

    branches.append('line')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
      .attr('stroke', 'darkgray')
      .attr('stroke-width', 2);

    // Add 0/1 labels to the branches
    const assignPathText = (d) => {
      return d.source.data.left === d.target.data ? '0' : '1';
    };

    const branchText = svgG.selectAll('path-text.label')
      .data(links)
      .enter();

    branchText.append('text')
      .attr('x', (d) => {
        const isLeftChild = d.source.data.left === d.target.data;
        const midX = (d.source.x + d.target.x) / 2;
        return isLeftChild ? midX - 10 : midX + 10; // Adjust X position based on label
      })
      .attr('y', (d) => (d.source.y + d.target.y) / 2) // Y position of the label
      .text((d) => assignPathText(d)) // Text content ("0" or "1")
      .attr('text-anchor', 'middle') // Center the text horizontally
      .attr('alignment-baseline', 'middle') // Center the text vertically
      .attr('fill', 'black') // Text color
      .attr('font-size', '16'); // Font size

    // Draw circle nodes for non-leaf nodes
    const circleNodes = svgG.selectAll('circle.node')
      .data(nodes.filter((node) => node.data.char === null))
      .enter();

    circleNodes.append('circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', nonLeafNodes.radius)
      .attr('fill', 'lightblue')
      .attr('stroke', 'darkgray')
      .attr('stroke-width', 2);

    // Draw rectangle nodes for leaf nodes
    const rectangleNodes = svgG.selectAll('rect.node')
      .data(nodes.filter((node) => node.data.char !== null))
      .enter();

    rectangleNodes.append('rect')
      .attr('x', (d) => d.x - rectLeafDim.width / 2)
      .attr('y', (d) => d.y - rectLeafDim.height / 2)
      .attr('width', rectLeafDim.width)
      .attr('height', rectLeafDim.height)
      .attr('rx', 4) // Rounded corners
      .attr('fill', '#edf4fb')
      .attr('stroke', 'darkgray')
      .attr('stroke-width', 2);

    // Add text to the nodes
    const nodeText = svgG.selectAll('node-text.label')
      .data(nodes)
      .enter();

    nodeText.append('text')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y + 5)
      .text((d) => (d.data.char === null ? d.data.freq : `'${d.data.char}' | ${d.data.freq}`))
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'gray')
      .attr('font-size', '20');

    // Zoom to fit the tree
    const zoomFit = (rootGroup, isOnlyRoot) => {
      const bounds = rootGroup.node().getBBox();
      const svgElement = svgRef.current;
      const svgWidth = svgElement.clientWidth;
      const svgHeight = svgElement.clientHeight;
      const midX = bounds.x + bounds.width / 2;
      const midY = bounds.y + bounds.height / 2;
      const scale = (isOnlyRoot ? 0.4 : 0.85) / Math.max(bounds.width / svgWidth, bounds.height / svgHeight);
      const translate = [svgWidth / 2 - scale * midX, svgHeight / 2 - scale * midY];

      rootGroup.attr('transform', `translate(${translate}) scale(${scale})`);
    };

    zoomFit(svgG, root.char === null);
  }, [root]);

  return (
    <div style={{ width: '100%', height: '100%', border: '2px solid #333', backgroundColor: '#f9f9f9' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
    </div>
  );
};

export default HuffmanTree;