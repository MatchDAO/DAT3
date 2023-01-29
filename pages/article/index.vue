<template>
  <view class="container">
    文章
  </view>
</template>

<script>
  export default {
    data() {
      return {
        
      }
    },
    computed:{
      
    },
    onLoad() {
      
    },
    methods: {
      
    }
  }
</script>

<style>
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .description {
    font-size: 14px;
    opacity: 0.6;
    margin-bottom: 15px;
  }

  .detail-link {
    font-size: 14px;
    word-break: break-all;
  }

  .link {
    color: #007AFF;
    margin-left: 10px;
  }

  .locale-setting {
    font-size: 16px;
    font-weight: bold;
    margin-top: 25px;
    margin-bottom: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid #f0f0f0;
  }

  .list-item {
    font-size: 14px;
    padding: 10px 0;
  }

  .list-item .v {
    margin-left: 5px;
  }

  .locale-item {
    display: flex;
    flex-direction: row;
    padding: 10px 0;
  }

  .locale-item .text {
    flex: 1;
  }

  .icon-check {
    margin-right: 5px;
    border: 2px solid #007aff;
    border-left: 0;
    border-top: 0;
    height: 12px;
    width: 6px;
    transform-origin: center;
    /* #ifndef APP-NVUE */
    transition: all 0.3s;
    /* #endif */
    transform: rotate(45deg);
  }
</style>
