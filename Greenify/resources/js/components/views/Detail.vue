<template>
    <page-wrapper color="purple">
<h1>Company</h1>

    <button-to-app :LinkSite='link'>
    </button-to-app>

<p>Beschrijving van het product of het restaurant of de winkel</p>

    </page-wrapper>
</template>

<script>
    import ButtonToApp from '../layout/ButtonToApp'
    export default {
        components: {
            ButtonToApp
        },
        data() {
            return {
                link: '#'
            }
        },
        name: "DetailPage"
    }
</script>

<style scoped>

</style>