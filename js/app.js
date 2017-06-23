// Global Data
var signInUser = undefined;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAE5ysZS5wL6CQRoFsm80ATYJqGjzQVcDg",
    authDomain: "pwa-hackathon-01.firebaseapp.com",
    databaseURL: "https://pwa-hackathon-01.firebaseio.com",
    projectId: "pwa-hackathon-01",
    storageBucket: "pwa-hackathon-01.appspot.com",
    messagingSenderId: "655479433794"
};
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        signInUser = user;
        goToMain();
    } else {
        signInUser = undefined;
        goToSignIn();
    }
});

function clearBodyContentClass() {
    $('body').removeClass('body-content-signup');
    $('body').removeClass('body-content-signin');
    $('body').removeClass('body-content-main');
}

function goToSignUp() {
    clearBodyContentClass();
    $('body').addClass('body-content-signup');
}

function goToSignIn() {
    clearBodyContentClass();
    $('body').addClass('body-content-signin');
}

function goToMain() {
    clearBodyContentClass();
    $('body').addClass('body-content-main');
}

$(document).ready(function() {
    var user = firebase.auth().currentUser;
    if (user) {
        signInUser = user;
        // User is signed in.
        console.log("User signed in");
        goToMain();
    } else {
        // No user is signed in, show sign in page
        goToSignIn();
    }
});