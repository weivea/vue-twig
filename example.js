/**
 * Created by weijianli on 16/7/23.
 */

import Vue from 'vue'
import twig from'vue-twig'
import app from './app.vue'
import co from 'co'

Vue.use(twig,[{
  key:'dataTree',
  //saveType:twig.saveType.sessionStorage,
  dataFun:  function *(data) {
    console.log(data);
    var re = yield thunk();
    return re;
  }
},{
  key:'storage',
  saveType:twig.saveType.localStorage,
  dataFun: async function( data) {
    console.log(data);
    var re = await storageFun();
    if(data){re = data};
    return re;
  }
},{
  key:'session',
  saveType:twig.saveType.sessionStorage,
  dataFun: async function( data) {
    console.log(data);
    var re = await sessionFun();
    if(data){re = data};
    return re;
  }
}],co);

function thunk() {
  return function (cb) {
    setTimeout(function () {
      cb(null,[{w:1},{w:2},{w:3},{w:4}]);
    },500)
  }
}
function storageFun() {
  return new Promise(function (rs,rj) {

    setTimeout(function () {
      rs({
        c:3,
        d:4
      });
    },500)
  })
}
function sessionFun() {
  return new Promise(function (rs,rj) {
    setTimeout(function () {
      rs({
        form:{
          a:1,
          b:2
        }
      });
    },500)
  })
}

twig.ready(function(){
  window.appVue =  new Vue({
    el: '#container',
    components: { app }
  });
});





