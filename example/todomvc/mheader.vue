<template>
    <header class="header">
        <h1>todos</h1>
        <input class="new-todo"
               autofocus autocomplete="off"
               placeholder="What needs to be done?"
               v-model="newTodo"
               @keyup.enter="addTodo">
    </header>
</template>
<script>
    //import {twigWarp} from '../../index'

    export default {
        data(){
            var twigs= this.$twigWarp({
                todos:this.$twig.todos
            })
            var privates={
                uid:this.$twig.todos.length,
                newTodo:''
            }
            return Object.assign(twigs,privates)
        },
        methods:{
            addTodo: function () {
                var value = this.newTodo && this.newTodo.trim()
                if (!value) {
                    return
                }
                this.todos.push({
                    id: this.uid++,
                    title: value,
                    completed: false
                })
                this.newTodo = ''
            }
        }
    }
</script>