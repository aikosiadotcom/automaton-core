import {resolve} from 'import-meta-resolve';

export const dotenv = async()=>(await import(resolve("#mock/dotenv",import.meta.url))).default;
export const envChecker = async(opts)=>(await import(resolve("#mock/node-envchecker",import.meta.url))).default(opts);
export const supabase = async()=>(await import(resolve("#mock/supabase",import.meta.url))).supabase_;
