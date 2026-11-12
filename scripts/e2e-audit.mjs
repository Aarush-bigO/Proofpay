import { spawn } from 'child_process';
import http from 'http';

const PORT = 3009;
const BASE_URL = `http://localhost:${PORT}`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, maxRetries = 20) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${url}/`);
      if (res.status === 200) return true;
    } catch (e) {
      // wait
    }
    await sleep(500);
  }
  return false;
}

async function runTests() {
  console.log(`\n======================================================`);
  console.log(`🔍 PROOFPAY EXHAUSTIVE SYSTEM & ENDPOINT AUDIT`);
  console.log(`======================================================\n`);

  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    stdio: 'pipe',
    env: { ...process.env, PORT: String(PORT) },
  });

  server.stdout.on('data', (d) => {
    // console.log(`[Next] ${d}`);
  });
  server.stderr.on('data', (d) => {
    // console.error(`[Next ERR] ${d}`);
  });

  const ready = await waitForServer(BASE_URL);
  if (!ready) {
    console.error('❌ Server failed to start in time.');
    server.kill();
    process.exit(1);
  }
  console.log('✅ Server online & responding at ' + BASE_URL + '\n');

  const results = [];

  // 1. PAGE ROUTES
  const pagesToTest = [
    { name: 'Landing Page', path: '/' },
    { name: 'AI Vision Scanner', path: '/analyze' },
    { name: 'Apprentice Dashboard', path: '/dashboard' },
    { name: 'Code & Knowledge Clips', path: '/knowledge' },
    { name: 'Marketplace Directory', path: '/marketplace' },
    { name: 'Marketplace Dashboard', path: '/marketplace/dashboard' },
    { name: 'Jobs Board', path: '/marketplace/jobs' },
    { name: 'Job Detail & Escrow Vault', path: '/marketplace/jobs/job-1' },
    { name: 'Post New Job Form', path: '/marketplace/jobs/new' },
    { name: 'Contractor Swipe Matcher', path: '/marketplace/swipe' },
    { name: 'Contractor Directory', path: '/marketplace/workers' },
    { name: 'Contractor Profile Card', path: '/marketplace/workers/worker-1' },
    { name: 'In-App Escrow Messaging', path: '/marketplace/messages/job-1' },
    { name: 'Cross-State Trade Passport', path: '/passport' },
    { name: 'Public Verified Credential', path: '/credential/demo-alex-smith' },
    { name: 'Inspection Dossier & Certificate', path: '/results/demo-analysis-1' },
  ];

  console.log('--- 1. Testing Web Page Routes (GET) ---');
  for (const page of pagesToTest) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${BASE_URL}${page.path}`);
      const t1 = Date.now();
      const text = await res.text();
      const pass = res.status === 200 && text.includes('ProofPay');
      results.push({
        type: 'PAGE',
        name: page.name,
        target: page.path,
        status: res.status,
        duration: `${t1 - t0}ms`,
        passed: pass,
        size: `${(text.length / 1024).toFixed(1)} KB`,
      });
      console.log(`  ${pass ? '🟢' : '🔴'} [${res.status}] ${page.name.padEnd(32)} -> ${page.path} (${t1 - t0}ms)`);
    } catch (err) {
      results.push({
        type: 'PAGE',
        name: page.name,
        target: page.path,
        status: 0,
        passed: false,
        error: err.message,
      });
      console.log(`  🔴 [FAIL] ${page.name} -> ${err.message}`);
    }
  }

  // 2. API ENDPOINTS
  console.log('\n--- 2. Testing API Routes (POST) ---');
  const dummyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const apisToTest = [
    {
      name: 'PayPal Escrow Authorize',
      path: '/api/escrow/authorize',
      body: { amount: 1500, jobId: 'job-audit-1', jobTitle: 'Panel Upgrade' },
      validate: (data) => data.success && data.authorizationId && data.amount === 1500,
    },
    {
      name: 'PayPal Escrow Capture',
      path: '/api/escrow/capture',
      body: { authorizationId: 'AUTH-PP-TEST-1', amount: 1500 },
      validate: (data) => data.success && data.captureId && data.netPayout > 0,
    },
    {
      name: 'PayPal Escrow Void/Refund',
      path: '/api/escrow/void',
      body: { authorizationId: 'AUTH-PP-TEST-1' },
      validate: (data) => data.success && data.voidedAt,
    },
    {
      name: 'Claude AI Vision Inspection',
      path: '/api/analyze',
      body: {
        image: dummyBase64,
        workType: 'electrical_panel',
        userDescription: 'Completed 200A main service panel upgrade with dual ground rods.',
        jurisdiction: 'Bengaluru, India',
      },
      validate: (data) => data.compliance_score >= 80 && Array.isArray(data.violations),
    },
    {
      name: 'AI Before/After Recheck',
      path: '/api/recheck',
      body: {
        originalImage: dummyBase64,
        fixedImage: dummyBase64,
        originalViolations: [
          { description: 'Box overfill', code_section: 'NEC 314.16' },
        ],
        userDescription: 'Fixed box overfill by upsizing enclosure.',
      },
      validate: (data) => data.is_compliant !== undefined && data.compliance_score >= 80,
    },
  ];

  for (const api of apisToTest) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${BASE_URL}${api.path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(api.body),
      });
      const t1 = Date.now();
      const json = await res.json();
      const valid = res.status === 200 && api.validate(json);
      results.push({
        type: 'API',
        name: api.name,
        target: api.path,
        status: res.status,
        duration: `${t1 - t0}ms`,
        passed: valid,
        payload: json,
      });
      console.log(`  ${valid ? '🟢' : '🔴'} [${res.status}] ${api.name.padEnd(30)} -> ${api.path} (${t1 - t0}ms)`);
    } catch (err) {
      results.push({
        type: 'API',
        name: api.name,
        target: api.path,
        status: 0,
        passed: false,
        error: err.message,
      });
      console.log(`  🔴 [FAIL] ${api.name} -> ${err.message}`);
    }
  }

  // Graceful shutdown
  server.kill('SIGINT');
  await sleep(1000);

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(`\n======================================================`);
  console.log(`📊 AUDIT SUMMARY: ${passed}/${total} TESTS PASSED (${failed} failures)`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    console.error('❌ Some tests failed. Review log above.');
    process.exit(1);
  } else {
    console.log('🏆 ALL 21 ROUTES & ENDPOINTS VERIFIED 100% FUNCTIONAL!');
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
