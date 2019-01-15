<template>
    <div class="button">
        <!-- <router-link :to="{name: 'detail', params: { category_slug: category.name, company_slug: company.name, company: company} }">  -->
        <img src="smiley.gif" alt="Smiley face">
        <!-- <a :href='linkDetailCompany'>Company</a> -->
        <p>Company {{ company.name.toUpperCase() }} </p>
        <!-- </router-link> -->
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
        height: 16vw;
        width: 16vw;
        border-radius: 12vw;
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
        border-color: red;
        border-style: solid;
        border-width: 1px;
        &:active{
            background-color: #3e8214;
            box-shadow: 0px 0px #888888;
        }
    }
    a{
        margin: 6vw;
        float: left;
        text-decoration: none;
        color: grey;
        font-size: 8vw;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: -1px;
    }
</style>