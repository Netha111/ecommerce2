// Simple test script to verify Firebase authentication is working
// Run this with: node test-auth.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } = require('firebase/auth');
const { getFirestore, doc, getDoc, deleteDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyB-5xSjL1ptNfHVuFL5YcGqiXBmJ-U7iM4",
    authDomain: "ecommerce-5175a.firebaseapp.com",
    projectId: "ecommerce-5175a",
    storageBucket: "ecommerce-5175a.firebasestorage.app",
    messagingSenderId: "1049383381276",
    appId: "1:1049383381276:web:9b5e56eb4c0d2b5a5b72d9",
    measurementId: "G-XCK4DBS5W6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testAuthentication() {
    console.log('🧪 Testing Firebase Authentication...\n');
    
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    try {
        // Test 1: Create User
        console.log('1️⃣ Testing user creation...');
        const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        console.log('✅ User created successfully:', userCredential.user.uid);
        
        // Test 2: Check if user document exists in Firestore
        console.log('\n2️⃣ Checking user document in Firestore...');
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
            console.log('✅ User document found in Firestore');
            console.log('📄 User data:', userDoc.data());
        } else {
            console.log('❌ User document not found in Firestore');
        }
        
        // Test 3: Sign out and sign back in
        console.log('\n3️⃣ Testing sign in...');
        await auth.signOut();
        const signInCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
        console.log('✅ Sign in successful:', signInCredential.user.uid);
        
        // Cleanup: Delete test user
        console.log('\n🧹 Cleaning up test user...');
        await deleteDoc(doc(db, 'users', userCredential.user.uid));
        await deleteUser(userCredential.user);
        console.log('✅ Test user cleaned up');
        
        console.log('\n🎉 All authentication tests passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Error code:', error.code);
        
        if (error.code === 'auth/configuration-not-found') {
            console.log('\n💡 This error suggests Firebase project is not properly configured.');
            console.log('Please check:');
            console.log('1. Firebase project exists');
            console.log('2. Authentication is enabled');
            console.log('3. Web app is configured in Firebase console');
        }
    }
}

// Run the test
testAuthentication().then(() => {
    process.exit(0);
}).catch((error) => {
    console.error('Test script error:', error);
    process.exit(1);
});
