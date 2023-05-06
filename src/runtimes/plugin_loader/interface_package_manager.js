import AbstractClassError from "#error/abstract_class_error";


/**
 * Acts as a Interface in case wanna build a custom loader for future use case
 * 
 * @category Runtimes
 * @subcategory Loader
 * @abstract
 * @interface
 */
class InterfacePackageManager{
     constructor(){
          if(this.constructor === InterfacePackageManager){
               throw new AbstractClassError();
          }
     }

     /**
      * This method is not mark async intentionally. so, it can be called inside a constructor class
      * 
      * @returns {string} - The root location of all plugins are stored
      */
     root(){
          //implementation
          return "";
     }

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
     ls(){
          //implementation
          return {
               "plugin_id_01":{},
               "plugin_id_02":{},
               "plugin_id_03":{}
          }
     }
}

export default InterfacePackageManager