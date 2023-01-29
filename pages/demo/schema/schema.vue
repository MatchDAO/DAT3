<template>
  <view class="container">
    <view>{{$t('schema.name')}}</view>
    <input class="input" v-model="name" />
    <button type="primary" @click="add">{{$t('schema.add')}}</button>
  </view>
</template>

<script>
  const collection = "hello";
  export default {
    data() {
      return {
        name: ""
      }
    },
    methods: {
      add() {
        uni.showLoading();
        let db = uniCloud.database()
        db.collection(collection).add({
          name: this.name
        }).then((res) => {
          uni.showToast({
            title: this.$t('schema.add-success')
          })
        }).catch((err) => {
          uni.showModal({
            content: err.message,
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading();
        })
      }
    }
  }
</script>

<style>
  .input {
    border: 1px solid #ebebeb;
    border-radius: 3px;
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 8px;
  }
</style>
