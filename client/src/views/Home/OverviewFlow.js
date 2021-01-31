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

const OverviewFlow = ({ nodes, setNodes }) => {
  const [rfInstance, setRfInstance] = useState(null);


  const onElementsRemove = (elementsToRemove) =>
    setNodes((els) => removeElements(elementsToRemove, els));

  const onConnect = (params) => setNodes((els) => addEdge(params, els));
  const onElementClick = (event, element) => console.log('click', element);
  const onNodeDragStop = (event, node) => { UpdateNodes(node) };

  const prereqUpdate = (flow) => {
    flow.elements.forEach(element => {
      if (element.id === 'ENC3246') {
        flow.elements.push({
          id: 'edge-' + element.id + '-' + 'MAC2311',
          source: 'ENC3246',
          target: 'MAC2311',
          type: 'smoothstep',
          animated: true,
          arrowHeadType: 'arrow',
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
      setNodes(flow.elements || []);
    }
  };

  const UpdateNodes = (node) => {
    onSave();
    onRestore();
  }

  return (
    <ReactFlow
      elements={nodes}
      nodesConnectable={false}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={setRfInstance}
      snapToGrid={true}
      snapGrid={[225, 133]}
      paneMoveable={false}
      onNodeDragStop={onNodeDragStop}
      onElementClick={onElementClick}
      deleteKeyCode={46}
      style={{ backgroundColor: "#c0c4cf" }}
    />
  );
};

export default OverviewFlow;