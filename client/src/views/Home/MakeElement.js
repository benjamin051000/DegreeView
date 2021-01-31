
/**
 * Constructs nodes in the flowchart library.
 * @param {string} id - course code
 * @param {string} label
 * @param {object} position - {x: int, y: int}, canvas position
 */
function makeNode(id, label, position) {
    return {
        id: id,
        sourcePosition: 'right',
        data: {label: label},
        position: position
    };
}


function makeEdge(id, label, src, target) {
    // TODO
}


export default makeNode;

// const prereqUpdate = (flow) => {
//     flow.elements.forEach(element => {
//       if(element.id === 'horizontal-4'){
//         flow.elements.push({
//           id:'edge-' + element.id + '-' + 'horizontal-7',
//           source: element.id,
//           target: 'horizontal-7',
//           type: 'smoothstep',
//           animated: true,
//           arrowHeadType: 'arrowclosed',
//           style: { stroke: '#435985' }
//         })
//       }
//     });
//     console.log(flow.elements)
//     return flow;
//   }