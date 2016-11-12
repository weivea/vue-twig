import child from './child'
export default {
  name: 'app',
  data: function () {
    return {
      form: this.$twig.session.form,
      storage: this.$twig.storage,
      dataTree: this.$twig.dataTree
    }
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
