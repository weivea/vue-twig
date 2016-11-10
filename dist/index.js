'use strict';

/**
 * Created by weijianli on 16/7/24.
 */
var timer1;
var timer2;
var session = proxyObj({},1);
var storage = proxyObj({},2);
if(sessionStorage.__vue_session){
  session = Object.assign(session,JSON.parse(sessionStorage.__vue_session));
}
if(localStorage.__vue_storage) {
  storage = Object.assign(storage,JSON.parse(localStorage.__vue_storage));
}
session.$saveData=()=>{
  saveDate(1);
};
storage.$saveData=()=>{
  saveDate(2);
};
function proxyObj(obj,type) {
  return new Proxy(obj, {
    set (target, key, value, receiver) {
      if(Object.prototype.toString.call(value) == "[object Object]"){
        value =  Object.assign(proxyObj({},type),value);
      }
      var re = Reflect.set(target, key, value, receiver);
      saveDate(type);
      return re;
    }
  })
}
function saveDate(type) {
  if(type == 1){
    if(!timer1){
      timer1 = setTimeout(function () {
        sessionStorage.__vue_session = JSON.stringify(session);
        timer1 = undefined;
      },0);
    }
  }else if(type == 2){
    if(!timer2){
      timer2 = setTimeout(function () {
        localStorage.__vue_storage = JSON.stringify(storage);
        timer2 = undefined;
      },0);
    }
  }
}

function vueStorage(Vue) {
  Object.defineProperties(Vue.prototype, {
    $storageBind: {
      get() {
        var property = 'vue'+this._uid;
        return function (data) {
          if(!data){
            storage[property] = {};return;
          }
          if(Object.prototype.toString.call(data) != "[object Object]"){
            throw new Error('vue-storage:$storageBind(data) needs data as like as [object Object]!!');
          }
          if(!storage[property]){
            storage[property] = {};
          }
          data = Object.assign(data,storage[property]);
          data = Object.assign(storage[property],data);
          data.$saveData = storage.$saveData;
          return data;
        };
      }
    },
    $sessionBind: {
      get() {
        var property = 'vue'+this._uid;
        return function (data) {
          if(!data){
            session[property] = {};return;
          }
          if(Object.prototype.toString.call(data) != "[object Object]"){
            throw new Error('vue-storage:$sessionBind(data) needs data as like as [object Object]!!');
          }
          if(!session[property]){
            session[property] = {};
          }
          data = Object.assign(data,session[property]);
          data = Object.assign(session[property],data);
          data.$saveData = session.$saveData;
          return data;
        };
      }
    }
  });
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueStorage);
}

module.exports = vueStorage;