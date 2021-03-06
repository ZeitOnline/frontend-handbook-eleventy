---
date: 2019-03-06
---

# Small Wins: Avoid empty containers in Jinja

At ZEIT ONLINE, our teasers and articles are composed of many parts like subtemplates and macros. Each component might be hidden under certain conditions. If all content of a wrapper element is hidden, we want to avoid rendering empty containers. A lesser-known Jinja feature helps us with that.
<!-- more -->

## The problem: empty containers

```jinja2
{% verbatim %}
<div class="metadata">
  {% include 'byline.html' %}
  {{ macro.include_datetime(teaser) }}
  {% if comments %}
    <a href="{{ teaser | create_url }}#comments">{{ comments }} Comments</a>
  {% endif %}
</div>
{% endverbatim %}
```

## The bad solution: too many conditions

We could define variables which check the individual parts for their content, and respond to that.

```jinja2
{% verbatim %}
{% set teaser_has_author = teaser | get_authors | length %}
{% set teaser_has_special_format = (teaser.format == 'essay' or teaser.format == 'interview' %}
{% set byline_has_content = teaser_has_author and teaser_has_special_format %}

{% set macro_has_content = macro.include_datetime(teaser) | length %}

{% if byline_has_content and macro_has_content and comments -%}

  <div class="metadata">
    {% include 'byline.html' %}
    {{ macro.include_datetime(teaser) }}
    {% if comments %}
      <a href="{{ teaser | create_url }}#comments">{{ comments }} Comments</a>
    {% endif %}
  </div>

{%- endif %}
{% endverbatim %}
```

But this is not elegant, and sometimes even tricky because the outer template does not (and should not) know the inner workings of included subtemplates. Especially if many outer templates include the same part.

We can do better:


## The good solution: set blocks

Jinja2 introduced a new feature in version 2.8: set blocks. We know the old traditional way of defining a variable via set `{% verbatim %}{% set foo = 'bar' %}{% endverbatim %}` and of defining a block this way: `{% verbatim %}{% block foo %}bar{% block %}{% endverbatim %}`. Even though version 2.8 was released in 2016, I have not been aware of the possibility to define (set) variables in the block style.

```jinja2
{% verbatim %}
{%- set teaser_metadata | trim -%}
  {% include 'byline.html' %}
  {{ macro.include_datetime(teaser) }}
  {% if comments %}
    <a href="{{ teaser | create_url }}#comments">{{ comments }} Comments</a>
  {% endif %}
{%- endset %}

{% if teaser_metadata | length %}
  <div class="metadata">
    {{ teaser_metadata }}
  </div>
{% endif %}
{% endverbatim %}
```

This way, the wrapper div only gets printed if it actually has content. Each part of this content is responsible for their own output. Included subtemplates (`{% verbatim %}{% include 'byline.html' %}{% endverbatim %}`) and macros (`{% verbatim %}{{ macro.include_datetime(teaser) }}{% endverbatim %}`) do also avoid rendering empty blocks – and might use Jinjas `set block` method for that.

You can do the same check for blocks as well, but I prefer the cleaner way of having variables.

```jinja
{% verbatim %}
{% block teaser_metadata %}
...
{% endblock %}

{% if self.teaser_metadata() | trim %}
  <div class="metadata">
    {{ self.teaser_metadata() }}
  </div>
{% endif %}
{% endverbatim %}
```

## Resources

* [Block Assignments in Jinja2](http://jinja.pocoo.org/docs/2.10/templates/#block-assignments)

---

_Written 2019-03-07 by Thomas Puppe_
