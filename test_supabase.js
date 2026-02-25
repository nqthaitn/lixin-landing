import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cncdirblgyvseazxndvj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuY2RpcmJsZ3l2c2VhenhuZHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzMxMTQsImV4cCI6MjA4NzYwOTExNH0.K0f4zhM2TTsNeFCytjxrrH2vDy49EF6QSPtxEW0Hcu0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
    console.log("Testing insert...");
    const { data, error } = await supabase
        .from('contacts')
        .insert([{
            name: "Test User",
            phone: "0123456789",
            source: 'website'
        }])
        .select();

    if (error) {
        console.error("Supabase Error:", JSON.stringify(error, null, 2));
    } else {
        console.log("Success:", data);
    }
}

test();
