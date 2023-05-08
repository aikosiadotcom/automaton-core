
import {jest} from '@jest/globals';
import mockApp from "#mock/app";

await mockApp(jest);

const Decorators = await import("../decorators.js");

class DecoratorTest{
    counter = 0;
    innerRetry = 0;
    constructor(){
    }

    @Decorators.dowhile
    async dowhile1(currentPage,...args){
        if(currentPage == 4){
            return true;
        }

        this.counter++;
        return false;
    }

    @Decorators.delay
    async delay1(args){
    }

    @Decorators.delay({min:1,max:1,meta:"hi, jen !"})
    async delay2(args){
        this.innerMethod();
    }

    @Decorators.retry
    async retry1(){
        this.innerRetry++;

        if(this.innerRetry == 2){
            return "hi, firman !";
        }
        throw new Error("hello world");
    }

    @Decorators.retry({min:1,max:1,meta:"hi, firman !"})
    async retry2(){
        throw new Error("hello world");
    }

    async innerMethod(){
        console.log("test this");
    }
}
export default DecoratorTest;