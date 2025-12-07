// Backend Health Check Script
// Run this to verify your backend is deployed and working

const API_URL = 'https://bangladeshi-supershop-api.onrender.com/api';

async function checkBackend() {
    console.log('🔍 Checking backend health...\n');

    try {
        // Test 1: Health endpoint
        console.log('Test 1: Health Check');
        const healthRes = await fetch(`${API_URL}/health`);
        const healthData = await healthRes.json();
        console.log('✅ Health:', healthRes.status, healthData);
        console.log('');

        // Test 2: User routes (will fail without auth, but shouldn't 404)
        console.log('Test 2: User Routes Exist');
        const userRes = await fetch(`${API_URL}/admin/users`);
        console.log('Status:', userRes.status);
        
        if (userRes.status === 404) {
            console.log('❌ PROBLEM: Routes not deployed! Status 404');
            console.log('Action needed: Manually deploy on Render dashboard');
        } else if (userRes.status === 401) {
            console.log('✅ Routes exist! (401 = needs authentication)');
        } else {
            const text = await userRes.text();
            console.log('Response:', text.substring(0, 100));
        }
        console.log('');

        // Test 3: Stats endpoint
        console.log('Test 3: Stats Endpoint');
        const statsRes = await fetch(`${API_URL}/admin/users/stats/overview`);
        console.log('Status:', statsRes.status);
        
        if (statsRes.status === 404) {
            console.log('❌ Stats route not found');
        } else if (statsRes.status === 401) {
            console.log('✅ Stats route exists!');
        }
        console.log('');

        console.log('='.repeat(50));
        if (userRes.status === 404 || statsRes.status === 404) {
            console.log('⚠️  ACTION REQUIRED:');
            console.log('1. Go to https://dashboard.render.com');
            console.log('2. Find: bangladeshi-supershop-api');
            console.log('3. Click "Manual Deploy"');
            console.log('4. Wait 2-3 minutes');
            console.log('5. Run this script again');
        } else {
            console.log('✅ Backend is deployed correctly!');
            console.log('Your user management page should work now.');
        }

    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.log('\nPossible issues:');
        console.log('- Backend not deployed yet');
        console.log('- Render service not created');
        console.log('- Network/CORS issues');
    }
}

checkBackend();
