'use strict';

var LearnJekyll = function() {
  this.structure = {};
  this.paths = {};
  this.layouts = {};
  this.includes = {}
  this.posts = {};
  this.pages = {};
  this.urls = {};
  this.files = {};
  this.data = {};
  this.config = {};
  
  this.init = function() {
    var loader = new LearnJekyllLoader(this);
    loader.load('structure.yml', loader.loadStructure.bind(loader));
    loader.load('./../_config.yml', loader.loadConfig.bind(loader));
  }
  
  this.render = function() {
    var url = window.location.href.replace(/^[^?]+\?/, '');
    
    if (!this.urls[url]) {
      url = 'index';
    }
    
    var page = this.files[this.urls[url]];
    var render = this.renderTemplate(this.urls[url], page);
    document.querySelector('html').innerHTML = render;
  }
  
  this.initConfig = function() {
    var tags = {},
      posts = [],
      pages = [];
    
    for (var post in this.posts) {
      posts.push(this.files[this.posts[post]]);
      posts[posts.length - 1].path = this.posts[post];
      posts[posts.length - 1].slug = post;
      posts[posts.length - 1].url = '/mock/?' + post;
      posts[posts.length - 1].id = posts.length - 1;
      
      for (var tagIndex in posts[posts.length - 1].tags) {
        var tag = posts[posts.length - 1].tags[tagIndex];
        
        if (typeof tag !== 'string') {
          continue;
        }
        
        if (!tags[tag]) {
          tags[tag] = [];
        }
        
        tags[tag].push(posts[posts.length - 1]);
      }
    }
    
    console.log(posts);
    for (var index in posts) {
      if (index > -1) {
        posts[index].prev = posts[parseInt(index) - 1] ? posts[parseInt(index) - 1] : null;
        posts[index].next = posts[parseInt(index) + 1] ? posts[parseInt(index) + 1] : null;
      }
    }
    
    
    for (var page in this.pages) {
      pages.push(this.files[this.pages[page]]);
      pages[pages.length - 1].path = this.pages[post];
      pages[pages.length - 1].slug = page;
      pages[pages.length - 1].url = '/mock/?' + page;
      pages[pages.length - 1].id = pages.length - 1;
    }
    
    for (var index in pages) {
      if (index > -1) {
        pages[index].prev = pages[parseInt(index) - 1] ? pages[parseInt(index) - 1] : null;
        pages[index].next = pages[parseInt(index) + 1] ? pages[parseInt(index) + 1] : null;
      }
    }
    
    var config = { 
      site: { 
        time: new Date(), 
        pages: pages,
        posts: posts, 
        related_posts: null,
        static_files: null,
        html_pages: null,
        collections: null,
        data: this.data,
        documents: null,
        categories: {},
        tags: tags
      },
      page: {
        content: '',
        title: '',
        excerpt: '',
        url: '',
        date: '',
        id: '',
        categories: '',
        tags: '',
        path: '',
        next: '',
        previous: ''
      }
    };
    
    for (var prop in this.config) {
      config.site[prop] = this.config[prop];
    }
    
    return config;
  }
  
  this.renderTemplate = function(filename, page, config, content) {
    if (config == null) {
      config = this.initConfig();
    }
    
    for (var prop in page) {
      config.page[prop] = page[prop];
    }
    
    var content = filename.match(/md|markdown$/) ? marked(page["__content"]) : page["__content"];
    var tpl = Liquid.parse(content);
    var render = tpl.render(config);
    
    console.log(page);
    console.log(config);
    
    if (page.layout) {
      return this.renderLayout(page.layout, config, render);
    } else {
      return render;
    }
  }
  
  this.renderLayout = function(layout, config, content) {
    for (var prop in this.config) {
      config.site[prop] = this.config[prop];
    }
    
    var page = this.files[this.layouts[layout]];
    config.content = content;
    return this.renderTemplate(this.layouts[layout], page, config, content);
  }
}

var LearnJekyllLoader = function(app) {
  this.app = app;
  this.structure = {};
  this.paths = [];
  this.files = {};
  
  this.loadStructure = function(path, structure) {
    this.structure = structure;
    this.paths = this.getPaths();
    this.loadFiles();
  }

  this.getPaths = function() {
    var structureObj = jsyaml.load(this.structure);
    
    // create paths
    var paths = structureObj.map(function(item, index) {
      if (typeof item === 'string') {
        return item; 
      } else {
        var path = Object.keys(item)[0];
        var items = item[Object.keys(item)[0]]
      
        return items.map(function(item) {
          return path + '/' + item;
        });
      }
    });
    
    // flatten
    return paths.reduce(function(a, b){
         return a.concat(b);
    });
  }
  
  this.getUrls = function() {
    this.paths.forEach(function (path) {
      if (path.match(/^_layouts/)) {
        this.app.layouts[path.substring('_layouts/'.length).replace(/\.[a-z0-9]+$/, '')] = path;
        return;
      } else if (path.match(/^_posts/)) {
        this.app.posts[path.substring('_posts/'.length).replace(/\.[a-z0-9]+$/, '')] = path;
        this.app.urls[path.substring('_posts/'.length).replace(/\.[a-z0-9]+$/, '')] = path;
        return;
      } else if (path.match(/^_includes/)) {
        this.app.includes[path.substring('_includes/'.length).replace(/\.[a-z0-9]+$/, '')] = path;
        this.app.includes[path.substring('_includes/'.length)] = path;
        return;
      } else if (path.match(/^_data/)) {
        if (path.match(/.json$/)) {
          var name = path.substring('_data/'.length).replace('.json', '');
          this.app.data[name] = JSON.parse(this.files[path]);
        } else if (path.match(/.yml$/)) {
          var name = path.substring('_data/'.length).replace('.yml', '');
          this.app.data[name] = jsyaml.load(this.files[path]["__content"]); 
        }
        return;
      } else if (path.match(/_config\.yml/)) {
        return;
      } else if (path.match(/\.(md|html)$/)) {
        this.app.pages[path.replace(/\.[a-z0-9]+$/, '')] = path;
        this.app.urls[path.replace(/\.[a-z0-9]+$/, '')] = path;
      } else if (!path.match(/\//)) {
        this.app.urls[path.replace(/\.[a-z0-9]+$/, '')] = path;
      }
    }.bind(this));
  }
  
  this.loadFiles = function() {
    var fileCount = 0;
    var loadedCount = 0;
    var result = {};
      
    for (var i = this.paths.length - 1; i >= 0; i--) {
      fileCount++;
      this.load('./../' + this.paths[i], this.appendFile.bind(this));
    }
  }
  
  this.appendFile = function(path, contents) {
      this.files[path.substring(5)] = jsyaml.loadFront(contents);
      
      if (this.paths.length === Object.keys(this.files).length) {
        this.app.structure = this.structure;
        this.app.paths = this.paths;
        this.app.files = this.files;
        this.getUrls();
        this.app.render();
      }
  }
  
  this.loadConfig = function(path, config) {
    this.app.config = jsyaml.load(config);
  }
  
  this.load = function(filename, callback) {
    var client = new XMLHttpRequest();
    client.open('GET', filename + '?' + new Date().getTime());
    client.onreadystatechange = function() {
      if (client.readyState === 4) {
        if (client.status === 200) {
          callback(filename, client.responseText);  
        } else {
          console.log('Error while loading "' + filename + '".');
        }
      }
    }
    client.send();
  }  
}
