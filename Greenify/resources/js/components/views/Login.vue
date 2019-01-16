<template>
    <page-wrapper bottom-color="purple">
        <slot name="content">
            <button-to-app :LinkSite='linkToSite'>
            </button-to-app>
            jervnbkjdncjwsbcks

            <button-detail-company :linkDetailCompany='linkToCompany'>
            </button-detail-company>
            <company-button :linkDetailCompany='linkToCompany'>
            </company-button>
            <company-button :linkDetailCompany='linkToCompany'>
            </company-button>
            <company-button :linkDetailCompany='linkToCompany'>
            </company-button>
            <company-button :linkDetailCompany='linkToCompany'>
            </company-button>
            <company-button :linkDetailCompany='linkToCompany'>
            </company-button>
        </slot>
    </page-wrapper>
</template>

<script>
    import ButtonToApp from '../layout/ButtonToApp'
    import ButtonDetailCompany from '../layout/CompanyButton'
    export default {
        components: {
            ButtonToApp,
            ButtonDetailCompany
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