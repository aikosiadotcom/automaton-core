export default NpmPackageManager;
/**
 * The idea is instead of build custom package manager, why dont just build plugins on top of the [NPM]{@link https://www.npmjs.com/} Infrastructures and get all the benefit from it? don't reinvent the wheel, right?
 *
 * @category Runtimes
 * @subcategory Loader
 * @class
 * @extends InterfacePackageManager
 */
declare class NpmPackageManager extends InterfacePackageManager {
    /**
     * @override
     */
    override ls(): any;
    /**
     * @override
     */
    override resolve(name: any): any;
    /**
     * @override
     */
    override search(name: any): Promise<any>;
}
import InterfacePackageManager from "#bot_loader/interface_package_manager";
