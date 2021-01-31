import React, { useState } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
} from 'react-flow-renderer';

const onLoad = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};

const OverviewFlow = ({nodes, setNodes}) => {

  const onElementsRemove = (elementsToRemove) =>
  setNodes((els) => removeElements(elementsToRemove, els));

  const onConnect = (params) => setNodes((els) => addEdge(params, els));
  const onElementClick = (event, element) => console.log('click', element);
  const onNodeDragStop = (event, node) => console.log('drag stop', node);

  return (
    <ReactFlow
      elements={nodes}
      nodesConnectable={false}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      snapToGrid={true}
      snapGrid={[225, 133]}
      paneMoveable={false}
      snapGrid={[1,1]}
      onNodeDragStop={onNodeDragStop}
      onElementClick={onElementClick}
      deleteKeyCode={46}
    />
  );
};

export default OverviewFlow;