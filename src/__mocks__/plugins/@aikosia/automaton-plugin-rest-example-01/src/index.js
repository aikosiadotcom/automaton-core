import Automaton, { Decorators } from "@aikosia/automaton-core";

class AutomatonPluginRestExample01 extends Automaton{
    constructor(){
        super({key:"AutomatonPluginRestExample01"});
    }

    async print({name}){
        return `Hello, ${name}`;
    }
}

export default AutomatonPluginRestExample01;