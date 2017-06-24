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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service_worker.js')
        .then(function() { console.log('Service Worker Registered'); });
}

firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user) {
    console.log(JSON.stringify(user));
    if (user) {
        signInUser = user;
        goToMain();
    } else {
        signInUser = undefined;
        goToSignIn();
    }
});

function showAlert(message) {
    // TODO: May change to Bootstrap's panels
    alert(message);
}

function setDisableInputAndButton(formId, isDisabled) {
    if (isDisabled) {
        $('#' + formId + ' :input').prop('disabled', true);
        $('#' + formId + ' :button').prop('disabled', true);
    } else {
        $('#' + formId + ' :input').removeProp('disabled');
        $('#' + formId + ' :button').removeProp('disabled');
    }
}

function clearInput(formId) {
    $('#' + formId + ' :input').val('');
}

function loading(isLoading) {

}

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

function onSubmitSignUp(evt) {
    evt.preventDefault();
    setDisableInputAndButton('formSignUp', true);
    var emailInput = $('#inputSignUpEmail');
    var psswordInput = $('#inputSignUpPassword');
    var email = emailInput.val();
    var password = psswordInput.val();
    loading(true);
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        setDisableInputAndButton('formSignUp', false);
        clearInput('formSignUp');
        loading(false);
    }).catch(function(error) {
        setDisableInputAndButton('formSignUp', false);
        loading(false);
        // Handle Errors here.
        if (!error || !error.code)
            return;
        var errorCode = error.code;
        var errorMessage = error.message;
        showAlert(errorMessage);
    });
}

function onSubmitSignIn(evt) {
    evt.preventDefault();
    setDisableInputAndButton('formSignIn', true);
    var emailInput = $('#inputSignInEmail');
    var psswordInput = $('#inputSignInPassword');
    var email = emailInput.val();
    var password = psswordInput.val();
    loading(true);
    firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
        setDisableInputAndButton('formSignIn', false);
        clearInput('formSignIn');
        loading(false);
    }).catch(function(error) {
        setDisableInputAndButton('formSignIn', false);
        loading(false);
        // Handle Errors here.
        if (!error || !error.code)
            return;
        var errorCode = error.code;
        var errorMessage = error.message;
        showAlert(errorMessage);
    });
}

function signOut() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        signInPage();
    }).catch(function(error) {
        // Handle Errors here.
        if (!error || !error.code)
            return;
        var errorCode = error.code;
        var errorMessage = error.message;
        showAlert(errorMessage);
    });
}

$(document).ready(function() {
    $('#formSignUp').submit(onSubmitSignUp);
    $('#formSignIn').submit(onSubmitSignIn);
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