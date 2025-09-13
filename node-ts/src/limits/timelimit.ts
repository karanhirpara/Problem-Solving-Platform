// Check if function runs within time limit using setTimeout
import { runCppCode } from "../compo/coderunner.js";

// Simple version without callback
export const  simpleTimeout = (func: () => any, timeLimit: number):boolean =>{
    var startTime = Date.now();
    var timedOut = false;
    
    setTimeout(function() {
        timedOut = true;
    }, timeLimit);
    
    try {
        var result = func();
        var executionTime = Date.now() - startTime;
        
        if (timedOut || executionTime > timeLimit) {
            return false;
        }
        
        return true;
    } catch (err) {
          let message = 'Unknown error';
        if (err instanceof Error) {
        message = err.message;
       } else {
        message = String(err);
       }
        return false
    }
}

 

// Example functions to test
