export default env;
declare const env: Env;
/**
 * For easy manage process.env.NODE_ENV
 */
declare class Env {
    /**
     * @returns {boolean} process.env.NODE_ENV === 'testing'
     */
    isTest(): boolean;
    /**
     * @returns {boolean} process.env.NODE_ENV === 'development'
     */
    isDev(): boolean;
    /**
     * @returns {boolean} process.env.NODE_ENV === 'production'
     */
    isPro(): boolean;
    /**
     * Capitalize process.env.NODE_ENV
     * @throws if NODE_ENV not set
     * @returns {'Development' | 'Production' | 'Testing'}
     */
    getCapitalize(): 'Development' | 'Production' | 'Testing';
}
