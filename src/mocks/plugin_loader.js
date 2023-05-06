import {jest} from '@jest/globals';
import path from "path";
import {resolve} from 'import-meta-resolve';

const __dirname = resolve("#mock",import.meta.url).replace(process.platform == "win32" ? "file:///" : "file://","");
async function main(opts){
    const location = resolve('#runtime/plugin_loader/index',import.meta.url);
    jest.unstable_mockModule(location.replace(process.platform == "win32" ? "file:///" : "file://",""),()=>({
        default:class PluginLoader{
            async ls(){
              switch (opts.case){
                case 1:
                  //cronjob false
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

                case 2:
                  //no default export
                  return {
                    installed: [
                    ],
                    candidates: [
                      {
                        name: '@aikosia/automaton-plugin-rest-example-04',
                        root: path.normalize(`${__dirname}\/plugins\/@aikosia\/automaton-plugin-rest-example-04`)
                      }
                    ],
                    excluded: []
                  }

                case 3:
                  //for cronjob * * * * * test
                  return {
                    installed: [
                    ],
                    candidates: [
                      {
                        name: '@aikosia/automaton-plugin-rest-example-05',
                        root: path.normalize(`${__dirname}\/plugins\/@aikosia\/automaton-plugin-rest-example-05`)
                      }
                    ],
                    excluded: []
                  }

                  case 4:
                    //for cronjob * * * * * test through error inside cron.schedule
                    return {
                      installed: [
                      ],
                      candidates: [
                        {
                          name: '@aikosia/automaton-plugin-rest-example-06',
                          root: path.normalize(`${__dirname}\/plugins\/@aikosia\/automaton-plugin-rest-example-06`)
                        }
                      ],
                      excluded: []
                    }
              }
            }
        }
    }));
    await import(location);
}


export default async(opts)=>main(opts);