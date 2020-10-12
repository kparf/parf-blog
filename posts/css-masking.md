---
title: "Как использовать CSS маски"
description: Перевод статьи Rachel Andrew CSS масках
date: 2020-10-11
tags:
  - css
  - draft
layout: layouts/post.njk
---

[Оригинал](https://web.dev/css-masking/)

Когда вы обрезаете вы обрезаете элемент с использованием **clip-path** свойства, обрезанная область становится невидимой. Если вместо этого вы хотите сделать часть изображения непрозрачной или применить к не й какой-либо другой эффект, вам необходимо использовать маску. Этот пост описывает то как использовать **mask-image** свойство в CSS, который позволяет указать изображение в качестве слоя маски.

## Совместимость браузеров
Большинство браузеров только частично поддерживают стандартные свойства CSS масок. Вам нужно будет использовать *-webkit-* префикс в дополнение к стандартному свойству, чтобы достигнуть большей браузерной совместимости. На  *Can I use CSS Masks?* вы найдет больше информации.

Хотя с использованием префикса браузерная поддержка достаточно хороша, позаботьтесь о том, что произойдет, если маски не будут работать. Возможно стоит использовать запросы функций (feature query) чтобы определить поддержку *mask-image* или *-webkit-mask-image* и предоставить удобочитаемые альтернативы перед добавлением вашей маски.

```css
  @supports(-webkit-mask-image: url(#mask)) or (mask-image: url(#mask)) {
    /* code that requires mask-image here. */
  }
```

### Маски с изображением

mask-image свойство работает аналогично свойству *background-image*. Используйте **url()** чтобы передать изображение. Изображение маски должно иметь прозрачную или полупрозрачную область.

Полностью прозрачная область сделает часть изображения под этой областью невидимой. Однако использование полупрозрачной области позволит просвечивать часть исходного изображения. Вы можете увидеть разницу ниже. Первое изображение - это исходное изображение воздушных шаров без маски. Ко второму изображению применена маска с белой звездой на полностью прозрачном фоне. Третье изображение имеет белую звезду на фоне с градиентом прозрачности.

```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Hello!</title>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="/style.css">
    </head>  
    <body>
      
      <div class="container">
        <img src="https://cdn.glitch.com/04eadd2b-7dd4-43fc-af3d-cff948811986%2Fballoons.jpg?v=1597755892826" alt="Balloons">
      </div>
      
      <div class="container">
        <img class="one" src="https://cdn.glitch.com/04eadd2b-7dd4-43fc-af3d-cff948811986%2Fballoons.jpg?v=1597755892826" alt="Balloons">
      </div>
      
      <div class="container">
        <img class="two" src="https://cdn.glitch.com/04eadd2b-7dd4-43fc-af3d-cff948811986%2Fballoons.jpg?v=1597755892826" alt="Balloons">
      </div>
    </body>
  </html>
```

```css
  body {
    font-family: "Benton Sans", "Helvetica Neue", helvetica, arial, sans-serif;
    margin: 2em;
  }

  img {
    max-width: 100%;
    display: block;
  }

  .container {
    width: 400px;
    height: 300px;
    margin: 1em auto;
  }

  .container img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    -webkit-mask-size: cover;
    mask-size: cover;
  }

  .one {
    -webkit-mask-image: url(https://cdn.glitch.com/04eadd2b-7dd4-43fc-af3d-cff948811986%2Fstar-mask.png?v=1597756701076);
    mask-image: url(https://cdn.glitch.com/04eadd2b-7dd4-43fc-af3d-cff948811986%2Fstar-mask.png?v=1597756701076);  
  }

  .two {
    -webkit-mask-image: url('https://cdn.glitch.com/04eadd2b-7dd4-43fc-af3d-cff948811986%2Fstar-mask-gradient.png?v=1597757011489');
    mask-image: url('https://cdn.glitch.com/04eadd2b-7dd4-43fc-af3d-cff948811986%2Fstar-mask-gradient.png?v=1597757011489');

  }
```

В этом примере использовалась **mask-size** свойство со значением **cover**. Это свойство работает также как **background-size**. Вы можете использовать ключевые слова cover и contain или вы можете задать размер фона, используя любую доступную единицу или процент.

Вы также можете повторить маску так же, как и фоновое изображение в качестве повторяющегося узора (repeating pattern).

## SVG маски

Вместо того чтобы использовать файл изображения в качестве маски, вы можете использовать SVG. Это можно добится несколькими способами. Первый - это `<mask>` элемент внутри SVG и ссылка на ID этого элемента в свойстве mask-image.

```html
  <svg width="0" height="0" viewBox="0 0 400 300">
    <defs>
      <mask id="mask">
        <rect fill="#000000" x="0" y="0" width="400" height="300"></rect>
        <circle fill="#FFFFFF" cx="150" cy="150" r="100" />
        <circle fill="#FFFFFF" cx="50" cy="50" r="150" />
      </mask>
    </defs>
  </svg>

  <div class="container">
      <img src="balloons.jpg" alt="Balloons">
  </div>
```

```css
  .container img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    -webkit-mask-image: url(#mask);
    mask-image: url(#mask);
  }
```

Преимущество этого подхода в том, что маску можно применить к любому элементу HTML, а не только к изображению. К сожалению, Firefox единственный браузер поддерживающий такой подход.

## Маски с градиентом
Использование CSS градиента в качестве маски - это элегантный способ создания масок области без необходимости создавать изображение или SVG.

Простой линейный градиент, используемый в качестве маски, может гарантировать, что нижняя часть изображения не будет слишком темной, например, под подписью.

```css
  .container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    -webkit-mask-image: linear-gradient(to top, transparent 5%, black 100%);
    mask-image: linear-gradient(to top, transparent 5%, black 100%);
  } 
```

Вы можете использовать любой из поддерживаемый типов градиента и проявлять столько творчества, сколько заходите. В следующем примере радиальный градиент используется для создания круговой маски для подсветки подписи.

```css
  .container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    -webkit-mask-image: radial-gradient(circle at 80% 70%, rgba(255,255,255,.1) 0%, rgba(0,0,0,1) 40%);
    mask-image: radial-gradient(circle at 80% 70%, rgba(255,255,255,.1) 0%, rgba(0,0,0,1) 40%);
    -webkit-mask-size: 400px 300px;
  } 
```

## Использование нескольких масок
Как и в случае с фоновыми изображениями, вы можете указать несколько источников маски, комбинируя их для получения желаемого эффекта. Это особенно полезно, если вы хотите использовать в качестве маски шаблоны созданные с помощью CSS градиентов. Обычно в них используются несколько фоновых изображений, поэтому их можно легко преобразовать в маску.

В качестве примера, узор в виде шахматной доски (пример шахматной доски найден в этой статье). Код использующий фоновые изображения, выглядит так:

```css
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size:20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

Чтобы превратить этот или любой другой шаблон, предназначенный для фоновых изображений, в маску, вам нужно будет заменить свойства background-* соответствующими свойствами маски, включая -webkit- префикс.

```css
  -webkit-mask-image:
    linear-gradient(45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
    linear-gradient(-45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
    linear-gradient(45deg, rgba(0,0,0,0.2) 75%, #000000 75%),
    linear-gradient(-45deg, rgba(0,0,0,0.2) 75%, #000000 75%);
  -webkit-mask-size:20px 20px;
  -webkit-mask-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

Есть несколько действительно хороших эффектов, которые можно получить, применяя градиентные узоры к изображениям. 

Наряду с обрезкой, CSS маски - это способ добавить интереса к изображениям и другим элементам HTML без необходимости использования графического приложения.
