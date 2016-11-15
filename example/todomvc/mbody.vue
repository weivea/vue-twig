<template>
    <section style="position: relative;">
        <input class="toggle-all" type="checkbox" v-model="allDone">
        <ul class="todo-list">
            <li v-for="todo in filteredTodos"
                class="todo"
                :key="todo.id"
                :class="{ completed: todo.completed, editing: todo == editedTodo }">
                <div class="view">
                    <input class="toggle" type="checkbox" v-model="todo.completed">
                    <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
                    <button class="destroy" @click="removeTodo(todo)"></button>
                </div>
                <input class="edit" type="text"
                       v-model="todo.title"
                       v-todo-focus="todo == editedTodo"
                       @blur="doneEdit(todo)"
                       @keyup.enter="doneEdit(todo)"
                       @keyup.esc="cancelEdit(todo)">
            </li>
        </ul>
    </section>
</template>
<script>

    import filters from './filters'
    export default {
        data(){
            var twigs= this.$twigWarp({
                todos:this.$twig.todos,
                state:this.$twig.state
            })
            var privates={
                editedTodo: null,
                beforeEditCache:null,
                allDone:null
            }
            return Object.assign(twigs,privates)
        },
        computed:{
            filteredTodos: function () {
                return filters[this.state.visibility](this.todos)
            },
            allDone: {
                get: function () {
                    return filters.active(this.$twig.todos).length === 0
                },
                set: function (value) {
                    this.todos.forEach(function (todo) {
                        todo.completed = value
                    })
                }
            }
        },
        methods:{
            removeTodo: function (todo) {
                this.todos.splice(this.todos.indexOf(todo), 1)
            },
            editTodo: function (todo) {
                this.beforeEditCache = todo.title
                this.editedTodo = todo
            },
            doneEdit: function (todo) {
                if (!this.editedTodo) {
                    return
                }
                this.editedTodo = null
                todo.title = todo.title.trim()
                if (!todo.title) {
                    this.removeTodo(todo)
                }
            },
            cancelEdit: function (todo) {
                this.editedTodo = null
                todo.title = this.beforeEditCache
            }
        },
        directives: {
            'todo-focus': function (el, value) {
                if (value) {
                    el.focus()
                }
            }
        }
    }
</script>