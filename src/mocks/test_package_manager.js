import path from 'path';
import InterfacePackageManager from '#bot_loader/interface_package_manager';
import {resolve} from 'import-meta-resolve';

const __dirname = resolve("#mock",import.meta.url).replace(process.platform == "win32" ? "file:///" : "file://","");
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
              "@aikosia/automaton-bot-rest-example-01": {},
              "@aikosia/automaton-bot-rest-example-02": {},
              "@aikosia/automaton-bot-rest-example-03": {},
            }
          }
          )["dependencies"];
    }
}

export default TestPackageManager;