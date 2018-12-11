<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="og:type" content="website">

        {{--<meta property="og:url" content="">--}}
        {{--<meta property="og:site_name" content="ELDE">--}}
        {{--<meta property="canonical" content="">--}}
        {{--<meta property="keyword" content="">--}}

        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="{{ mix('/css/app.css') }}">

    </head>
    <body>
        <div id="app">
            <router-view></router-view>
        </div>

        <script src="{{ mix('/js/app.js') }}"></script>
    </body>
</html>
