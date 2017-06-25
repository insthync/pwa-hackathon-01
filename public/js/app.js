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
        if (!signInUser) {
            signInUser = user;
            goToMain();
        }
        if (typeof(Storage) !== "undefined") {
            localStorage.signInUser = JSON.stringify(signInUser);
        }
    } else {
        goToSignIn();
        signInUser = undefined;
        removeLocalStorage();
    }
});

function removeLocalStorage() {
    if (typeof(Storage) !== "undefined") {
        localStorage.removeItem("signInUser");
        localStorage.removeItem("profile");
        localStorage.removeItem("myQuests");
    }
}

function showAlert(message) {
    // TODO: May change to Bootstrap's panels
    alert(message);
}

function setDisableInputAndButton(formId, isDisabled) {
    if (isDisabled) {
        $('#' + formId + ' input').prop('disabled', true);
        $('#' + formId + ' button').prop('disabled', true);
        $('#' + formId + ' textarea').prop('disabled', true);
        $('#' + formId + ' select').prop('disabled', true);
    } else {
        $('#' + formId + ' input').removeProp('disabled');
        $('#' + formId + ' button').removeProp('disabled');
        $('#' + formId + ' textarea').removeProp('disabled');
        $('#' + formId + ' select').removeProp('disabled');
    }
}

function clearInput(formId) {
    $('#' + formId + ' input').val('');
    $('#' + formId + ' textarea').val('');
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
    goToProfile();
}

function clearBodyMainContentClass() {
    $('body').removeClass('body-content-main-add-quest');
    $('body').removeClass('body-content-main-your-quest');
    $('body').removeClass('body-content-main-find-quest');
    $('body').removeClass('body-content-main-profile');
    $('body').removeClass('body-content-main-battle');
    $('body').removeClass('body-content-main-battle-result');
}

function goToAddQuest() {
    clearBodyMainContentClass();
    $('body').addClass('body-content-main-add-quest');
}

function goToYourQuest() {
    clearBodyMainContentClass();
    $('body').addClass('body-content-main-your-quest');
    refreshYourQuest();
}

function goToFindQuest() {
    clearBodyMainContentClass();
    $('body').addClass('body-content-main-find-quest');
    refreshFindQuest();
}

function goToProfile() {
    clearBodyMainContentClass();
    $('body').addClass('body-content-main-profile');
    refreshProfile();
}

function goToBattle() {
    clearBodyMainContentClass();
    $('body').addClass('body-content-main-battle');
    refreshBattle();
}

function goToBattleResult() {
    clearBodyMainContentClass();
    $('body').addClass('body-content-main-battle-result');
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
        removeLocalStorage();
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

function showEmptyListEntryMessage(containerId, content) {
    clearListEntries(containerId);
    var html = '<div class="col-md-12 empty-quest-entry-message"><div class="panel panel-default text-center">';
    html += '<h4>' + content + '</h4>';
    html += '</div></div>';
    $('#' + containerId).append(html);
}

function clearEmptyListEntryMessage(containerId) {
    $('#' + containerId + ' .empty-quest-entry-message').remove();
}

function clearListEntries(containerId) {
    $('#' + containerId).html('');
}

$(document).ready(function() {
    $('#formSignUp').submit(onSubmitSignUp);
    $('#formSignIn').submit(onSubmitSignIn);
    $('#formAddQuest').submit(onSubmitAddQuest);
    $('#formChangeName').submit(onSubmitChangeName);
    if (typeof(Storage) !== "undefined") {
        if (localStorage.signInUser) {
            signInUser = JSON.parse(localStorage.signInUser);
            goToMain();
            return;
        }
        goToSignIn();
    }
});