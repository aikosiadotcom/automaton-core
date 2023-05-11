/**
 * For easy manage process.env.NODE_ENV
 */
class Env{
    /**
     * @returns {boolean} process.env.NODE_ENV === 'testing'
     */
   isTest(){
        return process.env.NODE_ENV === 'testing'
   }

   /**
    * @returns {boolean} process.env.NODE_ENV === 'development'
    */
   isDev(){
        return process.env.NODE_ENV === 'development';
   }

   /**
    * @returns {boolean} process.env.NODE_ENV === 'production'
    */
   isPro(){
        return process.env.NODE_ENV === 'production';
   }

   /**
    * Capitalize process.env.NODE_ENV
    * @throws if NODE_ENV not set
    * @returns {'Development' | 'Production' | 'Testing'}
    */
   getCapitalize(){
        if(process.env.NODE_ENV == 'development'){
            return 'Development';
        }else if(process.env.NODE_ENV == 'production'){
            return 'Production';
        }else if(process.env.NODE_ENV == 'testing'){
            return 'Testing';
        }

        throw new Error(`Unknown ${process.env.NODE_ENV} Environment. Please set process.env.NODE_ENV`);
   }
}

const env = new Env();

export default env;