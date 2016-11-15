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


```

//初始化
import Vue from 'vue'
import twig from 'vue-twig'
import co from 'co'  //运行Generator函数需要
import app from './app'

var model = {
              key: "model名",
              saveType: twig.saveType.localStorage,//存储类型.localStorage/sessionStorage
              dataFun: function (data) {//可以是普通函数,Generator函数(需要co模块),async函数
                //data:缓存的数据

                //生成初始化数据

                return data;//返回初始化的数据
              }
            }

Vue.use(twig, model, [co])//co为可选参数
//或
Vue.use(twig, [model1,model2,moel3 ...],[co])

//数据初始化成功后创建应用实例
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




//组件接入子model
//app.js

export default {
  name: 'app',
  data: function () {
    //接入twig
    var twigs= this.$twigWarp({
      form: this.$twig.session.form,
      storage: this.$twig.storage,
      dataTree: this.$twig.dataTree
    })

    //私有data
    var privates={
        a:1,
        b:2
    }
    return Object.assign(twigs,privates)
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

app.js

```
import child from './child'

```