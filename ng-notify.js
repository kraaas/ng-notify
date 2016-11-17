(function(root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    if (typeof angular === 'undefined') {
      factory(require('angular'));
    } else {
      factory(angular);
    }
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['angular'], factory);
  } else {
    // Global Variables
    factory(root.angular);
  }
}(this, function(angular) {
  'use strict'
  var m = angular.module('ng.notify', [])
  m.run(['$templateCache', cacheTemplate])
  m.factory('notifyFactory', [
    '$rootScope',
    '$compile',
    '$templateCache',
    '$interval',
    '$timeout',
    notifyFactory
  ])
  m.provider('ngNotify', ngNotifyProvider)

  var TEMPLATE_PATH = 'templates/ng-notify/notify.html'
  var DEFAULT_OPTS = {
    title: '',
    content: '',
    top: '20px',
    position: 'top',
    onOk: angular.noop,
    onCancle: angular.noop,
    okText: '确认',
    cancleText: '取消',
    showOk: true,
    showCancle: false,
    showTitle: true,
    className: 'top',
    // duration: 3000
  }
  var iconType = {
    'open': '',
    'info': '&#451;',
    'success': '&#10003;',
    'wraning': '&#451;',
    'error': '&#215;'
  }
  var $container

  function ngNotifyProvider() {
    this.config = function(opts) {
      angular.extend(DEFAULT_OPTS, opts)
    }
    this.$get = [
      'notifyFactory',
      function(NgNotifyFactory) {
        return {
          open: function(opts) {
            return new NgNotifyFactory('open', opts)
          },
          info: function(opts) {
            return new NgNotifyFactory('info', opts)
          },
          success: function(opts) {
            return new NgNotifyFactory('success', opts)
          },
          error: function(opts) {
            return new NgNotifyFactory('error', opts)
          },
          warn: function(opts) {
            return new NgNotifyFactory('warn', opts)
          }
        }
      }
    ]
  }

  function notifyFactory($rootScope, $compile, $templateCache, $interval, $timeout) {

    function NotifyFactory(type, opts) {
      this.type = type
      this.opts = angular.copy(opts)
      this.init()
    }

    var np = NotifyFactory.prototype

    np.init = function() {
      this.scope = this.createScope()
      this.initData()
      this.compile()
      this.mount()
      if (this.vm.duration) {
        this.setTimeout()
      }
    }

    np.initData = function() {
      var _this = this
      angular.extend(this.vm, DEFAULT_OPTS, this.opts)
      this.vm.close = this.close.bind(this)
      this.vm.okHandel = function() {
        this.vm.onOk.call(this)
      }
      this.vm.icon = iconType[this.type]
      this.vm.iconClass = this.type
    }

    np.createScope = function() {
      var scope = $rootScope.$new()
      this.vm = scope.vm = {}
      return scope
    }

    np.compile = function() {
      this.template = $compile(
        $templateCache.get(TEMPLATE_PATH)
      )(this.scope)
    }

    np.mount = function(el) {
      var _this = this
      if (!$container) {
        $container = initNotifyWrap(this.vm.className)
      }
      $container.prepend(this.template.eq(0))
      setTimeout(function() {
        _this.template.addClass('slide_in')
      }, 0)

    }

    np.setTimeout = function() {
      var _this = this
      this.timer = $timeout(function() {
        _this.close()
      }, this.vm.duration)
    }

    np.close = function() {
      var _this = this
      this.template.removeClass('slide_in')
      setTimeout(function() {
        _this.template.remove()
      }, 300)

      if (this.timer) {
        clearTimeout(this.timer)
      }
    }

    return NotifyFactory
  }

  function cacheTemplate($templateCache) {
    var template = [
      '<li class="noitfy_item">',
      '<div class="notify_header" ng-if="vm.showTitle">{{vm.title}}</div>',
      '<div class="notify_content">{{vm.content}}</div>',
      '<div class="notify_footer">',
      '<button class="notify_btn" ng-if="vm.showCancle" ng-click="vm.onCancle()">{{vm.cancleText}}</button>',
      '<button class="notify_btn notify_btn--success" ng-if="vm.showOk" ng-click="vm.onOk()">{{vm.okText}}</button>',
      '</div>',
      '<span class="notify_close" ng-click="vm.close()">x</span>' +
      '</li>'
    ].join('')
    $templateCache.put(TEMPLATE_PATH, template)
  }

  function initNotifyWrap(className) {
    var $container = angular.element(document.createElement('ul'))
    $container.addClass('notify ' + className)
    angular.element('body').append($container)
    return $container
  }
}))