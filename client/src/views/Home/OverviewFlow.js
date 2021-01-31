import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
  ReactFlowProvider,
} from 'react-flow-renderer';
import localforage from 'localforage';

localforage.config({
  name: 'react-flow-docs',
  storeName: 'flows',
});

const flowKey = 'example-flow';

const CustomText = () => (
  <> 
    <div>Only connectable with B</div>
  </>
);

const nodeTypes = {
  customtext: CustomText,
};

const initialElements = [
  {
    id: 'horizontal-1',
    sourcePosition: 'right',
    data: { 
        label: 'Input' 
      },
    position: { x: 0, y: 80 },
  },
  {
    id: 'horizontal-2',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'A Node' + '\n' + 'Yeah'},
    position: { x: 250, y: 0 },
  },
  {
    id: 'horizontal-3',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 3' },
    position: { x: 250, y: 160 },
  },
  {
    id: 'horizontal-4',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 4' },
    position: { x: 500, y: 0 },
  },
  
  {
    id: 'horizontal-7',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 7' },
    position: { x: 750, y: 50 },
  },
  {
    id: 'horizontal-8',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 8' },
    position: { x: 750, y: 300 },
  },
  
];

const OverviewFlow = () => {
  const UpdateNodes = (node) =>{}

  const [elements, setElements] = useState(initialElements);
  const [rfInstance, setRfInstance] = useState(null);

  const onElementsRemove = (elementsToRemove) =>
  setElements((els) => removeElements(elementsToRemove, els));

  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onElementClick = (event, element) => console.log('click', element);
  const onNodeDragStop = (event, node) => {UpdateNodes(node)};

  //ON SAVE
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localforage.setItem(flowKey, flow);
    }
  });

  //ON RESTORE
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = await localforage.getItem(flowKey);
      if (flow) {
        const [x = 0, y = 0] = flow.position;
        setElements(flow.elements || []);
      }
    };
    restoreFlow();
  });

  return (
    <ReactFlowProvider>
      <ReactFlow
        elements={elements}
        nodesConnectable={false}
        nodeTypes={nodeTypes}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onLoad={setRfInstance}
        snapToGrid={true}
        paneMoveable={false}
        snapGrid={[1,1]}
        onNodeDragStop={onNodeDragStop}
        onElementClick={onElementClick}
        deleteKeyCode={46}
        style={{backgroundColor:"#c0c4cf"}}
      >
        
      </ReactFlow>
      < div >
          <button style={{zIndex:"3"}} onClick={onSave}>save</button>
          <button style={{zIndex:"3"}} onClick={onRestore}>restore</button>
        </div>
    </ReactFlowProvider>
  );
};

export default OverviewFlow;