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
    import CompanyButton from '../layout/CompanyButton'
    export default {
        components: {
            ButtonToApp,
            CompanyButton
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