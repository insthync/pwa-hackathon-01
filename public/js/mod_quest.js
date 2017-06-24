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

}