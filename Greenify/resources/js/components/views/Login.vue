<template>
    <page-wrapper bottom-color="purple">
        <div slot="content">
            <h1>ETEN</h1>
            <big-company-button/>
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
            <company-button/>
        </div>
    </page-wrapper>
</template>

<script>
    import CompanyButton from '../layout/CompanyButton'
    import BigCompanyButton from '../layout/BigCompanyButton'
    export default {
        components: {
            CompanyButton,
            BigCompanyButton
        },
        mounted() {
            this.fetchCompany()
        },
        methods: {
            fetchCompany() {
                this.loading = true
                axios.get(`/api/companies/${this.$data.category_slug}`)
                .then(response => {
                    this.company = response.data
                    this.loading = false
                })
                .catch(function (error) {
                    alert('404 company not found.')
                })
            }
        },
        data() {
            return {
                linkToCompany: 'company',
                loading: true,
                company: null,
                company_slug: this.$route.params.company_slug
            }
        },
        name: "LoginPage"
    }
</script>

<style scoped>


</style>