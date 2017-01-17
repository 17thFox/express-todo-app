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
            var self = this;
            updateTitle(self.items[index].id, self.items[index].title, 'done');
            self.itemsCompleted.unshift({
                id: self.items[index].id,
                text: self.items[index].text
            });
            self.items.splice(index, 1);
        },
        uncheckItem: function(index) {
            var self = this;
            updateTitle(self.itemsCompleted[index].id, self.itemsCompleted[index].title, 'not-done');
            self.items.push({
                id: self.itemsCompleted[index].id,
                text: self.itemsCompleted[index].text
            });
            self.itemsCompleted.splice(index, 1);
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
            var self = this;
            for (var i = 0; i < self.itemsCompleted.length; i++) {
                deleteTodo(self.itemsCompleted[i].id);
            }
            self.itemsCompleted.splice(0, self.itemsCompleted.length);
        },
        changed: function(event, index) {
            $that = this;
            if ($(event.target).val() === '') {
                if (this.activeEditorCompleted) {
                    deleteTodo($that.itemsCompleted[index].id);
                    $that.itemsCompleted.splice(index, 1);
                } else {
                    deleteTodo($that.items[index].id);
                    $that.items.splice(index, 1);
                }
                this.activeEditorIndex = -1;
            }
        },
        blurred: function(event, index, isCompleted) {
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
