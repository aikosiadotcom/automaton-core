import InterfacePackageManager from "#bot_loader/interface_package_manager";
import { execSync } from "child_process";

/**
 * The idea is instead of build custom package manager, why dont just build plugins on top of the [NPM]{@link https://www.npmjs.com/} Infrastructures and get all the benefit from it? don't reinvent the wheel, right?
 * 
 * @category Runtimes
 * @subcategory Loader
 * @class
 * @extends InterfacePackageManager
 */
class NpmPackageManager extends InterfacePackageManager{
    constructor(){
        super();
    }

    /**
     * @override
     */
    root(){
        return execSync(`npm root -g`).toString().replace("\n", "");
    }

    /**
     * @override
     */
    ls(){
        return  JSON.parse(execSync(`npm ls -g --depth=0 --json=true`).toString())["dependencies"];
    }

    /**
     * @override
     */
    resolve(name){
        return path.join(this.root(),name);
    }

    /**
     * @override
     */
    async search(name){
        return JSON.parse(execSync(`npm search ${name} --json --no-description --prefer-online`).toString());
    }
}

export default NpmPackageManager;