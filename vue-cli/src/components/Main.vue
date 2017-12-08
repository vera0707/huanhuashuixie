<template>
    <div>
        <h3>{{myName}}</h3>
    </div>
</template>
<style>
    body{
        background-color:#ff0000;
    }
</style>
<script>
    export default{
      name: 'Main',
      computed: {
        myName () {
          return this.$store.state.userName
        }
      }
    }
</script>
