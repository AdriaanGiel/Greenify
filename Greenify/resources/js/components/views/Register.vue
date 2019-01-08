<template>
    <page-wrapper bottomColor="#6AB04C">
<div slot="top-content"><h1>Registratie</h1>
<form>
    <dt><input v-model="email" placeholder="EMAIL"></dt>
    <dt><input v-model="password" placeholder="WACHTWOORD"></dt>
    <dt><input v-model="repeatPassword" placeholder="WACHTWOORD NOG EEN KEERTJE"></dt>
    <dt><button class="register">
    <span>register</span>
  </button></dt>
   
      
         
</form>
</div>
<slot>  <dt><button class="register">
    <span>register</span>
  </button></dt></slot>

    </page-wrapper>
</template>

<script>
    export default {
        name: "RegisterPage",
       data() {
           return {
               email:'',
               password: '',
               repeatPassword: ''
           }
       }
        
    }
</script>

<style scoped>
div {
    z-index: 999999999999999999
}
button {
   display:block;
  height:50px;
  width:90%;
  margin:0 auto;
  border:none;
  border-bottom:1px solid darkgrey;
}
input{
  display:block;
  height:50px;
  width:90%;
  margin:0 auto;
  border:none;
  border-bottom:1px solid darkgrey
    
}


h1{
    text-align: center;
    color: #6AB04C;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>