(function() {
    'use strict';


    var $todos = $('#todos');

    function myLi(item) {
        var $li = $('<li class="list-group-item">');
        var $doneTodos = $('#doneTodos');

        var $title = $('<span>').text(item.id + ': ' + item.title + '  ');
        $li.append($title);

        var $doneButton = $('<button type="button" class="btn btn-info">').text('DONE');
        var $deleteButton = $('<button type="button" class="btn btn-danger">').text('DELETE');
        var $notDoneButton;

        $doneButton.on('click', function() {
            $notDoneButton = $doneButton.text('NOT-DONE');
            $doneTodos.append($li);
        });

        // $notDoneButton.on('click', function() {
        //     $doneButton = $notDoneButton.text('DONE');
        // });

        $deleteButton.on('click', function() {
            deleteTodo(item.id, function() {
                $li.remove();
            });

        });

        $li.append($doneButton);
        $li.append($deleteButton);

        $todos.append($li);
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


    // $.ajax({
    //         method: "PUT",
    //         url: "/api/todos",
    //         data: {},
    //     })
    //     .done()


})();