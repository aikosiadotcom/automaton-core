import {describe,test,expect ,jest} from '@jest/globals';
import mockApp from "#mock/app"; 
import {PLUGIN_INCLUDE_REGEX} from "#src/constant";
import NpmPackageManager from "#plugin_loader/npm_package_manager";
import TestPackageManager from "#mock/test_package_manager";
import {resolve} from 'import-meta-resolve';

await mockApp({showLog:false});
const PluginLoader = (await import(resolve("#plugin_loader/index",import.meta.url))).default;

describe("given PluginLoader class",()=>{
    describe("when no options pass to constructor",()=>{
        test("then should throw error",()=>{
            expect(()=>new PluginLoader({})).toThrow(Error);
        });
    });

    describe("when required options includeRegex, packageManager is pass to constructor",()=>{
        test("then should get the returned immutable instance",()=>{
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
            test("then property candidates = 1 (immutable) and excluded == 0",async()=>{
                const loader = new PluginLoader({includeRegex:PLUGIN_INCLUDE_REGEX,excludeRegex:["@aikosiadotcom"],packageManager:new TestPackageManager()});
                const result = await loader.ls();
                expect(result["candidates"].length).toBeGreaterThan(0);
                // console.log("copy this",result);
                expect(result["excluded"].length).toEqual(0);
                expect(()=>result["excluded"] = null).toThrow();
                expect(()=>result["installed"] = null).toThrow();
                expect(()=>result["candidates"] = null).toThrow();
                expect(()=>result["candidates"][0] = null).toThrow();
                expect(()=>result["candidates"][0].name = null).toThrow();
                expect(()=>result["candidates"][0].root = null).toThrow();
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