import {jest} from '@jest/globals';

let mockReturnValue;

const supabase = {
    from:function(){
        return {
            insert:function(args){
                mockReturnValue = args;
            }
        }
    },
    get:()=>mockReturnValue
}

jest.unstable_mockModule('@supabase/supabase-js',()=>({
    'createClient':jest.fn()
}));

export const supabase_ = await import('@supabase/supabase-js');

export default supabase