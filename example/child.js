export default {
    name: 'child',
    data: function () {
        return this.$twig.storage
    },
    render (h) {
        return (
          <div>
              <h1>test:component-children</h1>
              <hr/>
              <h1 style="text-align: center">请在下面输入框输入内容,然后刷新看看</h1>
              <form style="text-align: center">
                  <input type="text" value={this.c} v-cmodel={()=>{console.log(this)}}/>
                  内容:{this.c}
                  <br/>
                  <input type="text" value={this.d} on-keydown={(e)=>{this.d = e.target.value}}/>
                  内容:{this.d}
                  <br/>
              </form>
              <hr/>
          </div>
        )
    }
}

