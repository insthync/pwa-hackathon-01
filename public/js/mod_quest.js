var questTaskId = 0;

function addQuestTask() {
    var id = ++questTaskId;
    var questTaskInput = $('#inputQuestTask');
    var questTask = questTaskInput.val();
    if (questTask.length > 0) {
        var html = '<tr id="questTaskEntry_' + id + '">';
        html += '<th>' + questTask + '<input type="hidden" name="questTasks[]" value="' + questTask + '" /></th>';
        html += '<td style="width:70px;"><a class="btn btn-sm btn-danger" href="javascript:removeQuestTask(' + id + ')">Remove</a></td>';
        html += '</tr>';
        $('#tasksContainer').append(html);
    }
    questTaskInput.val('');
}

function removeQuestTask(id) {
    $('#questTaskEntry_' + id).remove();
}

function onSubmitAddQuest(evt) {
    evt.preventDefault();

    var formData = $('#formAddQuest').serializeArray();
    var questName = '';
    var questDescription = '';
    var questTasks = [];
    for (var i = 0; i < formData.length; ++i) {
        var singleFormData = formData[i];
        var name = singleFormData.name;
        var value = singleFormData.value;
        if (name === "questName")
            questName = value;
        else if (name === "questDescription")
            questDescription = value;
        else if (name === "questTasks[]")
            questTasks.push(value);
    }

    var questData = {
        questName,
        questDescription,
        questTasks,
    };

    var newQuestKey = firebase.database().ref().child('quests').push().key;

    var updates = {};
    updates['/quests/' + newQuestKey] = questData;

    setDisableInputAndButton('formAddQuest', true);
    loading(true);
    firebase.database().ref().update(updates).then(function() {
        $('#tasksContainer').empty();
        setDisableInputAndButton('formAddQuest', false);
        clearInput('formAddQuest');
        loading(false);
    }).catch(function(error) {
        setDisableInputAndButton('formAddQuest', false);
        loading(false);
        // Handle Errors here.
        if (!error || !error.code)
            return;
        var errorCode = error.code;
        var errorMessage = error.message;
        showAlert(errorMessage);
    });
}

function finishQuest(id) {

}

function abandonQuest(id) {
    loading(true);
    firebase.database().ref('user-quests/' + signInUser.uid + '/' + id).remove().then(function() {
        loading(false);
        refreshYourQuest();
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

function startQuest(id) {
    var startQuestData = {
        questId: id,
    }

    var newQuestKey = firebase.database().ref().child('user-quests/' + signInUser.uid + '/quests').push().key;

    var updates = {};
    updates['/user-quests/' + signInUser.uid + '/' + newQuestKey] = startQuestData;

    loading(true);
    firebase.database().ref().update(updates).then(function() {
        loading(false);
        showAlert('Quest has begun!!');
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

function showEmptyQuestEntryMessage(containerId, content) {
    clearQuestEntries(containerId);
    var html = '<div class="col-md-12"><div class="panel panel-default text-center">';
    html += '<h4>' + content + '</h4>';
    html += '</div></div>';
    $('#' + containerId).append(html);
}

function clearQuestEntries(containerId) {
    $('#' + containerId).empty();
}

function addQuestEntry(containerId, id, data, actionHtml) {
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

function refreshYourQuest() {
    var allQuestsRef = firebase.database().ref('user-quests/' + signInUser.uid);
    showEmptyQuestEntryMessage('yourQuestsContainer', 'You are not start any quest<br><br><a class="btn btn-lg btn-default" href="javascript:goToFindQuest()">Find Quests</a>');
    allQuestsRef.on('value', function(snapshot) {
        if (snapshot.val()) {
            clearQuestEntries('yourQuestsContainer');
            snapshot.forEach(function(startQuestEntry) {
                var userQuestId = startQuestEntry.getKey();
                var userQuestData = JSON.parse(JSON.stringify(startQuestEntry.val()));
                firebase.database().ref('quests/' + userQuestData.questId).once('value').then(function(questEntry) {
                    var id = questEntry.getKey();
                    var data = JSON.parse(JSON.stringify(questEntry.val()));
                    var actionHtml = '<a class="btn btn-md btn-success" href="javascript:finishQuest(\'' + userQuestId + '\')">Finish Quest</a>';
                    actionHtml += '&nbsp;<a class="btn btn-md btn-danger" href="javascript:abandonQuest(\'' + userQuestId + '\')">Abandon</a>';
                    addQuestEntry('yourQuestsContainer', 'yourQuestEntry' + userQuestId, data, actionHtml);
                });
            });
        }
    });
}

function refreshFindQuest() {
    var allQuestsRef = firebase.database().ref('quests');
    showEmptyQuestEntryMessage('findQuestsContainer', 'No Quests');
    allQuestsRef.on('value', function(snapshot) {
        if (snapshot.val()) {
            clearQuestEntries('findQuestsContainer');
            snapshot.forEach(function(questEntry) {
                var id = questEntry.getKey();
                var data = JSON.parse(JSON.stringify(questEntry.val()));
                var actionHtml = '<a class="btn btn-md btn-success" href="javascript:startQuest(\'' + id + '\')">Start Quest</a>';
                addQuestEntry('findQuestsContainer', 'findQuestEntry' + id, data, actionHtml);
            });
        }
    });
}

function clearBodyMainContentClass() {
    $('body').removeClass('body-content-main-add-quest');
    $('body').removeClass('body-content-main-your-quest');
    $('body').removeClass('body-content-main-find-quest');
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