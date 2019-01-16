<template>
    <div class="preloader" v-if="loading">
        <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-green-only">
            <div class="circle-clipper left">
                <div class="circle"></div>
            </div><div class="gap-patch">
                <div class="circle"></div>
            </div><div class="circle-clipper right">
                <div class="circle"></div>
            </div>
            </div>
        </div>
    </div>
    <page-wrapper v-else :bottom-color='category.color'>
        <div slot="content">
            <h1>{{category.name.toUpperCase()}}</h1>
        </div>
    </page-wrapper>
</template>

<script>
    export default {
        name: "CategoryPage",
        mounted() {
            this.fetchCategory()
        },
        methods: {
            fetchCategory() {
                this.loading = true
                axios.get('/api/categories/eten')
                .then(response => {
                    this.category = response.data
                    this.loading = false
                })
            }
        },
        data() {
            return {
                loading: true,
                category: null
            }
        },
    }
</script>

<style lang="scss" scoped>
    .preloader {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        .preloader-wrapper {
            margin: 0 auto;
        }
    }
</style>