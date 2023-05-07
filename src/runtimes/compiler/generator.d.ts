export namespace BABEL_OPTIONS {
    export { __dirname as cwd };
    export namespace caller {
        const name: string;
        const supportsStaticESM: boolean;
    }
    export const code: boolean;
    export const ast: boolean;
    export const babelrc: boolean;
    export const presets: (string | {
        modules: boolean;
    })[][];
    export const plugins: (string | {
        version: string;
    })[][];
    export namespace targets {
        const node: string;
        const esmodules: boolean;
    }
}
export default Generator;
/**
 * ~GeneratedImmutableProperties
 */
export type Generator = {
    /**
     * - The path location of compiled file
     */
    main: string;
    /**
     * - Compiled file will be loaded to this property using await import(file) internally. {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import}
     */
    module: object;
    /**
     * - This property will hold instance of exported default variable inside module using syntax new module.default();
     */
    instance: object;
};
declare const __dirname: string;
/**
 * @typedef {object} Generator~GeneratedImmutableProperties
 * @property {string} main - The path location of compiled file
 * @property {object} module - Compiled file will be loaded to this property using await import(file) internally. {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import}
 * @property {object} instance - This property will hold instance of exported default variable inside module using syntax new module.default();
 */
/**
 * @typedef {Analyzer~AnalyzedImmutablePlugin & Generator~GeneratedImmutableProperties} Generator~GeneratedImmutablePlugin
 */
/**
 * This class will compile source code of plugin using [Babel]{@link https://babeljs.io/docs/babel-core#transformfileasync} and store the compiled file into folder .automaton on top of the root directory to run it later.
 * @example
 * import Generator from "./generator.js";
 *
 * const candidates = [{
 *  name:"@aikosia/automaton-bot-rest-example-01",
 *  root:path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01`),
 *  file:path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/src\/index.js`),
 *  manifest:{
 *      "version": "1.0.0",
 *      "template": "rest",
 *      "profile": "default",
 *      "runParameter": "page",
 *      "cronjob": false
 *  }
 * }]
 * const generator = new Generator();
 * const result = await generator.run({candidates});
 * console.log(result);
 *
 * Console Terminal Output:
 * {
 *  name:"@aikosia/automaton-bot-rest-example-01",
 *  root:path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01`),
 *  file:path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/src\/index.js`),
 *  manifest:{
 *      "version": "1.0.0",
 *      "template": "rest",
 *      "profile": "default",
 *      "runParameter": "page",
 *      "cronjob": false
 *  },
 *  main: path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/.automaton\/index.mjs`,
 *  module: [Module: null prototype] {...object}
 *  instance: ClassName {...object}
 * }
 *
 * @category Runtimes
 * @subcategory Compiler
 * @extends App
 */
declare class Generator extends App {
    constructor();
    /**
     * Run the generator
     * @param {object} options
     * @param {Array<Analyzer~AnalyzedImmutablePlugin>} options.candidates
     *
     * @returns {Promise<Array<Generator~GeneratedImmutablePlugin>>}
     *
     * @async
     */
    run({ candidates }: object): Promise<Array<Generator>>;
    #private;
}
import App from "#src/app";
