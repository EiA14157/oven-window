import {solve} from './engine.mjs';
onmessage=({data})=>{try{postMessage(solve(data));}catch{postMessage({status:'invalid',errors:['The plan could not be checked. Review the inputs and try again.']});}};
