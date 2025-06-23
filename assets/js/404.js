(function($) {
  "use strict";
  
  var Novacancy = function(element, options) {
      this._el = $(element);
      
      // 检查是否已初始化
      if (this.repeat()) return true;
      
      this._settings = options;
      this._powerOn = false;
      this._loopTimeout = 0;
      
      this._el.html(this.buildHTML());
      this._items = this._el.find("span.novacancy");
      this._blinkArr = this.arrayMake();
      
      this.bindEvent();
      this.writeCSS();
      
      if (this._settings.autoOn) this.blinkOn();
  };
  
  Novacancy.prototype.repeat = function() {
      var el = this._el;
      if (el[0].novacancy) {
          return true;
      } else {
          el[0].novacancy = true;
          return false;
      }
  };
  
  Novacancy.prototype.writeCSS = function() {
      var css = this.css();
      var style = $("<style>" + css + "</style>");
      $("body").append(style);
  };
  
  Novacancy.prototype.selector = function() {
      var el = this._el;
      var selector = el[0].tagName;
      
      if (el[0].id) selector += "#" + el[0].id;
      if (el[0].className) selector += "." + el[0].className.replace(/\s+/g, '.');
      
      return selector;
  };
  
  Novacancy.prototype.css = function() {
      var selector = this.selector();
      var settings = this._settings;
      
      var glow = settings.glow.toString();
      var onStyle = "color: " + settings.color + "; text-shadow: " + glow + ";";
      var offStyle = "color: " + settings.color + "; opacity: 0.3;";
      
      return selector + " .novacancy.on { " + onStyle + " }\n" +
             selector + " .novacancy.off { " + offStyle + " }\n";
  };
  
  Novacancy.prototype.rand = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  Novacancy.prototype.isNumber = function(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
  };
  
  Novacancy.prototype.blink = function(element) {
      var settings = this._settings;
      var self = this;
      
      this.off(element);
      element[0].blinking = true;
      
      setTimeout(function() {
          self.on(element);
          element[0].blinking = false;
          self.reblink(element);
      }, this.rand(settings.blinkMin, settings.blinkMax));
  };
  
  Novacancy.prototype.reblink = function(element) {
      var settings = this._settings;
      var self = this;
      
      setTimeout(function() {
          if (self.rand(1, 100) <= settings.reblinkProbability) {
              self.blink(element);
          }
      }, this.rand(settings.blinkMin, settings.blinkMax));
  };
  
  Novacancy.prototype.on = function(element) {
      element.removeClass("off").addClass("on");
  };
  
  Novacancy.prototype.off = function(element) {
      element.removeClass("on").addClass("off");
  };
  
  Novacancy.prototype.buildHTML = function() {
      var content = "";
      
      this._el.contents().each(function(index, node) {
          if (node.nodeType === 3) {
              // 文本节点
              var chars = node.nodeValue.split("");
              chars.forEach(function(char) {
                  content += '<span class="novacancy on">' + char + '</span>';
              });
          } else {
              // 元素节点
              content += node.outerHTML;
          }
      });
      
      return content;
  };
  
  Novacancy.prototype.arrayMake = function() {
      var items = this._items;
      var settings = this._settings;
      var count = items.length;
      
      var randomIndices = this.randomArray(count);
      var offIndices = [];
      var blinkIndices = [];
      
      var offCount = Math.min(settings.off, count);
      offCount = Math.max(0, offCount);
      
      var blinkCount = settings.blink === 0 ? count : settings.blink;
      blinkCount = Math.min(blinkCount, count - offCount);
      blinkCount = Math.max(0, blinkCount);
      
      // 初始化关闭的字符
      offIndices = randomIndices.splice(0, offCount);
      offIndices.forEach(function(index) {
          this.off($(items[index]));
      }.bind(this));
      
      // 初始化闪烁的字符
      blinkIndices = randomIndices.splice(0, blinkCount);
      
      return blinkIndices;
  };
  
  Novacancy.prototype.randomArray = function(length) {
      var array = [];
      for (var i = 0; i < length; i++) {
          array[i] = i;
      }
      
      // Fisher-Yates 洗牌算法
      for (var i = length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      
      return array;
  };
  
  Novacancy.prototype.loop = function() {
      if (!this._powerOn) return;
      
      var blinkArray = this._blinkArr;
      var items = this._items;
      
      if (blinkArray.length === 0) return;
      
      var randomIndex = this.rand(0, blinkArray.length - 1);
      var element = $(items[blinkArray[randomIndex]]);
      
      if (!element[0].blinking) this.blink(element);
      
      this._loopTimeout = setTimeout(function() {
          this.loop();
      }.bind(this), this.rand(this._settings.loopMin, this._settings.loopMax));
  };
  
  Novacancy.prototype.blinkOn = function() {
      if (!this._powerOn) {
          var settings = this._settings;
          this._powerOn = true;
          
          this._loopTimeout = setTimeout(function() {
              this.loop();
          }.bind(this), this.rand(settings.loopMin, settings.loopMax));
      }
  };
  
  Novacancy.prototype.blinkOff = function() {
      if (this._powerOn) {
          this._powerOn = false;
          clearTimeout(this._loopTimeout);
      }
  };
  
  Novacancy.prototype.bindEvent = function() {
      var self = this;
      this._el.on("blinkOn", function() {
          self.blinkOn();
      });
      this._el.on("blinkOff", function() {
          self.blinkOff();
      });
  };
  
  // 默认配置
  var defaults = function(options) {
      return $.extend({
          reblinkProbability: 1/3,
          blinkMin: 0.01,
          blinkMax: 0.5,
          loopMin: 0.5,
          loopMax: 2,
          color: "ORANGE",
          glow: ["0 0 80px Orange", "0 0 30px Red", "0 0 6px Yellow"],
          off: 0,
          blink: 0,
          autoOn: true
      }, options);
  };
  
  // jQuery 插件定义
  $.fn.novacancy = function(options) {
      options = defaults(options);
      
      // 将时间值从秒转换为毫秒
      options.reblinkProbability *= 100;
      options.blinkMin *= 1000;
      options.blinkMax *= 1000;
      options.loopMin *= 1000;
      options.loopMax *= 1000;
      
      return this.each(function() {
          new Novacancy(this, options);
      });
  };
  
})(jQuery);

// 文档就绪时初始化霓虹灯效果
$(function() {
  // 错误信息的霓虹灯效果
  $('#error').novacancy({
      'reblinkProbability': 0.1,
      'blinkMin': 0.2,
      'blinkMax': 0.6,
      'loopMin': 8,
      'loopMax': 10,
      'color': '#ffffff',
      'glow': ['0 0 80px #ffffff', '0 0 30px #008000', '0 0 6px #0000ff']
  });
  
  // 代码区域的霓虹灯效果
  $('#code').novacancy({
      'blink': 1,
      'off': 1,
      'color': 'Red',
      'glow': ['0 0 80px Red', '0 0 30px FireBrick', '0 0 6px DarkRed']
  });
});