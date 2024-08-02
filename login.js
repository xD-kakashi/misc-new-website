// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, getAdditionalUserInfo, onAuthStateChanged, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYPSXQ4VGdjebNmVBljJS29X9SQG-PGJ4",
    authDomain: "misc-69616.firebaseapp.com",
    projectId: "misc-69616",
    storageBucket: "misc-69616.appspot.com",
    messagingSenderId: "541590138923",
    appId: "1:541590138923:web:c92c54c9cf78e72bc8fa6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);
auth.language = 'en';
const provider = new GoogleAuthProvider(app);

if (localStorage.getItem('loggedInUser')) {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('overlay-warning').style.display = 'block'; // or 'flex', 'inline-block', etc.
} else {
    document.getElementById('login-container').style.display = 'block'; // or 'flex', 'inline-block', etc.
    document.getElementById('overlay-warning').style.display = 'none';
}

document.getElementById("google-signin-button").addEventListener("click", function(event) {
    console.log("Google sign-in button clicked"); // Debug log
    event.preventDefault();
    var username = document.getElementById("username").value;
    //const email = document.getElementById("email").value;
    //const password = document.getElementById("password").value;
    signInWithPopup(auth, provider)
        .then(async (result) => {
            console.log("Sign-in successful"); // Debug log
            const user = result.user;
            const email = result.user.email;
            const display_name = user.displayName;
            window.sessionStorage.setItem('profileName', display_name);
            console.log(user.displayName);
            //console.log(getAdditionalUserInfo(result));

            const docRef = doc(database, "users", user.uid);
            const userD = await getDoc(docRef);
            if (!userD.exists()){
                if(validate_username(username) == false){
                    username = display_name;
                }
                const userData = {
                    email:email,
                    username:username,
                    points: 0,
                    answers: {}
                };
                await setDoc(docRef, userData).then(() => {
                    console.log("Logged In");
                }).catch((error) => {
                    console.error(error);
                })
                
            }
            localStorage.setItem('loggedInUser', user.uid);
            // window.location.href = "secret-guide";
            window.location.href = "login";
        })
        .catch((error) => {
            console.error("Sign-in error", error); // Debug log
            const errorCode = error.code;
            const errorMessage = error.message;
            // Additional error handling here if necessary
        });
    //window.location.href = "../templates/secret-guide.html";
})

function validate_username(username){
    const valid = /^[a-zA-Z\-]+$/;
    return valid.test(username);

}

document.getElementById("signup-button").addEventListener('click', (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (validate_username(username) == false || email == false){
        alert('Please enter details');
    }
    else{
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email:email,
                username:username,
                points: 0,
                answers: {}
            }
            const docRef = doc(database, "users", user.uid);
            setDoc(docRef,userData).then(()=>{
                console.log("logged in");
                localStorage.setItem('loggedInUser', user.uid);
                // window.location.href = "secret-guide";    
                window.location.href = "login";
            }).catch((error) => {
                console.error(error);
            })
        }).catch((error) => {
            console.error(error);
        });
    }
})

document.getElementById('signin-button').addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    if (validate_username(username) == false || email == false){
        alert('Please enter details');
    }else{
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // alert('Logged In');
            const user = userCredential.user;
            localStorage.setItem('loggedInUser', user.uid);
            // window.location.href = "secret-guide";
            window.location.href = "login";
        }).catch((error) => {
            console.error(error);
        })
    }
})

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('home-redirect').style.display = 'none';
        const user_mail = user.email;
        const display_name = user.displayName;
        window.sessionStorage.setItem('profileName', display_name);
        document.getElementById("login-mail").innerHTML = user_mail;
        console.log("User is signed in");
    } else {
        document.getElementById('home-redirect').style.display = 'block';
        console.log("User is signed out");
    }
});

// if (user!==null) {
//     const profileName = auth.currentUser.displayName;
//     window.sessionStorage.setItem('profileName', profileName);
// }

document.getElementById('flag-sub').addEventListener('click', (event) => {
    window.location.href = "flag-sub";
});

document.getElementById('logout').addEventListener('click', (event) => {
    signOut(auth).then(() => {
        window.sessionStorage.clear();
        localStorage.clear();
        window.location.href = "login";
        console.log("User signed out.")
        // Sign-out successful.
      }).catch((error) => {
        console.error(error);
        console.log('Try again, sign-out failed.')
        // An error happened.
      });
});

document.getElementById('home-redirect').addEventListener('click', (event) => {
    window.location.href = "/";
});