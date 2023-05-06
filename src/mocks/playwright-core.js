import {jest} from '@jest/globals';

jest.unstable_mockModule('playwright-core',()=>({
    chromium:{
        connectOverCDP:()=>({
            contexts:()=>[{
                on:()=>"mock",
                newPage:()=>({
                    close:()=>"mock"
                })
            }]
        })
    }
}));

export default await import('playwright-core');