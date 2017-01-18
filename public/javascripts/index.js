/* global Vue */

(function() {

    var card = new Vue({
        delimiters: ['${', '}'],
        el: "#card",
        data: {
            activeEditorIndex: -1,
            activeEditorCompleted: false,
            title: "Your Todo List",
            items: [],
            itemsCompleted: []
        },

        computed: {
            totalLeft: function() {
                return this.items.length;
            }
        },

        watch: {
            items: function(newItems, oldItems) {
                // console.log(newItems, oldItems);
            },
            itemsCompleted: function(newItemsCompleted, oldItemsCompleted) {
                // console.log(newItemsCompleted[0].text, oldItemsCompleted.length);
            }
        },

        methods: {
            fetchData: function() {
                var self = this;
                $.ajax({
                        method: 'GET',
                        url: '/api/todos'
                    })
                    .done(function(res) {
                        $.each(res, function(idx, item) {
                            if (item.status !== 'done') {
                                self.items.push({
                                    id: item.id,
                                    text: item.title
                                });
                            } else {
                                self.itemsCompleted.push({
                                    id: item.id,
                                    text: item.title
                                });
                            }
                        });
                    });

            },
            addItem: function() {
                var input = document.getElementById('addTodosInput');
                var self = this;

                if (input.value !== '') {
                    $.ajax({
                            method: 'POST',
                            url: '/api/todos',
                            data: {
                                title: input.value
                            },
                        })
                        .done(function(res) {
                            self.items.push({
                                id: res.id,
                                text: res.title
                            });
                        });
                    input.value = '';
                }
            },

            checkItem: function(index) {
                updateTitle(this.items[index].id, this.items[index].text, 'done');
                this.itemsCompleted.unshift({
                    id: this.items[index].id,
                    text: this.items[index].text
                });
                this.items.splice(index, 1);
            },
            uncheckItem: function(index) {
                updateTitle(this.itemsCompleted[index].id, this.itemsCompleted[index].text, 'not-done');
                this.items.push({
                    id: this.itemsCompleted[index].id,
                    text: this.itemsCompleted[index].text
                });
                this.itemsCompleted.splice(index, 1);
            },
            deleteItem: function(index) {
                deleteTodo(this.items[index].id);
                this.items.splice(index, 1);
            },
            deleteItemCompleted: function(index) {
                deleteTodo(this.itemsCompleted[index].id);
                this.itemsCompleted.splice(index, 1);
            },
            clearCompleted: function() {
                for (var i = 0; i < this.itemsCompleted.length; i++) {
                    deleteTodo(this.itemsCompleted[i].id);
                }
                this.itemsCompleted.splice(0, this.itemsCompleted.length);
            },
            toggleCompletion: function() {
                if (this.itemsCompleted.length === 0) {
                    toggleCompletionFor(this.items, this.itemsCompleted, 'done');

                } else if (this.items.length === 0) {
                    toggleCompletionFor(this.itemsCompleted, this.items, 'not-done');

                } else {
                    toggleCompletionFor(this.items, this.itemsCompleted, 'done');
                }
            },
            changed: function(event, index) {
                if ($(event.target).val() === '') {
                    if (this.activeEditorCompleted) {
                        deleteTodo(this.itemsCompleted[index].id);
                        this.itemsCompleted.splice(index, 1);
                    } else {
                        deleteTodo(this.items[index].id);
                        this.items.splice(index, 1);
                    }
                    this.activeEditorIndex = -1;
                }
            },
            blurred: function(event, index, isCompleted) {
                if (this.activeEditorCompleted === true && this.activeEditorIndex !== -1) {
                    updateTitle(this.itemsCompleted[index].id, this.itemsCompleted[index].text, 'done');
                } else if (this.activeEditorCompleted === false && this.activeEditorIndex !== -1) {
                    updateTitle(this.items[index].id, this.items[index].text, 'not-done');
                }

                this.activeEditorIndex = -1;
            },
            spanClicked: function(event, index, isCompleted) {
                this.activeEditorCompleted = isCompleted;
                this.activeEditorIndex = index;
            }
        },
        created: function() {
            this.fetchData()
        }
    });

    function toggleCompletionFor(itemsToSplice, itemsToUnshift, status) {
        for (var i = itemsToSplice.length - 1; i >= 0; i--) {
            updateTitle(itemsToSplice[i].id, itemsToSplice[i].text, status);
            itemsToUnshift.unshift({
                id: itemsToSplice[i].id,
                text: itemsToSplice[i].text
            });
            itemsToSplice.splice(i, 1);
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