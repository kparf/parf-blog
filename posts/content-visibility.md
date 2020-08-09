---
title: "content-visibility: новое свойство CSS, повышающее производительность рендеринга." 
description: Перевод статьи о CSS свойстве content-visibility
date: 2020-08-07
tags:
  - html
  - draft
layout: layouts/post.njk
---

[Оригинал](https://web.dev/content-visibility)

Новое CSS свойство **content-visibility**, реализованное в Chromium 85, может быть одним из наиболее влияющим на производительность загрузки страницы. **content-visibility** позволяет агенту пользователя пропустить работу по отрисовке элемента, включая **layout** и **painting**, до тех пор пока это не понадобится. Так как отрисовка пропускается, если большая часть вашего контента за пределами экрана, использование **content-visibility** свойства делает первоначальную загрузку более быстрой. Это в свою очередь ведет к более скорому взаимодействию с контентом на экране.

![](https://webdev.imgix.net/content-visibility/demo.jpg)
В нашем примере применение **content-visibility: auto** к разбитому на блоки контенту привелу к 7-ми кратному улучшения производительности первоначальной загрузки страницы.

## Поддержка браузеров
**content-visibility** полагается на примитивы из спецификации [the CSS Containment Spec](https://drafts.csswg.org/css-contain/). Так как content-visibility поддерживается в Chromium 85 на данные момент (и считается [достойным для прототипирования](https://github.com/mozilla/standards-positions/issues/135) в Firefox) **Containment Spec** поддерживается в большинстве [современных браузеров](https://caniuse.com/#feat=css-containment).

## CSS Сдерживание (CSS Containment)

Единственная и ключевая цель CSS containment в том чтобы сделать улучшение производительности отрисовки веб контента возможным за счет **предсказуемой изоляции DOM поддеревьев** оставшейся части страницы.

По сути, разработчик может сказать браузеру что части страницы это изолированные группы контента, что позволяет браузеру рассуждать о контенте без учета состояния за пределами поддерева. Зная какие части контента (поддеревья) содержат изолированный контент означает, что браузер может принимать решения по оптимизации рендеринга страницы.

Есть 4 типа [CSS containment](https://developers.google.com/web/updates/2016/06/css-containment), каждое можно объеденить в список значенией разделенных пробелами:
 - **size**: Style containment  позволяет избежать вычисление стилей для потомков.
 - **layout**: layout containment подразумевает, что потомок не влияет на внешний вид других блоков. Это позволяет нам потенциально пропустить этап компоновки потомков если все что мы хотим это расположить другие компоненты.
 - **style**: Style containment гарантирует что свойства которые могут повлиять на 
Это потенциально позволяет избежать вычисление стилей для потомков если все что мы хотим это вычислить стили для других компонентов.
 - **paint**: Paint containment гарантирует что потомки не будут отображаться за пределами границ родительского компонента. Ничего не может явно переполнить элемент, и если элемент находится за пределами экрана или по иным причинам не отображается, его потомки тоже не будут видны. Потенциально это позволяет пропустить этап отрисовки потомков.