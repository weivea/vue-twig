<template>
    <footer class="footer" v-show="totalLength" v-cloak>
        <span class="todo-count">
          <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left
        </span>
        <ul class="filters">
            <li><a href="#/all" :class="{ selected: state.visibility == 'all' }">All</a></li>
            <li><a href="#/active" :class="{ selected: state.visibility == 'active' }">Active</a></li>
            <li><a href="#/completed" :class="{ selected: state.visibility == 'completed' }">Completed</a></li>
        </ul>
        <button class="clear-completed" @click="removeCompleted" v-show="totalLength > remaining">
            Clear completed
        </button>
    </footer>
</template>
<script type="text/babel">
    import filters from './filters'
    export default {
        data(){
            var twigs= this.$twigWarp({
                todos:this.$twig.todos,
                state:this.$twig.state
            })
            return twigs
        },
        computed: {
            remaining: function () {
                return filters.active(this.$twig.todos).length
            },
            totalLength:function () {
                return this.$twig.todos.length
            }
        },
        created(){
            window.addEventListener('hashchange', this.onHashChange)
            this.onHashChange()
        },
        methods:{
            onHashChange :function () {
                var visibility = window.location.hash.replace(/#\/?/, '')
                if (filters[visibility]) {
                    this.state.visibility = visibility
                } else {
                    window.location.hash = ''
                    this.state.visibility = 'all'
                }
            },
            removeCompleted: function () {
                var len = this.totalLength
                var actives = filters.active(this.todos)
                this.todos.splice(0,len, ...actives)

                //As a twig index, prop "state" can't be modified by '='
                //this.todos = actives;
            }
        },
        filters: {
            pluralize: function (n) {
                return n === 1 ? 'item' : 'items'
            }
        }
    }
</script>