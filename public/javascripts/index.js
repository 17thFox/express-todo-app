
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
            console.log(newItems, oldItems);
        },
        itemsCompleted: function(newItemsCompleted, oldItemsCompleted) {
            console.log(newItemsCompleted[0].text, oldItemsCompleted.length);
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
                        if (item.status === 'done') {
                            self.items.push({
                                id: item.id,
                                text: item.title
                            });
                        }
                        else {
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

            if (input.value !== '') {
                this.items.push({
                    text: input.value
                });
                input.value = '';
            }
        },

        checkItem: function(index) {
            this.itemsCompleted.unshift({
                text: this.items[index].text
            });
            this.items.splice(index, 1);
        },

        uncheckItem: function(index) {
            this.items.push({
                text: this.itemsCompleted[index].text
            });
            this.itemsCompleted.splice(index, 1);
        },

        clearCompleted: function() {
            this.itemsCompleted.splice(0, this.itemsCompleted.length);
        },
        deleteItemCompleted: function(index) {
            this.itemsCompleted.splice(index, 1);
        },
        deleteItem: function(index) {
            this.items.splice(index, 1);
        },
        changed: function(event, index) {

            $that = this;
            if ($(event.target).val() === '') {
                if (this.activeEditorCompleted) {
                    $that.itemsCompleted.splice(index, 1);
                } else {
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





            // this.$http.get('/api/todos').then(function(response) {

            //     // this.$set('datas', response.data);
            //     console.log('response', response);
            //     $.each(response, function(idx, item) {

            //         console.log('item', item.status);
            //     });
            // }, function(response) {
            //     // error callback
            // });