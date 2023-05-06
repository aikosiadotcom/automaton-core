export default FileExplorer;
/**
 * ~Path
 */
export type FileExplorer = {
    addToKey: 'data' | 'config' | 'cache' | 'log' | 'temp';
    name: string;
};
/**
 * @typedef {object} FileExplorer~Path
 * @property {'data' | 'config' | 'cache' | 'log' | 'temp'} addToKey
 * @property {string} name
*/
/**
 * Create folders to store data for your awesome App. The instance is immutable.
 *
 * @category Features
 * @subcategory Feature
 * @example
 *
 * import FileExplorer from "./file_explorer.js";
 *
 * const explorer = new FileExplorer({
 *      name:"Automaton",
 *      additionalPath:[
 *          {name:"Profile",addToKey:"data"}
 *      ]
 * });
 *
 * console.log(explorer.path);
 *
 * //immutables
 * explorer.path.data = "C:\\jen"; //throw Error
*/
declare class FileExplorer {
    /**
     * @param {object} options
     * @param {string} options.name
     * @param {FileExplorer~Path[]} [options.additionalPath=[]]
     * @param {boolean} [options.dryRun=false]
     */
    constructor({ name, additionalPath, dryRun }: {
        name: string;
    });
    /**
     * `dryRun` is a boolean option in the `FileExplorer` class constructor that, when set to
    `true`, creates the necessary directories for the app's data storage without actually
    writing any files to disk. This is useful for testing and debugging purposes, as it
    allows the developer to ensure that the necessary directories are being created without
    cluttering up the file system with unnecessary files.
     * @type {boolean}
     */
    dryRun: boolean;
    /**
     * Creating an object that contains the paths to various directories where the app's
data will be stored. It uses the `envPaths` library to generate these paths based on the app's name
and the current environment (either "Development" or "Production", determined by the
`getCurrentEnv()` method). The `path.join()` method is used to concatenate the app's name and the
current environment into a single string that is passed to `envPaths()`. The resulting object
contains properties for the "data", "config", "cache", "log", and "temp" directories, as well as any
additional directories specified in the `additionalPath` parameter of the constructor.
     * @type {object}
     * @property {string} data
     * @property {string} config
     * @property {string} cache
     * @property {string} log
     * @property {string} temp
     * @property {string} env - "The location of .env file"
     */
    path: object;
    /**
     * @type {object}
     * @property {function} isDev() - true if process.env.NODE_ENV === 'development' otherwise false
     * @property {function} isPro() - true if process.env.NODE_ENV === 'production' otherwise false
     * @property {function} changeToPro() - set process.env.NODE_ENV = 'production'
     * @property {function} changeToPro() - set process.env.NODE_ENV = 'development'
     */
    env: object;
    /**
     * Get normalize current environment string based on process.env.NODE_ENV
     *
     * @throws {Error} if process.env.NODE_ENV value not between 'development' or 'production'
     * @returns {'Development' | 'Production'}
     */
    getCurrentEnv(): 'Development' | 'Production';
}
