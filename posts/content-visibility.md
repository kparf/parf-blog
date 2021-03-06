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

## Отмена этапа отрисовки достигается за счет content-visibility

Иногда сложно понять какие containment значения использовать, так как оптимизация браузера может сработать только когда указаны подходящие значения. Вы можете поиграть со значениями чтобы увидеть [какое работает лучше](https://developers.google.com/web/updates/2016/06/css-containment), или вы можете использовать другое CSS свойство **content-visibility** для автоматического применения необходимого containment. **content-visibility** гарантирует, что вы получите максимальный прирост производительности, который браузер может обеспечить с минимальными усилиями от вас как разработчика.

Свойство **content-visibility** принимает несколько значений, но **auto** то которое обеспечивает немедленное улучшение производительности. Элемент к которому применено **content-visibility: auto** получает **layout**, **style** и **paint** containment. Если элементы находятся за пределами экрана (и у них нету фокуса или выделения в поддереве) он также получает **size** containment (он не отрисовывается и не проверяет свое содержимое)

Что это значит? Если кратко, то если элемент находится за пределами экрана, его потомки не отображаются. Браузер определяет размер элемента, не учитывая его содержимое, и на этом останавливается. Большая часть отрисовки, такие как стили и макет поддерева элемента, пропускаются.

Когда элемент приближается к области просмотра, браузер больше не добовляет **size** containment и начинает отрисовывать и проверять содержимое элемента. Это позволяет выполнить отрисовку как раз вовремя, чтобы пользователь мог его увидеть

## Пример: блог о путешествмях
<figure class="video_container">
  <video controls="true" allowfullscreen="true" poster="path/to/poster_image.png">
    <source src="https://storage.googleapis.com/web-dev-assets/content-visibility/travel_blog.mp4" type="video/mp4">
  </video>
</figure>

Блог о путешествиях обычно содержит набор историй с несколькими фотографиями, и каким-то описательным текстом. Вот что происходит в обычном браузере при переходе на блог о путешествиях:

1. Часть страницы загружается из сети вместе со всеми необходимыми ресурсами.
2. Браузер стилизует и размещает все содержимое страницы, не учитывая, является ли содержимое видимым для пользователя.
3. Браузер возвращается к шагу 1, пока не будут загружены все страницы и ресурсы.

На шаге 2, браузер обрабатывает все содержимое в поисках вещей, которые могли измениться. Обновляется стили и лейаут любых новых элементов, вместе с элементами которые могли бы сместится в результате новых обновлений. Это работа по рендерингу. И на это требуется время.

![](https://webdev.imgix.net/content-visibility/travelblog.jpg)

Теперь давайте посмотрим, что произойдет если вы пропишите **content-visibility: auto** для каждой отдельной истории в блоге. Общий цикл такой же: браузер загружает и отрисовывает части страниц. Однако, разница заключается в объеме работы, выполняемой на шаге 2.

С **content-visibility** этапы **style** и **layout** будут отрабатывать на элементах которые в настоящее время видны пользователю. Однако, при обработки истории, которая полностью находится за пределами экрана, браузер пропустит работу по рендерингу и только создаст стиль и макет самого блока элемента.

Производительность загрузки этой страницы будет такой, как если бы в историях которые попадают в экран есть контент, а истории за пределами экрана пусты. Это работает намного лучше, с ожидаемым снижением стоимости отрисовки на 50% и более. В нашем примере, мы видим уменьшение времени рендеринга с 232 мс до 30 мс. Это 7-кратный прирост производительности.

Какую работу нужно проделать, чтобы воспользоваться этими преимуществами? Сначала мы разбиваем контент на секции:

![](https://webdev.imgix.net/content-visibility/travelblog-chunked.jpg)
Пример разделения контента на секции с применением **story** класса для получения **content-visibility: auto**.

Затем, мы применяем к секциям следующее правило стиля:

``` css
  .story {
    content-visibility: auto;
    contain-intrinsic-size: 1000px; /* Explained in the next section. */
  }
```

## Указание естественного размера элемента с помощью contain-intrinsic-size

Чтобы реализовать потенциальные преимущества content-visibility браузеру необходимо применить size containment, чтобы гарантировать, что результаты рендеринга содержимого никоим образом не влияют на размер экрана. Это означает, что элемент будет выложен так, как если бы он был пустым. Если элемент не имеет высоты, указанной в обычном макете блока, то он будет иметь нулевую высоту.

Это может быть не идеально, так как размер полосы прокрутки сместится,с учетом того что каждая история имеет ненулевую высоту.

К счастью, CSS предоставляет другое свойство, **contain-intrinsic-size**, которое эффективно определяет естественный размер элемента, если на элемента влияет **size containment**. В нашем примере мы устанавливаем его на 1000 пикселей в качестве оценки высоты и ширины секций.

Это означает, что он будет располагаться так, как если бы у него был единственный дочерний элемент с размерами **intrinsic-size**. **contain-intrinsic-size** выполняет роль заполнителя вместо отображаемого контента.

## Скрытие содержимого с помощью content-visibility: hidden

Что делать, если вы хотите, чтобы контент не отображался независимо от того, отображается он на экране или нет, используя при этом преимущества кэширования состояниям визуализации? Введите: content-visibility: hidden .
**content-visibility: hidden** свойство дает вам все те же преимущества необработанного содержимого и кэшированного состояниям отрисовки, что и **content-visibility: auto** за пределами экрана. Однако в отличии от auto, он не начинает автоматически отображаться на экране.

Это дает вам больше контроля, позволяя скрыть содержимое элемента, а затем быстро отобразить его.

Сравните его с другими распространенными способами сокрытия содержимого элемента:
- **display: none**: скрывает элемент и разрушает его состояние рендеринга. Это означает, что отображение элемента так же дорого, как отображение нового элемента с тем же содержимым.
- **visibility: hidden**:  скрывает элемента и сохраняет его состояние отрисовки. На самом деле это не удаляет элемент из документа, поскольку он (и его содержимое) по-прежнему занимают геометрическое пространство на странице, и на него все еще можно нажать. Он также обновляет состояние рендеринга в любое время, когда это необходимо, даже когда оно скрыто.

С Другой стороны **content-visibility: hidden**  скрывает элемент, сохраняя его состоянием рендеринга, поэтому если какие-либо изменения, которые должны произойти, они произойдут только тогда, когда элемент будет показан снова.

Некоторые отличные варианты использования для content-visibility: hidden  это реализация расширенных виртуальных скроллеров и измерение макета.
