---
layout: page
title: Home
---

<h1 id="vitejte"> Vítejte! </h1>
<h2 style="text-align: center"> Vypadá to, že fungujeme! </h1>

## **Příspěvky**

Koukněte na některé z našich příspěvků:

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>

## **Stránky**

A zde vidíte jednotlivé stránky:

<ul>
  {% for page in site.pages %}
    <li>
      <a href="{{ site.baseurl }}{{ page.url }}">{{ page.title }}</a>
    </li>
  {% endfor %}
</ul>


<img src="https://img.clipartfest.com/97d2d5b97cce5f4dee5a8648f5a2f8de_work-in-progress-clip-art-work-in-progress-clipart-png_1023-1023.svg" width="300px" height="300px" title="snažíme se!"  > 

<br>