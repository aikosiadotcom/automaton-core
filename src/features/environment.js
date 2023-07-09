import path from 'path';
import envPaths from "env-paths";
import {isValidPath} from "@igor.dvlpr/valid-path";
import fsExtra from 'fs-extra';
import { deepFreeze } from 'deep-freeze-es6';

/**
 * @typedef {'development' | 'production' | 'testing'} Environment~Value
 */
/**
 * @typedef {'data' | 'config' | 'cache' | 'log' | 'temp'} Variable~Key
 */

/**
 * Create user and system path similar to windows environment variables
 */
class Variable{
     #root;
     #system;
     #user;
     #systemKeys = ['data','config','cache','log','temp'];

     /**
      * @param {string} root - root path
      */
     constructor(root){
          this.#root = root;

          this.#system = envPaths(this.#root, {
               suffix:"",
          });

          for(let key in this.#system){
               fsExtra.ensureDirSync(this.#system[key]);
          }

          this.#user = {};
     }

     /**
      * To create a new directory relative to system path
      * @param {Variable~Key} key 
      * @param {string} name - new directory or file name. will be relative to available system path
      * @param {boolean} isFile - true if file. otherwise directory
      * @returns {string} the path of created directory or file.
      */
     insertTo(key,name,isFile = false){
          if(!this.#systemKeys.includes(key)){
               throw new Error(`key: '${key}' not valid. available keys: `,this.#systemKeys);
          }
          
          if(this.#systemKeys.includes(name)){
               throw new Error(`'${name}' is reserved name. reserved names:`,this.#systemKeys);
          }

          if(!isValidPath(name,isFile)){
               throw new Error(`'${name}' is not valid.`);
          }

          for(let _key in this.#user){
               if(name === _key){
                    throw new Error(`${name} already exists.`);
               }
          }

          this.#user[name] = path.join(this.#system[key],name);

          if(isFile){
               fsExtra.ensureFileSync(this.#user[name])
          }else{
               fsExtra.ensureDirSync(this.#user[name])
          }

          return this.#user[name];
     }

     /**
      * To get path
      * @param {Variable~key | 'all'} [key = 'all'] 
      * @returns {string | undefined | object<string,string>}
      */
     get(key = 'all'){
          if(key == 'all') return {...this.#system,...this.#user}
          return this.#system[key] ?? this.#user[key]
     }
}


/**
 * Encapsulate environment related data and operation
 */
class Environment{
     #value;
     #name;
     root;
     variable;

     /**
      * @param {object} options 
      * @param {string} options.name - app name
      * @param {Environment~Value} options.value - use process.env.NODE_ENV if you comfort with it
     */
     constructor(options = {}){
          if(!options.name){
               throw new Error(`${options.name} not valid.`);
          }

          if(!['development','testing','production'].includes(options.value)){
               throw new Error(`Unknown Environment Value: '${options.value}'. The value should be one of these: 'development','production','testing'`);
          }

          this.#name = options.name;
          this.#value = options.value;
          this.root = path.join(this.#name,options.value);

          this.variable = new Variable(this.root);

          deepFreeze(this);
     }
    
     /**
      * To check if the current environment is testing
     * @returns {boolean}
     */
     isTest(){
          return this.#value === 'testing';
     }

   
     /**
      * To check if the current environment is development
     * @returns {boolean}
     */
     isDev(){
          return this.#value === 'development';
     }

     /**
      * To check if the current environment is production
      * @returns {boolean}
      */
     isPro(){
          return this.#value === 'production';
     }

     /**
      * @returns {Environment~Value}
      */
     get(){
          return this.#value;
     }
}

export default Environment;