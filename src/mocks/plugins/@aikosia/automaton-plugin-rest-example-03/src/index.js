import Automaton, { decorators } from "@aikosia/automaton-core";

class AutomatonPluginRestExample03 extends Automaton{
    constructor(){
        super({key:"AutomatonPluginRestExample03"});
    }

    async print({name}){
        return `Hello, ${name}`;
    }
}

export default AutomatonPluginRestExample03;