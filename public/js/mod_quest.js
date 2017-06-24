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

function refreshQuestList() {

}