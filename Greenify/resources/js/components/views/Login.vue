<template>
    <page-wrapper bottom-color="purple">
        <div slot="content">
            <h1>ETEN</h1>
            <company-button/>
            <company-button/>
            <company-button/>
            <company-button/>
            <company-button/>
            <company-button/>
            <company-button/>
            <company-button/>
            <company-button/>
            <company-button/>
        </div>
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