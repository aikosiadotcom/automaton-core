import path from 'path';
import InterfacePackageManager from '../runtimes/plugin_loader/interface_package_manager.js';

const __dirname = path.join(new URL('', import.meta.url).pathname.substring(1));

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