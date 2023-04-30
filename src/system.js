import envPaths from "env-paths";
import path from "path";
import fsExtra from 'fs-extra';

let folder;
const projectName = 'Automaton';
const projectEnv = getCurrentEnv();

async function main(){
    folder = envPaths(path.join(projectName,projectEnv), {
        suffix:"",
    });

    folder.profile = path.join(folder.data,"Profile");

    for(let [key,value] of Object.entries(folder)){
        await fsExtra.ensureDir(value);
    }
}

function getPath(folderName = ""){
    if(folderName == "env"){
        return path.join(folder["config"],'.env');
    }

    if(folderName){
        return folder[folderName];
    }
    
    return folder;
}

/* c8 ignore start */
function getCurrentEnv(){
    if(process.env.NODE_ENV == 'testing'){
        return 'Testing';
    }else if(process.env.NODE_ENV == 'development'){
        return 'Development';
    }

    return 'Production';
}
/* c8 ignore end */

await main();

export { getPath, getCurrentEnv }