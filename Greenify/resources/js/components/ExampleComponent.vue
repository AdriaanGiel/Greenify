<template>
    <div class="container test">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card card-default">
                    <div class="card-header">Example Component</div>

                    <div class="card-body">
                        I'm an example component.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>


<style lang="scss">

    .test{
        background-color: #1c7430;
        .row{
            background-color: red;
            opacity: .5;
        }
    }

</style>