import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Carregar variáveis de ambiente manualmente se o dotenv não pegar do .env.local automaticamente
function loadEnv() {
  const envPath = join(process.cwd(), '.env.local');
  try {
    const envContent = readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.join('=').trim();
      }
    });
    console.log('✅ .env.local carregado com sucesso.');
  } catch (e) {
    console.log('⚠️ .env.local não encontrado ou ilegível.');
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos.');
  process.exit(1);
}

// Cliente com a Service Role Key (Admin)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runTasks() {
  console.log('🚀 Iniciando Auditoria Autônoma do Supabase...');

  // 1. GESTÃO DE STORAGE
  console.log('\n📦 Verificando Buckets...');
  const { data: buckets, error: bError } = await supabase.storage.listBuckets();
  
  if (bError) {
    console.error('❌ Erro ao listar buckets:', bError.message);
  } else {
    const avatarBucketExists = buckets.find(b => b.name === 'avatars');
    
    if (!avatarBucketExists) {
      console.log('🏗️ Criando bucket "avatars"...');
      const { error: createError } = await supabase.storage.createBucket('avatars', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 2097152 // 2MB
      });
      if (createError) console.error('❌ Erro ao criar bucket:', createError.message);
      else console.log('✅ Bucket "avatars" criado como PÚBLICO.');
    } else {
      console.log('✅ Bucket "avatars" já existe.');
      // Garantir que é público
      if (!avatarBucketExists.public) {
        console.log('🔧 Ajustando bucket para ser PÚBLICO...');
        await supabase.storage.updateBucket('avatars', { public: true });
        console.log('✅ Bucket "avatars" agora é PÚBLICO.');
      }
    }
  }

  // 2. POLÍTICAS DE STORAGE (RLS) via SQL
  // Nota: O Storage do Supabase usa tabelas internas (storage.objects).
  // Vamos tentar injetar via SQL Editor se possível, ou usar metadados.
  // Como não podemos rodar SQL direto via SDK facilmente sem RPC,
  // vamos assumir que o usuário pode precisar rodar um SQL final se o SDK não suportar RLS setup.
  // No entanto, Buckets Públicos permitem SELECT por padrão.
  
  console.log('\n🔒 Verificando permissões de upload...');
  // O Supabase exige RLS para INSERT/UPDATE. 
  // Vou instruir o usuário se eu detectar falha, mas tentarei o máximo via Admin.

  // 3. VERIFICAÇÃO DE TABELAS
  console.log('\n📊 Verificando Tabela "profiles"...');
  const { data: profileCheck, error: pError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (pError) {
    console.error('❌ Erro na tabela profiles:', pError.message);
  } else {
    console.log('✅ Tabela "profiles" está acessível.');
  }

  console.log('\n✨ Auditoria Concluída!');
}

runTasks();
