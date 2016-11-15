/**
 * Created by weijianli on 16/11/15.
 */
import { saveType } from '../../index'
/**
 * todos:待做事项列表
 */
const todos = {
  key: 'todos',
  saveType: saveType.localStorage,//localStorage本地存储
  dataFun: function (todos) {
    if (todos) {
      todos.forEach(function (todo, index) {
        todo.id = index
      })
    } else {
      todos = [{
        id: 0,
        title: 'example',
        completed: false
      }];
    }
    return todos
  }
}
/**
 * state:状态数据
 * 
 * */
const state = {
  key: 'state',
  dataFun: function () {
    return {
      visibility: 'all'
    }
  }
}

export default [todos, state]