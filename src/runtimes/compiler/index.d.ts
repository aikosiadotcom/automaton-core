export default Compiler;
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
 *      "cronjob": false
 *  },
 *  main: path.normalize(`${mockPath}\/mocks\/plugins\/@aikosia\/automaton-plugin-rest-example-01\/.automaton\/index.mjs`,
 *  module: [Module: null prototype] {...object}
 *  instance: ClassName {...object}
 * }
 *
 * @extends App
 */
declare class Compiler extends App {
    constructor();
    /**
     * @param {object} options
     * @param {Array<PluginLoader~LoadedImmutablePlugin>} options.automata
     * @returns {Promise<Array<Generator~GeneratedImmutablePlugin>>}
     * @async
     */
    run({ automata }: object): Promise<Array<Generator>>;
    #private;
}
import App from "#src/app";
import Generator from "#compiler/generator";
