
function process_prereq(pre_str){
  //regex LETTER*3 SPACE NUM*4(optional LETTER)
  const reg = /( or )?(\w\w\w\s\d\d\d\d\w?( or )?)+/g;

  prereq = pre_str.match(reg);

  //Check if any class codes exist in the prereq
  if(prereq == undefined){
    return []
  }

  //Process the given array to be in the format [ [class1, equiv_class1, ...], [class2]]
  for(var i = 0; i < prereq.length; i++){
    prereq[i] = prereq[i].split(" or ");
    for(var j = 0; j < prereq[i].length; j++){
      prereq[i][j] = prereq[i][j].replace(" ","");

      if(j == prereq[i].length - 1 && prereq[i][j] == ''){
        prereq[i].pop();
      }
    }

  }

  return prereq
}

process_prereq("Prereq: MAC 2312 or MAC 2512 or MAC 3473 with a minimum grade of C.")
process_prereq("Prereq: Knowledge of a programming language.")
process_prereq("Prereq: EEL 3701C.")
process_prereq("Prereq: high-school physics, PHY 2020 or the equivalent, and MAC 2311")
