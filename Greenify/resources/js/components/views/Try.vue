<template>
    <page-wrapper bottom-color="#999744">
        <div slot="content">

            <h2>Try</h2>
           
           <button-to-app/>
        </div>
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