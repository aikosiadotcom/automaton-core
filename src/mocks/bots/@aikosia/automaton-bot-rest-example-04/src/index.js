await import('../../../../axios.js');
await import('../../../../playwright-core.js');

const {default:Automaton,Decorators} = await import('#core');

class AutomatonBotRestExample04 extends Automaton{
    constructor(){
        super({key:"AutomatonBotRestExample04"});
    }

    async print({name}){
        return `Hello, ${name}`;
    }
}