// import Vue from 'vue'
// import App from './App'
//
// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App }
// })

/**
 * Created by weijianli on 16/7/23.
 */
/* eslint-disable no-new */
import Vue from 'vue'
import twig from '../index'
import app from './app'
import co from 'co'


Vue.use(twig, [{
  key: 'dataTree',
  //saveType:twig.saveType.sessionStorage,
  dataFun: function *(data) {
    var re = yield thunk(data)
    return re
  }
}, {
  key: 'storage',
  saveType: twig.saveType.localStorage,
  dataFun: async function (data) {
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
  dataFun: async function (data) {
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


