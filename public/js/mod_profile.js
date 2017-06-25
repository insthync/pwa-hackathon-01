function getEmptyProfile() {
    return {
        characterName: '',
        strength: 0,
        agility: 0,
        intelligent: 0,
        battleWin: 0,
        battleLose: 0,
    };
}

function onSubmitChangeName(evt) {
    evt.preventDefault();

    firebase.database().ref('user-profiles/' + signInUser.uid).once('value').then(function(userProfileEntry) {
        var updateProfile = getEmptyProfile();
        if (userProfileEntry.val())
            updateProfile = JSON.parse(JSON.stringify(userProfileEntry));

        var characterNameInput = $('#inputProfileCharacterName');
        var characterName = characterNameInput.val();
        updateProfile.characterName = characterName;

        var updates = {};
        updates['user-profiles/' + signInUser.uid] = updateProfile;

        setDisableInputAndButton('formChangeName', true);
        loading(true);
        firebase.database().ref().update(updates).then(function() {
            $('#tasksContainer').empty();
            setDisableInputAndButton('formChangeName', false);
            loading(false);
        }).catch(function(error) {
            setDisableInputAndButton('formChangeName', false);
            loading(false);
            // Handle Errors here.
            if (!error || !error.code)
                return;
            var errorCode = error.code;
            var errorMessage = error.message;
            showAlert(errorMessage);
        });
    });
}

function refreshProfile() {
    var updateProfile = getEmptyProfile();
    if (typeof(Storage) !== "undefined") {
        if (localStorage.profile) {
            updateProfile = JSON.parse(localStorage.profile);
            $('#inputProfileCharacterName').val(updateProfile.characterName);
            $('#profileStrValue').html(updateProfile.strength);
            $('#profileAgiValue').html(updateProfile.agility);
            $('#profileIntValue').html(updateProfile.intelligent);
            $('#profileBattleWinValue').html(updateProfile.battleWin);
            $('#profileBattleLoseValue').html(updateProfile.battleLose);
        }
    }
    firebase.database().ref('user-profiles/' + signInUser.uid).once('value').then(function(userProfileEntry) {
        if (userProfileEntry.val()) {
            updateProfile = JSON.parse(JSON.stringify(userProfileEntry));
            if (!myProfile.battleWin)
                myProfile.battleWin = 0;
            if (!myProfile.battleLose)
                myProfile.battleLose = 0;
        }

        var updates = {};
        updates['user-profiles/' + signInUser.uid] = updateProfile;

        loading(true);
        firebase.database().ref().update(updates).then(function() {
            loading(false);
        }).catch(function(error) {
            loading(false);
            // Handle Errors here.
            if (!error || !error.code)
                return;
            var errorCode = error.code;
            var errorMessage = error.message;
            showAlert(errorMessage);
        });

        if (typeof(Storage) !== "undefined") {
            localStorage.profile = JSON.stringify(updateProfile);
        }
        $('#inputProfileCharacterName').val(updateProfile.characterName);
        $('#profileStrValue').html(updateProfile.strength);
        $('#profileAgiValue').html(updateProfile.agility);
        $('#profileIntValue').html(updateProfile.intelligent);
        $('#profileBattleWinValue').html(updateProfile.battleWin);
        $('#profileBattleLoseValue').html(updateProfile.battleLose);
    });
}