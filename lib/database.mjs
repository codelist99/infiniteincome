import { neon } from '@neondatabase/serverless';

let sql;
let readyPromise;

function client() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
}

async function query(text, params = []) {
  return client().query(text, params);
}

async function ready() {
  if (!readyPromise) {
    readyPromise = (async () => {
      await query(`CREATE TABLE IF NOT EXISTS leads (
        id BIGSERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        phone TEXT,
        first_name TEXT NOT NULL DEFAULT '',
        last_name TEXT NOT NULL DEFAULT '',
        source TEXT NOT NULL DEFAULT 'website',
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`);
      await query(`CREATE TABLE IF NOT EXISTS orders (
        id BIGSERIAL PRIMARY KEY,
        lead_id BIGINT NOT NULL REFERENCES leads(id),
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        amount NUMERIC(12,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        transaction_id TEXT UNIQUE,
        customer_vault_id TEXT NOT NULL DEFAULT '',
        response_code TEXT NOT NULL DEFAULT '',
        response_message TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`);
    })().catch(error => {
      readyPromise = null;
      throw error;
    });
  }
  return readyPromise;
}

export async function upsertLead(input = {}) {
  await ready();
  const email = String(input.email || '').trim().toLowerCase();
  if (!email) throw new Error('Email is required');
  const rows = await query(`INSERT INTO leads(email,phone,first_name,last_name,source,metadata)
    VALUES($1,$2,$3,$4,$5,$6::jsonb)
    ON CONFLICT(email) DO UPDATE SET
      phone=COALESCE(NULLIF(EXCLUDED.phone,''),leads.phone),
      first_name=COALESCE(NULLIF(EXCLUDED.first_name,''),leads.first_name),
      last_name=COALESCE(NULLIF(EXCLUDED.last_name,''),leads.last_name),
      metadata=leads.metadata || EXCLUDED.metadata,
      updated_at=NOW()
    RETURNING *`, [email, String(input.phone || '').trim(), String(input.first_name || '').trim(), String(input.last_name || '').trim(), String(input.source || 'website'), JSON.stringify(input.metadata || {})]);
  return rows[0];
}

export async function createOrder(leadId, product) {
  await ready();
  const rows = await query(`INSERT INTO orders(lead_id,product_id,product_name,amount)
    VALUES($1,$2,$3,$4) RETURNING *`, [leadId, product.id, product.name, product.amount]);
  return rows[0];
}

export async function completeOrder(id, result) {
  await ready();
  const rows = await query(`UPDATE orders SET status='paid',transaction_id=$1,customer_vault_id=$2,
    response_code=$3,response_message=$4,updated_at=NOW() WHERE id=$5 RETURNING *`,
    [result.transactionId, result.customerVaultId, result.responseCode, result.responseText, id]);
  return rows[0];
}

export async function declineOrder(id, error) {
  await ready();
  await query(`UPDATE orders SET status='declined',response_code=$1,response_message=$2,updated_at=NOW() WHERE id=$3`,
    [String(error.code || 'declined'), String(error.message || 'Declined'), id]);
}
