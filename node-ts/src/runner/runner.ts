import { simpleTimeout } from "../limits/timelimit.js";
import { runCppCode } from "../compo/coderunner.js";
import {Problem} from "../model/problem.js"
let lang = "cpp",code="",problem=12;

let status="accepted";

export const collect =  (summitedlang:string,summitedcode:string,problemid:number)=>{
   lang =summitedlang,code = summitedcode,problem=problemid;
}
const selectedProblem = await Problem.findById(problem); // not { _id: problem }

if (!selectedProblem) {
  throw new Error('Problem not found');
}

const allInput = selectedProblem.allInput ?? '';
const allOutput = selectedProblem.allOutput ?? '';
export const runner =async ()=>{

if(lang=="cpp"){
    
try{ const arr: string[] = allInput
  .split(/\n\*\n/)        // split where the line is exactly '*'
  .map(s => s.trim())     // trim each part
  .filter(Boolean);

  const arr2: string[] = allOutput
  .split(/\n\*\n/)        // split where the line is exactly '*'
  .map(s => s.trim())     // trim each part
  .filter(Boolean);
  
  for (let i = 0; i < arr.length; i++) {
    const input = arr[i];
    let program = "",result=false;
    try {
         program = await runCppCode(code, input);

    }
    catch (error) {
      console.error('Error running code:', error);
      return "error on runner";
    }
    
   try {
       result =  await simpleTimeout(() => runCppCode(code, input),3000);
    }
    catch (error) {
      console.error('Error running code:', error);
      return "time limit exceeded";
    }
    result ? status = "accepted" : status = "time limit exceeded";
    if(status=="accepted")
    program === arr2[i] ? status = "accepted" : status = "wrong answer";
  }

  return status;

}
catch (error) {
  console.error('Error running code:', error);
  return "error on runner";

}
 }
}