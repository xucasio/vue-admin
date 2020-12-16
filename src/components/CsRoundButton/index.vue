<template>
  <div class="cs-round-btn" >
    <i :class="['iconfont',icon]"/>
  </div>
</template>
<script>
export default {
    name: 'CsRoundButton',
    props: {
        icon: {
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="scss">
.cs-round-btn{
  width: 28px;
  height: 28px;
  border-radius: 50%;
  text-align: center;
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  background-color: transparent;
  outline: none;
  &:hover{
    background-color: #E1EAF7;
    color:$--color-main;
  }
  & + &{
  margin-left: 10px;
  }

}
</style>
