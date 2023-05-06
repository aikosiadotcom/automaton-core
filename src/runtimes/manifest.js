import deepFreeze from "deep-freeze-es6";
import cron from 'node-cron';

/**
 * @module Manifest
 * @category Runtimes
 * @subcategory Compiler
 */

/**
 * @typedef {object} Schema
 * @property {'1.0.0'} version
 * @property {module:Manifest~SCHEMA_TEMPLATE_TYPE} template
 * @property {string} profile 
 * @property {module:Manifest~SCHEMA_RUN_PARAMETER} runParameter
 * @property {boolean} cronJob
 */

/**
 * @constant {Array<'rest'|'crawler'>} SCHEMA_TEMPLATE_TYPE
 */
export const SCHEMA_TEMPLATE_TYPE = deepFreeze([
    'rest',
    'crawler'
]);

/**
 * @constant {Array<'context'|'page'|'null'>} SCHEMA_RUN_PARAMETER
 */
export const SCHEMA_RUN_PARAMETER = deepFreeze([
    'context',
    'page',
    'null'
]);

/**
 * @constant {object} SCHEMA_JSON_VALIDATOR
 * @see https://www.npmjs.com/package/json-validator#usage--examples
 */
export const SCHEMA_JSON_VALIDATOR = deepFreeze({
    version: {
      required: true,
      trim:true,
      enum: ['1.0.0']
    },
    template:{
        required:true,
        trim:true,
        enum: SCHEMA_TEMPLATE_TYPE
    },
    cronjob: {
      required: true,
      trim: true,
      asyncValidate: function(value, path, cb) {
        if(value == false || value == "false"){
            return cb(null,null);
        }else{
            if(!cron.validate(value)){
                return cb({message:`wrong syntax of ${path} field. Please read: https://www.npmjs.com/package/node-cron`});
            }else{
                return cb(null,null);
            }
        }
      }
    },  
    runParameter: {
      required: true,
      trim:true,
      enum: SCHEMA_RUN_PARAMETER
    },
    profile: {
        required: true,
        trim:true
    }
});