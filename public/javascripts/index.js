(function() {
    'use strict';

    var $todos = $('#todos');

    function myLi(item) {
        var $li = $('<li class="list-group-item clearfix">');
        // $li.data('todoId', item.id);

        var $doneTodos = $('#doneTodos');

        var $title = $('<span data-editable>').text(item.title);
        $li.append($title);

        var $doneButton = $('<button type="button" class="btn btn-info pull-right">').text('DONE');
        var $deleteButton = $('<button type="button" class="btn btn-danger pull-right">').text('DELETE');
        var $notDoneButton = $('<button type="button" class="btn btn-info pull-right">').text('NOT-DONE');

        $li.on('click', '[data-editable]', function() {
            var $el = $(this);

            var $input = $('<input/>').val($el.text());
            $el.replaceWith($input);

            var save = function() {

                console.log(item.id + '  this is item iiiidddddd ')
                if ($input.val().length === 0) {
                    deleteTodo(item.id, function() {
                        $li.remove();
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

        $doneButton.on('click', function() {
            item.status = 'done';
            updateTitle(item.id, item.title, item.status);
            $doneButton.hide();
            $notDoneButton.show();
            $li.append($notDoneButton);
            $doneTodos.append($li);
        });

        $notDoneButton.on('click', function() {
            item.status = 'not-done';
            updateTitle(item.id, item.title, item.status);
            $notDoneButton.hide();
            $doneButton.show();
            $todos.append($li);
        });

        $deleteButton.on('click', function() {
            deleteTodo(item.id, function() {
                $li.remove();
            });
        });

        $li.append($deleteButton);

        if (item.status === 'not-done') {
            $li.append($doneButton);
            $todos.append($li);
        } else {
            $li.append($notDoneButton);
            $doneTodos.append($li);
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
