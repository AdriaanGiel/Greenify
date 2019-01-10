<template>
    <page-wrapper bottomColor="#6AB04C">
        <div>
<h1>REGISTRATIE</h1>
<form>
    <dt><input v-model="data.email" placeholder="EMAIL"></dt>
    <dt><input v-model="data.password" placeholder="WACHTWOORD"></dt>
    <dt><input v-model="data.repeatPassword" placeholder="WACHTWOORD NOG EEN KEERTJE"></dt>
    <dt><button class="register">
    <span>VERZENDEN</span>
  </button></dt>
   
      
         
</form>
        </div>
    </page-wrapper>
</template>

<script>
    export default {
        name: "RegisterPage",
       data() {
           return {
               data: {}
           }
       },
       methods: {
           submit(){
               
           }
       }
        
    }
</script>

<style scoped>

button {
   display:block;
   margin-top: 20vh!important; 
border-radius: 12px;
  height:50px;
  width:200px;
  margin:0 auto;
  border:none;
  border-bottom:1px solid darkgrey;
  color:white;
  background-color: #535C68;
  font-size: 20px;
}
input{
  display:block;
  
  height:50px;
  width:250px;
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