import path from 'path';
import InterfacePackageManager from '#plugin_loader/interface_package_manager';
import {resolve} from 'import-meta-resolve';

const __dirname = resolve("#mock",import.meta.url).replace("file:///");

class TestPackageManager extends InterfacePackageManager{
    constructor(){
        super();
    }

    root(){
        return path.join(__dirname,"plugins");
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