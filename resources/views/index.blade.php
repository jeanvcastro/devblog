<!DOCTYPE html>
<html lang="{{ str_replace("_", "-", app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DevBlog - Blog de Tecnologia</title>
  <meta name="description"
    content="Artigos sobre desenvolvimento de software, arquitetura de sistemas, frontend, backend e performance.">
  <meta name="robots" content="index, follow">
  <meta name="language" content="pt-BR">
  <meta name="author" content="DevBlog">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="DevBlog">
  <meta property="og:title" content="DevBlog - Blog de Tecnologia">
  <meta property="og:description"
    content="Artigos sobre desenvolvimento de software, arquitetura de sistemas, frontend, backend e performance.">
  <meta property="og:url" content="https://blog.devbroder.com">
  <meta property="og:image" content="https://blog.devbroder.com/img/og.jpeg">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="DevBlog - Blog de Tecnologia">
  <meta name="twitter:description"
    content="Artigos sobre desenvolvimento de software, arquitetura de sistemas, frontend, backend e performance.">
  <meta name="twitter:image" content="https://blog.devbroder.com/images/og-default.jpg">

  <link rel="canonical" href="https://blog.devbroder.com">
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
