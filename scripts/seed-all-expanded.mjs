#!/usr/bin/env node

/**
 * Seed all expanded data into Supabase
 * Adds comprehensive candidate coverage for:
 * - Loudoun County, VA
 * - Lincoln County, NC
 * - Lehi, UT
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

// Use service role key to bypass RLS policies
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const seedFiles = [
  { name: 'Loudoun County Expanded', file: 'seed-data-loudoun-expanded.sql' },
  { name: 'Lincoln County Expanded', file: 'seed-data-lincoln-expanded.sql' },
  { name: 'Lehi Expanded', file: 'seed-data-lehi-expanded.sql' }
];

async function parseCandidateInsert(statement) {
  const candidateMatches = statement.matchAll(/\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*ARRAY\[([^\]]+)\]\s*\)/g);

  const results = [];
  for (const match of candidateMatches) {
    const [, id, name, office, party, bio, zipCodesStr] = match;
    const zip_codes = zipCodesStr.split(',').map(z => z.trim().replace(/'/g, ''));

    const { error } = await supabase.from('candidates').insert({
      id,
      name,
      office,
      party,
      bio,
      zip_codes
    });

    if (error && !error.message.includes('duplicate')) {
      results.push({ success: false, name, error: error.message });
    } else if (!error) {
      results.push({ success: true, name });
    } else {
      results.push({ success: true, name, skipped: true });
    }
  }
  return results;
}

async function parsePositionInsert(statement) {
  const positionMatches = statement.matchAll(/\('([^']+)',\s*'([^']+)',\s*(\d+),\s*'([^']+)',\s*'([^']+)'\)/g);

  const results = [];
  for (const match of positionMatches) {
    const [, candidate_id, issue_id, position, position_text, source_id] = match;

    const { error } = await supabase.from('candidate_positions').insert({
      candidate_id,
      issue_id,
      position: parseInt(position),
      position_text,
      source_id
    });

    if (error && !error.message.includes('duplicate')) {
      results.push({ success: false, error: error.message });
    } else if (!error) {
      results.push({ success: true });
    } else {
      results.push({ success: true, skipped: true });
    }
  }
  return results;
}

async function seedFile(fileName, displayName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🌱 Seeding ${displayName}...`);
  console.log('='.repeat(60));

  try {
    const sqlPath = join(__dirname, '..', 'supabase', fileName);
    const sqlContent = readFileSync(sqlPath, 'utf-8');

    // Split by INSERT statements
    const statements = sqlContent
      .split(/INSERT INTO/)
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => 'INSERT INTO' + stmt);

    console.log(`📝 Found ${statements.length} SQL statements\n`);

    let candidatesAdded = 0;
    let candidatesSkipped = 0;
    let positionsAdded = 0;
    let positionsSkipped = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;

      const tableMatch = statement.match(/INSERT INTO\s+(\w+)/);
      const tableName = tableMatch ? tableMatch[1] : 'unknown';

      console.log(`⏳ Processing ${tableName}...`);

      if (tableName === 'candidates') {
        const results = await parseCandidateInsert(statement);
        for (const result of results) {
          if (result.success && !result.skipped) {
            console.log(`  ✓ Inserted candidate: ${result.name}`);
            candidatesAdded++;
          } else if (result.skipped) {
            console.log(`  ℹ️  Candidate already exists: ${result.name}`);
            candidatesSkipped++;
          } else {
            console.error(`  ⚠️  Warning for candidate "${result.name}":`, result.error);
          }
        }
      } else if (tableName === 'candidate_positions') {
        const results = await parsePositionInsert(statement);
        for (const result of results) {
          if (result.success && !result.skipped) {
            positionsAdded++;
          } else if (result.skipped) {
            positionsSkipped++;
          } else {
            console.error(`  ⚠️  Warning for position:`, result.error);
          }
        }
        console.log(`  ✓ Processed ${results.length} positions`);
      }
    }

    console.log(`\n✅ ${displayName} seeding completed!`);
    console.log(`   📊 Candidates added: ${candidatesAdded}`);
    console.log(`   📊 Candidates skipped: ${candidatesSkipped}`);
    console.log(`   📊 Positions added: ${positionsAdded}`);
    console.log(`   📊 Positions skipped: ${positionsSkipped}`);

    return { candidatesAdded, candidatesSkipped, positionsAdded, positionsSkipped };
  } catch (error) {
    console.error(`❌ Error seeding ${displayName}:`, error);
    throw error;
  }
}

async function seedAllData() {
  console.log('🚀 Starting comprehensive data seeding...\n');

  const totals = {
    candidatesAdded: 0,
    candidatesSkipped: 0,
    positionsAdded: 0,
    positionsSkipped: 0
  };

  for (const { name, file } of seedFiles) {
    const results = await seedFile(file, name);
    totals.candidatesAdded += results.candidatesAdded;
    totals.candidatesSkipped += results.candidatesSkipped;
    totals.positionsAdded += results.positionsAdded;
    totals.positionsSkipped += results.positionsSkipped;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('🎉 ALL DATA SEEDING COMPLETED!');
  console.log('='.repeat(60));
  console.log(`\n📊 Grand Total:`);
  console.log(`   ✅ Total candidates added: ${totals.candidatesAdded}`);
  console.log(`   ℹ️  Total candidates skipped: ${totals.candidatesSkipped}`);
  console.log(`   ✅ Total positions added: ${totals.positionsAdded}`);
  console.log(`   ℹ️  Total positions skipped: ${totals.positionsSkipped}`);
  console.log(`\n📍 Coverage Areas:`);
  console.log(`   • Loudoun County, VA (20147, 20148, 20164, 20165)`);
  console.log(`   • Lincoln County, NC (28092, 28090)`);
  console.log(`   • Lehi, UT (84003, 84005, 84043)`);
  console.log(`\n🏛️  Offices Covered:`);
  console.log(`   • County/City Supervisors/Commissioners`);
  console.log(`   • School Boards`);
  console.log(`   • State House/Delegates`);
  console.log(`   • State Senate`);
  console.log(`   • Mayor (Lehi)`);
}

seedAllData().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
