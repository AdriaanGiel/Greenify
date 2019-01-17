<template>
    <div class="button">
        <!-- <router-link :to="{name: 'detail', params: { category_slug: category.name, company_slug: company.name} }">  -->
        <div class="block">
        <img src="smiley.gif" alt="Smiley face">
        <h4>Appel</h4> <!-- {{ company.name.toUpperCase() }}-->
        </div>
        <!-- </router-link> -->
        <p>Informatie over het bedrijf of de producten en dat is dan een stukje wat uitgelicht is en speciaal hiervoor geschreven is of gewoon een stukje van de...</p>
    </div>
</template>

<script>
    export default {
        name: "BigCompanyButton",
        props: ['linkDetailBigCompany'],
        company: {name:'test'}

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
        margin-top: 5vw;
        margin-bottom: 5vw;
        padding: 4vw 0vw 0vw 4vw!important;
        width: 90vw;
        height: 50vw;
        background-color: white;
        border-color: red;
        border-style: solid;
        border-width: 1px;
        &:active{
            background-color: #3e8214;
            box-shadow: 0px 0px #888888;
        }
    }
    p{
        width: 80vw
    }
    h4{
        margin: 2vw 0vw 0vw 4vw;
        float: left;
        text-decoration: none;
        color: grey;
        font-size: 8vw;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: -1px;
    }
    .block{
        height: 16vw;
        width: 80vw;
    }
</style>