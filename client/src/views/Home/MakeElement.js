
/**
 * Constructs nodes in the flowchart library.
 * @param {object} course 
 * @param {object} position 
 */
function makeNode(course, position) {
    const id = course.code;
    const label = `${id} (${course.credits} cred.)`;
    const prereqs = course.prereq;
    const coreqs = course.coreq;
    const desc = course.desc;

    return {
        id: id,
        sourcePosition: 'right',
        targetPosition: 'left',
        data: {
            label: label,
            prereqs: prereqs,
            coreqs: coreqs,
            desc: desc
        },
        position: position,
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