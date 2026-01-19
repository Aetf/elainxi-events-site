---
layout: front
title: Story
---

# Story

{% major %}
A (modular, highly tweakable) responsive one-page template designed by [HTML5 UP](https://html5up.net) and released for free under the [Creative Commons](https://html5up.net/license).
{% endmajor %}

This is a **Banner** element, and it's generally used as an introduction or opening statement. You can customize its [appearance with a number of modifiers](#), as well as assign it an optional `onload` or `onscroll` transition modifier ([details](#reference-banner)).

{% asbanner h1 images/banner.jpg %}

{% spotlight position:right id:first image:images/spotlight01.jpg %}

## Spotlight

This is a **Spotlight** element, and it's generally used – as its name implies – to spotlight a particular feature, subject, or pretty much whatever. You can customize its [appearance with a number of modifiers](#), as well as assign it an optional `onload` or `onscroll` transition modifier ([details](#reference-spotlight)).

<ul class="actions stacked">
    <li><a href="#" class="button">Learn More</a></li>
</ul>
{% endspotlight %}

{% spotlight position:left id:second image:images/spotlight02.jpg %}

## Spotlight

This is also a **Spotlight** element, and it's here because this demo would look a bit empty with just one spotlight. Like all spotlights, you can customize its [appearance with a number of modifiers](#), as well as assign it an optional `onload` or `onscroll` transition modifier ([details](#reference-spotlight)).

<ul class="actions stacked">
    <li><a href="#" class="button">Learn More</a></li>
</ul>
{% endspotlight %}

{% wrapper class:style1|align-center %}

## Gallery

This is a **Gallery** element. It can behave as a lightbox (when given the `lightbox` class).

{% gallery class:style2|medium lightbox:true %}
{% gallery_item src:images/gallery/fulls/01.jpg thumb:images/gallery/thumbs/01.jpg title:Title %}
Lorem ipsum dolor amet, consectetur magna etiam elit. Etiam sed ultrices.
{% endgallery_item %}

{% gallery_item src:images/gallery/fulls/02.jpg thumb:images/gallery/thumbs/02.jpg title:Title %}
Lorem ipsum dolor amet, consectetur magna etiam elit. Etiam sed ultrices.
{% endgallery_item %}

{% endgallery %}
{% endwrapper %}

{% wrapper class:style1|align-center id:cta %}

## Items

This is an **Items** element, and it's basically just a grid for organizing items of various types.

{% items class:style1|medium|onscroll-fade-in %}
{% item icon:gem %}

### One

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dui turpis, cursus eget orci amet aliquam congue semper.
{% enditem %}

{% item icon:save %}

### Two

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dui turpis, cursus eget orci amet aliquam congue semper.
{% enditem %}
{% enditems %}

{% endwrapper %}
