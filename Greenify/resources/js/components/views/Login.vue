<template>
    <page-wrapper color="blue">
        <button-to-app :LinkSite='linkToSite'>
        </button-to-app>

        <company-button :linkDetailCompany='linkToCompany'>
        </company-button>
    </page-wrapper>
</template>

<script>
    import ButtonToApp from '../layout/ButtonToApp'
    import ButtonToApp from '../layout/CompanyButton'
    export default {
        components: {
            ButtonToApp
        },
        data() {
            return {
                linkToSite: '#',
                linkToCompany: 'company'
            }
        },
        name: "LoginPage"
    }
</script>

<style scoped>

</style>