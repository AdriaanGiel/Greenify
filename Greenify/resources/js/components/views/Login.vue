<template>
    <page-wrapper color="blue">
        <button-to-app :LinkSite='link'>
        </button-to-app>
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
        name: "LoginPage"
    }
</script>

<style scoped>

</style>