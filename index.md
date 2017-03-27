---
layout: page
title: Home
---

# Hello World! (It works!)

This are the contents of the Jekyll front page.

## Something to read: Sonnet LXVI.

> *Tired with all these, for restful death I cry,  
> As to behold desert a beggar born,  
> And needy nothing trimm'd in jollity,  
> And purest faith unhappily forsworn,  
> And gilded honour shamefully misplaced,  
> And maiden virtue rudely strumpeted,  
> And right perfection wrongfully disgraced,  
> And strength by limping sway disabled  
> And art made tongue-tied by authority,  
> And folly, doctor-like, controlling skill,  
> And simple truth miscalled simplicity,  
> And captive good attending captain ill:  
> Tired with all these, from these would I be gone,  
> Save that, to die, I leave my love alone.*
> 
> William Shakespeare

## Posts

See the posts:

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>

## Pages

And even normal pages:

<ul>
  {% for page in site.pages %}
    <li>
      <a href="{{ site.baseurl }}{{ page.url }}">{{ page.title }}</a>
    </li>
  {% endfor %}
</ul>
