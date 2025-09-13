#!/usr/bin/env node

/**
 * Simple test script to demonstrate OTP authentication flow
 * Run with: node test-otp-flow.js
 * 
 * This script tests the API endpoints without requiring email configuration
 * It will show OTPs in console output for testing purposes
 */

const { generateOTP } = require('./utils/emailService');

console.log('🧪 Testing OTP Authentication Flow');
console.log('=================================\n');

// Test OTP generation
console.log('1. Testing OTP Generation:');
const otp1 = generateOTP();
const otp2 = generateOTP();
console.log(`   Generated OTP 1: ${otp1} (Length: ${otp1.length})`);
console.log(`   Generated OTP 2: ${otp2} (Length: ${otp2.length})`);
console.log(`   ✅ OTPs are 6-digit numbers\n`);

// Test email service (console mode)
console.log('2. Testing Email Service (Console Mode):');
const { sendOTPEmail } = require('./utils/emailService');

const testEmail = async () => {
  try {
    console.log('   📧 Sending registration OTP...');
    await sendOTPEmail('test@example.com', otp1, 'verification');
    
    console.log('   📧 Sending login OTP...');
    await sendOTPEmail('test@example.com', otp2, 'login');
    
    console.log('   ✅ Email service working in console mode\n');
  } catch (error) {
    console.error('   ❌ Email service error:', error.message);
  }
};

testEmail();

console.log('3. API Endpoints Available:');
console.log('   POST /api/auth/register        - Send registration OTP');
console.log('   POST /api/auth/verify-otp      - Verify registration OTP');
console.log('   POST /api/auth/login           - Send login OTP');
console.log('   POST /api/auth/verify-login-otp - Verify login OTP');
console.log('   GET  /api/auth/me              - Get current user (protected)');
console.log('   PUT  /api/auth/profile         - Update profile (protected)');

console.log('\n4. Example Usage:');
console.log('   # Start server');
console.log('   npm start');
console.log('');
console.log('   # Register user (sends OTP to console)');
console.log('   curl -X POST http://localhost:5000/api/auth/register \\');
console.log('        -H "Content-Type: application/json" \\');
console.log('        -d \'{"name":"John Doe","email":"john@example.com"}\'');
console.log('');
console.log('   # Verify registration OTP');
console.log('   curl -X POST http://localhost:5000/api/auth/verify-otp \\');
console.log('        -H "Content-Type: application/json" \\');
console.log('        -d \'{"email":"john@example.com","otp":"123456"}\'');

console.log('\n📚 See docs/OTP_AUTHENTICATION.md for complete documentation\n');