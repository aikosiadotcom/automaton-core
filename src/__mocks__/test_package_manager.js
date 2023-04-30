import path from 'path';
import InterfacePackageManager from '../runtimes/plugin_loader/interface_package_manager.js';
import { resolveDirname } from '../system.js';
const __dirname = resolveDirname(import.meta.url);

class TestPackageManager extends InterfacePackageManager{
    constructor(){
        super();
    }

    root(){
        return path.join(__dirname,"..","plugins");
    }

    ls(){
        return  ({
            "name": "test",
            "dependencies": {
              "@aikosia/automaton-plugin-rest-example-01": {},
              "@aikosia/automaton-plugin-rest-example-02": {},
              "@aikosia/automaton-plugin-rest-example-03": {},
            }
          }
          )["dependencies"];
    }
}

export default TestPackageManager;