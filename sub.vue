<template>
    <h1>test:component-children</h1>
    <hr>
    <h1 style="text-align: center">请在下面输入框输入内容,然后刷新看看</h1>
    <form  style="text-align: center">
        <input type="text"  v-model="c">
        内容:{{c}}
        <br>
        <input type="text"  v-model="d">
        内容:{{d}}
        <br>
    </form>
    <hr>

</template>
<script type="text/babel">
    export default {
        data:function(){
            return this.$twig.storage
        },
        methods:{
            addOne:function() {

            }
        }
    }
</script>