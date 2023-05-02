import InterfacePackageManager from "#plugin_loader/interface_package_manager";
import { execSync } from "child_process";

class NpmPackageManager extends InterfacePackageManager{
    constructor(){
        super();
    }

    root(){
        return execSync(`npm root -g`).toString().replace("\n", "");
    }

    ls(){
        return  JSON.parse(execSync(`npm ls -g --depth=0 --json=true`).toString())["dependencies"];
    }
}

export default NpmPackageManager;