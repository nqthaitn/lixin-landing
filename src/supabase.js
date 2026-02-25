import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://cncdirblgyvseazxndvj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuY2RpcmJsZ3l2c2VhenhuZHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzMxMTQsImV4cCI6MjA4NzYwOTExNH0.K0f4zhM2TTsNeFCytjxrrH2vDy49EF6QSPtxEW0Hcu0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
