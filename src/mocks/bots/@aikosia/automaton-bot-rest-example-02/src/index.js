import Automaton, { decorators } from "@aikosia/automaton-core";

class AutomatonBotRestExample02 extends Automaton{
    constructor(){
        super({key:"AutomatonBotRestExample02"});
    }

    @decorators.firman
    async print({name}){
        return `Hello, ${name}`;
    }
}

export default AutomatonBotRestExample02;