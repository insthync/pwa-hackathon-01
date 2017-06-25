function createFighterStat(profile) {

}

function calculationFight(profileA, profileB) {
    var isProfileAWin = false;
    var profileAStat = {

    }
    var profileBStat = {

    }
    return isProfileAWin;
}

function onFightWin(id) {
    showAlert("You Win");
}

function onFightLose(id) {
    showAlert("You Lose");
}

function startFight(id) {
    firebase.database().ref('user-profiles/' + signInUser.uid).once('value').then(function(userProfileEntry) {
        if (userProfileEntry.val()) {
            var myProfile = JSON.parse(JSON.stringify(userProfileEntry));
            firebase.database().ref('user-profiles/' + id).once('value').then(function(userProfileEntry) {
                if (userProfileEntry.val()) {
                    var fighterProfile = JSON.parse(JSON.stringify(userProfileEntry));

                    if (calculationFight(myProfile, fighterProfile)) {
                        onFightWin(id);
                        if (!myProfile.battleWin)
                            myProfile.battleWin = 0;
                        ++myProfile.battleWin;
                    } else {
                        onFightLose(id);
                        if (!myProfile.battleLose)
                            myProfile.battleLose = 0;
                        ++myProfile.battleLose;
                    }

                    var updates = {};
                    updates['user-profiles/' + signInUser.uid] = myProfile;

                    console.log(myProfile);

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
                }
            });
        }
    });
}

function addFighterEntry(containerId, id, data) {
    if ($('#' + id).length !== 0) {
        return;
    }
    var characterName = data.characterName;
    if (!characterName)
        characterName = "Unknow Player";
    var html = '<div class="col-md-12" id="' + id + '"><div class="panel panel-default">';
    html += '<div class="panel-body">';
    html += '<h4>' + characterName + '</h4><br>';
    html += '<ul>';
    html += '<li>Strength: ' + data.strength + '</li>';
    html += '<li>Agility: ' + data.agility + '</li>';
    html += '<li>Intelligent: ' + data.intelligent + '</li>';
    html += '</ul>';
    html += '</div>'
    html += '<div class="panel-footer text-right"><a class="btn btn-md btn-success" href="javascript:startFight(\'' + id + '\')">Fight</a></div>';
    html += '</div></div>';

    $('#' + containerId).append(html);
}

function refreshBattle() {
    var allProfilesRef = firebase.database().ref('user-profiles');
    showEmptyListEntryMessage('fighterContainer', 'No Fighters, If you are not connected to internet, You have to do that.');
    allProfilesRef.on('value', function(snapshot) {
        if (snapshot.val()) {
            clearEmptyListEntryMessage('fighterContainer');
            snapshot.forEach(function(fighterEntry) {
                var id = fighterEntry.getKey();
                var data = JSON.parse(JSON.stringify(fighterEntry.val()));
                addFighterEntry('fighterContainer', id, data);
            });
        }
    });
}