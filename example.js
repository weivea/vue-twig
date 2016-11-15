/**
 * Created by weijianli on 16/11/14.
 */
import Vue from 'vue/dist/vue'
import twig from 'vue-twig'
import mbody from './todomvc/mbody.vue'
import mheader from './todomvc/mheader.vue'
import mfooter from './todomvc/mfooter.vue'
import twigData from './todomvc/twig-data'


window.onload = function () {
  Vue.use(twig, twigData)
  twig.ready(function () {
    window._App = new Vue({
      el: document.getElementById('container'),
      template: '<div><mheader/><mbody/><mfooter/></div>',
      components: {
        mbody,
        mheader,
        mfooter
      }
    })
  })
}
