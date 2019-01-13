<template>
    <div class="button">
        <a :href='linkSite'><p>Ga naar de site</p></a>
    </div>
</template>

<script>
    export default {
        name: "ButtonToApp",
        props: ['taart']
    }
</script>

<style lang="scss" scoped>
    .button{
        width: 40vw;
        background-color: #99e86a;
        // background-image: linear-gradient(#99e86a 40%, #64c926) ;
        text-align: center;
        // border-radius: 10px;
        // box-shadow: 2px 2px #888888;
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