import {jest} from '@jest/globals';
import path from "path";
import {resolve} from 'import-meta-resolve';

const __dirname = resolve("#mock",import.meta.url).replace("file:///","");
async function main(opts){
    const location = resolve('#runtime/plugin_loader/index',import.meta.url);
    jest.unstable_mockModule(location.replace("file:///",""),()=>({
        default:class PluginLoader{
            async ls(){
                return {
                    installed: [
                      {
                        name: '@aikosia/automaton-plugin-rest-example-01',
                        root: path.normalize(`${__dirname}\/plugins\/@aikosia\/automaton-plugin-rest-example-01`)
                      },
                      {
                        name: '@aikosia/automaton-plugin-rest-example-02',
                        root: path.normalize(`${__dirname}\/plugins\/@aikosia\/automaton-plugin-rest-example-02`)
                      },
                      {
                        name: '@aikosia/automaton-plugin-rest-example-03',
                        root: path.normalize(`${__dirname}\/plugins\/@aikosia\/automaton-plugin-rest-example-03`)
                      }
                    ],
                    candidates: [
                      {
                        name: '@aikosia/automaton-plugin-rest-example-01',
                        root: path.normalize(`${__dirname}\/plugins\/@aikosia\/automaton-plugin-rest-example-01`)
                      },
                      {
                        name: '@aikosia/automaton-plugin-rest-example-02',
                        root: path.normalize(`${__dirname}\/plugins\/@aikosia\/automaton-plugin-rest-example-02`)
                      },
                      {
                        name: '@aikosia/automaton-plugin-rest-example-03',
                        root: path.normalize(`${__dirname}\/plugins\/@aikosia\/automaton-plugin-rest-example-03`)
                      }
                    ],
                    excluded: []
                  }
            }
        }
    }));
    await import(location);
}


export default async(opts)=>main(opts);