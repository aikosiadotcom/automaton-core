import {describe,test,expect ,jest} from '@jest/globals';
import mockAbility from "../../__mocks__/ability.js"; 
import path from "path";
import {PLUGIN_INCLUDE_REGEX} from "../../constant.js";
import NpmPackageManager from "./npm_package_manager.js";
import TestPackageManager from "../../__mocks__/test_package_manager.js";
import { resolveDirname } from '../../system.js';

const __dirname = resolveDirname(import.meta.url);
await mockAbility(path.join(__dirname,"..","..",".."),{showLog:false});
const PluginLoader = (await import("./index.js")).default;

describe("given PluginLoader class",()=>{
    describe("when no options pass to constructor",()=>{
        test("then should throw error",()=>{
            expect(()=>new PluginLoader({})).toThrow(Error);
        });
    });

    describe("when required options includeRegex, packageManager is pass to constructor",()=>{
        test("then should get the instance and properties of root, packages should be immutables",()=>{
            const loader = new PluginLoader({includeRegex:PLUGIN_INCLUDE_REGEX,packageManager:new NpmPackageManager()});
            expect(loader.root).toContain("node_modules");
            expect(()=>{
                loader.root = []
            }).toThrowError()
            expect(()=>{
                loader.packages = []
            }).toThrowError()
        }); 
    });
 
    // describe("given includeRegex pass to constructor using NpmPackageManager",()=>{
    //     describe("when ls method is called",()=>{
    //         test("then the return is immutable and property candidates should be greater than 0",async()=>{
    //             const loader = new PluginLoader({includeRegex:PLUGIN_INCLUDE_REGEX,packageManager:new NpmPackageManager()});
    //             const result = await loader.ls();
    //             expect(result["candidates"].length).toBeGreaterThan(0);
    //             expect(()=>{
    //                 result.candidates = []
    //             }).toThrowError()
    //         });
    //     });
    // });

    describe("given incudeRegex match and excludeRegex match pass to constructor using TestPackageManager",()=>{
        describe("when ls method is called",()=>{
            test("then property candidates == 0 and excluded == 1",async()=>{
                const loader = new PluginLoader({includeRegex:PLUGIN_INCLUDE_REGEX,excludeRegex:["@aikosia"],packageManager:new TestPackageManager()});
                const result = await loader.ls();
                expect(result["candidates"].length).toEqual(0);
                expect(result["excluded"].length).toBeGreaterThan(0);
            });
        });
    });

    describe("given incudeRegex match and excludeRegex not match pass to constructor using TestPackageManager",()=>{
        describe("when ls method is called",()=>{
            test("then property candidates = 1 and excluded == 0",async()=>{
                const loader = new PluginLoader({includeRegex:PLUGIN_INCLUDE_REGEX,excludeRegex:["@aikosiadotcom"],packageManager:new TestPackageManager()});
                const result = await loader.ls();
                expect(result["candidates"].length).toBeGreaterThan(0);
                // console.log("copy this",result);
                expect(result["excluded"].length).toEqual(0);
            });
        });
    });

    describe("given includeRegex not match && excludeRegex match pass to constructor using TestPackageManager",()=>{
        describe("when ls method is called",()=>{
            test("then property candidates == 0 and excluded == 1",async()=>{
                //because excludeRegex is filter based on candidates
                const loader = new PluginLoader({includeRegex:PLUGIN_INCLUDE_REGEX,excludeRegex:["@aikosia"],packageManager:new TestPackageManager()});
                const result = await loader.ls();
                expect(result["candidates"].length).toEqual(0);
                expect(result["excluded"].length).toBeGreaterThan(0);
            });
        });
    });

    
    describe("given includeRegex not match && excludeRegex not match pass to constructor using TestPackageManager",()=>{
        describe("when ls method is called",()=>{
            test("then property candidates == 0 and excluded == 0",async()=>{
                //because excludeRegex is filter based on candidates
                const loader = new PluginLoader({includeRegex:["test"],excludeRegex:["@aikosiadotcom"],packageManager:new TestPackageManager()});
                const result = await loader.ls();
                expect(result["candidates"].length).toEqual(0);
                expect(result["excluded"].length).toEqual(0);
            });
        });
    });
});