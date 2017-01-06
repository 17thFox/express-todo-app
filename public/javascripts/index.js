(function() {
    'use strict';

    var $todos = $('#todos');
    var $doneTodos = $('#doneTodos');
    var $itemsLeftToDo = $('#itemsLeftToDo');
    var countItems = 0;

    function myLi(item) {
        var $li = $('<li class="todo-item list-group-item clearfix">');
        // $li.data('todoId', item.id);

        var $title = $('<span class="todo-title" data-editable>').text(item.title);
        $li.append($title);

        var $doneButton = $('<button type="button" class="btn btn-default pull-left btnFromLeft btnWithSpecialDefault"><span class="glyphicon glyphicon-unchecked"></span></button>');
        var $deleteButton = $('<button type="button" class="btn btn-default pull-right btnFromRight btnWithSpecialDefault"><span class="glyphicon glyphicon-remove"></span></button>');
        var $notDoneButton = $('<button type="button" class="btn btn-default pull-left btnFromLeft btnWithSpecialDefault"><span class="glyphicon glyphicon-check"></span></button>');

        $li.on('click', '[data-editable]', function() {
            var $el = $(this);

            var $input = $('<input/>').val($el.text());
            $el.replaceWith($input);

            var save = function() {
                if ($input.val().length === 0) {
                    deleteTodo(item.id, function() {
                        $li.remove();
                        toastr.error('You removed an item from the To-Do list!');
                        if (item.status === 'not-done') {
                            countItems -= 1;
                            $itemsLeftToDo.text(countItems + ' left');
                        }
                    });
                } else {
                    item.title = $input.val();
                    if (item.status === 'done') {
                        var $span = $('<span data-editable style="text-decoration: line-through;" />').text($input.val());
                    }
                    var $span = $('<span data-editable style="text-decoration: none;" />').text($input.val());
                    $input.replaceWith($span);
                    updateTitle(item.id, item.title, item.status);
                }
            };
            $input.on('blur', save).focus();
        });

        function toggleTodoStatus() {
            item.status === 'done' ? (
                item.status = 'not-done',
                countItems += 1) : (
                item.status = 'done',
                countItems -= 1);

            $doneButton.toggle();
            $notDoneButton.toggle();

            $itemsLeftToDo.text(countItems + ' left');

            $li.toggleClass('done-todo');
            updateTitle(item.id, item.title, item.status);
            var $targetList = item.status === 'done' ? $doneTodos : $todos;
            $targetList.append($li);
            item.status === 'done' ? toastr.success('You achieved an item from the To-Do list!') : toastr.warning('You resurrected an item from the To-Do list!');
        }

        $doneButton.on('click', toggleTodoStatus);
        $notDoneButton.on('click', toggleTodoStatus);

        $deleteButton.on('click', function() {
            deleteTodo(item.id, function() {
                $li.remove();
                toastr.error('You removed an item from the To-Do list!');
                if (item.status === 'not-done') {
                    countItems -= 1;
                    $itemsLeftToDo.text(countItems + ' left');
                }
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


    $(function() {
        $('#toggleCompletion').on('click', function(event) {
            event.preventDefault();
            $.ajax({
                    method: 'GET',
                    url: '/api/todos'
                })
                .done(function(res) {

                    var nr = 0;
                    countItems = 0;
                    $todos.empty();
                    $doneTodos.empty();
                    $.each(res, function(idx, item) {
                        if (item.status === 'not-done') {
                            nr += 1;
                        }
                        countItems += 1;
                    });
                    if (nr != 0) {
                        $.each(res, function(idx, item) {
                            item.status = 'done';
                            updateTitle(item.id, item.title, item.status);
                            myLi(item);
                        });
                        countItems = 0;
                        $itemsLeftToDo.text(countItems + ' left');
                    } else {
                        $.each(res, function(idx, item) {
                            item.status = 'not-done';
                            updateTitle(item.id, item.title, item.status);
                            myLi(item);
                        });

                        $itemsLeftToDo.text(countItems + ' left');
                    }
                });
        })
    })


    $(function() {
        $('#clearCompleted').on('click', function(event) {
            event.preventDefault();
            $.ajax({
                    method: 'GET',
                    url: '/api/todos'
                })
                .done(function(res) {
                    $todos.empty();
                    $doneTodos.empty();
                    $.each(res, function(idx, item) {
                        if (item.status === 'done') {
                            deleteTodo(item.id);
                        } else {
                            myLi(item);
                        }
                    });
                });
        })
    })


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
            countItems = 0;
            $.each(res, function(idx, item) {

                if (item.status === 'not-done') {
                    countItems += 1;
                }
                myLi(item);
            });
            $itemsLeftToDo.text(countItems + ' left');
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
                    countItems += 1;

                    myLi(res);

                    $itemsLeftToDo.text(countItems + ' left');
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