<template>
  <!-- 搜索 -->
  <div class="search" :class="{focused: focused}">
    <!-- 搜索框 -->
    <div class="input-wrap" @click="goSearch">
      <input type="text" @confirm="goList" v-model="keywords" @input="query" :placeholder="placeholder">
      <span class="cancle" @click.stop="cancleSearch">取消</span>
    </div>
    <!-- 搜索结果 -->
    <div class="content">
      <div class="title">搜索历史<span class="clear" @click="clearHistory"></span></div>
      <div class="history">
        <navigator :url="'/pages/list/main?query=' + item" :key="index" v-for="(item, index) in history">{{item}}</navigator>
      </div>
      <!-- 结果 -->
      <scroll-view scroll-y class="result" v-if="list.length">
        <navigator url="" :key="index" v-for="(item, index) in list">{{item.goods_name}}</navigator>
      </scroll-view>
    </div>
  </div>
</template>
<script>

  // 引入 wx.request 的 Promise 封装版本
  import request from '@/utils/request';
  
  export default {

    data () {
      return {
        focused: false,
        placeholder: '',
        // 搜索关键字
        keywords: '',
        // 搜索建议列表
        list: [],

        // 搜索历史
        history: mpvue.getStorageSync('history') || [],

        // 表示上一次请求是否完成
        locked: false
      }
    },

    methods: {

      clearHistory () {
        // 清空搜索历史
        mpvue.removeStorageSync('history');
        this.history = [];
      },

      goList () {
        // 将用户的搜索记录存在本地，即 storage

        // 追加用户的搜索历史
        this.history.push(this.keywords);

        // 将重复的单元删除
        this.history = [...new Set(this.history)];

        // 存入本地
        mpvue.setStorageSync('history', this.history);

        // 跳转到商品列表
        // 输入的关键字为空时，不能跳转
        if(this.keywords == '') return;
        mpvue.navigateTo({
          url: '/pages/list/main?query' + this.keywords
        })
      },

      // 当用户输入时，发起请求
      async query () {

        // 如果 keywords 为空时，无需要发送请求
        if(this.keywords == '') return this.list = [];

        // 上一次请求未完成，不允许下一次请求
        if(this.locked) return; 

        this.locked = true;

        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/goods/qsearch',
          data: {query: this.keywords}
        })

        // console.log(message);
        // 更新数据
        this.list = message;

        this.locked = false;
      },

      goSearch (ev) {
        this.focused = true;
        this.placeholder = '请输入您要搜索的内容';
        
        // 触发父组件自定义事件
        this.$emit('search', {
          pageHeight: mpvue.getSystemInfoSync().windowHeight
        })

        // 隐藏 tabBar
        mpvue.hideTabBar();
      },

      cancleSearch () {
        this.focused = false;
        this.placeholder = '';

        // 清空输入框
        this.keywords = '';
        // 清空列表
        this.list = [];

        // 触发父组件自定义事件
        this.$emit('search', {
          pageHeight: 'auto'
        })

        // 显示 tabBar
        mpvue.showTabBar();
      }
    },


    // mpvue 目前尚不支持 pageLifetimes !!!!!!
    // 而且估计永远也不会支持了！！！！！

    // 当父组件的事件触发时，
    // 该组件也会有对应的事件被执行
    pageLifetimes: {
      show: function() {
        // 页面被展示
        // 当父组件的 show 被触发时
        // 该组件的 show 也会被执行
        // this.focused = false;
        // this.keywords = '';

        // console.log(111);
      },

      hide: function() {
        // 页面被隐藏
        // 当父组件的 hide 被触发时
        // 该组件的 hide 也会被执行
      }
    }
  }

</script>
<style lang="less" scoped>
  .search {
    display: flex;
    flex-direction: column;
    
    // 搜索框
    .input-wrap {
      display: flex;
      height: 100rpx;
      padding: 20rpx 30rpx;
      background-color: #ea4451;
      box-sizing: border-box;
      position: relative;

      &::before,
      &::after {
        height: 44rpx;
        line-height: 1;
        background-image: url(https://ugo2.oss-cn-hangzhou.aliyuncs.com/images/icon_search%402x.png);
        background-size: 32rpx;
        background-position: 6rpx center;
        background-repeat: no-repeat;

        position: absolute;
        top: 28rpx;
        z-index: 9;
      }

      &::before {
        content: '搜索';
        display: block;

        width: 100rpx;
        padding: 11rpx 0 10rpx 44rpx;
        box-sizing: border-box;
        color: #666;
        font-size: 24rpx;
        left: 325rpx;
      }

      &::after {
        display: none;
        content: '';
        width: 44rpx;
        left: 40rpx;
      }

      input {
        flex: 1;
        height: 60rpx;
        padding: 0 20rpx 0 64rpx;
        background-color: #fff;
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #666;
      }

      span.cancle {
        display: none;
        width: 80rpx;
        text-align: right;
        line-height: 60rpx;
        font-size: 27rpx;
        color: #666;
      }
    }

    // 搜索结果
    .content {
      display: none;
      flex: 1;
      padding: 27rpx;
      background-color: #fff;
      position: relative;

      .title {
        font-size: 27rpx;
        line-height: 1;
        color: #333;
      }

      .clear {
        display: block;
        width: 27rpx;
        height: 27rpx;
        float: right;
        background-image: url(https://ugo2.oss-cn-hangzhou.aliyuncs.com/images/clear.png);
        background-size: cover;
      }

      .history {
        padding-top: 30rpx;

        navigator {
          display: inline-block;
          line-height: 1;
          padding: 15rpx 20rpx 12rpx;
          background-color: #ddd;
          font-size: 24rpx;
          margin-right: 20rpx;
          margin-bottom: 15rpx;
          color: #333;
        }
      }

      .result {
        // display: none;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;

        navigator {
          line-height: 1;
          padding: 20rpx 30rpx;
          font-size: 24rpx;
          color: #666;
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
    
    // 获得焦点状态
    &.focused {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9;

      .input-wrap {
        background-color: #eee;

        &::before {
          display: none;
        }

        &::after {
          display: block;
        }
      }

      span.cancle {
        display: block;
      }

      .content {
        display: block;
      }
    }
  }
</style>