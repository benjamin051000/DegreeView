function parse_req(pre_str){
  const reg=/( or )?(\w\w\w\s\d\d\d\d\w?( or )?)+/g;
  prereq = pre_str.match(reg)

  for(var i = 0; i < prereq.length; i++){
    prereq[i] = prereq[i].split(" or ");
    for(var j = 0; j < prereq.length; j++){
      prereq[i][j] = prereq[i][j].replace(" ","");

      if(j == prereq[i].length - 1 && prereq[i][j] ==''){
        prereq[i].pop();
      }
    }
  }
}