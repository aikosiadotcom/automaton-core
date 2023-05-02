import Automaton, { decorators } from "@aikosia/automaton-core";

class AutomatonPluginRestExample02 extends Automaton{
    constructor(){
        super({key:"AutomatonPluginRestExample02"});
    }

    @decorators.firman
    async print({name}){
        return `Hello, ${name}`;
    }
}

export default AutomatonPluginRestExample02;