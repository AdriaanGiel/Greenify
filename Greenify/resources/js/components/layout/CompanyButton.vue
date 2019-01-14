<template>
    <div class="button">
        <a :href='linkDetailCompany'><p>Company</p></a>
    </div>
</template>

<script>
    export default {
        name: "ButtonDetailCompany",
        props: ['linkDetailCompany']
    }
</script>

<style lang="scss" scoped>
    .button{
        width: 40vw;
        background-color: #99e86a;
        text-align: center;
        border-radius: 3px;
        box-shadow: 0px 1px 5px #8888889d;
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