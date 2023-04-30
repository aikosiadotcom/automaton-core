import {jest} from '@jest/globals';
import path from "path";

async function main(currentDir, opts){
    const location = path.join(currentDir,"runtimes","plugin_loader","index.js");
    jest.unstable_mockModule(location,()=>({
        default:class PluginLoader{
            async ls(){
                return {
                    installed: [
                      {
                        name: '@aikosia/automaton-plugin-rest-example-01',
                        root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\__mocks__\\plugins\\@aikosia\\automaton-plugin-rest-example-01'
                      },
                      {
                        name: '@aikosia/automaton-plugin-rest-example-02',
                        root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\__mocks__\\plugins\\@aikosia\\automaton-plugin-rest-example-02'
                      },
                      {
                        name: '@aikosia/automaton-plugin-rest-example-03',
                        root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\__mocks__\\plugins\\@aikosia\\automaton-plugin-rest-example-03'
                      }
                    ],
                    candidates: [
                      {
                        name: '@aikosia/automaton-plugin-rest-example-01',
                        root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\__mocks__\\plugins\\@aikosia\\automaton-plugin-rest-example-01'
                      },
                      {
                        name: '@aikosia/automaton-plugin-rest-example-02',
                        root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\__mocks__\\plugins\\@aikosia\\automaton-plugin-rest-example-02'
                      },
                      {
                        name: '@aikosia/automaton-plugin-rest-example-03',
                        root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\__mocks__\\plugins\\@aikosia\\automaton-plugin-rest-example-03'
                      }
                    ],
                    excluded: []
                  }["candidates"]
            }
        }
    }));
    await import(location);
}


export default async(currentDir,opts)=>main(currentDir,opts);