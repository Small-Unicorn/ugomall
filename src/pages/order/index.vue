<template>
  <div class="wrapper">
    <!-- 订单状态 -->
    <div class="tabs">
      <span class="active">全部</span>
      <span>待付款</span>
      <span>已付款</span>
      <span>退款/退货</span>
    </div>
    <!-- 订单 -->
    <scroll-view class="orders" scroll-y>
      <div class="item" :key="key" v-for="(order, key) in orders">
        <block :key="index" v-for="(goods, index) in order.goods">
          <!-- 商品图片 -->
          <image class="pic" :src="goods.goods_small_logo"></image>
          <!-- 商品信息 -->
          <div class="meta">
            <p class="name">{{goods.goods_name}}</p>
            <p class="price"><span>￥</span>{{goods.goods_price}}<span>.00</span></p>
            <p class="num">x{{goods.goods_number}}</p>
          </div>
        </block>
        <!-- 总价 -->
        <div class="amount">
          共1件商品 总计: ￥{{order.order_price}}(含运费0.00)
        </div>
        <!-- 其它 -->
        <div class="extra">
          订单号: {{order.order_number}}
          <button size="mini" @click="payment(order.order_number)" v-if="order.pay_status == 0" type="primary">支付</button>
          <button size="mini" v-else type="primary">已支付</button>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  
  import request from '@/utils/request';

  export default {

    data () {
      return {
        // 订单列表
        orders: []
      }
    },

    methods: {
      // 微信支付
      async payment (order_number) {

        // 请求支付接口
        const {message} = await request({
          url: '/api/public/v1/my/orders/req_unifiedorder',
          method: 'post',
          header: {Authorization: mpvue.getStorageSync('token')},
          data: {order_number}
        })

        // console.log(message);

        // 通过小程序的 api 可以调出微信支付窗口
        mpvue.requestPayment(message.pay);
      },

      // 订单列表接口
      async getOrderList () {

        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/my/orders/all',
          header: {Authorization: mpvue.getStorageSync('token')},
          data: {type: 1}
        })

        // console.log(message);
        // 数据更新
        this.orders = message.orders;
      }
    },
    
    mounted () {
      // 调用订单列表接口
      this.getOrderList();
    }
  }

</script>

<style scoped lang="less">
  .wrapper {
    
  }
  
  .tabs {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    background-color: #fff;
    box-shadow: 0 4rpx 10rpx #ccc;

    span {
      flex: 1;
      text-align: center;
      font-size: 27rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }

  
  .orders {
    width: 100%;
    background-color: #f4f4f4;

    position: absolute;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    padding: 30rpx 20rpx;
    margin-top: 27rpx;
    background-color: #fff;

    .pic {
      width: 200rpx;
      height: 200rpx;
      float: left;
    }

    .meta {
      height: 200rpx;
      margin-left: 230rpx;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      span {
        font-size: 22rpx;
      }
    }

    .num {
      position: absolute;
      bottom: 0;
      right: 20rpx;
      color: #333;
    }

    .amount {
      text-align: right;
      padding: 20rpx;
      font-size: 24rpx;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
      margin-top: 20rpx;
      color: #999;
    }

    .extra {
      padding: 30rpx;
      font-size: 24rpx;
      color: #999;

      position: relative;

      button {
        position: absolute;
        right: 20rpx;
        font-size: 24rpx;
        margin-top: -10rpx;
      }
    }
  }
</style>