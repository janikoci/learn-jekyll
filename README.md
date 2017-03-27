# LearnJekyll.js

JS mockup engine for learning how to use Jekyll basics.

**This is not a replacement for Jekyll** — it just mocks up some of its behaviors:

- Liquid templating works (`include` and `link` tags work).
- Markdown is rendered from `*.md` files.
- `site` variable works in templates:
  - `site.time` = new Date();
  - `site.pages` = all pages
  - `site.posts` = all posts
  - `site.related_posts` **unsupported**
  - `site.static_files` **unsupported**
  - `site.html_pages` **unsupported**
  - `site.collections` **unsupported** (planned)
  - `site.data` = all files in `_data` folder (supports YAML and JSON)
  - `site.documents` **unsupported** (planned)
  - `site.categories.CATEGORY` **unsupported**
  - `site.tags.TAG` = all posts with tag TAG (specified in front matter)
- `page` variable works in templates:
  - `page.content` = page content
  - `page.title` = set in front matter
  - `page.excerpt` = set in front matter
  - `page.url` = automatically set
  - `page.date`  = set in front matter (or filename of a post)
  - `page.id` = set for posts and pages, both start at 0
  - `page.categories` **unsupported**
  - `page.tags` = set as an array in front matter
  - `page.path` = path to file
  - `page.next` = next post, last post has `null` 
  - `page.previous` = next post, first post has `null` 


## Usage

Javascript in a browser cannot walk the filesystem, hence a list of all content files needs to be mirrored as a YAML file `mock/structure.yml`, e.g.:

    - _posts:
      - 2017-03-13-welcome-to-jekyll.md
    - _includes:
      - sidebar.md
    - _layouts:
      - default.html
      - home.html
      - post.html
    - _config.yml
    - about.md
    - index.md

To view the mockup, just open `index.html` via any server software (e.g [Civetweb][cw]) pointed to the folder with Jekyll installation. Correct `baseurl` has to be set in `_config.yml` for the mockup to work. (When downloaded from [releases page](rel), it should work when placed right into the server root.)

[cw]: https://github.com/civetweb/civetweb
[rel]: https://github.com/jan-martinek/learn-jekyll/releases
