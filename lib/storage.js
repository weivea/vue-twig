function storage() {
  var re = {};
  var flag = testStorage();
  if(flag){
    re.localStorage = window.localStorage;
    re.sessionStorage = window.sessionStorage;
  }else{
    re.localStorage = storageTmp();
    re.sessionStorage = storageTmp();
  }
  re.valid = flag;
  return re;
}
function storageTmp() {
  var STORAGE = {};
  STORAGE.o = {};
  STORAGE.setItem = function(key, value) {
    STORAGE.o[key]=value;
  };
  STORAGE.getItem = function(key) {
    return STORAGE.o[key];
  };
  STORAGE.removeItem = function(key) {
    STORAGE.o[key] = undefined;
    delete STORAGE.o[key];
  };
  return STORAGE;
}
function testStorage() {
  var re =true;
  var storage = window.localStorage;
  if (storage) {
    try {
      storage.setItem("_localStorageTest", "Hello");
      storage.removeItem("_localStorageTest");
    } catch (e) {
      re = false;
    }
  }
  else {
    re = false;
  }
  !re && console.error('browser does not support localStorage~~');
  return re;
}
export  default storage