function addFighterEntry(conatinerId, id, data) {
    if ($('#' + id).length !== 0) {
        return;
    }
    var html = '<div class="col-md-12" id="' + id + '"><div class="panel panel-default">';
    html += '<div class="panel-body">';
    html += '<h4>' + data.questName + '</h4><br>';
    html += data.questDescription + '<br>';
    if (data.questTasks) {
        html += '<br><ul>';
        var tasks = data.questTasks;
        for (var key in tasks) {
            if (tasks.hasOwnProperty(key)) {
                var element = tasks[key];
                html += '<li>' + element + '</li>';
            }
        }
        html += '</ul>';
    }
    html += '</div>'
    html += '<div class="panel-footer text-right">' + actionHtml + '</div>';
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