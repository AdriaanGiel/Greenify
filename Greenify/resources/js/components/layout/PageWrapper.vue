<template>
    <div class="page-wrapper" :style="'background-color:' + this.color">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "pageWrapper",
        data() {
            return {
                color: "blue"
            }
        },
        methods: {
            changeProps(color) {
                console.log('sddas');
                this.color = color
            }
        }

    }
</script>

<style scoped>

</style>