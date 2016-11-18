
let toMixin = {
    isEmpty: function(thing) {
      return thing.length === 0;
    },
    isntEmpty: function(thing) {
      return thing.length !== 0;
    },
    method: function(thing, name) {
      return function() {
        return thing[name].apply(thing, arguments);
      };
    },
    protract: function() {
      var name, names, obj;
      obj = arguments[0], name = arguments[1], names = 3 <= arguments.length ? [].slice.call(arguments, 2) : [];
      if (name === void 0) {
        return obj;
      } else if (obj === void 0) {
        return void 0;
      } else {
        return _.protract.apply({}, [obj[name]].concat(names));
      }
    },
    streamToString: function(stream, callback) {
      var input;
      input = void 0;
      input = "";
      stream.on("data", function(chunk) {
        return input += chunk.toString();
      });
      return stream.on("end", function() {
        return callback(input);
      });
    },
    stringRepeat: function(n, str) {
      if (n < 1) {
        return '';
      } else {
        return str + arguments.callee(n - 1, str);
      }
    },
    createCheckin: function(n, cb) {
      return function() {
        if (--n <= 0) {
          return cb();
        }
      };
    },
    numberToEnglish: function(n, item) {
      if (item === void 0) {
        return ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n - 1];
      } else {
        switch (n) {
          case 0:
            return "no " + item + "s";
          case 1:
            return "one " + item;
          default:
            return "" + (_.numberToEnglish(n)) + " " + item + "s";
        }
      }
    },
    englishList: function(xs) {
      switch (xs.length) {
        case 1:
        case 0:
          return xs.join('');
        case 2:
          return xs[0] + " and " + xs[1];
        default:
          return xs.slice(0, -1).join(', ') + ", and " + xs[xs.length - 1];
      }
    },
    segment: function(xs, n, includeTail) {
      var result;
      if (includeTail == null) {
        includeTail = false;
      }
      result = [];
      while (n <= xs.length) {
        result.push(xs.slice(0, n));
        xs = xs.slice(n);
      }
      if (true === includeTail && 0 < xs.length) {
        result.push(xs);
      }
      return result;
    },
    repeat: function(n, item) {
      var _results;
      _results = [];
      while (n--) {
        _results.push(item);
      }
      return _results;
    }
};

toMixin.select = (n, items) => {
    items = items.slice();
    return through(n).map(() => {
        let i = Math.floor(Math.random() * items.length);
        return items.splice(i, 1)[0]
    });
};

toMixin.sum = (items) => {
    items.reduce((a, b) => a + b);
};

toMixin.randomBiased = (weights) => {
    let total = Math.random();
    let i = 0;
    while (i + weights[i] < total) {
        i += weights[i];
    }
    return i;
};

toMixin.merge = (...lists) => {
    let result = [];
    while (0 < lists.length) {
        let weights = _.pluck(lists, 'length') / sum(_.pluck(lists, 'length'));
        let chosenIndex = randomBiased(weights);
        let chosen = lists[chosenIndex];
        result.push(chosen.shift());
        if (chosen.length === 0) {
            lists.splice(chosenIndex, 1);
        }
    }
    return result;
};

toMixin.through = (n) => {
    let result = [];
    for (var i = 0; i < n; i++) {
        result.push(i);
    }
    return result;
};

toMixin.repeat = (n, item) => {
    through(n).map(() => item);
};  

toMixin.calm = (f, wait) => {
    let calls = [];
    let calling = false;
    let call = () => {
        calling = true;
        f(...(calls.shift()));
        setTimeout(revisit, wait);
    };
    let revisit = () => {
        calling = false;
        if (calls.length !== 0) {
            call();
        }
    };
    return (...args) => {
        calls.push(args);
        if (!calling) {
            call();
        }
    };
};

toMixin.shuffle = (items) => {
    items = items.slice();
    return through(items.length).map(() => {
        return items.splice(Math.random() * items.length, 1)[0];
    });
};

if (typeof _ !== "undefined" && _ !== null) {
    _.mixin(toMixin);
    module.exports = _;
} else if ((typeof module !== "undefined" && module !== null) && (typeof process !== "undefined" && process !== null)) {
    let _ = require('underscore');
    _.mixin(toMixin);
    module.exports = _;
} else {
    console.error("Customscore: You need to include underscore as well! Try `npm install underscore`");
}
