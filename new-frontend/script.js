var card = new Vue({
    el: "#card",
    data: {
        activeEditorIndex: -1,
        activeEditorCompleted: false,
        title: "Your Todo List",
        items: [{
            id: 1,
            text: "Velociraptor"
        }, {
            id: 2,
            text: "Triceratops"
        }, {
            id: 3,
            text: "Stegosaurus"
        }],

        itemsCompleted: [{
            id: 4,
            text: "VelociraptorComplt"
        }, {
            id: 5,
            text: "TriceratopsComplt"
        }, {
            id: 6,
            text: "StegosaurusComplt"
        }]
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
        itemsCompleted: function (newItemsCompleted, oldItemsCompleted) {
            console.log(newItemsCompleted, oldItemsCompleted);
        }
    },

    methods: {
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

            $that = this; // 'this' keyword will change of scope inside timeout function
            if ($(event.target).val() === '') {
                if (this.activeEditorCompleted) {
                    $that.itemsCompleted.splice(index, 1);
                } else {
                    $that.items.splice(index, 1);
                }
                this.activeEditorIndex = -1;
            }

            // $input.on('focusout', save);
        },
        blurred: function (event, index, isCompleted) {
            this.activeEditorIndex = -1;
        },
        spanClicked: function (event, index, isCompleted) {
            this.activeEditorCompleted = isCompleted;
            this.activeEditorIndex = index;
        }
    }
});
