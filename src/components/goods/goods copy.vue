<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li v-for="(item,index) in goods" :key=index class="menu-item">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper"></div>
  </div>
</template>

<script>
const ERR_OK = 0
export default {
  props:{
    seller:{
      type:Object
    },
  },
  data(){
    return{
      goods:[]
    }
  },
  created(){
    this.$http.get('/api/goods').then((response)=>{
      response = response.body
      if(response.errno === ERR_OK){
        console.log(response)
        this.goods = response.data
      }
    })
    this.classMap=['decrease','discount','special','invoice','guarantee']  
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .goods
    display: flex
    position:absolute
    top:174px
    bottom: 46px
    width:100%
    overflow: hidden
    .menu-wrapper
      flex:0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        .icon
          display:inline-block
          vertical-align:top
          width:12px
          height:12px
          background-size:12px 12px
          background-repeat:no-repeat
          margin-right: 2px
          &.decrease
            bg-image('decrease_1')
          &.discount
            bg-image('discount_1')
          &.guarantee
            bg-image('guarantee_1')
          &.invoice
            bg-image('invoice_1')
          &.special
            bg-image('special_1') 
          
    .foods-wrapper 
      flex:1

</style>
