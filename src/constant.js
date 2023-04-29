import cron from 'node-cron';
import { deepFreeze } from 'deep-freeze-es6';

export const PLUGIN_NAMING_PREFIX = deepFreeze({
    'rest':'automaton-plugin-rest-',
    'crawler':'automaton-plugin-crawler-'
})

export const PLUGIN_INCLUDE_REGEX = deepFreeze([
    `@aikosia/${PLUGIN_NAMING_PREFIX['rest']}`,
    `@aikosia/${PLUGIN_NAMING_PREFIX['crawler']}`
]);

export const PLUGIN_IGNORE_REGEX = Object.freeze([
]);

export const SCHEMA_TEMPLATE_TYPE = deepFreeze([
    'rest',
    'crawler'
]);

export const SCHEMA_RUN_PARAMETER = deepFreeze([
    'context',
    'page',
    'null'
]);


export const SCHEMA = deepFreeze({
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
        if(value === "false"){
            cb(null,null);
        }else{
            if(!cron.validate(value)){
                cb({message:`wrong syntax of ${path} field. Please read: https://www.npmjs.com/package/node-cron`});
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
})