import Automaton, { decorators } from "@aikosia/automaton-core";

class AutomatonBotRestExample03 extends Automaton{
    constructor(){
        super({key:"AutomatonBotRestExample03"});
    }

    async print({name}){
        return `Hello, ${name}`;
    }
}

export default AutomatonBotRestExample03;