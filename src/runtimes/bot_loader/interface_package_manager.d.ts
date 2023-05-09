export default InterfacePackageManager;
/**
 * Acts as a Interface in case wanna build a custom loader for future use case
 *
 * @category Runtimes
 * @subcategory Loader
 * @abstract
 * @interface
 */
declare class InterfacePackageManager {
    /**
     * This method is not mark async intentionally. so, it can be called inside a constructor class
     *
     * @returns {string} - The root location of all plugins are stored
     */
    root(): string;
    /**
     * ls stands for list. So, it will return id of all the plugins. Also, This method is not mark async intentionally. so, it can be called inside a constructor class
     *
     * @example
     *
     * when this method is called, the return shall like this:
     * {
     *   "plugin_id_01":{},
     *   "plugin_id_02":{},
     *   "plugin_id_03":{}
     * }
     *
     * @returns {Object.<string, object>}
     */
    ls(): {
        [x: string]: object;
    };
    /**
     * @param {string} name - project name
     * @returns {string} absolute path of the root project
     */
    resolve(name: string): string;
    /**
     * will be used to search the plugins and perform existence check
     * @async
     * @param {string} - name of your project
     * @returns {Promise<Array<Object.<string, string>>>}
     * @todo This method maybe optional, cause when runtimes running in local it doesn't need this method. but some dependent of this project need this method
     */
    search(name: any): Promise<Array<{
        [x: string]: string;
    }>>;
}
