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

function addQuestEntry(containerId, data, actionHtml) {
    data = JSON.parse(JSON.stringify(data));
    var html = '<div class="col-md-12"><div class="panel panel-default">';
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
    var actionHtml = '<a class="btn btn-sm btn-success">Finish Quest</a>';
    actionHtml += '&nbsp;<a class="btn btn-sm btn-danger">Abandon</a>';
    var allQuestsRef = firebase.database().ref('quests');
    showEmptyQuestEntryMessage('yourQuestsContainer', 'No Quests');
    allQuestsRef.on('value', function(snapshot) {
        if (snapshot.val()) {
            clearQuestEntries('yourQuestsContainer');
            snapshot.forEach(function(snapshotEntry) {
                addQuestEntry('yourQuestsContainer', snapshotEntry, actionHtml);
            });
        }
    });
}

function refreshFindQuest() {
    var actionHtml = '<a class="btn btn-sm btn-success">Start Quest</a>';
    var allQuestsRef = firebase.database().ref('quests');
    showEmptyQuestEntryMessage('findQuestsContainer', 'No Quests');
    allQuestsRef.on('value', function(snapshot) {
        if (snapshot.val()) {
            clearQuestEntries('findQuestsContainer');
            snapshot.forEach(function(snapshotEntry) {
                addQuestEntry('findQuestsContainer', snapshotEntry, actionHtml);
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