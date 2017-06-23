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
        mainPage();
    } else {
        signInUser = undefined;
        signInPage();
    }
});