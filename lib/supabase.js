import {createClient} from '@supabase/supabase-js';
export function supabaseServer(){return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})}
export function publicImage(url){if(!url)return null;try{const u=new URL(url);return /^https?:$/.test(u.protocol)?u.href:null}catch{return null}}
