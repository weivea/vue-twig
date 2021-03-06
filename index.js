/**
 * Created by weijianli on 16/7/23.
 */
/* eslint-disable no-new */
import storage from './lib/storage'
let __Vue, twiger, readyCallBack
 const saveType = {
  localStorage: 'localStorage',
  sessionStorage: 'sessionStorage'
}
class Twig {
  constructor (op, co) {
    this.opErrStr = '[Twig] format of "option" like {"key":"xxxx",dataFun:function(data){},saveType:"xxx[optional]"} | [{"key":"xxxx",dataFun:function(data){},saveType:"xxx"},{"key":"xxxx",dataFun:function(data){},saveType:"xxx"}...]'
    this.prex = '_twig_'
    this.co = co
    this.timer = null
    this.ready = null
    this.vm = null
    if (readyCallBack) {
      this.ready = readyCallBack
    }
    this.dataTree = {}

    this.watchList = {}
    this.downFlags = {}
    this.readyFlag = false
    var st = storage()
    this.st = st
    this.sessionStorage = st.sessionStorage
    this.localStorage = st.localStorage

    // 处理配置参数op
    let errFlag = false
    if (Object.prototype.toString.call(op) === '[object Object]') {
      this.explainOption(op)
    } else if (Object.prototype.toString.call(op) === '[object Array]') {
      op.forEach((item) => {
        if (Object.prototype.toString.call(item) === '[object Object]') {
          this.explainOption(item)
        } else {
          errFlag = true
        }
      })
    } else {
      errFlag = true
    }
    if (errFlag) {
      console.error(this.opErrStr)
    }
  }
  // 处理配置参数op
  explainOption (opItem) {
    if (typeof opItem.key !== 'string' || typeof opItem.dataFun !== 'function' || (opItem.saveType && typeof opItem.saveType !== 'string')) {
      console.error(this.opErrStr)
      return
    }
    this.downFlags[opItem.key] = false

    let tmpD
    if (opItem.saveType === saveType.localStorage || opItem.saveType === saveType.sessionStorage) {
      this.watchList[opItem.key] = {
        handler: (val, oldVal) => {
          this.watchHander(val, opItem.key, opItem.saveType)
        },
        deep: true
      }
      tmpD = this[opItem.saveType].getItem(this.prex + opItem.key)
      try {
        tmpD = JSON.parse(tmpD)
      } catch (e) {

      }
    }
    var dataFun
    if (Object.prototype.toString.call(opItem.dataFun) === '[object GeneratorFunction]') {
      if (this.co) {
        dataFun = this.co.wrap(opItem.dataFun)
      } else {
        throw new Error('[Twig] GeneratorFunction needs "co" mobule')
      }
    } else {
      dataFun = opItem.dataFun
    }
    var re = dataFun(tmpD)
    if (Object.prototype.toString.call(re) === '[object Promise]') {
      re.then((data) => {
        this.initData(opItem.key, data, opItem.saveType)
      }).catch((err) => {
        console.error(err)
      })
    } else {
      this.initData(opItem.key, re, opItem.saveType)
    }
  }

  initData (key, data, sType) {
    this.dataTree[key] = data
    if (sType === saveType.localStorage || sType === saveType.sessionStorage) {
      if (typeof data === 'object') {
        data = JSON.stringify(data)
        this[sType].setItem(this.prex + key, data)
      }else{
        console.error(`twig model "${key}" should be object`)
      }
    }
    this.downFlags[key] = true
    setTimeout(() => {
      this.checkReady()
    }, 0)
  }

  watchHander (data, key, sType) {
    if(this.timer){
      clearTimeout(this.timer)
      this.timer = null
    }
    this.timer = setTimeout(() => {
      if (typeof data === 'object') {
        data = JSON.stringify(data)
      }
      this[sType].setItem(this.prex + key, data)
    },0)
  }

  checkReady () {
    if(this.readyFlag){
      return
    }
    for (var k in this.downFlags) {
      if (this.downFlags[k] === false) {
        return
      }
    }
    this.readyFlag = true;
    this.vm = new __Vue({
      data: this.dataTree,
      watch: this.watchList
    })
    this.ready()
  }
}

function install (_Vue, option, co) {
  if (__Vue) {
    console.error(
      '[Twig] already installed. Vue.use(Twig) should be called only once.'
    )
    return
  }
  __Vue = _Vue

  twiger = new Twig(option, co)
  Object.defineProperty(__Vue.prototype, '$twig', {
    configurable: false,
    enumerable: true,
    get () {
      return twiger.vm.$data
    }
  })
  Object.defineProperty(__Vue.prototype, '$twigWarp', {
    value: twigWarp,
    writable: false,
    enumerable: true,
    configurable: true
  })
}
 function twigWarp(obj){
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    var re = {}
    for(var key in obj){
      const val = obj[key];
      Object.defineProperty(re, key, {
        enumerable: true,
        configurable: true,
        get: function () {
          return val
        },
        set: function (newVal) {
          console.error(`As a twig index, prop "${key}" can't be modified by '='`)
        }
      })
    }
    return re
  }else{
    console.error('$twigWarp()\'s param format should be JSON')
    return obj
  }
}
function ready (cb) {
  if (twiger) {
    twiger.ready = cb
  } else {
    readyCallBack = cb
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Twig = Twig
}
module.exports = {
  install,
  saveType,
  twigWarp,
  ready: ready
}
