<template>
    <div class="button-to-app">
        <a :href='linkSite'><p>Ga naar de site</p></a>
    </div>
</template>

<script>
    export default {
        name: "ButtonToApp",
        props: ['linkSite']
    }
</script>

<style lang="scss" scoped>
    .button-to-app{
        width: 40vw;
        background-color: #99e86a;
        padding: 0.5vw 0vw 0.5vw 0vw;
        margin: 2.5vw;
        text-align: center;
        border-radius: 3px;
        box-shadow: 0px 1px 5px #8888889d;
        float: right;
        &:active{
            background-color: #3e8214;
            box-shadow: 0px 0px #888888;
        }
    }
    a{
        text-decoration: none;
    }
    p{
        color:white;
        font-size: 4vw;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: -1px;
    }
</style>