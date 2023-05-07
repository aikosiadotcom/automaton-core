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
     * will be used to search the plugins and perform existence check
     * @async
     * @param {string} - name of your project
     * @returns {Array<Object.<string, string>>}
     */
    search(name: any): Array<{
        [x: string]: string;
    }>;
}
