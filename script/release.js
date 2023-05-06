import { execSync }  from 'child_process';
import {readPackage} from 'read-pkg';

const json = await readPackage();

try{
    console.log("sync with remote files");
    execSync(`git pull origin`);

    console.log("stage all changes");
    execSync(`git pull origin`);
    
    console.log("commit changes");
    execSync(`git add * && git commit -m \"Release ${json.version}\"`);
    
    console.log("push to server");
    execSync(`git push origin`);

    setTimeout(() => {
        execSync("git pull origin");
    }, 10000);
}catch(err){
    console.log(err.message);
}
