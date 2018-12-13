<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Greenify</title>
        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="{{ mix('/css/app.css') }}">

    </head>
    <body>
        <div id="app">
            <page-wrapper>
                <router-view></router-view>
            </page-wrapper>
        </div>
        <script src="{{ mix('/js/app.js') }}"></script>
    </body>
</html>