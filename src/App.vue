<template>
  <div id="app">
    <headers :seller="seller"/>
    <div class="tab border-1px">
      <div class="tab-item">
          <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
          <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
          <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- keep-alive用来保存组件的状态，对组件进行缓存。 -->
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import qs from 'query-string'
import {getSeller} from '../src/api'
import headers from './components/header/headers'
const ERR_OK = 0
export default {
  components:{
    headers
  },
  data(){
    return{
      seller: {
        id: qs.parse(location.search).id
      }
    }
  },
  created(){
    this.$http.get('/api/seller').then((response)=>{
      response = response.body
      if(response.errno === ERR_OK){
        console.log(response)
        this.seller = response.data
      }
    })
    this._getSeller()
    },
  methods: {
    _getSeller() {
      getSeller({
        id: this.seller.id
      }).then((seller) => {
        this.seller = Object.assign({}, this.seller, seller)
        console.log(this.seller)
      })
    }
  },
                                                              
}
</script>


<style lang="stylus" rel="stylesheet/stylus">
@import './common/stylus/mixin.styl'
  #app
    .tab
      display :flex
      width:100%
      height:40px
      line-height:40px
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex:auto
        text-align:center
        &>a
          display:block
          font-size:14px
          color:rgb(77,85,93)
          &.active
            color:rgb(240,20,20)
</style>
