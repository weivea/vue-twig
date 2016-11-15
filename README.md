# vue-twig
用于vue.js的数据mvc的model层插件,区别于单项数据流的另一种体验
同时提供localStorage,sessionStorage

## demo
todomvc:https://weivea.github.io/vue-twig/

## install

```
npm install vue-twig --save
```

## usage


example.js
```
import Vue from 'vue'
import twig from '../index'
import app from './app'
import co from 'co'


//初始化
//dataFun支持 一般函数, Generator函数,async 函数
Vue.use(twig, [{
  key: 'dataTree',
  //saveType:未缓存
  dataFun: function *() {
    var re = yield thunk(data)
    return re
  }
}, {
  key: 'storage',
  saveType: twig.saveType.localStorage,
  dataFun: async function (data) {//data为缓存数据
    console.log(data)
    var re = await storageFun()
    if (data) {
      re = data
    }
    return re
  }
}, {
  key: 'session',
  saveType: twig.saveType.sessionStorage,
  dataFun: async function (data) {//data为缓存数据
    console.log(data)
    var re = await sessionFun()
    if (data) {
      re = data
    }
    return re
  }
}], co)

function thunk (data) {
  console.log(data)
  return function (cb) {
    setTimeout(function () {
      cb(null, data || [{w: 1}, {w: 2}, {w: 3}, {w: 4}])
    }, 500)
  }
}
function storageFun () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve({
        c: 3,
        d: 4
      })
    }, 500)
  })
}
function sessionFun () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve({
        form: {
          a: 1,
          b: 2
        }
      })
    }, 500)
  })
}

twig.ready(function () {
  window._App = new Vue({
    el: '#container',
    components: {
      app
    },
    render (h) {
      return (
        <app/>
      )
    }

  })
})
```

app.js

```
import child from './child'
export default {
  name: 'app',
  data: function () {
    return this.$twigWarp({
      form: this.$twig.session.form,
      storage: this.$twig.storage,
      dataTree: this.$twig.dataTree
    })
  },
  created: function () {
    setTimeout(() => {
      this.$twig.session.form.a = 123
    }, 5000)
  },
  methods: {
    add: function () {
      this.dataTree.push({w: this.dataTree.length + 1})
    }
  },
  components: {
    child
  },
  render (h) {
    var form = this.form
    var storage = this.storage
    var dataTree = this.dataTree
    return (
      <div>
        <h1>test:component-parent</h1>
        <hr/>
        <h1 style="text-align: center">请在下面输入框输入内容,然后刷新看看</h1>
        session:sessionStorage
        <form style="text-align: center">
          <input type="text" value={form.a} on-input={(e)=>{form.a = e.target.value}}/>
          <span>内容:{form.a}</span>
          <br />
          <input type="text" value={form.b} on-input={(e)=>{form.b = e.target.value}}/>
          <span>内容:{form.b}</span>

        </form>
        storage:localStorage
        <form style="text-align: center">
          <input type="text" value={storage.c} on-input={(e)=>{storage.c = e.target.value}}/>
          内容:{storage.c}
          <br/>
          <input type="text" value={storage.d} on-input={(e)=>{storage.d = e.target.value}}/>
          内容:{storage.d}
          <br/>
        </form>
        <hr/>
        <div>
          <p>dataTree:no Cache!</p>
          {
            dataTree.map((item,index)=>{
              return (<span key={index}>{item.w}-</span>)
            })
          }
          <button on-click={this.add}>add</button>
        </div>
        <hr/>
        <div>
          <child/>
        </div>
      </div>
    )
  }
}
```