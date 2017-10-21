<template>
    <div>
      <h3>这是子组件</h3>
      <p>{{content}}</p>
      <p>
        <input type="button" value="告诉大王一个消息" v-on:click="send" />
      </p>
    </div>
</template>
<style>
    body{
        background-color: rgba(0,0,0,.6);
    }
</style>
<script>
    export default {
      props: ['content'],
      methods: {
        send () {
          this.$emit('ParentRecEv', '父王,你卤的盐水白菜发霉了')
        }
      }
    }
</script>
