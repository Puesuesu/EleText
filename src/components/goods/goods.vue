<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <!-- v-for中的循环嵌套 -->
          <ul>
            <li @click="selectFood(i,$event)" v-for="(i,cindex) in goods[index].foods" :key="cindex" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="i.icon">
              </div>
              <div class="content" >
                <h2 class="name">{{i.name}}</h2>
                <p class="desc">{{i.description}}</p>
                <div class="extra">
                  <span class="count">月售{{i.sellCount}}份</span><span>好评率{{i.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">{{i.price}}元</span><span class="old" v-show="i.oldPrice">{{i.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="onAdd" :food="i"/>
                </div>
              </div>
            </li>
          </ul>      
        </li>
      </ul>

    </div>
    <shopcart ref="shopcart" :select-foods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"/>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script>
const ERR_OK = 0
import BScroll from "better-scroll"
import shopcart from '../../components/shopcart/shopcart'
import cartcontrol from '../../components/cartcontrol/cartcontrol'
import food from '../../components/food/food'
export default {
  components:{
    shopcart,
    cartcontrol,
    food
  },
/*   props:{
    seller:{
      type:Object
    },
  }, */
  data(){
    return{
      seller:{},
      goods:[],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed:{
    currentIndex(){
      for(let i = 0;i < this.listHeight.length;i++){
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i+1]
        if(!height2 || this.scrollY >= height1 && this.scrollY < height2){
          return i
        }
      }
      return 0
    },
    selectFoods(){
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if(food.count){
            foods.push(food)
          }
        })
      })
      return foods
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
    this.$http.get('/api/goods').then((response)=>{
      response = response.body
      if(response.errno === ERR_OK){
        console.log(response)
        this.goods = response.data
        /* dom中更新数据是异步的，实际上并未更新，需要使用nextTick函数 */
        this.$nextTick(() =>{
          this._initScroll()
          this._calculateHeight();
          })   
      }
    });
    this.classMap=['decrease','discount','special','invoice','guarantee']  
    },
  methods:{
    selectMenu(index,event){
      if(!event._constructed){
        return
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el,300)
      console.log(index)

    },
    selectFood(i,event){
      if(!event._constructed){
        return
      }
      this.selectedFood = i
      /* 调用子组件方法 */
      this.$refs.food.show()
    },
    onAdd(el){
      this.$refs.shopcart.drop(el)
    },
    /* 滑动实现包括:div中refs的书写+nextTick的使用 */
    _initScroll(){
      this.menuScroll = new BScroll(this.$refs.menuWrapper,{
        click:true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
        probeType: 3,
        click:true
      });/* 
      时实获取Y值 */
      this.foodsScroll.on('scroll',(pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    /* 计算每个index的区间高度 */
    _calculateHeight(){
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for(let i = 0;i < foodList.length;i++){
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl'
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
        padding:0 12px
        &.current
          position:relative
          z-index:10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()

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
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7,17,27,0.1))
          font-size:12 px
    .foods-wrapper 
      flex:1
      .food-list
        .title
          padding-left: 14px
          height: 26px
          line-height: 26px
          border-left: 2px solid #d9dde1
          font-size: 12px
          color: rgb(147,153,159)
          background: #f3f5f7
        .food-item
          display:flex
          margin: 18px
          padding-bottom: 18px
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
            margin-bottom:0
          .icon
            flex: 0 0 57px
            margin-right: 10px
          .content
            flex: 1
            .name
              margin: 2px 0 8px 0
              height: 14px
              line-height: 14px
              font-size: 14px
              color: rgb(7,17,27)
            .desc,.extra
              line-height: 10px
              font-size: 10px
              color: rgb(147,153,159)
            .desc
              margin-bottom: 8px
              line-height: 12px
            .extra
              .count
                margin-right: 12px
            .price
              font-weight: 700
              line-height: 24px
              .now
                margin-right: 8px
                font-size: 14px
                color:rgb(240,20,20)
              .old
                text-decoration: line-through
                font-size: 10px
                color:rgb(147,153,159)
            .cartcontrol-wrapper
              position: absolute
              right: 0
              bottom: 12px


</style>  
