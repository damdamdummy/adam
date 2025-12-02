import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBBgPDB0GmGr9Siyr5chV9XktlHkNPwm9w",
    authDomain: "adam-17aa6.firebaseapp.com",
    projectId: "adam-17aa6",
    storageBucket: "adam-17aa6.firebasestorage.app",
    messagingSenderId: "914906910725",
    appId: "1:914906910725:web:0ebb24f1aa809e52d2cc6c",
    measurementId: "G-PVWF8M2TW8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

window.db = db;
window.auth = auth;

window.loadMessages = async function () {
    const messagesDisplay = document.getElementById('messageList');
    messagesDisplay.innerHTML = '';
    const isAdmin = !!auth.currentUser;

    try {
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(3));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            messagesDisplay.innerHTML = '<p style="color: #888; text-align: center;">NO MESSAGES RECEIVED</p>';
            return;
        }

        snapshot.forEach((doc) => {
            const msg = doc.data();
            const blurClass = isAdmin ? '' : 'blurred';
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message-bubble';
            messageDiv.innerHTML = `
                        <span class="message-sender-horror ${blurClass}">${msg.name || 'ANONYMOUS'}</span>
                        <span class="message-timestamp ${blurClass}">${new Date(msg.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <div class="message-text ${blurClass}">${msg.text}</div>
                    `;
            messagesDisplay.appendChild(messageDiv);
        });

        const infoDiv = document.createElement('p');
        infoDiv.style.textAlign = 'center';
        infoDiv.style.color = '#888';
        infoDiv.style.fontSize = '0.8rem';
        infoDiv.style.marginTop = '20px';
        infoDiv.textContent = '📡 SHOWING LAST 3 MESSAGES';
        messagesDisplay.appendChild(infoDiv);

        if (isAdmin) {
            const viewAllBtn = document.createElement('button');
            viewAllBtn.textContent = 'VIEW ALL IN CONSOLE';
            viewAllBtn.className = 'send-btn';
            viewAllBtn.style.width = '100%';
            viewAllBtn.style.marginTop = '15px';
            viewAllBtn.style.fontSize = '1rem';
            viewAllBtn.onclick = async () => {
                const allQ = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
                const allSnapshot = await getDocs(allQ);
                const allMessages = allSnapshot.docs.map(doc => doc.data());
                console.table(allMessages);
                alert('Success! ' + allMessages.length + ' messages logged to console!');
            };
            messagesDisplay.appendChild(viewAllBtn);
        }
    } catch (e) {
        console.error('Error loading messages:', e);
        messagesDisplay.innerHTML = '<p style="color: #8b0000;">ERROR LOADING MESSAGES</p>';
    }
};

window.sendMessage = async function (name, text) {
    try {
        await addDoc(collection(db, 'messages'), {
            name,
            text,
            timestamp: Date.now()
        });
        return true;
    } catch (e) {
        console.error('Error sending message:', e);
        return false;
    }
};


window.loginAdmin = async function () {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        await window.loadMessages();
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'block';
        alert('SYSTEM ACCESS GRANTED!');
    } catch (e) {
        document.getElementById('loginError').style.display = 'block';
        setTimeout(() => {
            document.getElementById('loginError').style.display = 'none';
        }, 3000);
    }
};


window.logoutAdmin = async function () {
    await signOut(auth);
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
    await window.loadMessages();
    alert('LOGGED OUT');
};

let initialLoadDone = false;
onAuthStateChanged(auth, (user) => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (user) {
        logoutBtn.style.display = 'block';
    } else {
        logoutBtn.style.display = 'none';
    }

    if (!initialLoadDone) {
        window.loadMessages();
        initialLoadDone = true;
    }
});