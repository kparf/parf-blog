---
title: Datalist элемент (перевод)
description: Перевод статьи о элементе datalist
date: 2020-08-01
tags:
  - html
layout: layouts/post.njk
---
[Оригинал](https://funwithforms.com/posts/datalist/)
В этой статье вы познакомитесь с тем что такое **`<datalist>`**, как его использовать и почему вы на вряд ли возмете его к себе.

## Как использовать datalist
``` html
  <label for="formelement">Your favourite form element?</label>
  <input list="formelements" id="formelement" name="formelement" />
  <datalist id="formelements">
    <option value="input">
    <option value="button">
    <option value="select">
    <option value="datalist">
    <option value="legend">
  </datalist>
```
В первую очередь, вам нужен input элемент. Чтобы объединить input и datalist вам нужно будет прописать id datalist элемента в list атрибут input элемента. После этого вы можете определить различные значения в option элементах.

## Возможные проблемы связанные с `<datalist>`

Хотя это может быть хорошим улучшением, **datalist** очень базовый и часто не то что вам нужно.

### Без кастомных стилей
Как в случае с **`<option>`** в **`<select>`**, **`<option>`** для **`<datalist>`** также не стилизуем. Это значит вы будите всегда использовать базовые стили браузера.

Вы можете поменять стили для **`<datalist>`** как в примере если вы пропишите **display: block;**, но это никак не повлияет на выпадающий список который вы увидите, а потому бесполезно.

### Без вариантов
Вариант когда вы не можете стилизовать вы может примите, но самая большая проблема для меня это то что вы не можете повлиять на то когда и почему вараинты списка показываются.

Вы не можете определить минимальное количество символов после которого варианты показываются, не можете определить максимальное количество результатов.

### Поддержка браузеров
Браузеры поддерживают **`<datalist>`** хорошо. Все современные браузеры поддерживают этот элемент. Вплоть до Internet Explorer, хотя есть баги. Так как это улучшение, я предлагаю вам использовать без панфилов.

## Ресурсы
https://jsbin.com/lipelisuza/1/edit?html
https://developer.mozilla.org/en/docs/Web/HTML/Element/datalist
https://github.com/mfranzke/datalist-polyfill
