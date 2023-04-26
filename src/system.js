import envPaths from "env-paths";
import path from "path";
import fsExtra from 'fs-extra';

const folder = envPaths(process.env.NODE_ENV != 'production' ? `automaton-dev` :  'automaton', {
    suffix:"",
});

folder.profile = path.join(folder.data,"profile");

for(let [key,value] of Object.entries(folder)){
    await fsExtra.ensureDir(value);
}

function getPath(folderName = ""){
    if(folderName == "env"){
        return path.join(folder["config"],'.env');
    }

    if(folderName != ""){
        return folder[folderName];
    }
    
    return folder;
}

export { getPath }