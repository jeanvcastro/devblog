<!DOCTYPE html>
<html lang="{{ str_replace("_", "-", app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ config("app.name") }}</title>

  <link rel="shortcut icon" href="{{ asset("favicon.ico") }}" />
  <link rel="apple-touch-icon" sizes="180x180" href="{{ asset("/img/apple-touch-icon.png") }}" />
  <link rel="icon" type="image/png" sizes="32x32" href="{{ asset("/img/favicon-32x32.png") }}" />
  <link rel="icon" type="image/png" sizes="16x16" href="{{ asset("/img/favicon-16x16.png") }}" />
  <link rel="manifest" href="/manifest.json" />

  @viteReactRefresh
  @vite("resources/js/index.tsx")
</head>

<body>
  <div id="app"></div>
</body>

</html>
