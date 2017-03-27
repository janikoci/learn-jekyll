'use strict';

Liquid.readTemplateFile = function(path) {
  var tpl = app.files[app.includes[path]];
  
  if(tpl) {
    return tpl['__content'];
  } else {
    return console.error('"' + path +'" can\'t be found.');
  }
}

Liquid.Template.registerTag( 'link', Liquid.Tag.extend({
  init: function(tagName, markup, tokens) {
    function getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    }
    
    var link = markup.trim();
    var slug = getKeyByValue(app.urls, link);
    
    this.link = slug ? slug : 'Error: file not found.';
  },
  render: function(context) {
    return '/mock/?' + this.link;
  }
}));

Liquid.Template.registerTag( 'include', Liquid.Tag.extend({

  tagSyntax: /['"]?([^'" ]+)['"]?\s?(.+)?/,

  init: function(tag, markup, tokens) {
    var matches = (markup || '').match(this.tagSyntax);
    if(matches) {
      this.templateName = '\'' + matches[1] + '\'';
      this.templateNameVar = matches[1];
      this.variableName = matches[3];
      this.attributes = {};

      var attMatch = [];
      var attRegex = /(\s?([a-z0-9]+)=['"]([^']+)['"])/g;
      while (attMatch = attRegex.exec(markup)) {
        this.attributes[attMatch[2].trim()] = attMatch[3].trim();
      };
    } else {
      throw ("Error in tag 'include' - Valid syntax: include [template] [param]='[value]'");
    }
    this._super(tag, markup, tokens);
  },

  render: function(context) {
    var self     = this,
        source   = Liquid.readTemplateFile( context.get(this.templateName) ),
        partial  = Liquid.parse(source),
        variable = context.get((this.variableName || this.templateNameVar)),
        output   = '';
    context.stack(function(){
      self.attributes.each = hackObjectEach;
      self.attributes.each(function(pair){
        context.set(pair.key, context.get(pair.value));
      })

      if(variable instanceof Array) {
        output = variable.map(function(variable){
          context.set( self.templateNameVar, variable );
          return partial.render(context);
        });
      } else {
        context.set(self.templateNameVar, variable);
        output = partial.render(context);
      }
    });
    output = [output].flatten().join('');
    return output
  }
}));
