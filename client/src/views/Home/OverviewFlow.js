import React, { useState } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
} from 'react-flow-renderer';
import initialElements from './initial-elements';

const onLoad = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};

const OverviewFlow = () => {
  const [elements, setElements] = useState(initialElements);

  const onElementsRemove = (elementsToRemove) =>
  setElements((els) => removeElements(elementsToRemove, els));

  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onElementClick = (event, element) => console.log('click', element);
  const onNodeDragStop = (event, node) => console.log('drag stop', node);

  return (
    <ReactFlow
      elements={elements}
      nodesConnectable={false}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      snapToGrid={true}
      paneMoveable={false}
      snapGrid={[1,1]}
      onNodeDragStop={onNodeDragStop}
      onElementClick={onElementClick}
      deleteKeyCode={46}
    >
    </ReactFlow>
  );
};

export default OverviewFlow;