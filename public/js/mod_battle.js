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
    html += '<br><ul>';
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