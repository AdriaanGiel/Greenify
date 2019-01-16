<template>
    <page-wrapper bottom-color="red">
        <div slot="content">
            <navigation-bar/>
            <div class="block">

                <div class="headBlock">
                <h4>BlaBlaCar</h4>
                <button-to-app/>
                </div>

                <div class="description">
                <p>Beschrijving van het product of het restaurant of de winkel. 
                    Ik vind dit een heel mooi product omdat het hele mooie kleuren 
                    heeft en heel duurzaam is en al je wensen vervuld maar natuurlijk 
                    heeft het ook driehonderd ogen twee balonnen en een aardappel. 
                    Dit was mijn spreekbeurt.</p>
                <p>Beschrijving van het product of het restaurant of de winkel. 
                    Ik vind dit een heel mooi product omdat het hele mooie kleuren 
                    heeft en heel duurzaam is en al je wensen vervuld maar natuurlijk 
                    heeft het ook driehonderd ogen twee balonnen en een aardappel. 
                    Dit was mijn spreekbeurt.</p>
                <p>Beschrijving van het product of het restaurant of de winkel. 
                    Ik vind dit een heel mooi product omdat het hele mooie kleuren 
                    heeft en heel duurzaam is en al je wensen vervuld maar natuurlijk 
                    heeft het ook driehonderd ogen twee balonnen en een aardappel. 
                    Dit was mijn spreekbeurt.</p>
                </div>

            </div>
        </div>
    </page-wrapper>
</template>

<script>
    import NavigationBar from '../layout/NavigationBar'
    import HamburgerMenu from '../layout/HamburgerMenu'
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
*{
    box-sizing: border-box;
}
h4{
    color: white;
    float: left;
    margin-bottom: 5vw;
    font-size: 7vw;
    margin-top: 6vw;
}
p{
    color: white;
}
.block{
    padding-top: 310px;
    padding-bottom: 20px;
}
.headBlock{
    height: 20vw;
    width: 90vw;
}
</style>