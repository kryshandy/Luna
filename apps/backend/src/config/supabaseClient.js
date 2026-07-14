const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Attention: SUPABASE_URL ou SUPABASE_ANON_KEY manquant dans .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };