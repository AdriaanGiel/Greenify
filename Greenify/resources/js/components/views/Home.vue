<template>

    <page-wrapper  bottom-color="green" picture-position="bottom 2em" >

        <custom-form :items="[
        {type:'email',label:'e-mail',name:'email'},
        {type:'text',label:'wachtwoord', name: 'password'},
        {type:'text',label:'wachtwoord nog een keer', name:'password_confirm'}
        ]"/>

    </page-wrapper>

</template>

<script>
    import FormBuilder from '../layout/FormBuilder';
    export default {
        name: "Home",
        components:{
            "custom-form": FormBuilder
        }
    }
</script>
