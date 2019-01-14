<template>
    <div class="button">
        <img src="smiley.gif" alt="Smiley face" height="42" width="42">
        <a :href='linkDetailCompany'>Company</a>
    </div>
</template>

<script>
    export default {
        name: "ButtonDetailCompany",
        props: ['linkDetailCompany']
    }
</script>

<style lang="scss" scoped>
    img{
        border-radius: 30px;
        background-color: red; 
        float: left;
    }
    .button{
        box-sizing: border-box;
        margin: 5vw;
        padding: 4vw 0vw 0vw 4vw!important;
        width: 90vw;
        height: 24vw;
        background-color: white;
        // border-radius: 3px;
        border-color: red;
        border-style: solid;
        border-width: 1px;
        &:active{
            background-color: #3e8214;
            box-shadow: 0px 0px #888888;
        }
    }
    a{
        margin: 3vw;
        float: left;
        text-decoration: none;
        color: grey;
        font-size: 8vw;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: -1px;
    }
</style>