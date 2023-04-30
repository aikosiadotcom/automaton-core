import Ability from "#src/ability";
import Analyzer from "#src/runtimes/compiler/analyzer";
import Generator from "#src/runtimes/compiler/generator";

class Compiler extends Ability{
    #analyzer;
    #generator;

    constructor(){
        super({key:"Core",childKey:"Compiler"});
        this.#analyzer = new Analyzer();
        this.#generator = new Generator();
    }
    
    async run({automata}){
        const analyzerResult = await this.#analyzer.run({candidates:automata});
        const generatorResult = await this.#generator.run({candidates:analyzerResult});

        return generatorResult;
    }
}

export default Compiler;