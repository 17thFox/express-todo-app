(function() {
    'use strict';

    var $todos = $('#todos');

    function myLi(item) {
        var $li = $('<li class="todo-item list-group-item clearfix">');
        // $li.data('todoId', item.id);

        var $doneTodos = $('#doneTodos');

        var $title = $('<span class="todo-title" data-editable>').text(item.title);
        $li.append($title);

        var $doneButton = $('<button type="button" class="btn btn-info pull-right">').text('DONE');
        var $deleteButton = $('<button type="button" class="btn btn-danger pull-right">').text('DELETE');
        var $notDoneButton = $('<button type="button" class="btn btn-info pull-right">').text('NOT-DONE');

        $li.on('click', '[data-editable]', function() {
            var $el = $(this);

            var $input = $('<input/>').val($el.text());
            $el.replaceWith($input);

            var save = function() {
                if ($input.val().length === 0) {
                    deleteTodo(item.id, function() {
                        $li.remove();
                        toastr.error('You removed an item from the To-Do list!');
                    });
                } else {
                    item.title = $input.val();
                    var $span = $('<span data-editable />').text($input.val());
                    $input.replaceWith($span);
                    updateTitle(item.id, item.title, item.status);
                }
            };
            $input.on('blur', save).focus();
        });

        function toggleTodoStatus() {
            item.status = item.status === 'done' ? 'not-done' : 'done';
            $doneButton.toggle();
            $notDoneButton.toggle();
            $li.toggleClass('done-todo');
            updateTitle(item.id, item.title, item.status);
            var $targetList = item.status === 'done' ? $doneTodos : $todos;
            $targetList.append($li);
            item.status === 'done' ? toastr.success('You achieved an item from the To-Do list!') : toastr.success('You resurrected an item from the To-Do list!');
            
        }

        $doneButton.on('click', toggleTodoStatus);
        $notDoneButton.on('click', toggleTodoStatus);

        $deleteButton.on('click', function() {
            deleteTodo(item.id, function() {
                $li.remove();
                toastr.error('You removed an item from the To-Do list!');
            });
        });

        $li.append($deleteButton);
        $li.append($doneButton);
        $li.append($notDoneButton);

        if (item.status === 'not-done') {
            $notDoneButton.hide();
            $todos.append($li);
        } else {
            $doneButton.hide();
            $doneTodos.append($li);
            $li.toggleClass('done-todo');
        }
    }


    function deleteTodo(id, callback) {
        $.ajax({
                method: 'DELETE',
                url: '/api/todos/' + id
            })
            .done(function() {
                if (typeof callback === 'function') {
                    callback();
                }
            })
    }

    $.ajax({
            method: 'GET',
            url: '/api/todos'
        })
        .done(function(res) {
            $todos.empty();
            $.each(res, function(idx, item) {
                myLi(item);
            });
        });

    $(function() {
        $('#addTodosForm').on('submit', function(event) {
            event.preventDefault();
            var myAddTodosInput = $('#addTodosInput').val();

            $.ajax({
                    method: 'POST',
                    url: '/api/todos',
                    data: {
                        title: myAddTodosInput
                    },
                })
                .done(function(res) {
                    myLi(res);
                });
        })
    })

    function updateTitle(myId, myTitle, myStatus) {
        $.ajax({
                method: "PUT",
                url: "/api/todos",
                data: {
                    id: myId,
                    title: myTitle,
                    status: myStatus
                },
            })
            .done();
    }
})();
