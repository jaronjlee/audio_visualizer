// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"AudioVisualizer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AudioVisualizer = /*#__PURE__*/function () {
  function AudioVisualizer() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.audioVisualizer';
    var audio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, AudioVisualizer);

    //creates audioVisualizer class
    this.playerElem = document.querySelector(selector); //references where playerElem is sitting on the page

    this.audio = audio; //property that holds audio files

    this.currentAudio = null; //song that is currently playing

    this.createPlayerElements(); //creates HTML markups 

    this.audioContext = null; //holds reference to current audio
  }

  _createClass(AudioVisualizer, [{
    key: "createVisualizer",
    value: function createVisualizer() {
      this.audioContext = new AudioContext();
      var source = this.audioContext.createMediaElementSource(this.audioElem); //audioElem is the HTML tag

      var analyser = this.audioContext.createAnalyser();
      var canvas = this.visualizerElem;
      var canvasContext = canvas.getContext('2d');
      source.connect(analyser);
      analyser.connect(this.audioContext.destination);
      analyser.fftSize = 256;
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);
      var barWidth = canvas.width / bufferLength * 2.75;

      function draw() {
        var drawVisual = requestAnimationFrame(draw);
        var bar = 0;
        analyser.getByteFrequencyData(dataArray);
        canvasContext.fillStyle = "rgb(0, 0, 0)"; // canvasContext.fillStyle = "rgb(255, 255, 255)";

        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < bufferLength; i++) {
          var barHeight = dataArray[i]; //remove some bar height
          // const r = barHeight + (25 * (i/bufferLength))
          // canvasContext.fillStyle = `rgb(${r}, 50, 50)`;
          // canvasContext.fillRect(bar, canvas.height-barHeight, barWidth, barHeight);

          canvasContext.fillStyle = 'rgb(' + barHeight + ',179,255)'; // canvasContext.fillStyle = 'rgb(' + (barHeight - 100) + ',255,255)';
          // canvasContext.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';

          canvasContext.fillRect(bar, canvas.height - barHeight / 2, barWidth, barHeight);
          bar += barWidth - .75;
        }
      }

      draw();
    }
  }, {
    key: "createPlayerElements",
    value: function createPlayerElements() {
      var playlistElem = document.createElement('div'); //creates visualizer div

      playlistElem.classList.add('playlist');
      this.audioElem = document.createElement('audio');
      this.visualizerElem = document.createElement('canvas');
      this.playerElem.appendChild(this.audioElem);
      this.playerElem.appendChild(playlistElem);
      this.playerElem.appendChild(this.visualizerElem);
      this.createPlaylistElements(playlistElem);
    }
  }, {
    key: "createPlaylistElements",
    value: function createPlaylistElements(playlistElem) {
      var _this = this;

      this.audio.forEach(function (audio) {
        //iterate through audio and create audio items to append to playlist
        var audioItem = document.createElement('a');
        audioItem.href = audio.url; //each audio item has URL and name

        audioItem.innerHTML = "<i class=\"fa fa-play\"></i>".concat(audio.name);

        _this.setupEventListener(audioItem);

        playlistElem.appendChild(audioItem);
      });
    }
  }, {
    key: "setupEventListener",
    value: function setupEventListener(audioItem) {
      var _this2 = this;

      audioItem.addEventListener('click', function (e) {
        e.preventDefault();

        if (!_this2.audioContext) {
          _this2.createVisualizer();
        }

        var isCurrentAudio = audioItem.getAttribute('href') === (_this2.currentAudio && _this2.currentAudio.getAttribute('href'));

        if (isCurrentAudio && !_this2.audioElem.paused) {
          _this2.setPlayIcon(_this2.currentAudio);

          _this2.audioElem.pause();
        } else if (isCurrentAudio && _this2.audioElem.paused) {
          _this2.setPauseIcon(_this2.currentAudio);

          _this2.audioElem.play();
        } else {
          if (_this2.currentAudio) {
            _this2.setPlayIcon(_this2.currentAudio);
          }

          _this2.currentAudio = audioItem;

          _this2.setPauseIcon(_this2.currentAudio);

          _this2.audioElem.src = _this2.currentAudio.getAttribute('href');

          _this2.audioElem.play();
        }
      });
    }
  }, {
    key: "setPlayIcon",
    value: function setPlayIcon(ele) {
      var icon = ele.querySelector('i');
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
    }
  }, {
    key: "setPauseIcon",
    value: function setPauseIcon(ele) {
      var icon = ele.querySelector('i');
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
    }
  }]);

  return AudioVisualizer;
}();

exports.default = AudioVisualizer;
},{}],"app.js":[function(require,module,exports) {
"use strict";

var _AudioVisualizer = _interopRequireDefault(require("./AudioVisualizer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioVisualizer = new _AudioVisualizer.default(".audioVisualizer", [{
  url: "./songs/Make_it_to_Heaven.mp3",
  name: "MAKE IT TO HEAVEN"
}, {
  url: "./songs/Midnight_Hour.mp3",
  name: "MIDNIGHT HOUR"
}, {
  url: "./songs/Ritual.mp3",
  name: "RITUAL"
}]);
},{"./AudioVisualizer":"AudioVisualizer.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52336" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","app.js"], null)