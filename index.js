/**
 * Created by weijianli on 16/7/23.
 */
import storage from './lib/storage'
let __Vue,twiger,readyCallBack;
const saveType = {
  localStorage:"localStorage",
  sessionStorage:"sessionStorage"
};
class twig {
  constructor(op,co){
    this.opErrStr = '[twig] format of "option" like {"key":"xxxx",dataFun:function(data){},saveType:"xxx[optional]"} | [{"key":"xxxx",dataFun:function(data){},saveType:"xxx"},{"key":"xxxx",dataFun:function(data){},saveType:"xxx"}...]';
    this.prex = '_twig_';
    this.co = co;
    this.timer=null;
    this.ready = null;
    if(readyCallBack){
      this.ready = readyCallBack;
    }
    
    this.watchList = [];
    this.downFlags = {};
    this.vm = new __Vue();
    var st = storage();
    this.st = st;
    this.sessionStorage = st.sessionStorage;
    this.localStorage = st.localStorage;

    //处理配置参数op
    let errFlag = false;
    if(Object.prototype.toString.call(op) == "[object Object]"){
      this.explainOption(op);
    }else if(Object.prototype.toString.call(op) == "[object Array]"){
      op.forEach((item)=>{
        if(Object.prototype.toString.call(item) == "[object Object]"){
          this.explainOption(item);
        }else{
          errFlag = true;
        }
      })
    }else{
      errFlag = true;
    }
    if(errFlag){
      console.error(this.opErrStr);
    }
  }

  //处理配置参数op
  explainOption(opItem){
    if(typeof opItem.key != 'string' || typeof opItem.dataFun != 'function' || (opItem.saveType && typeof opItem.saveType != 'string')){
      console.error(this.opErrStr);
      return;
    }
    this.downFlags[opItem.key] = false;

    let tmpD;
    if(opItem.saveType == saveType.localStorage || opItem.saveType == saveType.sessionStorage){
      this.watchList.push({key: opItem.key, sType: opItem.saveType});
      tmpD = this[opItem.saveType].getItem(this.prex+opItem.key);
      try{
        tmpD = JSON.parse(tmpD);
      }catch(e){

      }
    }
    var dataFun;
    if(Object.prototype.toString.call(opItem.dataFun) == "[object GeneratorFunction]"){
      if(this.co){
        dataFun = this.co.wrap(opItem.dataFun);
      }else{
        throw new Error("[twig] GeneratorFunction needs 'co' mobule")
      }
    }else{
      dataFun = opItem.dataFun;
    }
    var re = dataFun(tmpD);
    if(Object.prototype.toString.call(re) == "[object Promise]"){
      re.then((data) =>{
        this.initData(opItem.key,data,opItem.saveType);
      }).catch((err) => {
        console.error(err);
      })
    }else{
      this.initData(opItem.key,re,opItem.saveType);
    }
  }

  initData(key, data, sType) {
    __Vue.set(this.vm,key,data);
    //this.vm.$data[key] = data;
    if (sType == saveType.localStorage || sType == saveType.sessionStorage) {
      if(typeof data == 'object'){
        data = JSON.stringify(data);
      }
      this[sType].setItem(this.prex + key, data);
    }
    this.downFlags[key] = true;
    this.timer = setTimeout(()=>{
      this.checkReady();
    },0)
  }

  initWatch(){
    this.watchList.forEach((item)=>{
      this.vm.$watch(item.key, (data,oldVal)=>{
        setTimeout(()=>{
          if(typeof data == 'object'){
            data = JSON.stringify(data);
          }
          this[item.sType].setItem(this.prex+item.key, data);
        },0);
      }, {
        deep: true
      })
    })
  }

  checkReady(){
    for(var k in this.downFlags){
      if(this.downFlags[k] == false){
        return;
      }
    }
    //实施缓存数据初始化
    this.st.valid && this.initWatch();

    this.ready();
  }
}



function install(_Vue,option,co) {
  if(__Vue){
    console.error(
      '[twig] already installed. Vue.use(twig) should be called only once.'
    );
    return;
  }
  __Vue = _Vue;

  twiger = new twig(option,co);


  Object.defineProperty( __Vue.prototype,'$twig',{
    configurable:false,
    enumerable:true,
    get(){
      return twiger.vm.$data;
    }
  });
}

function ready(cb){
  if(twiger){
    twiger.ready = cb;
  }else{
    readyCallBack = cb
  }
}



if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueStorage);
}
export default {
  install,
  saveType,
  ready:ready
}