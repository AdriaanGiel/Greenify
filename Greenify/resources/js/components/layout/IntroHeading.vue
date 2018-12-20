<template>
    <div class="intro-heading">
        <h1>{{title}}</h1>
        <h2>{{subtitle}}</h2>
    </div>
</template>

<script>
export default {
    props: ['title', 'subtitle']
}
</script>

<style lang="scss" scoped>
    .intro-heading {
        text-transform: uppercase;
        h1 {
            font-weight: 900;
        }
    }
</style>