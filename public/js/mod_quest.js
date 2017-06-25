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

function addMyQuestToLocalStorage(userQuestId, data) {
    if (typeof(Storage) !== "undefined") {
        var loadedMyQuests = [];
        var containedQuest = false;
        if (localStorage.myQuests) {
            loadedMyQuests = JSON.parse(localStorage.myQuests);
            if (loadedMyQuests.length > 0) {
                for (var i = loadedMyQuests.length - 1; i >= 0; --i) {
                    var loadedMyQuest = loadedMyQuests[i];
                    if (userQuestId === loadedMyQuest.userQuestId) {
                        containedQuest = true;
                        break;
                    }
                }
            }
        }
        if (!containedQuest) {
            loadedMyQuests.push({ userQuestId, data });
            localStorage.myQuests = JSON.stringify(loadedMyQuests);
        }
    }
}

function removeMyQuestFromLocalStorage(userQuestId) {
    if (typeof(Storage) !== "undefined") {
        if (localStorage.myQuests) {
            var loadedMyQuests = JSON.parse(localStorage.myQuests);
            if (loadedMyQuests.length > 0) {
                for (var i = loadedMyQuests.length - 1; i >= 0; --i) {
                    var loadedMyQuest = loadedMyQuests[i];
                    if (userQuestId === loadedMyQuest.userQuestId) {
                        loadedMyQuests.splice(i, 1);
                        continue;
                    }
                }
                localStorage.myQuests = JSON.stringify(loadedMyQuests);
            }
        }
    }
}

function finishQuest(id) {
    firebase.database().ref('user-profiles/' + signInUser.uid).once('value').then(function(userProfileEntry) {
        var updateProfile = getEmptyProfile();
        if (userProfileEntry.val())
            updateProfile = JSON.parse(JSON.stringify(userProfileEntry));

        var addStrForm = $('#inputFinishQuestStr' + id);
        var addAgiForm = $('#inputFinishQuestAgi' + id);
        var addIntForm = $('#inputFinishQuestInt' + id);

        var addStr = addStrForm.val();
        var addAgi = addAgiForm.val();
        var addInt = addIntForm.val();

        updateProfile.strength += Number(addStr);
        updateProfile.agility += Number(addAgi);
        updateProfile.intelligent += Number(addInt);

        var updates = {};
        updates['user-profiles/' + signInUser.uid] = updateProfile;

        loading(true);
        firebase.database().ref().update(updates).then(function() {
            addStrForm.val('');
            addAgiForm.val('');
            addIntForm.val('');

            firebase.database().ref('user-quests/' + signInUser.uid + '/' + id).remove().then(function() {
                loading(false);
                removeMyQuestFromLocalStorage(id);
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
    });
}

function abandonQuest(id) {
    if (!confirm("Are you sure to abandon this quest?"))
        return;
    loading(true);
    firebase.database().ref('user-quests/' + signInUser.uid + '/' + id).remove().then(function() {
        loading(false);
        removeMyQuestFromLocalStorage(id);
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

function addQuestEntry(containerId, id, data, actionHtml) {
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

function showFinishQuestForm(id) {
    $('#yourQuestMenu' + id).css('display', 'none');
    $('#yourQuestFinish' + id).css('display', 'block');
}

function hideFinishQuestForm(id) {
    $('#yourQuestMenu' + id).css('display', 'block');
    $('#yourQuestFinish' + id).css('display', 'none');
}

function addYourQuestEntry(userQuestId, data) {
    if (!data)
        return;
    var actionHtml = '';
    actionHtml += '<div id="yourQuestFinish' + userQuestId + '" class="text-left row">';
    actionHtml += '<div class="col-md-12"><h4>How many attributes you think you should receives by finish this quest?</h4></div>';
    actionHtml += '<div class="col-md-4"><label>Strength</label><input id="inputFinishQuestStr' + userQuestId + '" type="number" class="form-control" name="strength" value="0" required></div>';
    actionHtml += '<div class="col-md-4"><label>Agility</label><input id="inputFinishQuestAgi' + userQuestId + '" type="number" class="form-control" name="agility" value="0" required></div>';
    actionHtml += '<div class="col-md-4"><label>Intelligent</label><input id="inputFinishQuestInt' + userQuestId + '" type="number" class="form-control" name="intelligent" value="0" required></div>';
    actionHtml += '<div class="col-md-12 text-right">';
    actionHtml += '<br><a class="btn btn-md btn-success" href="javascript:finishQuest(\'' + userQuestId + '\')">Finish Quest</a>';
    actionHtml += '&nbsp;<a class="btn btn-md btn-default" href="javascript:hideFinishQuestForm(\'' + userQuestId + '\')">Cancel</a>';
    actionHtml += '</div>';
    actionHtml += '</div>';
    actionHtml += '<div id="yourQuestMenu' + userQuestId + '">';
    actionHtml += '<a class="btn btn-md btn-success" href="javascript:showFinishQuestForm(\'' + userQuestId + '\')">Finish Quest</a>';
    actionHtml += '&nbsp;<a class="btn btn-md btn-danger" href="javascript:abandonQuest(\'' + userQuestId + '\')">Abandon</a>';
    actionHtml += '</div>';
    addQuestEntry('yourQuestsContainer', 'yourQuestEntry' + userQuestId, data, actionHtml);
    hideFinishQuestForm(userQuestId);
}

function refreshYourQuest() {
    var allQuestsRef = firebase.database().ref('user-quests/' + signInUser.uid);
    showEmptyListEntryMessage('yourQuestsContainer', 'You are not start any quest<br><br><a class="btn btn-lg btn-default" href="javascript:goToFindQuest()">Find Quests</a>');
    if (typeof(Storage) !== "undefined") {
        if (localStorage.myQuests) {
            var loadedMyQuests = JSON.parse(localStorage.myQuests);
            if (loadedMyQuests.length > 0) {
                clearEmptyListEntryMessage('yourQuestsContainer');
                for (var i = 0; i < loadedMyQuests.length; ++i) {
                    var loadedMyQuest = loadedMyQuests[i];
                    addYourQuestEntry(loadedMyQuest.userQuestId, loadedMyQuest.data);
                }
            }
        }
    }
    allQuestsRef.on('value', function(snapshot) {
        if (snapshot.val()) {
            clearEmptyListEntryMessage('yourQuestsContainer');
            snapshot.forEach(function(startQuestEntry) {
                var userQuestId = startQuestEntry.getKey();
                var userQuestData = JSON.parse(JSON.stringify(startQuestEntry.val()));
                firebase.database().ref('quests/' + userQuestData.questId).once('value').then(function(questEntry) {
                    var id = questEntry.getKey();
                    var data = JSON.parse(JSON.stringify(questEntry.val()));
                    addYourQuestEntry(userQuestId, data);
                    addMyQuestToLocalStorage(userQuestId, data);
                });
            });
        }
    });
}

function addFindQuestEntry(id, data) {
    if (!data)
        return;
    var actionHtml = '<a class="btn btn-md btn-success" href="javascript:startQuest(\'' + id + '\')">Start Quest</a>';
    addQuestEntry('findQuestsContainer', 'findQuestEntry' + id, data, actionHtml);
}

function refreshFindQuest() {
    var allQuestsRef = firebase.database().ref('quests');
    showEmptyListEntryMessage('findQuestsContainer', 'No Quests, If you are not connected to internet, You have to do that.');
    allQuestsRef.on('value', function(snapshot) {
        if (snapshot.val()) {
            clearEmptyListEntryMessage('findQuestsContainer');
            snapshot.forEach(function(questEntry) {
                var id = questEntry.getKey();
                var data = JSON.parse(JSON.stringify(questEntry.val()));
                addFindQuestEntry(id, data);
            });
        }
    });
}