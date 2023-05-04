import App from "#src/app";
import Analyzer from "#compiler/analyzer";
import Generator from "#compiler/generator";

/**
 * To compile plugins
 * @category Runtimes
 * @subcategory Compiler
 * @example
 * import Compiler from "./compiler.js";
 * 
 * const automata = [{
 *      name: '@aikosia/automaton-plugin-rest-example-01',
 *      root: path.normalize(`${__dirname}\/plugins\/@aikosia\/automaton-plugin-rest-example-01`)
 * }]
 * const compiler = new Compiler();
 * const result = await compiler.run({automata});
 * console.log(result);
 * 
 * Console Terminal Output:
 * {
 *  name:"@aikosia/automaton-plugin-rest-example-01",
 *  root:path.normalize(`${mockPath}\/mocks\/plugins\/@aikosia\/automaton-plugin-rest-example-01`),
 *  file:path.normalize(`${mockPath}\/mocks\/plugins\/@aikosia\/automaton-plugin-rest-example-01\/src\/index.js`),
 *  manifest:{
 *      "version": "1.0.0",
 *      "template": "rest",
 *      "profile": "default",
 *      "runParameter": "page",
 *      "cronjob": "false"
 *  },
 *  main: path.normalize(`${mockPath}\/mocks\/plugins\/@aikosia\/automaton-plugin-rest-example-01\/.automaton\/index.mjs`,
 *  module: [Module: null prototype] {...object}
 *  instance: ClassName {...object}
 * }
 * 
 * @extends App
 */
class Compiler extends App{
    #analyzer;
    #generator;

    constructor(){
        super({key:"Core",childKey:"Compiler"});
        this.#analyzer = new Analyzer();
        this.#generator = new Generator();
    }
    
    /**
     * @param {object} options 
     * @param {Array<PluginLoader~LoadedImmutablePlugin>} options.automata 
     * @returns {Promise<Array<Generator~GeneratedImmutablePlugin>>}
     * @async
     */
    async run({automata}){
        const analyzerResult = await this.#analyzer.run({candidates:automata});
        const generatorResult = await this.#generator.run({candidates:analyzerResult});

        return generatorResult;
    }
}

export default Compiler;