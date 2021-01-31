import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
  ReactFlowProvider,
  Background
} from 'react-flow-renderer';

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
    targetPosition: 'left',
    data: { 
        label: 'Input' 
      },
    position: { x: 37.5, y: 40 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
    },
  },
  {
    id: 'horizontal-2',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'A Node' + '\n' + 'Yeah'},
    position: { x: 37.5, y: 173 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
    },
  },
  {
    id: 'horizontal-3',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 3' },
    position: { x: 37.5, y: 306 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
    },
  },
  {
    id: 'horizontal-4',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 4' },
    position: { x: 37.5, y: 439 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
    },
  },
  
  {
    id: 'horizontal-7',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 7' },
    position: { x: 300-37.5, y: 40 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
    },
  },
  {
    id: 'horizontal-8',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 8' },
    position: { x: 300-37.5, y: 173 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
    },
  },
  
  
];

const OverviewFlow = () => {
  const UpdateNodes = (node) =>{
    onSave();
    onRestore();
  }

  const [elements, setElements] = useState(initialElements);
  const [rfInstance, setRfInstance] = useState(null);

  const onElementsRemove = (elementsToRemove) =>
  setElements((els) => removeElements(elementsToRemove, els));

  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onElementClick = (event, element) => console.log('click', element);
  const onNodeDragStop = (event, node) => {UpdateNodes(node)};

  const prereqUpdate = (flow) => {
    flow.elements.forEach(element => {
      if(element.id === 'horizontal-4'){
        flow.elements.push({
          id:'edge-' + element.id + '-' + 'horizontal-7',
          source: element.id,
          target: 'horizontal-7',
          type: 'smoothstep',
          animated: true,
          arrowHeadType: 'arrowclosed',
          style: { stroke: '#435985' }
        })
      }
    });
    console.log(flow.elements)
    return flow;
  }

  const gridUpdate = (flow) => {
    // flow.elements.forEach(element => {
    //   let elementCenterX = element.position.x + 75;
    //   let elementCenterY = element.position.y + 20;
    //   //For each X
    //   for(let i = 37.5; i < 1800; i + 225){
    //     if(elementCenterX > i - 30 && elementCenterX < i + 180){
    //       //If there is a X in range, then check for Y
    //       for(let j = 40; j < 800; j + 133){
    //         if(elementCenterY > j - 20 && elementCenterY < j + 60 ){
    //           element.position.x = -75 + i * 225 + 37.5;
    //           element.position.y = -20 + i * 133 + 40;
    //         }
    //       }
    //     }

    //   }
    // });
    return flow;
  }

  //ON SAVE
  const onSave = () => {
    if (rfInstance) {
      let flow = rfInstance.toObject();
      flow = prereqUpdate(flow);
      flow = gridUpdate(flow);
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  };

  //ON RESTORE
  const onRestore = () => {
      console.log("in console log 1")
      const flow = JSON.parse(localStorage.getItem(flowKey));
      if (flow) {
        const [x = 0, y = 0] = flow.position;
        console.log("in console log 2")
        setElements(flow.elements || []);
      }
  };

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
        snapGrid={[225,133]}
      >
      
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default OverviewFlow;