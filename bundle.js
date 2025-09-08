(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/js-beautify/js/src/core/output.js
  var require_output = __commonJS({
    "node_modules/js-beautify/js/src/core/output.js"(exports, module) {
      "use strict";
      function OutputLine(parent) {
        this.__parent = parent;
        this.__character_count = 0;
        this.__indent_count = -1;
        this.__alignment_count = 0;
        this.__wrap_point_index = 0;
        this.__wrap_point_character_count = 0;
        this.__wrap_point_indent_count = -1;
        this.__wrap_point_alignment_count = 0;
        this.__items = [];
      }
      OutputLine.prototype.clone_empty = function() {
        var line = new OutputLine(this.__parent);
        line.set_indent(this.__indent_count, this.__alignment_count);
        return line;
      };
      OutputLine.prototype.item = function(index) {
        if (index < 0) {
          return this.__items[this.__items.length + index];
        } else {
          return this.__items[index];
        }
      };
      OutputLine.prototype.has_match = function(pattern) {
        for (var lastCheckedOutput = this.__items.length - 1; lastCheckedOutput >= 0; lastCheckedOutput--) {
          if (this.__items[lastCheckedOutput].match(pattern)) {
            return true;
          }
        }
        return false;
      };
      OutputLine.prototype.set_indent = function(indent, alignment) {
        if (this.is_empty()) {
          this.__indent_count = indent || 0;
          this.__alignment_count = alignment || 0;
          this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count);
        }
      };
      OutputLine.prototype._set_wrap_point = function() {
        if (this.__parent.wrap_line_length) {
          this.__wrap_point_index = this.__items.length;
          this.__wrap_point_character_count = this.__character_count;
          this.__wrap_point_indent_count = this.__parent.next_line.__indent_count;
          this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count;
        }
      };
      OutputLine.prototype._should_wrap = function() {
        return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count;
      };
      OutputLine.prototype._allow_wrap = function() {
        if (this._should_wrap()) {
          this.__parent.add_new_line();
          var next = this.__parent.current_line;
          next.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count);
          next.__items = this.__items.slice(this.__wrap_point_index);
          this.__items = this.__items.slice(0, this.__wrap_point_index);
          next.__character_count += this.__character_count - this.__wrap_point_character_count;
          this.__character_count = this.__wrap_point_character_count;
          if (next.__items[0] === " ") {
            next.__items.splice(0, 1);
            next.__character_count -= 1;
          }
          return true;
        }
        return false;
      };
      OutputLine.prototype.is_empty = function() {
        return this.__items.length === 0;
      };
      OutputLine.prototype.last = function() {
        if (!this.is_empty()) {
          return this.__items[this.__items.length - 1];
        } else {
          return null;
        }
      };
      OutputLine.prototype.push = function(item) {
        this.__items.push(item);
        var last_newline_index = item.lastIndexOf("\n");
        if (last_newline_index !== -1) {
          this.__character_count = item.length - last_newline_index;
        } else {
          this.__character_count += item.length;
        }
      };
      OutputLine.prototype.pop = function() {
        var item = null;
        if (!this.is_empty()) {
          item = this.__items.pop();
          this.__character_count -= item.length;
        }
        return item;
      };
      OutputLine.prototype._remove_indent = function() {
        if (this.__indent_count > 0) {
          this.__indent_count -= 1;
          this.__character_count -= this.__parent.indent_size;
        }
      };
      OutputLine.prototype._remove_wrap_indent = function() {
        if (this.__wrap_point_indent_count > 0) {
          this.__wrap_point_indent_count -= 1;
        }
      };
      OutputLine.prototype.trim = function() {
        while (this.last() === " ") {
          this.__items.pop();
          this.__character_count -= 1;
        }
      };
      OutputLine.prototype.toString = function() {
        var result = "";
        if (this.is_empty()) {
          if (this.__parent.indent_empty_lines) {
            result = this.__parent.get_indent_string(this.__indent_count);
          }
        } else {
          result = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count);
          result += this.__items.join("");
        }
        return result;
      };
      function IndentStringCache(options, baseIndentString) {
        this.__cache = [""];
        this.__indent_size = options.indent_size;
        this.__indent_string = options.indent_char;
        if (!options.indent_with_tabs) {
          this.__indent_string = new Array(options.indent_size + 1).join(options.indent_char);
        }
        baseIndentString = baseIndentString || "";
        if (options.indent_level > 0) {
          baseIndentString = new Array(options.indent_level + 1).join(this.__indent_string);
        }
        this.__base_string = baseIndentString;
        this.__base_string_length = baseIndentString.length;
      }
      IndentStringCache.prototype.get_indent_size = function(indent, column) {
        var result = this.__base_string_length;
        column = column || 0;
        if (indent < 0) {
          result = 0;
        }
        result += indent * this.__indent_size;
        result += column;
        return result;
      };
      IndentStringCache.prototype.get_indent_string = function(indent_level, column) {
        var result = this.__base_string;
        column = column || 0;
        if (indent_level < 0) {
          indent_level = 0;
          result = "";
        }
        column += indent_level * this.__indent_size;
        this.__ensure_cache(column);
        result += this.__cache[column];
        return result;
      };
      IndentStringCache.prototype.__ensure_cache = function(column) {
        while (column >= this.__cache.length) {
          this.__add_column();
        }
      };
      IndentStringCache.prototype.__add_column = function() {
        var column = this.__cache.length;
        var indent = 0;
        var result = "";
        if (this.__indent_size && column >= this.__indent_size) {
          indent = Math.floor(column / this.__indent_size);
          column -= indent * this.__indent_size;
          result = new Array(indent + 1).join(this.__indent_string);
        }
        if (column) {
          result += new Array(column + 1).join(" ");
        }
        this.__cache.push(result);
      };
      function Output(options, baseIndentString) {
        this.__indent_cache = new IndentStringCache(options, baseIndentString);
        this.raw = false;
        this._end_with_newline = options.end_with_newline;
        this.indent_size = options.indent_size;
        this.wrap_line_length = options.wrap_line_length;
        this.indent_empty_lines = options.indent_empty_lines;
        this.__lines = [];
        this.previous_line = null;
        this.current_line = null;
        this.next_line = new OutputLine(this);
        this.space_before_token = false;
        this.non_breaking_space = false;
        this.previous_token_wrapped = false;
        this.__add_outputline();
      }
      Output.prototype.__add_outputline = function() {
        this.previous_line = this.current_line;
        this.current_line = this.next_line.clone_empty();
        this.__lines.push(this.current_line);
      };
      Output.prototype.get_line_number = function() {
        return this.__lines.length;
      };
      Output.prototype.get_indent_string = function(indent, column) {
        return this.__indent_cache.get_indent_string(indent, column);
      };
      Output.prototype.get_indent_size = function(indent, column) {
        return this.__indent_cache.get_indent_size(indent, column);
      };
      Output.prototype.is_empty = function() {
        return !this.previous_line && this.current_line.is_empty();
      };
      Output.prototype.add_new_line = function(force_newline) {
        if (this.is_empty() || !force_newline && this.just_added_newline()) {
          return false;
        }
        if (!this.raw) {
          this.__add_outputline();
        }
        return true;
      };
      Output.prototype.get_code = function(eol) {
        this.trim(true);
        var last_item = this.current_line.pop();
        if (last_item) {
          if (last_item[last_item.length - 1] === "\n") {
            last_item = last_item.replace(/\n+$/g, "");
          }
          this.current_line.push(last_item);
        }
        if (this._end_with_newline) {
          this.__add_outputline();
        }
        var sweet_code = this.__lines.join("\n");
        if (eol !== "\n") {
          sweet_code = sweet_code.replace(/[\n]/g, eol);
        }
        return sweet_code;
      };
      Output.prototype.set_wrap_point = function() {
        this.current_line._set_wrap_point();
      };
      Output.prototype.set_indent = function(indent, alignment) {
        indent = indent || 0;
        alignment = alignment || 0;
        this.next_line.set_indent(indent, alignment);
        if (this.__lines.length > 1) {
          this.current_line.set_indent(indent, alignment);
          return true;
        }
        this.current_line.set_indent();
        return false;
      };
      Output.prototype.add_raw_token = function(token) {
        for (var x = 0; x < token.newlines; x++) {
          this.__add_outputline();
        }
        this.current_line.set_indent(-1);
        this.current_line.push(token.whitespace_before);
        this.current_line.push(token.text);
        this.space_before_token = false;
        this.non_breaking_space = false;
        this.previous_token_wrapped = false;
      };
      Output.prototype.add_token = function(printable_token) {
        this.__add_space_before_token();
        this.current_line.push(printable_token);
        this.space_before_token = false;
        this.non_breaking_space = false;
        this.previous_token_wrapped = this.current_line._allow_wrap();
      };
      Output.prototype.__add_space_before_token = function() {
        if (this.space_before_token && !this.just_added_newline()) {
          if (!this.non_breaking_space) {
            this.set_wrap_point();
          }
          this.current_line.push(" ");
        }
      };
      Output.prototype.remove_indent = function(index) {
        var output_length = this.__lines.length;
        while (index < output_length) {
          this.__lines[index]._remove_indent();
          index++;
        }
        this.current_line._remove_wrap_indent();
      };
      Output.prototype.trim = function(eat_newlines) {
        eat_newlines = eat_newlines === void 0 ? false : eat_newlines;
        this.current_line.trim();
        while (eat_newlines && this.__lines.length > 1 && this.current_line.is_empty()) {
          this.__lines.pop();
          this.current_line = this.__lines[this.__lines.length - 1];
          this.current_line.trim();
        }
        this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
      };
      Output.prototype.just_added_newline = function() {
        return this.current_line.is_empty();
      };
      Output.prototype.just_added_blankline = function() {
        return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
      };
      Output.prototype.ensure_empty_line_above = function(starts_with, ends_with) {
        var index = this.__lines.length - 2;
        while (index >= 0) {
          var potentialEmptyLine = this.__lines[index];
          if (potentialEmptyLine.is_empty()) {
            break;
          } else if (potentialEmptyLine.item(0).indexOf(starts_with) !== 0 && potentialEmptyLine.item(-1) !== ends_with) {
            this.__lines.splice(index + 1, 0, new OutputLine(this));
            this.previous_line = this.__lines[this.__lines.length - 2];
            break;
          }
          index--;
        }
      };
      module.exports.Output = Output;
    }
  });

  // node_modules/js-beautify/js/src/core/token.js
  var require_token = __commonJS({
    "node_modules/js-beautify/js/src/core/token.js"(exports, module) {
      "use strict";
      function Token(type, text, newlines, whitespace_before) {
        this.type = type;
        this.text = text;
        this.comments_before = null;
        this.newlines = newlines || 0;
        this.whitespace_before = whitespace_before || "";
        this.parent = null;
        this.next = null;
        this.previous = null;
        this.opened = null;
        this.closed = null;
        this.directives = null;
      }
      module.exports.Token = Token;
    }
  });

  // node_modules/js-beautify/js/src/javascript/acorn.js
  var require_acorn = __commonJS({
    "node_modules/js-beautify/js/src/javascript/acorn.js"(exports) {
      "use strict";
      var baseASCIIidentifierStartChars = "\\x23\\x24\\x40\\x41-\\x5a\\x5f\\x61-\\x7a";
      var baseASCIIidentifierChars = "\\x24\\x30-\\x39\\x41-\\x5a\\x5f\\x61-\\x7a";
      var nonASCIIidentifierStartChars = "\\xaa\\xb5\\xba\\xc0-\\xd6\\xd8-\\xf6\\xf8-\\u02c1\\u02c6-\\u02d1\\u02e0-\\u02e4\\u02ec\\u02ee\\u0370-\\u0374\\u0376\\u0377\\u037a-\\u037d\\u0386\\u0388-\\u038a\\u038c\\u038e-\\u03a1\\u03a3-\\u03f5\\u03f7-\\u0481\\u048a-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05d0-\\u05ea\\u05f0-\\u05f2\\u0620-\\u064a\\u066e\\u066f\\u0671-\\u06d3\\u06d5\\u06e5\\u06e6\\u06ee\\u06ef\\u06fa-\\u06fc\\u06ff\\u0710\\u0712-\\u072f\\u074d-\\u07a5\\u07b1\\u07ca-\\u07ea\\u07f4\\u07f5\\u07fa\\u0800-\\u0815\\u081a\\u0824\\u0828\\u0840-\\u0858\\u08a0\\u08a2-\\u08ac\\u0904-\\u0939\\u093d\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097f\\u0985-\\u098c\\u098f\\u0990\\u0993-\\u09a8\\u09aa-\\u09b0\\u09b2\\u09b6-\\u09b9\\u09bd\\u09ce\\u09dc\\u09dd\\u09df-\\u09e1\\u09f0\\u09f1\\u0a05-\\u0a0a\\u0a0f\\u0a10\\u0a13-\\u0a28\\u0a2a-\\u0a30\\u0a32\\u0a33\\u0a35\\u0a36\\u0a38\\u0a39\\u0a59-\\u0a5c\\u0a5e\\u0a72-\\u0a74\\u0a85-\\u0a8d\\u0a8f-\\u0a91\\u0a93-\\u0aa8\\u0aaa-\\u0ab0\\u0ab2\\u0ab3\\u0ab5-\\u0ab9\\u0abd\\u0ad0\\u0ae0\\u0ae1\\u0b05-\\u0b0c\\u0b0f\\u0b10\\u0b13-\\u0b28\\u0b2a-\\u0b30\\u0b32\\u0b33\\u0b35-\\u0b39\\u0b3d\\u0b5c\\u0b5d\\u0b5f-\\u0b61\\u0b71\\u0b83\\u0b85-\\u0b8a\\u0b8e-\\u0b90\\u0b92-\\u0b95\\u0b99\\u0b9a\\u0b9c\\u0b9e\\u0b9f\\u0ba3\\u0ba4\\u0ba8-\\u0baa\\u0bae-\\u0bb9\\u0bd0\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c28\\u0c2a-\\u0c33\\u0c35-\\u0c39\\u0c3d\\u0c58\\u0c59\\u0c60\\u0c61\\u0c85-\\u0c8c\\u0c8e-\\u0c90\\u0c92-\\u0ca8\\u0caa-\\u0cb3\\u0cb5-\\u0cb9\\u0cbd\\u0cde\\u0ce0\\u0ce1\\u0cf1\\u0cf2\\u0d05-\\u0d0c\\u0d0e-\\u0d10\\u0d12-\\u0d3a\\u0d3d\\u0d4e\\u0d60\\u0d61\\u0d7a-\\u0d7f\\u0d85-\\u0d96\\u0d9a-\\u0db1\\u0db3-\\u0dbb\\u0dbd\\u0dc0-\\u0dc6\\u0e01-\\u0e30\\u0e32\\u0e33\\u0e40-\\u0e46\\u0e81\\u0e82\\u0e84\\u0e87\\u0e88\\u0e8a\\u0e8d\\u0e94-\\u0e97\\u0e99-\\u0e9f\\u0ea1-\\u0ea3\\u0ea5\\u0ea7\\u0eaa\\u0eab\\u0ead-\\u0eb0\\u0eb2\\u0eb3\\u0ebd\\u0ec0-\\u0ec4\\u0ec6\\u0edc-\\u0edf\\u0f00\\u0f40-\\u0f47\\u0f49-\\u0f6c\\u0f88-\\u0f8c\\u1000-\\u102a\\u103f\\u1050-\\u1055\\u105a-\\u105d\\u1061\\u1065\\u1066\\u106e-\\u1070\\u1075-\\u1081\\u108e\\u10a0-\\u10c5\\u10c7\\u10cd\\u10d0-\\u10fa\\u10fc-\\u1248\\u124a-\\u124d\\u1250-\\u1256\\u1258\\u125a-\\u125d\\u1260-\\u1288\\u128a-\\u128d\\u1290-\\u12b0\\u12b2-\\u12b5\\u12b8-\\u12be\\u12c0\\u12c2-\\u12c5\\u12c8-\\u12d6\\u12d8-\\u1310\\u1312-\\u1315\\u1318-\\u135a\\u1380-\\u138f\\u13a0-\\u13f4\\u1401-\\u166c\\u166f-\\u167f\\u1681-\\u169a\\u16a0-\\u16ea\\u16ee-\\u16f0\\u1700-\\u170c\\u170e-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176c\\u176e-\\u1770\\u1780-\\u17b3\\u17d7\\u17dc\\u1820-\\u1877\\u1880-\\u18a8\\u18aa\\u18b0-\\u18f5\\u1900-\\u191c\\u1950-\\u196d\\u1970-\\u1974\\u1980-\\u19ab\\u19c1-\\u19c7\\u1a00-\\u1a16\\u1a20-\\u1a54\\u1aa7\\u1b05-\\u1b33\\u1b45-\\u1b4b\\u1b83-\\u1ba0\\u1bae\\u1baf\\u1bba-\\u1be5\\u1c00-\\u1c23\\u1c4d-\\u1c4f\\u1c5a-\\u1c7d\\u1ce9-\\u1cec\\u1cee-\\u1cf1\\u1cf5\\u1cf6\\u1d00-\\u1dbf\\u1e00-\\u1f15\\u1f18-\\u1f1d\\u1f20-\\u1f45\\u1f48-\\u1f4d\\u1f50-\\u1f57\\u1f59\\u1f5b\\u1f5d\\u1f5f-\\u1f7d\\u1f80-\\u1fb4\\u1fb6-\\u1fbc\\u1fbe\\u1fc2-\\u1fc4\\u1fc6-\\u1fcc\\u1fd0-\\u1fd3\\u1fd6-\\u1fdb\\u1fe0-\\u1fec\\u1ff2-\\u1ff4\\u1ff6-\\u1ffc\\u2071\\u207f\\u2090-\\u209c\\u2102\\u2107\\u210a-\\u2113\\u2115\\u2119-\\u211d\\u2124\\u2126\\u2128\\u212a-\\u212d\\u212f-\\u2139\\u213c-\\u213f\\u2145-\\u2149\\u214e\\u2160-\\u2188\\u2c00-\\u2c2e\\u2c30-\\u2c5e\\u2c60-\\u2ce4\\u2ceb-\\u2cee\\u2cf2\\u2cf3\\u2d00-\\u2d25\\u2d27\\u2d2d\\u2d30-\\u2d67\\u2d6f\\u2d80-\\u2d96\\u2da0-\\u2da6\\u2da8-\\u2dae\\u2db0-\\u2db6\\u2db8-\\u2dbe\\u2dc0-\\u2dc6\\u2dc8-\\u2dce\\u2dd0-\\u2dd6\\u2dd8-\\u2dde\\u2e2f\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303c\\u3041-\\u3096\\u309d-\\u309f\\u30a1-\\u30fa\\u30fc-\\u30ff\\u3105-\\u312d\\u3131-\\u318e\\u31a0-\\u31ba\\u31f0-\\u31ff\\u3400-\\u4db5\\u4e00-\\u9fcc\\ua000-\\ua48c\\ua4d0-\\ua4fd\\ua500-\\ua60c\\ua610-\\ua61f\\ua62a\\ua62b\\ua640-\\ua66e\\ua67f-\\ua697\\ua6a0-\\ua6ef\\ua717-\\ua71f\\ua722-\\ua788\\ua78b-\\ua78e\\ua790-\\ua793\\ua7a0-\\ua7aa\\ua7f8-\\ua801\\ua803-\\ua805\\ua807-\\ua80a\\ua80c-\\ua822\\ua840-\\ua873\\ua882-\\ua8b3\\ua8f2-\\ua8f7\\ua8fb\\ua90a-\\ua925\\ua930-\\ua946\\ua960-\\ua97c\\ua984-\\ua9b2\\ua9cf\\uaa00-\\uaa28\\uaa40-\\uaa42\\uaa44-\\uaa4b\\uaa60-\\uaa76\\uaa7a\\uaa80-\\uaaaf\\uaab1\\uaab5\\uaab6\\uaab9-\\uaabd\\uaac0\\uaac2\\uaadb-\\uaadd\\uaae0-\\uaaea\\uaaf2-\\uaaf4\\uab01-\\uab06\\uab09-\\uab0e\\uab11-\\uab16\\uab20-\\uab26\\uab28-\\uab2e\\uabc0-\\uabe2\\uac00-\\ud7a3\\ud7b0-\\ud7c6\\ud7cb-\\ud7fb\\uf900-\\ufa6d\\ufa70-\\ufad9\\ufb00-\\ufb06\\ufb13-\\ufb17\\ufb1d\\ufb1f-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40\\ufb41\\ufb43\\ufb44\\ufb46-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb\\ufe70-\\ufe74\\ufe76-\\ufefc\\uff21-\\uff3a\\uff41-\\uff5a\\uff66-\\uffbe\\uffc2-\\uffc7\\uffca-\\uffcf\\uffd2-\\uffd7\\uffda-\\uffdc";
      var nonASCIIidentifierChars = "\\u0300-\\u036f\\u0483-\\u0487\\u0591-\\u05bd\\u05bf\\u05c1\\u05c2\\u05c4\\u05c5\\u05c7\\u0610-\\u061a\\u0620-\\u0649\\u0672-\\u06d3\\u06e7-\\u06e8\\u06fb-\\u06fc\\u0730-\\u074a\\u0800-\\u0814\\u081b-\\u0823\\u0825-\\u0827\\u0829-\\u082d\\u0840-\\u0857\\u08e4-\\u08fe\\u0900-\\u0903\\u093a-\\u093c\\u093e-\\u094f\\u0951-\\u0957\\u0962-\\u0963\\u0966-\\u096f\\u0981-\\u0983\\u09bc\\u09be-\\u09c4\\u09c7\\u09c8\\u09d7\\u09df-\\u09e0\\u0a01-\\u0a03\\u0a3c\\u0a3e-\\u0a42\\u0a47\\u0a48\\u0a4b-\\u0a4d\\u0a51\\u0a66-\\u0a71\\u0a75\\u0a81-\\u0a83\\u0abc\\u0abe-\\u0ac5\\u0ac7-\\u0ac9\\u0acb-\\u0acd\\u0ae2-\\u0ae3\\u0ae6-\\u0aef\\u0b01-\\u0b03\\u0b3c\\u0b3e-\\u0b44\\u0b47\\u0b48\\u0b4b-\\u0b4d\\u0b56\\u0b57\\u0b5f-\\u0b60\\u0b66-\\u0b6f\\u0b82\\u0bbe-\\u0bc2\\u0bc6-\\u0bc8\\u0bca-\\u0bcd\\u0bd7\\u0be6-\\u0bef\\u0c01-\\u0c03\\u0c46-\\u0c48\\u0c4a-\\u0c4d\\u0c55\\u0c56\\u0c62-\\u0c63\\u0c66-\\u0c6f\\u0c82\\u0c83\\u0cbc\\u0cbe-\\u0cc4\\u0cc6-\\u0cc8\\u0cca-\\u0ccd\\u0cd5\\u0cd6\\u0ce2-\\u0ce3\\u0ce6-\\u0cef\\u0d02\\u0d03\\u0d46-\\u0d48\\u0d57\\u0d62-\\u0d63\\u0d66-\\u0d6f\\u0d82\\u0d83\\u0dca\\u0dcf-\\u0dd4\\u0dd6\\u0dd8-\\u0ddf\\u0df2\\u0df3\\u0e34-\\u0e3a\\u0e40-\\u0e45\\u0e50-\\u0e59\\u0eb4-\\u0eb9\\u0ec8-\\u0ecd\\u0ed0-\\u0ed9\\u0f18\\u0f19\\u0f20-\\u0f29\\u0f35\\u0f37\\u0f39\\u0f41-\\u0f47\\u0f71-\\u0f84\\u0f86-\\u0f87\\u0f8d-\\u0f97\\u0f99-\\u0fbc\\u0fc6\\u1000-\\u1029\\u1040-\\u1049\\u1067-\\u106d\\u1071-\\u1074\\u1082-\\u108d\\u108f-\\u109d\\u135d-\\u135f\\u170e-\\u1710\\u1720-\\u1730\\u1740-\\u1750\\u1772\\u1773\\u1780-\\u17b2\\u17dd\\u17e0-\\u17e9\\u180b-\\u180d\\u1810-\\u1819\\u1920-\\u192b\\u1930-\\u193b\\u1951-\\u196d\\u19b0-\\u19c0\\u19c8-\\u19c9\\u19d0-\\u19d9\\u1a00-\\u1a15\\u1a20-\\u1a53\\u1a60-\\u1a7c\\u1a7f-\\u1a89\\u1a90-\\u1a99\\u1b46-\\u1b4b\\u1b50-\\u1b59\\u1b6b-\\u1b73\\u1bb0-\\u1bb9\\u1be6-\\u1bf3\\u1c00-\\u1c22\\u1c40-\\u1c49\\u1c5b-\\u1c7d\\u1cd0-\\u1cd2\\u1d00-\\u1dbe\\u1e01-\\u1f15\\u200c\\u200d\\u203f\\u2040\\u2054\\u20d0-\\u20dc\\u20e1\\u20e5-\\u20f0\\u2d81-\\u2d96\\u2de0-\\u2dff\\u3021-\\u3028\\u3099\\u309a\\ua640-\\ua66d\\ua674-\\ua67d\\ua69f\\ua6f0-\\ua6f1\\ua7f8-\\ua800\\ua806\\ua80b\\ua823-\\ua827\\ua880-\\ua881\\ua8b4-\\ua8c4\\ua8d0-\\ua8d9\\ua8f3-\\ua8f7\\ua900-\\ua909\\ua926-\\ua92d\\ua930-\\ua945\\ua980-\\ua983\\ua9b3-\\ua9c0\\uaa00-\\uaa27\\uaa40-\\uaa41\\uaa4c-\\uaa4d\\uaa50-\\uaa59\\uaa7b\\uaae0-\\uaae9\\uaaf2-\\uaaf3\\uabc0-\\uabe1\\uabec\\uabed\\uabf0-\\uabf9\\ufb20-\\ufb28\\ufe00-\\ufe0f\\ufe20-\\ufe26\\ufe33\\ufe34\\ufe4d-\\ufe4f\\uff10-\\uff19\\uff3f";
      var unicodeEscapeOrCodePoint = "\\\\u[0-9a-fA-F]{4}|\\\\u\\{[0-9a-fA-F]+\\}";
      var identifierStart = "(?:" + unicodeEscapeOrCodePoint + "|[" + baseASCIIidentifierStartChars + nonASCIIidentifierStartChars + "])";
      var identifierChars = "(?:" + unicodeEscapeOrCodePoint + "|[" + baseASCIIidentifierChars + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "])*";
      exports.identifier = new RegExp(identifierStart + identifierChars, "g");
      exports.identifierStart = new RegExp(identifierStart);
      exports.identifierMatch = new RegExp("(?:" + unicodeEscapeOrCodePoint + "|[" + baseASCIIidentifierChars + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "])+");
      exports.newline = /[\n\r\u2028\u2029]/;
      exports.lineBreak = new RegExp("\r\n|" + exports.newline.source);
      exports.allLineBreaks = new RegExp(exports.lineBreak.source, "g");
    }
  });

  // node_modules/js-beautify/js/src/core/options.js
  var require_options = __commonJS({
    "node_modules/js-beautify/js/src/core/options.js"(exports, module) {
      "use strict";
      function Options(options, merge_child_field) {
        this.raw_options = _mergeOpts(options, merge_child_field);
        this.disabled = this._get_boolean("disabled");
        this.eol = this._get_characters("eol", "auto");
        this.end_with_newline = this._get_boolean("end_with_newline");
        this.indent_size = this._get_number("indent_size", 4);
        this.indent_char = this._get_characters("indent_char", " ");
        this.indent_level = this._get_number("indent_level");
        this.preserve_newlines = this._get_boolean("preserve_newlines", true);
        this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786);
        if (!this.preserve_newlines) {
          this.max_preserve_newlines = 0;
        }
        this.indent_with_tabs = this._get_boolean("indent_with_tabs", this.indent_char === "	");
        if (this.indent_with_tabs) {
          this.indent_char = "	";
          if (this.indent_size === 1) {
            this.indent_size = 4;
          }
        }
        this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char"));
        this.indent_empty_lines = this._get_boolean("indent_empty_lines");
        this.templating = this._get_selection_list("templating", ["auto", "none", "angular", "django", "erb", "handlebars", "php", "smarty"], ["auto"]);
      }
      Options.prototype._get_array = function(name, default_value) {
        var option_value = this.raw_options[name];
        var result = default_value || [];
        if (typeof option_value === "object") {
          if (option_value !== null && typeof option_value.concat === "function") {
            result = option_value.concat();
          }
        } else if (typeof option_value === "string") {
          result = option_value.split(/[^a-zA-Z0-9_\/\-]+/);
        }
        return result;
      };
      Options.prototype._get_boolean = function(name, default_value) {
        var option_value = this.raw_options[name];
        var result = option_value === void 0 ? !!default_value : !!option_value;
        return result;
      };
      Options.prototype._get_characters = function(name, default_value) {
        var option_value = this.raw_options[name];
        var result = default_value || "";
        if (typeof option_value === "string") {
          result = option_value.replace(/\\r/, "\r").replace(/\\n/, "\n").replace(/\\t/, "	");
        }
        return result;
      };
      Options.prototype._get_number = function(name, default_value) {
        var option_value = this.raw_options[name];
        default_value = parseInt(default_value, 10);
        if (isNaN(default_value)) {
          default_value = 0;
        }
        var result = parseInt(option_value, 10);
        if (isNaN(result)) {
          result = default_value;
        }
        return result;
      };
      Options.prototype._get_selection = function(name, selection_list, default_value) {
        var result = this._get_selection_list(name, selection_list, default_value);
        if (result.length !== 1) {
          throw new Error(
            "Invalid Option Value: The option '" + name + "' can only be one of the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name] + "'"
          );
        }
        return result[0];
      };
      Options.prototype._get_selection_list = function(name, selection_list, default_value) {
        if (!selection_list || selection_list.length === 0) {
          throw new Error("Selection list cannot be empty.");
        }
        default_value = default_value || [selection_list[0]];
        if (!this._is_valid_selection(default_value, selection_list)) {
          throw new Error("Invalid Default Value!");
        }
        var result = this._get_array(name, default_value);
        if (!this._is_valid_selection(result, selection_list)) {
          throw new Error(
            "Invalid Option Value: The option '" + name + "' can contain only the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name] + "'"
          );
        }
        return result;
      };
      Options.prototype._is_valid_selection = function(result, selection_list) {
        return result.length && selection_list.length && !result.some(function(item) {
          return selection_list.indexOf(item) === -1;
        });
      };
      function _mergeOpts(allOptions, childFieldName) {
        var finalOpts = {};
        allOptions = _normalizeOpts(allOptions);
        var name;
        for (name in allOptions) {
          if (name !== childFieldName) {
            finalOpts[name] = allOptions[name];
          }
        }
        if (childFieldName && allOptions[childFieldName]) {
          for (name in allOptions[childFieldName]) {
            finalOpts[name] = allOptions[childFieldName][name];
          }
        }
        return finalOpts;
      }
      function _normalizeOpts(options) {
        var convertedOpts = {};
        var key;
        for (key in options) {
          var newKey = key.replace(/-/g, "_");
          convertedOpts[newKey] = options[key];
        }
        return convertedOpts;
      }
      module.exports.Options = Options;
      module.exports.normalizeOpts = _normalizeOpts;
      module.exports.mergeOpts = _mergeOpts;
    }
  });

  // node_modules/js-beautify/js/src/javascript/options.js
  var require_options2 = __commonJS({
    "node_modules/js-beautify/js/src/javascript/options.js"(exports, module) {
      "use strict";
      var BaseOptions = require_options().Options;
      var validPositionValues = ["before-newline", "after-newline", "preserve-newline"];
      function Options(options) {
        BaseOptions.call(this, options, "js");
        var raw_brace_style = this.raw_options.brace_style || null;
        if (raw_brace_style === "expand-strict") {
          this.raw_options.brace_style = "expand";
        } else if (raw_brace_style === "collapse-preserve-inline") {
          this.raw_options.brace_style = "collapse,preserve-inline";
        } else if (this.raw_options.braces_on_own_line !== void 0) {
          this.raw_options.brace_style = this.raw_options.braces_on_own_line ? "expand" : "collapse";
        }
        var brace_style_split = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
        this.brace_preserve_inline = false;
        this.brace_style = "collapse";
        for (var bs = 0; bs < brace_style_split.length; bs++) {
          if (brace_style_split[bs] === "preserve-inline") {
            this.brace_preserve_inline = true;
          } else {
            this.brace_style = brace_style_split[bs];
          }
        }
        this.unindent_chained_methods = this._get_boolean("unindent_chained_methods");
        this.break_chained_methods = this._get_boolean("break_chained_methods");
        this.space_in_paren = this._get_boolean("space_in_paren");
        this.space_in_empty_paren = this._get_boolean("space_in_empty_paren");
        this.jslint_happy = this._get_boolean("jslint_happy");
        this.space_after_anon_function = this._get_boolean("space_after_anon_function");
        this.space_after_named_function = this._get_boolean("space_after_named_function");
        this.keep_array_indentation = this._get_boolean("keep_array_indentation");
        this.space_before_conditional = this._get_boolean("space_before_conditional", true);
        this.unescape_strings = this._get_boolean("unescape_strings");
        this.e4x = this._get_boolean("e4x");
        this.comma_first = this._get_boolean("comma_first");
        this.operator_position = this._get_selection("operator_position", validPositionValues);
        this.test_output_raw = this._get_boolean("test_output_raw");
        if (this.jslint_happy) {
          this.space_after_anon_function = true;
        }
      }
      Options.prototype = new BaseOptions();
      module.exports.Options = Options;
    }
  });

  // node_modules/js-beautify/js/src/core/inputscanner.js
  var require_inputscanner = __commonJS({
    "node_modules/js-beautify/js/src/core/inputscanner.js"(exports, module) {
      "use strict";
      var regexp_has_sticky = RegExp.prototype.hasOwnProperty("sticky");
      function InputScanner(input_string) {
        this.__input = input_string || "";
        this.__input_length = this.__input.length;
        this.__position = 0;
      }
      InputScanner.prototype.restart = function() {
        this.__position = 0;
      };
      InputScanner.prototype.back = function() {
        if (this.__position > 0) {
          this.__position -= 1;
        }
      };
      InputScanner.prototype.hasNext = function() {
        return this.__position < this.__input_length;
      };
      InputScanner.prototype.next = function() {
        var val = null;
        if (this.hasNext()) {
          val = this.__input.charAt(this.__position);
          this.__position += 1;
        }
        return val;
      };
      InputScanner.prototype.peek = function(index) {
        var val = null;
        index = index || 0;
        index += this.__position;
        if (index >= 0 && index < this.__input_length) {
          val = this.__input.charAt(index);
        }
        return val;
      };
      InputScanner.prototype.__match = function(pattern, index) {
        pattern.lastIndex = index;
        var pattern_match = pattern.exec(this.__input);
        if (pattern_match && !(regexp_has_sticky && pattern.sticky)) {
          if (pattern_match.index !== index) {
            pattern_match = null;
          }
        }
        return pattern_match;
      };
      InputScanner.prototype.test = function(pattern, index) {
        index = index || 0;
        index += this.__position;
        if (index >= 0 && index < this.__input_length) {
          return !!this.__match(pattern, index);
        } else {
          return false;
        }
      };
      InputScanner.prototype.testChar = function(pattern, index) {
        var val = this.peek(index);
        pattern.lastIndex = 0;
        return val !== null && pattern.test(val);
      };
      InputScanner.prototype.match = function(pattern) {
        var pattern_match = this.__match(pattern, this.__position);
        if (pattern_match) {
          this.__position += pattern_match[0].length;
        } else {
          pattern_match = null;
        }
        return pattern_match;
      };
      InputScanner.prototype.read = function(starting_pattern, until_pattern, until_after) {
        var val = "";
        var match;
        if (starting_pattern) {
          match = this.match(starting_pattern);
          if (match) {
            val += match[0];
          }
        }
        if (until_pattern && (match || !starting_pattern)) {
          val += this.readUntil(until_pattern, until_after);
        }
        return val;
      };
      InputScanner.prototype.readUntil = function(pattern, until_after) {
        var val = "";
        var match_index = this.__position;
        pattern.lastIndex = this.__position;
        var pattern_match = pattern.exec(this.__input);
        if (pattern_match) {
          match_index = pattern_match.index;
          if (until_after) {
            match_index += pattern_match[0].length;
          }
        } else {
          match_index = this.__input_length;
        }
        val = this.__input.substring(this.__position, match_index);
        this.__position = match_index;
        return val;
      };
      InputScanner.prototype.readUntilAfter = function(pattern) {
        return this.readUntil(pattern, true);
      };
      InputScanner.prototype.get_regexp = function(pattern, match_from) {
        var result = null;
        var flags = "g";
        if (match_from && regexp_has_sticky) {
          flags = "y";
        }
        if (typeof pattern === "string" && pattern !== "") {
          result = new RegExp(pattern, flags);
        } else if (pattern) {
          result = new RegExp(pattern.source, flags);
        }
        return result;
      };
      InputScanner.prototype.get_literal_regexp = function(literal_string) {
        return RegExp(literal_string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
      };
      InputScanner.prototype.peekUntilAfter = function(pattern) {
        var start = this.__position;
        var val = this.readUntilAfter(pattern);
        this.__position = start;
        return val;
      };
      InputScanner.prototype.lookBack = function(testVal) {
        var start = this.__position - 1;
        return start >= testVal.length && this.__input.substring(start - testVal.length, start).toLowerCase() === testVal;
      };
      module.exports.InputScanner = InputScanner;
    }
  });

  // node_modules/js-beautify/js/src/core/tokenstream.js
  var require_tokenstream = __commonJS({
    "node_modules/js-beautify/js/src/core/tokenstream.js"(exports, module) {
      "use strict";
      function TokenStream(parent_token) {
        this.__tokens = [];
        this.__tokens_length = this.__tokens.length;
        this.__position = 0;
        this.__parent_token = parent_token;
      }
      TokenStream.prototype.restart = function() {
        this.__position = 0;
      };
      TokenStream.prototype.isEmpty = function() {
        return this.__tokens_length === 0;
      };
      TokenStream.prototype.hasNext = function() {
        return this.__position < this.__tokens_length;
      };
      TokenStream.prototype.next = function() {
        var val = null;
        if (this.hasNext()) {
          val = this.__tokens[this.__position];
          this.__position += 1;
        }
        return val;
      };
      TokenStream.prototype.peek = function(index) {
        var val = null;
        index = index || 0;
        index += this.__position;
        if (index >= 0 && index < this.__tokens_length) {
          val = this.__tokens[index];
        }
        return val;
      };
      TokenStream.prototype.add = function(token) {
        if (this.__parent_token) {
          token.parent = this.__parent_token;
        }
        this.__tokens.push(token);
        this.__tokens_length += 1;
      };
      module.exports.TokenStream = TokenStream;
    }
  });

  // node_modules/js-beautify/js/src/core/pattern.js
  var require_pattern = __commonJS({
    "node_modules/js-beautify/js/src/core/pattern.js"(exports, module) {
      "use strict";
      function Pattern(input_scanner, parent) {
        this._input = input_scanner;
        this._starting_pattern = null;
        this._match_pattern = null;
        this._until_pattern = null;
        this._until_after = false;
        if (parent) {
          this._starting_pattern = this._input.get_regexp(parent._starting_pattern, true);
          this._match_pattern = this._input.get_regexp(parent._match_pattern, true);
          this._until_pattern = this._input.get_regexp(parent._until_pattern);
          this._until_after = parent._until_after;
        }
      }
      Pattern.prototype.read = function() {
        var result = this._input.read(this._starting_pattern);
        if (!this._starting_pattern || result) {
          result += this._input.read(this._match_pattern, this._until_pattern, this._until_after);
        }
        return result;
      };
      Pattern.prototype.read_match = function() {
        return this._input.match(this._match_pattern);
      };
      Pattern.prototype.until_after = function(pattern) {
        var result = this._create();
        result._until_after = true;
        result._until_pattern = this._input.get_regexp(pattern);
        result._update();
        return result;
      };
      Pattern.prototype.until = function(pattern) {
        var result = this._create();
        result._until_after = false;
        result._until_pattern = this._input.get_regexp(pattern);
        result._update();
        return result;
      };
      Pattern.prototype.starting_with = function(pattern) {
        var result = this._create();
        result._starting_pattern = this._input.get_regexp(pattern, true);
        result._update();
        return result;
      };
      Pattern.prototype.matching = function(pattern) {
        var result = this._create();
        result._match_pattern = this._input.get_regexp(pattern, true);
        result._update();
        return result;
      };
      Pattern.prototype._create = function() {
        return new Pattern(this._input, this);
      };
      Pattern.prototype._update = function() {
      };
      module.exports.Pattern = Pattern;
    }
  });

  // node_modules/js-beautify/js/src/core/whitespacepattern.js
  var require_whitespacepattern = __commonJS({
    "node_modules/js-beautify/js/src/core/whitespacepattern.js"(exports, module) {
      "use strict";
      var Pattern = require_pattern().Pattern;
      function WhitespacePattern(input_scanner, parent) {
        Pattern.call(this, input_scanner, parent);
        if (parent) {
          this._line_regexp = this._input.get_regexp(parent._line_regexp);
        } else {
          this.__set_whitespace_patterns("", "");
        }
        this.newline_count = 0;
        this.whitespace_before_token = "";
      }
      WhitespacePattern.prototype = new Pattern();
      WhitespacePattern.prototype.__set_whitespace_patterns = function(whitespace_chars, newline_chars) {
        whitespace_chars += "\\t ";
        newline_chars += "\\n\\r";
        this._match_pattern = this._input.get_regexp(
          "[" + whitespace_chars + newline_chars + "]+",
          true
        );
        this._newline_regexp = this._input.get_regexp(
          "\\r\\n|[" + newline_chars + "]"
        );
      };
      WhitespacePattern.prototype.read = function() {
        this.newline_count = 0;
        this.whitespace_before_token = "";
        var resulting_string = this._input.read(this._match_pattern);
        if (resulting_string === " ") {
          this.whitespace_before_token = " ";
        } else if (resulting_string) {
          var matches = this.__split(this._newline_regexp, resulting_string);
          this.newline_count = matches.length - 1;
          this.whitespace_before_token = matches[this.newline_count];
        }
        return resulting_string;
      };
      WhitespacePattern.prototype.matching = function(whitespace_chars, newline_chars) {
        var result = this._create();
        result.__set_whitespace_patterns(whitespace_chars, newline_chars);
        result._update();
        return result;
      };
      WhitespacePattern.prototype._create = function() {
        return new WhitespacePattern(this._input, this);
      };
      WhitespacePattern.prototype.__split = function(regexp, input_string) {
        regexp.lastIndex = 0;
        var start_index = 0;
        var result = [];
        var next_match = regexp.exec(input_string);
        while (next_match) {
          result.push(input_string.substring(start_index, next_match.index));
          start_index = next_match.index + next_match[0].length;
          next_match = regexp.exec(input_string);
        }
        if (start_index < input_string.length) {
          result.push(input_string.substring(start_index, input_string.length));
        } else {
          result.push("");
        }
        return result;
      };
      module.exports.WhitespacePattern = WhitespacePattern;
    }
  });

  // node_modules/js-beautify/js/src/core/tokenizer.js
  var require_tokenizer = __commonJS({
    "node_modules/js-beautify/js/src/core/tokenizer.js"(exports, module) {
      "use strict";
      var InputScanner = require_inputscanner().InputScanner;
      var Token = require_token().Token;
      var TokenStream = require_tokenstream().TokenStream;
      var WhitespacePattern = require_whitespacepattern().WhitespacePattern;
      var TOKEN = {
        START: "TK_START",
        RAW: "TK_RAW",
        EOF: "TK_EOF"
      };
      var Tokenizer = function(input_string, options) {
        this._input = new InputScanner(input_string);
        this._options = options || {};
        this.__tokens = null;
        this._patterns = {};
        this._patterns.whitespace = new WhitespacePattern(this._input);
      };
      Tokenizer.prototype.tokenize = function() {
        this._input.restart();
        this.__tokens = new TokenStream();
        this._reset();
        var current;
        var previous = new Token(TOKEN.START, "");
        var open_token = null;
        var open_stack = [];
        var comments = new TokenStream();
        while (previous.type !== TOKEN.EOF) {
          current = this._get_next_token(previous, open_token);
          while (this._is_comment(current)) {
            comments.add(current);
            current = this._get_next_token(previous, open_token);
          }
          if (!comments.isEmpty()) {
            current.comments_before = comments;
            comments = new TokenStream();
          }
          current.parent = open_token;
          if (this._is_opening(current)) {
            open_stack.push(open_token);
            open_token = current;
          } else if (open_token && this._is_closing(current, open_token)) {
            current.opened = open_token;
            open_token.closed = current;
            open_token = open_stack.pop();
            current.parent = open_token;
          }
          current.previous = previous;
          previous.next = current;
          this.__tokens.add(current);
          previous = current;
        }
        return this.__tokens;
      };
      Tokenizer.prototype._is_first_token = function() {
        return this.__tokens.isEmpty();
      };
      Tokenizer.prototype._reset = function() {
      };
      Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
        this._readWhitespace();
        var resulting_string = this._input.read(/.+/g);
        if (resulting_string) {
          return this._create_token(TOKEN.RAW, resulting_string);
        } else {
          return this._create_token(TOKEN.EOF, "");
        }
      };
      Tokenizer.prototype._is_comment = function(current_token) {
        return false;
      };
      Tokenizer.prototype._is_opening = function(current_token) {
        return false;
      };
      Tokenizer.prototype._is_closing = function(current_token, open_token) {
        return false;
      };
      Tokenizer.prototype._create_token = function(type, text) {
        var token = new Token(
          type,
          text,
          this._patterns.whitespace.newline_count,
          this._patterns.whitespace.whitespace_before_token
        );
        return token;
      };
      Tokenizer.prototype._readWhitespace = function() {
        return this._patterns.whitespace.read();
      };
      module.exports.Tokenizer = Tokenizer;
      module.exports.TOKEN = TOKEN;
    }
  });

  // node_modules/js-beautify/js/src/core/directives.js
  var require_directives = __commonJS({
    "node_modules/js-beautify/js/src/core/directives.js"(exports, module) {
      "use strict";
      function Directives(start_block_pattern, end_block_pattern) {
        start_block_pattern = typeof start_block_pattern === "string" ? start_block_pattern : start_block_pattern.source;
        end_block_pattern = typeof end_block_pattern === "string" ? end_block_pattern : end_block_pattern.source;
        this.__directives_block_pattern = new RegExp(start_block_pattern + / beautify( \w+[:]\w+)+ /.source + end_block_pattern, "g");
        this.__directive_pattern = / (\w+)[:](\w+)/g;
        this.__directives_end_ignore_pattern = new RegExp(start_block_pattern + /\sbeautify\signore:end\s/.source + end_block_pattern, "g");
      }
      Directives.prototype.get_directives = function(text) {
        if (!text.match(this.__directives_block_pattern)) {
          return null;
        }
        var directives = {};
        this.__directive_pattern.lastIndex = 0;
        var directive_match = this.__directive_pattern.exec(text);
        while (directive_match) {
          directives[directive_match[1]] = directive_match[2];
          directive_match = this.__directive_pattern.exec(text);
        }
        return directives;
      };
      Directives.prototype.readIgnored = function(input) {
        return input.readUntilAfter(this.__directives_end_ignore_pattern);
      };
      module.exports.Directives = Directives;
    }
  });

  // node_modules/js-beautify/js/src/core/templatablepattern.js
  var require_templatablepattern = __commonJS({
    "node_modules/js-beautify/js/src/core/templatablepattern.js"(exports, module) {
      "use strict";
      var Pattern = require_pattern().Pattern;
      var template_names = {
        django: false,
        erb: false,
        handlebars: false,
        php: false,
        smarty: false,
        angular: false
      };
      function TemplatablePattern(input_scanner, parent) {
        Pattern.call(this, input_scanner, parent);
        this.__template_pattern = null;
        this._disabled = Object.assign({}, template_names);
        this._excluded = Object.assign({}, template_names);
        if (parent) {
          this.__template_pattern = this._input.get_regexp(parent.__template_pattern);
          this._excluded = Object.assign(this._excluded, parent._excluded);
          this._disabled = Object.assign(this._disabled, parent._disabled);
        }
        var pattern = new Pattern(input_scanner);
        this.__patterns = {
          handlebars_comment: pattern.starting_with(/{{!--/).until_after(/--}}/),
          handlebars_unescaped: pattern.starting_with(/{{{/).until_after(/}}}/),
          handlebars: pattern.starting_with(/{{/).until_after(/}}/),
          php: pattern.starting_with(/<\?(?:[= ]|php)/).until_after(/\?>/),
          erb: pattern.starting_with(/<%[^%]/).until_after(/[^%]%>/),
          // django coflicts with handlebars a bit.
          django: pattern.starting_with(/{%/).until_after(/%}/),
          django_value: pattern.starting_with(/{{/).until_after(/}}/),
          django_comment: pattern.starting_with(/{#/).until_after(/#}/),
          smarty: pattern.starting_with(/{(?=[^}{\s\n])/).until_after(/[^\s\n]}/),
          smarty_comment: pattern.starting_with(/{\*/).until_after(/\*}/),
          smarty_literal: pattern.starting_with(/{literal}/).until_after(/{\/literal}/)
        };
      }
      TemplatablePattern.prototype = new Pattern();
      TemplatablePattern.prototype._create = function() {
        return new TemplatablePattern(this._input, this);
      };
      TemplatablePattern.prototype._update = function() {
        this.__set_templated_pattern();
      };
      TemplatablePattern.prototype.disable = function(language) {
        var result = this._create();
        result._disabled[language] = true;
        result._update();
        return result;
      };
      TemplatablePattern.prototype.read_options = function(options) {
        var result = this._create();
        for (var language in template_names) {
          result._disabled[language] = options.templating.indexOf(language) === -1;
        }
        result._update();
        return result;
      };
      TemplatablePattern.prototype.exclude = function(language) {
        var result = this._create();
        result._excluded[language] = true;
        result._update();
        return result;
      };
      TemplatablePattern.prototype.read = function() {
        var result = "";
        if (this._match_pattern) {
          result = this._input.read(this._starting_pattern);
        } else {
          result = this._input.read(this._starting_pattern, this.__template_pattern);
        }
        var next = this._read_template();
        while (next) {
          if (this._match_pattern) {
            next += this._input.read(this._match_pattern);
          } else {
            next += this._input.readUntil(this.__template_pattern);
          }
          result += next;
          next = this._read_template();
        }
        if (this._until_after) {
          result += this._input.readUntilAfter(this._until_pattern);
        }
        return result;
      };
      TemplatablePattern.prototype.__set_templated_pattern = function() {
        var items = [];
        if (!this._disabled.php) {
          items.push(this.__patterns.php._starting_pattern.source);
        }
        if (!this._disabled.handlebars) {
          items.push(this.__patterns.handlebars._starting_pattern.source);
        }
        if (!this._disabled.angular) {
          items.push(this.__patterns.handlebars._starting_pattern.source);
        }
        if (!this._disabled.erb) {
          items.push(this.__patterns.erb._starting_pattern.source);
        }
        if (!this._disabled.django) {
          items.push(this.__patterns.django._starting_pattern.source);
          items.push(this.__patterns.django_value._starting_pattern.source);
          items.push(this.__patterns.django_comment._starting_pattern.source);
        }
        if (!this._disabled.smarty) {
          items.push(this.__patterns.smarty._starting_pattern.source);
        }
        if (this._until_pattern) {
          items.push(this._until_pattern.source);
        }
        this.__template_pattern = this._input.get_regexp("(?:" + items.join("|") + ")");
      };
      TemplatablePattern.prototype._read_template = function() {
        var resulting_string = "";
        var c = this._input.peek();
        if (c === "<") {
          var peek1 = this._input.peek(1);
          if (!this._disabled.php && !this._excluded.php && peek1 === "?") {
            resulting_string = resulting_string || this.__patterns.php.read();
          }
          if (!this._disabled.erb && !this._excluded.erb && peek1 === "%") {
            resulting_string = resulting_string || this.__patterns.erb.read();
          }
        } else if (c === "{") {
          if (!this._disabled.handlebars && !this._excluded.handlebars) {
            resulting_string = resulting_string || this.__patterns.handlebars_comment.read();
            resulting_string = resulting_string || this.__patterns.handlebars_unescaped.read();
            resulting_string = resulting_string || this.__patterns.handlebars.read();
          }
          if (!this._disabled.django) {
            if (!this._excluded.django && !this._excluded.handlebars) {
              resulting_string = resulting_string || this.__patterns.django_value.read();
            }
            if (!this._excluded.django) {
              resulting_string = resulting_string || this.__patterns.django_comment.read();
              resulting_string = resulting_string || this.__patterns.django.read();
            }
          }
          if (!this._disabled.smarty) {
            if (this._disabled.django && this._disabled.handlebars) {
              resulting_string = resulting_string || this.__patterns.smarty_comment.read();
              resulting_string = resulting_string || this.__patterns.smarty_literal.read();
              resulting_string = resulting_string || this.__patterns.smarty.read();
            }
          }
        }
        return resulting_string;
      };
      module.exports.TemplatablePattern = TemplatablePattern;
    }
  });

  // node_modules/js-beautify/js/src/javascript/tokenizer.js
  var require_tokenizer2 = __commonJS({
    "node_modules/js-beautify/js/src/javascript/tokenizer.js"(exports, module) {
      "use strict";
      var InputScanner = require_inputscanner().InputScanner;
      var BaseTokenizer = require_tokenizer().Tokenizer;
      var BASETOKEN = require_tokenizer().TOKEN;
      var Directives = require_directives().Directives;
      var acorn = require_acorn();
      var Pattern = require_pattern().Pattern;
      var TemplatablePattern = require_templatablepattern().TemplatablePattern;
      function in_array(what, arr) {
        return arr.indexOf(what) !== -1;
      }
      var TOKEN = {
        START_EXPR: "TK_START_EXPR",
        END_EXPR: "TK_END_EXPR",
        START_BLOCK: "TK_START_BLOCK",
        END_BLOCK: "TK_END_BLOCK",
        WORD: "TK_WORD",
        RESERVED: "TK_RESERVED",
        SEMICOLON: "TK_SEMICOLON",
        STRING: "TK_STRING",
        EQUALS: "TK_EQUALS",
        OPERATOR: "TK_OPERATOR",
        COMMA: "TK_COMMA",
        BLOCK_COMMENT: "TK_BLOCK_COMMENT",
        COMMENT: "TK_COMMENT",
        DOT: "TK_DOT",
        UNKNOWN: "TK_UNKNOWN",
        START: BASETOKEN.START,
        RAW: BASETOKEN.RAW,
        EOF: BASETOKEN.EOF
      };
      var directives_core = new Directives(/\/\*/, /\*\//);
      var number_pattern = /0[xX][0123456789abcdefABCDEF_]*n?|0[oO][01234567_]*n?|0[bB][01_]*n?|\d[\d_]*n|(?:\.\d[\d_]*|\d[\d_]*\.?[\d_]*)(?:[eE][+-]?[\d_]+)?/;
      var digit = /[0-9]/;
      var dot_pattern = /[^\d\.]/;
      var positionable_operators = ">>> === !== &&= ??= ||= << && >= ** != == <= >> || ?? |> < / - + > : & % ? ^ | *".split(" ");
      var punct = ">>>= ... >>= <<= === >>> !== **= &&= ??= ||= => ^= :: /= << <= == && -= >= >> != -- += ** || ?? ++ %= &= *= |= |> = ! ? > < : / ^ - + * & % ~ |";
      punct = punct.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
      punct = "\\?\\.(?!\\d) " + punct;
      punct = punct.replace(/ /g, "|");
      var punct_pattern = new RegExp(punct);
      var line_starters = "continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,import,export".split(",");
      var reserved_words = line_starters.concat(["do", "in", "of", "else", "get", "set", "new", "catch", "finally", "typeof", "yield", "async", "await", "from", "as", "class", "extends"]);
      var reserved_word_pattern = new RegExp("^(?:" + reserved_words.join("|") + ")$");
      var in_html_comment;
      var Tokenizer = function(input_string, options) {
        BaseTokenizer.call(this, input_string, options);
        this._patterns.whitespace = this._patterns.whitespace.matching(
          /\u00A0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff/.source,
          /\u2028\u2029/.source
        );
        var pattern_reader = new Pattern(this._input);
        var templatable = new TemplatablePattern(this._input).read_options(this._options);
        this.__patterns = {
          template: templatable,
          identifier: templatable.starting_with(acorn.identifier).matching(acorn.identifierMatch),
          number: pattern_reader.matching(number_pattern),
          punct: pattern_reader.matching(punct_pattern),
          // comment ends just before nearest linefeed or end of file
          comment: pattern_reader.starting_with(/\/\//).until(/[\n\r\u2028\u2029]/),
          //  /* ... */ comment ends with nearest */ or end of file
          block_comment: pattern_reader.starting_with(/\/\*/).until_after(/\*\//),
          html_comment_start: pattern_reader.matching(/<!--/),
          html_comment_end: pattern_reader.matching(/-->/),
          include: pattern_reader.starting_with(/#include/).until_after(acorn.lineBreak),
          shebang: pattern_reader.starting_with(/#!/).until_after(acorn.lineBreak),
          xml: pattern_reader.matching(/[\s\S]*?<(\/?)([-a-zA-Z:0-9_.]+|{[^}]+?}|!\[CDATA\[[^\]]*?\]\]|)(\s*{[^}]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{([^{}]|{[^}]+?})+?}))*\s*(\/?)\s*>/),
          single_quote: templatable.until(/['\\\n\r\u2028\u2029]/),
          double_quote: templatable.until(/["\\\n\r\u2028\u2029]/),
          template_text: templatable.until(/[`\\$]/),
          template_expression: templatable.until(/[`}\\]/)
        };
      };
      Tokenizer.prototype = new BaseTokenizer();
      Tokenizer.prototype._is_comment = function(current_token) {
        return current_token.type === TOKEN.COMMENT || current_token.type === TOKEN.BLOCK_COMMENT || current_token.type === TOKEN.UNKNOWN;
      };
      Tokenizer.prototype._is_opening = function(current_token) {
        return current_token.type === TOKEN.START_BLOCK || current_token.type === TOKEN.START_EXPR;
      };
      Tokenizer.prototype._is_closing = function(current_token, open_token) {
        return (current_token.type === TOKEN.END_BLOCK || current_token.type === TOKEN.END_EXPR) && (open_token && (current_token.text === "]" && open_token.text === "[" || current_token.text === ")" && open_token.text === "(" || current_token.text === "}" && open_token.text === "{"));
      };
      Tokenizer.prototype._reset = function() {
        in_html_comment = false;
      };
      Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
        var token = null;
        this._readWhitespace();
        var c = this._input.peek();
        if (c === null) {
          return this._create_token(TOKEN.EOF, "");
        }
        token = token || this._read_non_javascript(c);
        token = token || this._read_string(c);
        token = token || this._read_pair(c, this._input.peek(1));
        token = token || this._read_word(previous_token);
        token = token || this._read_singles(c);
        token = token || this._read_comment(c);
        token = token || this._read_regexp(c, previous_token);
        token = token || this._read_xml(c, previous_token);
        token = token || this._read_punctuation();
        token = token || this._create_token(TOKEN.UNKNOWN, this._input.next());
        return token;
      };
      Tokenizer.prototype._read_word = function(previous_token) {
        var resulting_string;
        resulting_string = this.__patterns.identifier.read();
        if (resulting_string !== "") {
          resulting_string = resulting_string.replace(acorn.allLineBreaks, "\n");
          if (!(previous_token.type === TOKEN.DOT || previous_token.type === TOKEN.RESERVED && (previous_token.text === "set" || previous_token.text === "get")) && reserved_word_pattern.test(resulting_string)) {
            if ((resulting_string === "in" || resulting_string === "of") && (previous_token.type === TOKEN.WORD || previous_token.type === TOKEN.STRING)) {
              return this._create_token(TOKEN.OPERATOR, resulting_string);
            }
            return this._create_token(TOKEN.RESERVED, resulting_string);
          }
          return this._create_token(TOKEN.WORD, resulting_string);
        }
        resulting_string = this.__patterns.number.read();
        if (resulting_string !== "") {
          return this._create_token(TOKEN.WORD, resulting_string);
        }
      };
      Tokenizer.prototype._read_singles = function(c) {
        var token = null;
        if (c === "(" || c === "[") {
          token = this._create_token(TOKEN.START_EXPR, c);
        } else if (c === ")" || c === "]") {
          token = this._create_token(TOKEN.END_EXPR, c);
        } else if (c === "{") {
          token = this._create_token(TOKEN.START_BLOCK, c);
        } else if (c === "}") {
          token = this._create_token(TOKEN.END_BLOCK, c);
        } else if (c === ";") {
          token = this._create_token(TOKEN.SEMICOLON, c);
        } else if (c === "." && dot_pattern.test(this._input.peek(1))) {
          token = this._create_token(TOKEN.DOT, c);
        } else if (c === ",") {
          token = this._create_token(TOKEN.COMMA, c);
        }
        if (token) {
          this._input.next();
        }
        return token;
      };
      Tokenizer.prototype._read_pair = function(c, d) {
        var token = null;
        if (c === "#" && d === "{") {
          token = this._create_token(TOKEN.START_BLOCK, c + d);
        }
        if (token) {
          this._input.next();
          this._input.next();
        }
        return token;
      };
      Tokenizer.prototype._read_punctuation = function() {
        var resulting_string = this.__patterns.punct.read();
        if (resulting_string !== "") {
          if (resulting_string === "=") {
            return this._create_token(TOKEN.EQUALS, resulting_string);
          } else if (resulting_string === "?.") {
            return this._create_token(TOKEN.DOT, resulting_string);
          } else {
            return this._create_token(TOKEN.OPERATOR, resulting_string);
          }
        }
      };
      Tokenizer.prototype._read_non_javascript = function(c) {
        var resulting_string = "";
        if (c === "#") {
          if (this._is_first_token()) {
            resulting_string = this.__patterns.shebang.read();
            if (resulting_string) {
              return this._create_token(TOKEN.UNKNOWN, resulting_string.trim() + "\n");
            }
          }
          resulting_string = this.__patterns.include.read();
          if (resulting_string) {
            return this._create_token(TOKEN.UNKNOWN, resulting_string.trim() + "\n");
          }
          c = this._input.next();
          var sharp = "#";
          if (this._input.hasNext() && this._input.testChar(digit)) {
            do {
              c = this._input.next();
              sharp += c;
            } while (this._input.hasNext() && c !== "#" && c !== "=");
            if (c === "#") {
            } else if (this._input.peek() === "[" && this._input.peek(1) === "]") {
              sharp += "[]";
              this._input.next();
              this._input.next();
            } else if (this._input.peek() === "{" && this._input.peek(1) === "}") {
              sharp += "{}";
              this._input.next();
              this._input.next();
            }
            return this._create_token(TOKEN.WORD, sharp);
          }
          this._input.back();
        } else if (c === "<" && this._is_first_token()) {
          resulting_string = this.__patterns.html_comment_start.read();
          if (resulting_string) {
            while (this._input.hasNext() && !this._input.testChar(acorn.newline)) {
              resulting_string += this._input.next();
            }
            in_html_comment = true;
            return this._create_token(TOKEN.COMMENT, resulting_string);
          }
        } else if (in_html_comment && c === "-") {
          resulting_string = this.__patterns.html_comment_end.read();
          if (resulting_string) {
            in_html_comment = false;
            return this._create_token(TOKEN.COMMENT, resulting_string);
          }
        }
        return null;
      };
      Tokenizer.prototype._read_comment = function(c) {
        var token = null;
        if (c === "/") {
          var comment = "";
          if (this._input.peek(1) === "*") {
            comment = this.__patterns.block_comment.read();
            var directives = directives_core.get_directives(comment);
            if (directives && directives.ignore === "start") {
              comment += directives_core.readIgnored(this._input);
            }
            comment = comment.replace(acorn.allLineBreaks, "\n");
            token = this._create_token(TOKEN.BLOCK_COMMENT, comment);
            token.directives = directives;
          } else if (this._input.peek(1) === "/") {
            comment = this.__patterns.comment.read();
            token = this._create_token(TOKEN.COMMENT, comment);
          }
        }
        return token;
      };
      Tokenizer.prototype._read_string = function(c) {
        if (c === "`" || c === "'" || c === '"') {
          var resulting_string = this._input.next();
          this.has_char_escapes = false;
          if (c === "`") {
            resulting_string += this._read_string_recursive("`", true, "${");
          } else {
            resulting_string += this._read_string_recursive(c);
          }
          if (this.has_char_escapes && this._options.unescape_strings) {
            resulting_string = unescape_string(resulting_string);
          }
          if (this._input.peek() === c) {
            resulting_string += this._input.next();
          }
          resulting_string = resulting_string.replace(acorn.allLineBreaks, "\n");
          return this._create_token(TOKEN.STRING, resulting_string);
        }
        return null;
      };
      Tokenizer.prototype._allow_regexp_or_xml = function(previous_token) {
        return previous_token.type === TOKEN.RESERVED && in_array(previous_token.text, ["return", "case", "throw", "else", "do", "typeof", "yield"]) || previous_token.type === TOKEN.END_EXPR && previous_token.text === ")" && previous_token.opened.previous.type === TOKEN.RESERVED && in_array(previous_token.opened.previous.text, ["if", "while", "for"]) || in_array(previous_token.type, [
          TOKEN.COMMENT,
          TOKEN.START_EXPR,
          TOKEN.START_BLOCK,
          TOKEN.START,
          TOKEN.END_BLOCK,
          TOKEN.OPERATOR,
          TOKEN.EQUALS,
          TOKEN.EOF,
          TOKEN.SEMICOLON,
          TOKEN.COMMA
        ]);
      };
      Tokenizer.prototype._read_regexp = function(c, previous_token) {
        if (c === "/" && this._allow_regexp_or_xml(previous_token)) {
          var resulting_string = this._input.next();
          var esc = false;
          var in_char_class = false;
          while (this._input.hasNext() && ((esc || in_char_class || this._input.peek() !== c) && !this._input.testChar(acorn.newline))) {
            resulting_string += this._input.peek();
            if (!esc) {
              esc = this._input.peek() === "\\";
              if (this._input.peek() === "[") {
                in_char_class = true;
              } else if (this._input.peek() === "]") {
                in_char_class = false;
              }
            } else {
              esc = false;
            }
            this._input.next();
          }
          if (this._input.peek() === c) {
            resulting_string += this._input.next();
            resulting_string += this._input.read(acorn.identifier);
          }
          return this._create_token(TOKEN.STRING, resulting_string);
        }
        return null;
      };
      Tokenizer.prototype._read_xml = function(c, previous_token) {
        if (this._options.e4x && c === "<" && this._allow_regexp_or_xml(previous_token)) {
          var xmlStr = "";
          var match = this.__patterns.xml.read_match();
          if (match) {
            var rootTag = match[2].replace(/^{\s+/, "{").replace(/\s+}$/, "}");
            var isCurlyRoot = rootTag.indexOf("{") === 0;
            var depth = 0;
            while (match) {
              var isEndTag = !!match[1];
              var tagName = match[2];
              var isSingletonTag = !!match[match.length - 1] || tagName.slice(0, 8) === "![CDATA[";
              if (!isSingletonTag && (tagName === rootTag || isCurlyRoot && tagName.replace(/^{\s+/, "{").replace(/\s+}$/, "}"))) {
                if (isEndTag) {
                  --depth;
                } else {
                  ++depth;
                }
              }
              xmlStr += match[0];
              if (depth <= 0) {
                break;
              }
              match = this.__patterns.xml.read_match();
            }
            if (!match) {
              xmlStr += this._input.match(/[\s\S]*/g)[0];
            }
            xmlStr = xmlStr.replace(acorn.allLineBreaks, "\n");
            return this._create_token(TOKEN.STRING, xmlStr);
          }
        }
        return null;
      };
      function unescape_string(s) {
        var out = "", escaped = 0;
        var input_scan = new InputScanner(s);
        var matched = null;
        while (input_scan.hasNext()) {
          matched = input_scan.match(/([\s]|[^\\]|\\\\)+/g);
          if (matched) {
            out += matched[0];
          }
          if (input_scan.peek() === "\\") {
            input_scan.next();
            if (input_scan.peek() === "x") {
              matched = input_scan.match(/x([0-9A-Fa-f]{2})/g);
            } else if (input_scan.peek() === "u") {
              matched = input_scan.match(/u([0-9A-Fa-f]{4})/g);
              if (!matched) {
                matched = input_scan.match(/u\{([0-9A-Fa-f]+)\}/g);
              }
            } else {
              out += "\\";
              if (input_scan.hasNext()) {
                out += input_scan.next();
              }
              continue;
            }
            if (!matched) {
              return s;
            }
            escaped = parseInt(matched[1], 16);
            if (escaped > 126 && escaped <= 255 && matched[0].indexOf("x") === 0) {
              return s;
            } else if (escaped >= 0 && escaped < 32) {
              out += "\\" + matched[0];
            } else if (escaped > 1114111) {
              out += "\\" + matched[0];
            } else if (escaped === 34 || escaped === 39 || escaped === 92) {
              out += "\\" + String.fromCharCode(escaped);
            } else {
              out += String.fromCharCode(escaped);
            }
          }
        }
        return out;
      }
      Tokenizer.prototype._read_string_recursive = function(delimiter, allow_unescaped_newlines, start_sub) {
        var current_char;
        var pattern;
        if (delimiter === "'") {
          pattern = this.__patterns.single_quote;
        } else if (delimiter === '"') {
          pattern = this.__patterns.double_quote;
        } else if (delimiter === "`") {
          pattern = this.__patterns.template_text;
        } else if (delimiter === "}") {
          pattern = this.__patterns.template_expression;
        }
        var resulting_string = pattern.read();
        var next = "";
        while (this._input.hasNext()) {
          next = this._input.next();
          if (next === delimiter || !allow_unescaped_newlines && acorn.newline.test(next)) {
            this._input.back();
            break;
          } else if (next === "\\" && this._input.hasNext()) {
            current_char = this._input.peek();
            if (current_char === "x" || current_char === "u") {
              this.has_char_escapes = true;
            } else if (current_char === "\r" && this._input.peek(1) === "\n") {
              this._input.next();
            }
            next += this._input.next();
          } else if (start_sub) {
            if (start_sub === "${" && next === "$" && this._input.peek() === "{") {
              next += this._input.next();
            }
            if (start_sub === next) {
              if (delimiter === "`") {
                next += this._read_string_recursive("}", allow_unescaped_newlines, "`");
              } else {
                next += this._read_string_recursive("`", allow_unescaped_newlines, "${");
              }
              if (this._input.hasNext()) {
                next += this._input.next();
              }
            }
          }
          next += pattern.read();
          resulting_string += next;
        }
        return resulting_string;
      };
      module.exports.Tokenizer = Tokenizer;
      module.exports.TOKEN = TOKEN;
      module.exports.positionable_operators = positionable_operators.slice();
      module.exports.line_starters = line_starters.slice();
    }
  });

  // node_modules/js-beautify/js/src/javascript/beautifier.js
  var require_beautifier = __commonJS({
    "node_modules/js-beautify/js/src/javascript/beautifier.js"(exports, module) {
      "use strict";
      var Output = require_output().Output;
      var Token = require_token().Token;
      var acorn = require_acorn();
      var Options = require_options2().Options;
      var Tokenizer = require_tokenizer2().Tokenizer;
      var line_starters = require_tokenizer2().line_starters;
      var positionable_operators = require_tokenizer2().positionable_operators;
      var TOKEN = require_tokenizer2().TOKEN;
      function in_array(what, arr) {
        return arr.indexOf(what) !== -1;
      }
      function ltrim(s) {
        return s.replace(/^\s+/g, "");
      }
      function generateMapFromStrings(list) {
        var result = {};
        for (var x = 0; x < list.length; x++) {
          result[list[x].replace(/-/g, "_")] = list[x];
        }
        return result;
      }
      function reserved_word(token, word) {
        return token && token.type === TOKEN.RESERVED && token.text === word;
      }
      function reserved_array(token, words) {
        return token && token.type === TOKEN.RESERVED && in_array(token.text, words);
      }
      var special_words = ["case", "return", "do", "if", "throw", "else", "await", "break", "continue", "async"];
      var validPositionValues = ["before-newline", "after-newline", "preserve-newline"];
      var OPERATOR_POSITION = generateMapFromStrings(validPositionValues);
      var OPERATOR_POSITION_BEFORE_OR_PRESERVE = [OPERATOR_POSITION.before_newline, OPERATOR_POSITION.preserve_newline];
      var MODE = {
        BlockStatement: "BlockStatement",
        // 'BLOCK'
        Statement: "Statement",
        // 'STATEMENT'
        ObjectLiteral: "ObjectLiteral",
        // 'OBJECT',
        ArrayLiteral: "ArrayLiteral",
        //'[EXPRESSION]',
        ForInitializer: "ForInitializer",
        //'(FOR-EXPRESSION)',
        Conditional: "Conditional",
        //'(COND-EXPRESSION)',
        Expression: "Expression"
        //'(EXPRESSION)'
      };
      function remove_redundant_indentation(output, frame) {
        if (frame.multiline_frame || frame.mode === MODE.ForInitializer || frame.mode === MODE.Conditional) {
          return;
        }
        output.remove_indent(frame.start_line_index);
      }
      function split_linebreaks(s) {
        s = s.replace(acorn.allLineBreaks, "\n");
        var out = [], idx = s.indexOf("\n");
        while (idx !== -1) {
          out.push(s.substring(0, idx));
          s = s.substring(idx + 1);
          idx = s.indexOf("\n");
        }
        if (s.length) {
          out.push(s);
        }
        return out;
      }
      function is_array(mode) {
        return mode === MODE.ArrayLiteral;
      }
      function is_expression(mode) {
        return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
      }
      function all_lines_start_with(lines, c) {
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (line.charAt(0) !== c) {
            return false;
          }
        }
        return true;
      }
      function each_line_matches_indent(lines, indent) {
        var i = 0, len = lines.length, line;
        for (; i < len; i++) {
          line = lines[i];
          if (line && line.indexOf(indent) !== 0) {
            return false;
          }
        }
        return true;
      }
      function Beautifier(source_text, options) {
        options = options || {};
        this._source_text = source_text || "";
        this._output = null;
        this._tokens = null;
        this._last_last_text = null;
        this._flags = null;
        this._previous_flags = null;
        this._flag_store = null;
        this._options = new Options(options);
      }
      Beautifier.prototype.create_flags = function(flags_base, mode) {
        var next_indent_level = 0;
        if (flags_base) {
          next_indent_level = flags_base.indentation_level;
          if (!this._output.just_added_newline() && flags_base.line_indent_level > next_indent_level) {
            next_indent_level = flags_base.line_indent_level;
          }
        }
        var next_flags = {
          mode,
          parent: flags_base,
          last_token: flags_base ? flags_base.last_token : new Token(TOKEN.START_BLOCK, ""),
          // last token text
          last_word: flags_base ? flags_base.last_word : "",
          // last TOKEN.WORD passed
          declaration_statement: false,
          declaration_assignment: false,
          multiline_frame: false,
          inline_frame: false,
          if_block: false,
          else_block: false,
          class_start_block: false,
          // class A { INSIDE HERE } or class B extends C { INSIDE HERE }
          do_block: false,
          do_while: false,
          import_block: false,
          in_case_statement: false,
          // switch(..){ INSIDE HERE }
          in_case: false,
          // we're on the exact line with "case 0:"
          case_body: false,
          // the indented case-action block
          case_block: false,
          // the indented case-action block is wrapped with {}
          indentation_level: next_indent_level,
          alignment: 0,
          line_indent_level: flags_base ? flags_base.line_indent_level : next_indent_level,
          start_line_index: this._output.get_line_number(),
          ternary_depth: 0
        };
        return next_flags;
      };
      Beautifier.prototype._reset = function(source_text) {
        var baseIndentString = source_text.match(/^[\t ]*/)[0];
        this._last_last_text = "";
        this._output = new Output(this._options, baseIndentString);
        this._output.raw = this._options.test_output_raw;
        this._flag_store = [];
        this.set_mode(MODE.BlockStatement);
        var tokenizer = new Tokenizer(source_text, this._options);
        this._tokens = tokenizer.tokenize();
        return source_text;
      };
      Beautifier.prototype.beautify = function() {
        if (this._options.disabled) {
          return this._source_text;
        }
        var sweet_code;
        var source_text = this._reset(this._source_text);
        var eol = this._options.eol;
        if (this._options.eol === "auto") {
          eol = "\n";
          if (source_text && acorn.lineBreak.test(source_text || "")) {
            eol = source_text.match(acorn.lineBreak)[0];
          }
        }
        var current_token = this._tokens.next();
        while (current_token) {
          this.handle_token(current_token);
          this._last_last_text = this._flags.last_token.text;
          this._flags.last_token = current_token;
          current_token = this._tokens.next();
        }
        sweet_code = this._output.get_code(eol);
        return sweet_code;
      };
      Beautifier.prototype.handle_token = function(current_token, preserve_statement_flags) {
        if (current_token.type === TOKEN.START_EXPR) {
          this.handle_start_expr(current_token);
        } else if (current_token.type === TOKEN.END_EXPR) {
          this.handle_end_expr(current_token);
        } else if (current_token.type === TOKEN.START_BLOCK) {
          this.handle_start_block(current_token);
        } else if (current_token.type === TOKEN.END_BLOCK) {
          this.handle_end_block(current_token);
        } else if (current_token.type === TOKEN.WORD) {
          this.handle_word(current_token);
        } else if (current_token.type === TOKEN.RESERVED) {
          this.handle_word(current_token);
        } else if (current_token.type === TOKEN.SEMICOLON) {
          this.handle_semicolon(current_token);
        } else if (current_token.type === TOKEN.STRING) {
          this.handle_string(current_token);
        } else if (current_token.type === TOKEN.EQUALS) {
          this.handle_equals(current_token);
        } else if (current_token.type === TOKEN.OPERATOR) {
          this.handle_operator(current_token);
        } else if (current_token.type === TOKEN.COMMA) {
          this.handle_comma(current_token);
        } else if (current_token.type === TOKEN.BLOCK_COMMENT) {
          this.handle_block_comment(current_token, preserve_statement_flags);
        } else if (current_token.type === TOKEN.COMMENT) {
          this.handle_comment(current_token, preserve_statement_flags);
        } else if (current_token.type === TOKEN.DOT) {
          this.handle_dot(current_token);
        } else if (current_token.type === TOKEN.EOF) {
          this.handle_eof(current_token);
        } else if (current_token.type === TOKEN.UNKNOWN) {
          this.handle_unknown(current_token, preserve_statement_flags);
        } else {
          this.handle_unknown(current_token, preserve_statement_flags);
        }
      };
      Beautifier.prototype.handle_whitespace_and_comments = function(current_token, preserve_statement_flags) {
        var newlines = current_token.newlines;
        var keep_whitespace = this._options.keep_array_indentation && is_array(this._flags.mode);
        if (current_token.comments_before) {
          var comment_token = current_token.comments_before.next();
          while (comment_token) {
            this.handle_whitespace_and_comments(comment_token, preserve_statement_flags);
            this.handle_token(comment_token, preserve_statement_flags);
            comment_token = current_token.comments_before.next();
          }
        }
        if (keep_whitespace) {
          for (var i = 0; i < newlines; i += 1) {
            this.print_newline(i > 0, preserve_statement_flags);
          }
        } else {
          if (this._options.max_preserve_newlines && newlines > this._options.max_preserve_newlines) {
            newlines = this._options.max_preserve_newlines;
          }
          if (this._options.preserve_newlines) {
            if (newlines > 1) {
              this.print_newline(false, preserve_statement_flags);
              for (var j = 1; j < newlines; j += 1) {
                this.print_newline(true, preserve_statement_flags);
              }
            }
          }
        }
      };
      var newline_restricted_tokens = ["async", "break", "continue", "return", "throw", "yield"];
      Beautifier.prototype.allow_wrap_or_preserved_newline = function(current_token, force_linewrap) {
        force_linewrap = force_linewrap === void 0 ? false : force_linewrap;
        if (this._output.just_added_newline()) {
          return;
        }
        var shouldPreserveOrForce = this._options.preserve_newlines && current_token.newlines || force_linewrap;
        var operatorLogicApplies = in_array(this._flags.last_token.text, positionable_operators) || in_array(current_token.text, positionable_operators);
        if (operatorLogicApplies) {
          var shouldPrintOperatorNewline = in_array(this._flags.last_token.text, positionable_operators) && in_array(this._options.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE) || in_array(current_token.text, positionable_operators);
          shouldPreserveOrForce = shouldPreserveOrForce && shouldPrintOperatorNewline;
        }
        if (shouldPreserveOrForce) {
          this.print_newline(false, true);
        } else if (this._options.wrap_line_length) {
          if (reserved_array(this._flags.last_token, newline_restricted_tokens)) {
            return;
          }
          this._output.set_wrap_point();
        }
      };
      Beautifier.prototype.print_newline = function(force_newline, preserve_statement_flags) {
        if (!preserve_statement_flags) {
          if (this._flags.last_token.text !== ";" && this._flags.last_token.text !== "," && this._flags.last_token.text !== "=" && (this._flags.last_token.type !== TOKEN.OPERATOR || this._flags.last_token.text === "--" || this._flags.last_token.text === "++")) {
            var next_token = this._tokens.peek();
            while (this._flags.mode === MODE.Statement && !(this._flags.if_block && reserved_word(next_token, "else")) && !this._flags.do_block) {
              this.restore_mode();
            }
          }
        }
        if (this._output.add_new_line(force_newline)) {
          this._flags.multiline_frame = true;
        }
      };
      Beautifier.prototype.print_token_line_indentation = function(current_token) {
        if (this._output.just_added_newline()) {
          if (this._options.keep_array_indentation && current_token.newlines && (current_token.text === "[" || is_array(this._flags.mode))) {
            this._output.current_line.set_indent(-1);
            this._output.current_line.push(current_token.whitespace_before);
            this._output.space_before_token = false;
          } else if (this._output.set_indent(this._flags.indentation_level, this._flags.alignment)) {
            this._flags.line_indent_level = this._flags.indentation_level;
          }
        }
      };
      Beautifier.prototype.print_token = function(current_token) {
        if (this._output.raw) {
          this._output.add_raw_token(current_token);
          return;
        }
        if (this._options.comma_first && current_token.previous && current_token.previous.type === TOKEN.COMMA && this._output.just_added_newline()) {
          if (this._output.previous_line.last() === ",") {
            var popped = this._output.previous_line.pop();
            if (this._output.previous_line.is_empty()) {
              this._output.previous_line.push(popped);
              this._output.trim(true);
              this._output.current_line.pop();
              this._output.trim();
            }
            this.print_token_line_indentation(current_token);
            this._output.add_token(",");
            this._output.space_before_token = true;
          }
        }
        this.print_token_line_indentation(current_token);
        this._output.non_breaking_space = true;
        this._output.add_token(current_token.text);
        if (this._output.previous_token_wrapped) {
          this._flags.multiline_frame = true;
        }
      };
      Beautifier.prototype.indent = function() {
        this._flags.indentation_level += 1;
        this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
      };
      Beautifier.prototype.deindent = function() {
        if (this._flags.indentation_level > 0 && (!this._flags.parent || this._flags.indentation_level > this._flags.parent.indentation_level)) {
          this._flags.indentation_level -= 1;
          this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
        }
      };
      Beautifier.prototype.set_mode = function(mode) {
        if (this._flags) {
          this._flag_store.push(this._flags);
          this._previous_flags = this._flags;
        } else {
          this._previous_flags = this.create_flags(null, mode);
        }
        this._flags = this.create_flags(this._previous_flags, mode);
        this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
      };
      Beautifier.prototype.restore_mode = function() {
        if (this._flag_store.length > 0) {
          this._previous_flags = this._flags;
          this._flags = this._flag_store.pop();
          if (this._previous_flags.mode === MODE.Statement) {
            remove_redundant_indentation(this._output, this._previous_flags);
          }
          this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
        }
      };
      Beautifier.prototype.start_of_object_property = function() {
        return this._flags.parent.mode === MODE.ObjectLiteral && this._flags.mode === MODE.Statement && (this._flags.last_token.text === ":" && this._flags.ternary_depth === 0 || reserved_array(this._flags.last_token, ["get", "set"]));
      };
      Beautifier.prototype.start_of_statement = function(current_token) {
        var start = false;
        start = start || reserved_array(this._flags.last_token, ["var", "let", "const"]) && current_token.type === TOKEN.WORD;
        start = start || reserved_word(this._flags.last_token, "do");
        start = start || !(this._flags.parent.mode === MODE.ObjectLiteral && this._flags.mode === MODE.Statement) && reserved_array(this._flags.last_token, newline_restricted_tokens) && !current_token.newlines;
        start = start || reserved_word(this._flags.last_token, "else") && !(reserved_word(current_token, "if") && !current_token.comments_before);
        start = start || this._flags.last_token.type === TOKEN.END_EXPR && (this._previous_flags.mode === MODE.ForInitializer || this._previous_flags.mode === MODE.Conditional);
        start = start || this._flags.last_token.type === TOKEN.WORD && this._flags.mode === MODE.BlockStatement && !this._flags.in_case && !(current_token.text === "--" || current_token.text === "++") && this._last_last_text !== "function" && current_token.type !== TOKEN.WORD && current_token.type !== TOKEN.RESERVED;
        start = start || this._flags.mode === MODE.ObjectLiteral && (this._flags.last_token.text === ":" && this._flags.ternary_depth === 0 || reserved_array(this._flags.last_token, ["get", "set"]));
        if (start) {
          this.set_mode(MODE.Statement);
          this.indent();
          this.handle_whitespace_and_comments(current_token, true);
          if (!this.start_of_object_property()) {
            this.allow_wrap_or_preserved_newline(
              current_token,
              reserved_array(current_token, ["do", "for", "if", "while"])
            );
          }
          return true;
        }
        return false;
      };
      Beautifier.prototype.handle_start_expr = function(current_token) {
        if (!this.start_of_statement(current_token)) {
          this.handle_whitespace_and_comments(current_token);
        }
        var next_mode = MODE.Expression;
        if (current_token.text === "[") {
          if (this._flags.last_token.type === TOKEN.WORD || this._flags.last_token.text === ")") {
            if (reserved_array(this._flags.last_token, line_starters)) {
              this._output.space_before_token = true;
            }
            this.print_token(current_token);
            this.set_mode(next_mode);
            this.indent();
            if (this._options.space_in_paren) {
              this._output.space_before_token = true;
            }
            return;
          }
          next_mode = MODE.ArrayLiteral;
          if (is_array(this._flags.mode)) {
            if (this._flags.last_token.text === "[" || this._flags.last_token.text === "," && (this._last_last_text === "]" || this._last_last_text === "}")) {
              if (!this._options.keep_array_indentation) {
                this.print_newline();
              }
            }
          }
          if (!in_array(this._flags.last_token.type, [TOKEN.START_EXPR, TOKEN.END_EXPR, TOKEN.WORD, TOKEN.OPERATOR, TOKEN.DOT])) {
            this._output.space_before_token = true;
          }
        } else {
          if (this._flags.last_token.type === TOKEN.RESERVED) {
            if (this._flags.last_token.text === "for") {
              this._output.space_before_token = this._options.space_before_conditional;
              next_mode = MODE.ForInitializer;
            } else if (in_array(this._flags.last_token.text, ["if", "while", "switch"])) {
              this._output.space_before_token = this._options.space_before_conditional;
              next_mode = MODE.Conditional;
            } else if (in_array(this._flags.last_word, ["await", "async"])) {
              this._output.space_before_token = true;
            } else if (this._flags.last_token.text === "import" && current_token.whitespace_before === "") {
              this._output.space_before_token = false;
            } else if (in_array(this._flags.last_token.text, line_starters) || this._flags.last_token.text === "catch") {
              this._output.space_before_token = true;
            }
          } else if (this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
            if (!this.start_of_object_property()) {
              this.allow_wrap_or_preserved_newline(current_token);
            }
          } else if (this._flags.last_token.type === TOKEN.WORD) {
            this._output.space_before_token = false;
            var peek_back_two = this._tokens.peek(-3);
            if (this._options.space_after_named_function && peek_back_two) {
              var peek_back_three = this._tokens.peek(-4);
              if (reserved_array(peek_back_two, ["async", "function"]) || peek_back_two.text === "*" && reserved_array(peek_back_three, ["async", "function"])) {
                this._output.space_before_token = true;
              } else if (this._flags.mode === MODE.ObjectLiteral) {
                if (peek_back_two.text === "{" || peek_back_two.text === "," || peek_back_two.text === "*" && (peek_back_three.text === "{" || peek_back_three.text === ",")) {
                  this._output.space_before_token = true;
                }
              } else if (this._flags.parent && this._flags.parent.class_start_block) {
                this._output.space_before_token = true;
              }
            }
          } else {
            this.allow_wrap_or_preserved_newline(current_token);
          }
          if (this._flags.last_token.type === TOKEN.RESERVED && (this._flags.last_word === "function" || this._flags.last_word === "typeof") || this._flags.last_token.text === "*" && (in_array(this._last_last_text, ["function", "yield"]) || this._flags.mode === MODE.ObjectLiteral && in_array(this._last_last_text, ["{", ","]))) {
            this._output.space_before_token = this._options.space_after_anon_function;
          }
        }
        if (this._flags.last_token.text === ";" || this._flags.last_token.type === TOKEN.START_BLOCK) {
          this.print_newline();
        } else if (this._flags.last_token.type === TOKEN.END_EXPR || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.END_BLOCK || this._flags.last_token.text === "." || this._flags.last_token.type === TOKEN.COMMA) {
          this.allow_wrap_or_preserved_newline(current_token, current_token.newlines);
        }
        this.print_token(current_token);
        this.set_mode(next_mode);
        if (this._options.space_in_paren) {
          this._output.space_before_token = true;
        }
        this.indent();
      };
      Beautifier.prototype.handle_end_expr = function(current_token) {
        while (this._flags.mode === MODE.Statement) {
          this.restore_mode();
        }
        this.handle_whitespace_and_comments(current_token);
        if (this._flags.multiline_frame) {
          this.allow_wrap_or_preserved_newline(
            current_token,
            current_token.text === "]" && is_array(this._flags.mode) && !this._options.keep_array_indentation
          );
        }
        if (this._options.space_in_paren) {
          if (this._flags.last_token.type === TOKEN.START_EXPR && !this._options.space_in_empty_paren) {
            this._output.trim();
            this._output.space_before_token = false;
          } else {
            this._output.space_before_token = true;
          }
        }
        this.deindent();
        this.print_token(current_token);
        this.restore_mode();
        remove_redundant_indentation(this._output, this._previous_flags);
        if (this._flags.do_while && this._previous_flags.mode === MODE.Conditional) {
          this._previous_flags.mode = MODE.Expression;
          this._flags.do_block = false;
          this._flags.do_while = false;
        }
      };
      Beautifier.prototype.handle_start_block = function(current_token) {
        this.handle_whitespace_and_comments(current_token);
        var next_token = this._tokens.peek();
        var second_token = this._tokens.peek(1);
        if (this._flags.last_word === "switch" && this._flags.last_token.type === TOKEN.END_EXPR) {
          this.set_mode(MODE.BlockStatement);
          this._flags.in_case_statement = true;
        } else if (this._flags.case_body) {
          this.set_mode(MODE.BlockStatement);
        } else if (second_token && (in_array(second_token.text, [":", ","]) && in_array(next_token.type, [TOKEN.STRING, TOKEN.WORD, TOKEN.RESERVED]) || in_array(next_token.text, ["get", "set", "..."]) && in_array(second_token.type, [TOKEN.WORD, TOKEN.RESERVED]))) {
          if (in_array(this._last_last_text, ["class", "interface"]) && !in_array(second_token.text, [":", ","])) {
            this.set_mode(MODE.BlockStatement);
          } else {
            this.set_mode(MODE.ObjectLiteral);
          }
        } else if (this._flags.last_token.type === TOKEN.OPERATOR && this._flags.last_token.text === "=>") {
          this.set_mode(MODE.BlockStatement);
        } else if (in_array(this._flags.last_token.type, [TOKEN.EQUALS, TOKEN.START_EXPR, TOKEN.COMMA, TOKEN.OPERATOR]) || reserved_array(this._flags.last_token, ["return", "throw", "import", "default"])) {
          this.set_mode(MODE.ObjectLiteral);
        } else {
          this.set_mode(MODE.BlockStatement);
        }
        if (this._flags.last_token) {
          if (reserved_array(this._flags.last_token.previous, ["class", "extends"])) {
            this._flags.class_start_block = true;
          }
        }
        var empty_braces = !next_token.comments_before && next_token.text === "}";
        var empty_anonymous_function = empty_braces && this._flags.last_word === "function" && this._flags.last_token.type === TOKEN.END_EXPR;
        if (this._options.brace_preserve_inline) {
          var index = 0;
          var check_token = null;
          this._flags.inline_frame = true;
          do {
            index += 1;
            check_token = this._tokens.peek(index - 1);
            if (check_token.newlines) {
              this._flags.inline_frame = false;
              break;
            }
          } while (check_token.type !== TOKEN.EOF && !(check_token.type === TOKEN.END_BLOCK && check_token.opened === current_token));
        }
        if ((this._options.brace_style === "expand" || this._options.brace_style === "none" && current_token.newlines) && !this._flags.inline_frame) {
          if (this._flags.last_token.type !== TOKEN.OPERATOR && (empty_anonymous_function || this._flags.last_token.type === TOKEN.EQUALS || reserved_array(this._flags.last_token, special_words) && this._flags.last_token.text !== "else")) {
            this._output.space_before_token = true;
          } else {
            this.print_newline(false, true);
          }
        } else {
          if (is_array(this._previous_flags.mode) && (this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.COMMA)) {
            if (this._flags.last_token.type === TOKEN.COMMA || this._options.space_in_paren) {
              this._output.space_before_token = true;
            }
            if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR && this._flags.inline_frame) {
              this.allow_wrap_or_preserved_newline(current_token);
              this._previous_flags.multiline_frame = this._previous_flags.multiline_frame || this._flags.multiline_frame;
              this._flags.multiline_frame = false;
            }
          }
          if (this._flags.last_token.type !== TOKEN.OPERATOR && this._flags.last_token.type !== TOKEN.START_EXPR) {
            if (in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.SEMICOLON]) && !this._flags.inline_frame) {
              this.print_newline();
            } else {
              this._output.space_before_token = true;
            }
          }
        }
        this.print_token(current_token);
        this.indent();
        if (!empty_braces && !(this._options.brace_preserve_inline && this._flags.inline_frame)) {
          this.print_newline();
        }
      };
      Beautifier.prototype.handle_end_block = function(current_token) {
        this.handle_whitespace_and_comments(current_token);
        while (this._flags.mode === MODE.Statement) {
          this.restore_mode();
        }
        var empty_braces = this._flags.last_token.type === TOKEN.START_BLOCK;
        if (this._flags.inline_frame && !empty_braces) {
          this._output.space_before_token = true;
        } else if (this._options.brace_style === "expand") {
          if (!empty_braces) {
            this.print_newline();
          }
        } else {
          if (!empty_braces) {
            if (is_array(this._flags.mode) && this._options.keep_array_indentation) {
              this._options.keep_array_indentation = false;
              this.print_newline();
              this._options.keep_array_indentation = true;
            } else {
              this.print_newline();
            }
          }
        }
        this.restore_mode();
        this.print_token(current_token);
      };
      Beautifier.prototype.handle_word = function(current_token) {
        if (current_token.type === TOKEN.RESERVED) {
          if (in_array(current_token.text, ["set", "get"]) && this._flags.mode !== MODE.ObjectLiteral) {
            current_token.type = TOKEN.WORD;
          } else if (current_token.text === "import" && in_array(this._tokens.peek().text, ["(", "."])) {
            current_token.type = TOKEN.WORD;
          } else if (in_array(current_token.text, ["as", "from"]) && !this._flags.import_block) {
            current_token.type = TOKEN.WORD;
          } else if (this._flags.mode === MODE.ObjectLiteral) {
            var next_token = this._tokens.peek();
            if (next_token.text === ":") {
              current_token.type = TOKEN.WORD;
            }
          }
        }
        if (this.start_of_statement(current_token)) {
          if (reserved_array(this._flags.last_token, ["var", "let", "const"]) && current_token.type === TOKEN.WORD) {
            this._flags.declaration_statement = true;
          }
        } else if (current_token.newlines && !is_expression(this._flags.mode) && (this._flags.last_token.type !== TOKEN.OPERATOR || (this._flags.last_token.text === "--" || this._flags.last_token.text === "++")) && this._flags.last_token.type !== TOKEN.EQUALS && (this._options.preserve_newlines || !reserved_array(this._flags.last_token, ["var", "let", "const", "set", "get"]))) {
          this.handle_whitespace_and_comments(current_token);
          this.print_newline();
        } else {
          this.handle_whitespace_and_comments(current_token);
        }
        if (this._flags.do_block && !this._flags.do_while) {
          if (reserved_word(current_token, "while")) {
            this._output.space_before_token = true;
            this.print_token(current_token);
            this._output.space_before_token = true;
            this._flags.do_while = true;
            return;
          } else {
            this.print_newline();
            this._flags.do_block = false;
          }
        }
        if (this._flags.if_block) {
          if (!this._flags.else_block && reserved_word(current_token, "else")) {
            this._flags.else_block = true;
          } else {
            while (this._flags.mode === MODE.Statement) {
              this.restore_mode();
            }
            this._flags.if_block = false;
            this._flags.else_block = false;
          }
        }
        if (this._flags.in_case_statement && reserved_array(current_token, ["case", "default"])) {
          this.print_newline();
          if (!this._flags.case_block && (this._flags.case_body || this._options.jslint_happy)) {
            this.deindent();
          }
          this._flags.case_body = false;
          this.print_token(current_token);
          this._flags.in_case = true;
          return;
        }
        if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
          if (!this.start_of_object_property() && !// start of object property is different for numeric values with +/- prefix operators
          (in_array(this._flags.last_token.text, ["+", "-"]) && this._last_last_text === ":" && this._flags.parent.mode === MODE.ObjectLiteral)) {
            this.allow_wrap_or_preserved_newline(current_token);
          }
        }
        if (reserved_word(current_token, "function")) {
          if (in_array(this._flags.last_token.text, ["}", ";"]) || this._output.just_added_newline() && !(in_array(this._flags.last_token.text, ["(", "[", "{", ":", "=", ","]) || this._flags.last_token.type === TOKEN.OPERATOR)) {
            if (!this._output.just_added_blankline() && !current_token.comments_before) {
              this.print_newline();
              this.print_newline(true);
            }
          }
          if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD) {
            if (reserved_array(this._flags.last_token, ["get", "set", "new", "export"]) || reserved_array(this._flags.last_token, newline_restricted_tokens)) {
              this._output.space_before_token = true;
            } else if (reserved_word(this._flags.last_token, "default") && this._last_last_text === "export") {
              this._output.space_before_token = true;
            } else if (this._flags.last_token.text === "declare") {
              this._output.space_before_token = true;
            } else {
              this.print_newline();
            }
          } else if (this._flags.last_token.type === TOKEN.OPERATOR || this._flags.last_token.text === "=") {
            this._output.space_before_token = true;
          } else if (!this._flags.multiline_frame && (is_expression(this._flags.mode) || is_array(this._flags.mode))) {
          } else {
            this.print_newline();
          }
          this.print_token(current_token);
          this._flags.last_word = current_token.text;
          return;
        }
        var prefix = "NONE";
        if (this._flags.last_token.type === TOKEN.END_BLOCK) {
          if (this._previous_flags.inline_frame) {
            prefix = "SPACE";
          } else if (!reserved_array(current_token, ["else", "catch", "finally", "from"])) {
            prefix = "NEWLINE";
          } else {
            if (this._options.brace_style === "expand" || this._options.brace_style === "end-expand" || this._options.brace_style === "none" && current_token.newlines) {
              prefix = "NEWLINE";
            } else {
              prefix = "SPACE";
              this._output.space_before_token = true;
            }
          }
        } else if (this._flags.last_token.type === TOKEN.SEMICOLON && this._flags.mode === MODE.BlockStatement) {
          prefix = "NEWLINE";
        } else if (this._flags.last_token.type === TOKEN.SEMICOLON && is_expression(this._flags.mode)) {
          prefix = "SPACE";
        } else if (this._flags.last_token.type === TOKEN.STRING) {
          prefix = "NEWLINE";
        } else if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD || this._flags.last_token.text === "*" && (in_array(this._last_last_text, ["function", "yield"]) || this._flags.mode === MODE.ObjectLiteral && in_array(this._last_last_text, ["{", ","]))) {
          prefix = "SPACE";
        } else if (this._flags.last_token.type === TOKEN.START_BLOCK) {
          if (this._flags.inline_frame) {
            prefix = "SPACE";
          } else {
            prefix = "NEWLINE";
          }
        } else if (this._flags.last_token.type === TOKEN.END_EXPR) {
          this._output.space_before_token = true;
          prefix = "NEWLINE";
        }
        if (reserved_array(current_token, line_starters) && this._flags.last_token.text !== ")") {
          if (this._flags.inline_frame || this._flags.last_token.text === "else" || this._flags.last_token.text === "export") {
            prefix = "SPACE";
          } else {
            prefix = "NEWLINE";
          }
        }
        if (reserved_array(current_token, ["else", "catch", "finally"])) {
          if ((!(this._flags.last_token.type === TOKEN.END_BLOCK && this._previous_flags.mode === MODE.BlockStatement) || this._options.brace_style === "expand" || this._options.brace_style === "end-expand" || this._options.brace_style === "none" && current_token.newlines) && !this._flags.inline_frame) {
            this.print_newline();
          } else {
            this._output.trim(true);
            var line = this._output.current_line;
            if (line.last() !== "}") {
              this.print_newline();
            }
            this._output.space_before_token = true;
          }
        } else if (prefix === "NEWLINE") {
          if (reserved_array(this._flags.last_token, special_words)) {
            this._output.space_before_token = true;
          } else if (this._flags.last_token.text === "declare" && reserved_array(current_token, ["var", "let", "const"])) {
            this._output.space_before_token = true;
          } else if (this._flags.last_token.type !== TOKEN.END_EXPR) {
            if ((this._flags.last_token.type !== TOKEN.START_EXPR || !reserved_array(current_token, ["var", "let", "const"])) && this._flags.last_token.text !== ":") {
              if (reserved_word(current_token, "if") && reserved_word(current_token.previous, "else")) {
                this._output.space_before_token = true;
              } else {
                this.print_newline();
              }
            }
          } else if (reserved_array(current_token, line_starters) && this._flags.last_token.text !== ")") {
            this.print_newline();
          }
        } else if (this._flags.multiline_frame && is_array(this._flags.mode) && this._flags.last_token.text === "," && this._last_last_text === "}") {
          this.print_newline();
        } else if (prefix === "SPACE") {
          this._output.space_before_token = true;
        }
        if (current_token.previous && (current_token.previous.type === TOKEN.WORD || current_token.previous.type === TOKEN.RESERVED)) {
          this._output.space_before_token = true;
        }
        this.print_token(current_token);
        this._flags.last_word = current_token.text;
        if (current_token.type === TOKEN.RESERVED) {
          if (current_token.text === "do") {
            this._flags.do_block = true;
          } else if (current_token.text === "if") {
            this._flags.if_block = true;
          } else if (current_token.text === "import") {
            this._flags.import_block = true;
          } else if (this._flags.import_block && reserved_word(current_token, "from")) {
            this._flags.import_block = false;
          }
        }
      };
      Beautifier.prototype.handle_semicolon = function(current_token) {
        if (this.start_of_statement(current_token)) {
          this._output.space_before_token = false;
        } else {
          this.handle_whitespace_and_comments(current_token);
        }
        var next_token = this._tokens.peek();
        while (this._flags.mode === MODE.Statement && !(this._flags.if_block && reserved_word(next_token, "else")) && !this._flags.do_block) {
          this.restore_mode();
        }
        if (this._flags.import_block) {
          this._flags.import_block = false;
        }
        this.print_token(current_token);
      };
      Beautifier.prototype.handle_string = function(current_token) {
        if (current_token.text.startsWith("`") && current_token.newlines === 0 && current_token.whitespace_before === "" && (current_token.previous.text === ")" || this._flags.last_token.type === TOKEN.WORD)) {
        } else if (this.start_of_statement(current_token)) {
          this._output.space_before_token = true;
        } else {
          this.handle_whitespace_and_comments(current_token);
          if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD || this._flags.inline_frame) {
            this._output.space_before_token = true;
          } else if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
            if (!this.start_of_object_property()) {
              this.allow_wrap_or_preserved_newline(current_token);
            }
          } else if (current_token.text.startsWith("`") && this._flags.last_token.type === TOKEN.END_EXPR && (current_token.previous.text === "]" || current_token.previous.text === ")") && current_token.newlines === 0) {
            this._output.space_before_token = true;
          } else {
            this.print_newline();
          }
        }
        this.print_token(current_token);
      };
      Beautifier.prototype.handle_equals = function(current_token) {
        if (this.start_of_statement(current_token)) {
        } else {
          this.handle_whitespace_and_comments(current_token);
        }
        if (this._flags.declaration_statement) {
          this._flags.declaration_assignment = true;
        }
        this._output.space_before_token = true;
        this.print_token(current_token);
        this._output.space_before_token = true;
      };
      Beautifier.prototype.handle_comma = function(current_token) {
        this.handle_whitespace_and_comments(current_token, true);
        this.print_token(current_token);
        this._output.space_before_token = true;
        if (this._flags.declaration_statement) {
          if (is_expression(this._flags.parent.mode)) {
            this._flags.declaration_assignment = false;
          }
          if (this._flags.declaration_assignment) {
            this._flags.declaration_assignment = false;
            this.print_newline(false, true);
          } else if (this._options.comma_first) {
            this.allow_wrap_or_preserved_newline(current_token);
          }
        } else if (this._flags.mode === MODE.ObjectLiteral || this._flags.mode === MODE.Statement && this._flags.parent.mode === MODE.ObjectLiteral) {
          if (this._flags.mode === MODE.Statement) {
            this.restore_mode();
          }
          if (!this._flags.inline_frame) {
            this.print_newline();
          }
        } else if (this._options.comma_first) {
          this.allow_wrap_or_preserved_newline(current_token);
        }
      };
      Beautifier.prototype.handle_operator = function(current_token) {
        var isGeneratorAsterisk = current_token.text === "*" && (reserved_array(this._flags.last_token, ["function", "yield"]) || in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.COMMA, TOKEN.END_BLOCK, TOKEN.SEMICOLON]));
        var isUnary = in_array(current_token.text, ["-", "+"]) && (in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.START_EXPR, TOKEN.EQUALS, TOKEN.OPERATOR]) || in_array(this._flags.last_token.text, line_starters) || this._flags.last_token.text === ",");
        if (this.start_of_statement(current_token)) {
        } else {
          var preserve_statement_flags = !isGeneratorAsterisk;
          this.handle_whitespace_and_comments(current_token, preserve_statement_flags);
        }
        if (current_token.text === "*" && this._flags.last_token.type === TOKEN.DOT) {
          this.print_token(current_token);
          return;
        }
        if (current_token.text === "::") {
          this.print_token(current_token);
          return;
        }
        if (in_array(current_token.text, ["-", "+"]) && this.start_of_object_property()) {
          this.print_token(current_token);
          return;
        }
        if (this._flags.last_token.type === TOKEN.OPERATOR && in_array(this._options.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE)) {
          this.allow_wrap_or_preserved_newline(current_token);
        }
        if (current_token.text === ":" && this._flags.in_case) {
          this.print_token(current_token);
          this._flags.in_case = false;
          this._flags.case_body = true;
          if (this._tokens.peek().type !== TOKEN.START_BLOCK) {
            this.indent();
            this.print_newline();
            this._flags.case_block = false;
          } else {
            this._flags.case_block = true;
            this._output.space_before_token = true;
          }
          return;
        }
        var space_before = true;
        var space_after = true;
        var in_ternary = false;
        if (current_token.text === ":") {
          if (this._flags.ternary_depth === 0) {
            space_before = false;
          } else {
            this._flags.ternary_depth -= 1;
            in_ternary = true;
          }
        } else if (current_token.text === "?") {
          this._flags.ternary_depth += 1;
        }
        if (!isUnary && !isGeneratorAsterisk && this._options.preserve_newlines && in_array(current_token.text, positionable_operators)) {
          var isColon = current_token.text === ":";
          var isTernaryColon = isColon && in_ternary;
          var isOtherColon = isColon && !in_ternary;
          switch (this._options.operator_position) {
            case OPERATOR_POSITION.before_newline:
              this._output.space_before_token = !isOtherColon;
              this.print_token(current_token);
              if (!isColon || isTernaryColon) {
                this.allow_wrap_or_preserved_newline(current_token);
              }
              this._output.space_before_token = true;
              return;
            case OPERATOR_POSITION.after_newline:
              this._output.space_before_token = true;
              if (!isColon || isTernaryColon) {
                if (this._tokens.peek().newlines) {
                  this.print_newline(false, true);
                } else {
                  this.allow_wrap_or_preserved_newline(current_token);
                }
              } else {
                this._output.space_before_token = false;
              }
              this.print_token(current_token);
              this._output.space_before_token = true;
              return;
            case OPERATOR_POSITION.preserve_newline:
              if (!isOtherColon) {
                this.allow_wrap_or_preserved_newline(current_token);
              }
              space_before = !(this._output.just_added_newline() || isOtherColon);
              this._output.space_before_token = space_before;
              this.print_token(current_token);
              this._output.space_before_token = true;
              return;
          }
        }
        if (isGeneratorAsterisk) {
          this.allow_wrap_or_preserved_newline(current_token);
          space_before = false;
          var next_token = this._tokens.peek();
          space_after = next_token && in_array(next_token.type, [TOKEN.WORD, TOKEN.RESERVED]);
        } else if (current_token.text === "...") {
          this.allow_wrap_or_preserved_newline(current_token);
          space_before = this._flags.last_token.type === TOKEN.START_BLOCK;
          space_after = false;
        } else if (in_array(current_token.text, ["--", "++", "!", "~"]) || isUnary) {
          if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR) {
            this.allow_wrap_or_preserved_newline(current_token);
          }
          space_before = false;
          space_after = false;
          if (current_token.newlines && (current_token.text === "--" || current_token.text === "++" || current_token.text === "~")) {
            var new_line_needed = reserved_array(this._flags.last_token, special_words) && current_token.newlines;
            if (new_line_needed && (this._previous_flags.if_block || this._previous_flags.else_block)) {
              this.restore_mode();
            }
            this.print_newline(new_line_needed, true);
          }
          if (this._flags.last_token.text === ";" && is_expression(this._flags.mode)) {
            space_before = true;
          }
          if (this._flags.last_token.type === TOKEN.RESERVED) {
            space_before = true;
          } else if (this._flags.last_token.type === TOKEN.END_EXPR) {
            space_before = !(this._flags.last_token.text === "]" && (current_token.text === "--" || current_token.text === "++"));
          } else if (this._flags.last_token.type === TOKEN.OPERATOR) {
            space_before = in_array(current_token.text, ["--", "-", "++", "+"]) && in_array(this._flags.last_token.text, ["--", "-", "++", "+"]);
            if (in_array(current_token.text, ["+", "-"]) && in_array(this._flags.last_token.text, ["--", "++"])) {
              space_after = true;
            }
          }
          if ((this._flags.mode === MODE.BlockStatement && !this._flags.inline_frame || this._flags.mode === MODE.Statement) && (this._flags.last_token.text === "{" || this._flags.last_token.text === ";")) {
            this.print_newline();
          }
        }
        this._output.space_before_token = this._output.space_before_token || space_before;
        this.print_token(current_token);
        this._output.space_before_token = space_after;
      };
      Beautifier.prototype.handle_block_comment = function(current_token, preserve_statement_flags) {
        if (this._output.raw) {
          this._output.add_raw_token(current_token);
          if (current_token.directives && current_token.directives.preserve === "end") {
            this._output.raw = this._options.test_output_raw;
          }
          return;
        }
        if (current_token.directives) {
          this.print_newline(false, preserve_statement_flags);
          this.print_token(current_token);
          if (current_token.directives.preserve === "start") {
            this._output.raw = true;
          }
          this.print_newline(false, true);
          return;
        }
        if (!acorn.newline.test(current_token.text) && !current_token.newlines) {
          this._output.space_before_token = true;
          this.print_token(current_token);
          this._output.space_before_token = true;
          return;
        } else {
          this.print_block_commment(current_token, preserve_statement_flags);
        }
      };
      Beautifier.prototype.print_block_commment = function(current_token, preserve_statement_flags) {
        var lines = split_linebreaks(current_token.text);
        var j;
        var javadoc = false;
        var starless = false;
        var lastIndent = current_token.whitespace_before;
        var lastIndentLength = lastIndent.length;
        this.print_newline(false, preserve_statement_flags);
        this.print_token_line_indentation(current_token);
        this._output.add_token(lines[0]);
        this.print_newline(false, preserve_statement_flags);
        if (lines.length > 1) {
          lines = lines.slice(1);
          javadoc = all_lines_start_with(lines, "*");
          starless = each_line_matches_indent(lines, lastIndent);
          if (javadoc) {
            this._flags.alignment = 1;
          }
          for (j = 0; j < lines.length; j++) {
            if (javadoc) {
              this.print_token_line_indentation(current_token);
              this._output.add_token(ltrim(lines[j]));
            } else if (starless && lines[j]) {
              this.print_token_line_indentation(current_token);
              this._output.add_token(lines[j].substring(lastIndentLength));
            } else {
              this._output.current_line.set_indent(-1);
              this._output.add_token(lines[j]);
            }
            this.print_newline(false, preserve_statement_flags);
          }
          this._flags.alignment = 0;
        }
      };
      Beautifier.prototype.handle_comment = function(current_token, preserve_statement_flags) {
        if (current_token.newlines) {
          this.print_newline(false, preserve_statement_flags);
        } else {
          this._output.trim(true);
        }
        this._output.space_before_token = true;
        this.print_token(current_token);
        this.print_newline(false, preserve_statement_flags);
      };
      Beautifier.prototype.handle_dot = function(current_token) {
        if (this.start_of_statement(current_token)) {
        } else {
          this.handle_whitespace_and_comments(current_token, true);
        }
        if (this._flags.last_token.text.match("^[0-9]+$")) {
          this._output.space_before_token = true;
        }
        if (reserved_array(this._flags.last_token, special_words)) {
          this._output.space_before_token = false;
        } else {
          this.allow_wrap_or_preserved_newline(
            current_token,
            this._flags.last_token.text === ")" && this._options.break_chained_methods
          );
        }
        if (this._options.unindent_chained_methods && this._output.just_added_newline()) {
          this.deindent();
        }
        this.print_token(current_token);
      };
      Beautifier.prototype.handle_unknown = function(current_token, preserve_statement_flags) {
        this.print_token(current_token);
        if (current_token.text[current_token.text.length - 1] === "\n") {
          this.print_newline(false, preserve_statement_flags);
        }
      };
      Beautifier.prototype.handle_eof = function(current_token) {
        while (this._flags.mode === MODE.Statement) {
          this.restore_mode();
        }
        this.handle_whitespace_and_comments(current_token);
      };
      module.exports.Beautifier = Beautifier;
    }
  });

  // node_modules/js-beautify/js/src/javascript/index.js
  var require_javascript = __commonJS({
    "node_modules/js-beautify/js/src/javascript/index.js"(exports, module) {
      "use strict";
      var Beautifier = require_beautifier().Beautifier;
      var Options = require_options2().Options;
      function js_beautify(js_source_text, options) {
        var beautifier = new Beautifier(js_source_text, options);
        return beautifier.beautify();
      }
      module.exports = js_beautify;
      module.exports.defaultOptions = function() {
        return new Options();
      };
    }
  });

  // node_modules/js-beautify/js/src/css/options.js
  var require_options3 = __commonJS({
    "node_modules/js-beautify/js/src/css/options.js"(exports, module) {
      "use strict";
      var BaseOptions = require_options().Options;
      function Options(options) {
        BaseOptions.call(this, options, "css");
        this.selector_separator_newline = this._get_boolean("selector_separator_newline", true);
        this.newline_between_rules = this._get_boolean("newline_between_rules", true);
        var space_around_selector_separator = this._get_boolean("space_around_selector_separator");
        this.space_around_combinator = this._get_boolean("space_around_combinator") || space_around_selector_separator;
        var brace_style_split = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
        this.brace_style = "collapse";
        for (var bs = 0; bs < brace_style_split.length; bs++) {
          if (brace_style_split[bs] !== "expand") {
            this.brace_style = "collapse";
          } else {
            this.brace_style = brace_style_split[bs];
          }
        }
      }
      Options.prototype = new BaseOptions();
      module.exports.Options = Options;
    }
  });

  // node_modules/js-beautify/js/src/css/beautifier.js
  var require_beautifier2 = __commonJS({
    "node_modules/js-beautify/js/src/css/beautifier.js"(exports, module) {
      "use strict";
      var Options = require_options3().Options;
      var Output = require_output().Output;
      var InputScanner = require_inputscanner().InputScanner;
      var Directives = require_directives().Directives;
      var directives_core = new Directives(/\/\*/, /\*\//);
      var lineBreak = /\r\n|[\r\n]/;
      var allLineBreaks = /\r\n|[\r\n]/g;
      var whitespaceChar = /\s/;
      var whitespacePattern = /(?:\s|\n)+/g;
      var block_comment_pattern = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g;
      var comment_pattern = /\/\/(?:[^\n\r\u2028\u2029]*)/g;
      function Beautifier(source_text, options) {
        this._source_text = source_text || "";
        this._options = new Options(options);
        this._ch = null;
        this._input = null;
        this.NESTED_AT_RULE = {
          "page": true,
          "font-face": true,
          "keyframes": true,
          // also in CONDITIONAL_GROUP_RULE below
          "media": true,
          "supports": true,
          "document": true
        };
        this.CONDITIONAL_GROUP_RULE = {
          "media": true,
          "supports": true,
          "document": true
        };
        this.NON_SEMICOLON_NEWLINE_PROPERTY = [
          "grid-template-areas",
          "grid-template"
        ];
      }
      Beautifier.prototype.eatString = function(endChars) {
        var result = "";
        this._ch = this._input.next();
        while (this._ch) {
          result += this._ch;
          if (this._ch === "\\") {
            result += this._input.next();
          } else if (endChars.indexOf(this._ch) !== -1 || this._ch === "\n") {
            break;
          }
          this._ch = this._input.next();
        }
        return result;
      };
      Beautifier.prototype.eatWhitespace = function(allowAtLeastOneNewLine) {
        var result = whitespaceChar.test(this._input.peek());
        var newline_count = 0;
        while (whitespaceChar.test(this._input.peek())) {
          this._ch = this._input.next();
          if (allowAtLeastOneNewLine && this._ch === "\n") {
            if (newline_count === 0 || newline_count < this._options.max_preserve_newlines) {
              newline_count++;
              this._output.add_new_line(true);
            }
          }
        }
        return result;
      };
      Beautifier.prototype.foundNestedPseudoClass = function() {
        var openParen = 0;
        var i = 1;
        var ch = this._input.peek(i);
        while (ch) {
          if (ch === "{") {
            return true;
          } else if (ch === "(") {
            openParen += 1;
          } else if (ch === ")") {
            if (openParen === 0) {
              return false;
            }
            openParen -= 1;
          } else if (ch === ";" || ch === "}") {
            return false;
          }
          i++;
          ch = this._input.peek(i);
        }
        return false;
      };
      Beautifier.prototype.print_string = function(output_string) {
        this._output.set_indent(this._indentLevel);
        this._output.non_breaking_space = true;
        this._output.add_token(output_string);
      };
      Beautifier.prototype.preserveSingleSpace = function(isAfterSpace) {
        if (isAfterSpace) {
          this._output.space_before_token = true;
        }
      };
      Beautifier.prototype.indent = function() {
        this._indentLevel++;
      };
      Beautifier.prototype.outdent = function() {
        if (this._indentLevel > 0) {
          this._indentLevel--;
        }
      };
      Beautifier.prototype.beautify = function() {
        if (this._options.disabled) {
          return this._source_text;
        }
        var source_text = this._source_text;
        var eol = this._options.eol;
        if (eol === "auto") {
          eol = "\n";
          if (source_text && lineBreak.test(source_text || "")) {
            eol = source_text.match(lineBreak)[0];
          }
        }
        source_text = source_text.replace(allLineBreaks, "\n");
        var baseIndentString = source_text.match(/^[\t ]*/)[0];
        this._output = new Output(this._options, baseIndentString);
        this._input = new InputScanner(source_text);
        this._indentLevel = 0;
        this._nestedLevel = 0;
        this._ch = null;
        var parenLevel = 0;
        var insideRule = false;
        var insidePropertyValue = false;
        var enteringConditionalGroup = false;
        var insideNonNestedAtRule = false;
        var insideScssMap = false;
        var topCharacter = this._ch;
        var insideNonSemiColonValues = false;
        var whitespace;
        var isAfterSpace;
        var previous_ch;
        while (true) {
          whitespace = this._input.read(whitespacePattern);
          isAfterSpace = whitespace !== "";
          previous_ch = topCharacter;
          this._ch = this._input.next();
          if (this._ch === "\\" && this._input.hasNext()) {
            this._ch += this._input.next();
          }
          topCharacter = this._ch;
          if (!this._ch) {
            break;
          } else if (this._ch === "/" && this._input.peek() === "*") {
            this._output.add_new_line();
            this._input.back();
            var comment = this._input.read(block_comment_pattern);
            var directives = directives_core.get_directives(comment);
            if (directives && directives.ignore === "start") {
              comment += directives_core.readIgnored(this._input);
            }
            this.print_string(comment);
            this.eatWhitespace(true);
            this._output.add_new_line();
          } else if (this._ch === "/" && this._input.peek() === "/") {
            this._output.space_before_token = true;
            this._input.back();
            this.print_string(this._input.read(comment_pattern));
            this.eatWhitespace(true);
          } else if (this._ch === "$") {
            this.preserveSingleSpace(isAfterSpace);
            this.print_string(this._ch);
            var variable = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
            if (variable.match(/[ :]$/)) {
              variable = this.eatString(": ").replace(/\s+$/, "");
              this.print_string(variable);
              this._output.space_before_token = true;
            }
            if (parenLevel === 0 && variable.indexOf(":") !== -1) {
              insidePropertyValue = true;
              this.indent();
            }
          } else if (this._ch === "@") {
            this.preserveSingleSpace(isAfterSpace);
            if (this._input.peek() === "{") {
              this.print_string(this._ch + this.eatString("}"));
            } else {
              this.print_string(this._ch);
              var variableOrRule = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
              if (variableOrRule.match(/[ :]$/)) {
                variableOrRule = this.eatString(": ").replace(/\s+$/, "");
                this.print_string(variableOrRule);
                this._output.space_before_token = true;
              }
              if (parenLevel === 0 && variableOrRule.indexOf(":") !== -1) {
                insidePropertyValue = true;
                this.indent();
              } else if (variableOrRule in this.NESTED_AT_RULE) {
                this._nestedLevel += 1;
                if (variableOrRule in this.CONDITIONAL_GROUP_RULE) {
                  enteringConditionalGroup = true;
                }
              } else if (parenLevel === 0 && !insidePropertyValue) {
                insideNonNestedAtRule = true;
              }
            }
          } else if (this._ch === "#" && this._input.peek() === "{") {
            this.preserveSingleSpace(isAfterSpace);
            this.print_string(this._ch + this.eatString("}"));
          } else if (this._ch === "{") {
            if (insidePropertyValue) {
              insidePropertyValue = false;
              this.outdent();
            }
            insideNonNestedAtRule = false;
            if (enteringConditionalGroup) {
              enteringConditionalGroup = false;
              insideRule = this._indentLevel >= this._nestedLevel;
            } else {
              insideRule = this._indentLevel >= this._nestedLevel - 1;
            }
            if (this._options.newline_between_rules && insideRule) {
              if (this._output.previous_line && this._output.previous_line.item(-1) !== "{") {
                this._output.ensure_empty_line_above("/", ",");
              }
            }
            this._output.space_before_token = true;
            if (this._options.brace_style === "expand") {
              this._output.add_new_line();
              this.print_string(this._ch);
              this.indent();
              this._output.set_indent(this._indentLevel);
            } else {
              if (previous_ch === "(") {
                this._output.space_before_token = false;
              } else if (previous_ch !== ",") {
                this.indent();
              }
              this.print_string(this._ch);
            }
            this.eatWhitespace(true);
            this._output.add_new_line();
          } else if (this._ch === "}") {
            this.outdent();
            this._output.add_new_line();
            if (previous_ch === "{") {
              this._output.trim(true);
            }
            if (insidePropertyValue) {
              this.outdent();
              insidePropertyValue = false;
            }
            this.print_string(this._ch);
            insideRule = false;
            if (this._nestedLevel) {
              this._nestedLevel--;
            }
            this.eatWhitespace(true);
            this._output.add_new_line();
            if (this._options.newline_between_rules && !this._output.just_added_blankline()) {
              if (this._input.peek() !== "}") {
                this._output.add_new_line(true);
              }
            }
            if (this._input.peek() === ")") {
              this._output.trim(true);
              if (this._options.brace_style === "expand") {
                this._output.add_new_line(true);
              }
            }
          } else if (this._ch === ":") {
            for (var i = 0; i < this.NON_SEMICOLON_NEWLINE_PROPERTY.length; i++) {
              if (this._input.lookBack(this.NON_SEMICOLON_NEWLINE_PROPERTY[i])) {
                insideNonSemiColonValues = true;
                break;
              }
            }
            if ((insideRule || enteringConditionalGroup) && !(this._input.lookBack("&") || this.foundNestedPseudoClass()) && !this._input.lookBack("(") && !insideNonNestedAtRule && parenLevel === 0) {
              this.print_string(":");
              if (!insidePropertyValue) {
                insidePropertyValue = true;
                this._output.space_before_token = true;
                this.eatWhitespace(true);
                this.indent();
              }
            } else {
              if (this._input.lookBack(" ")) {
                this._output.space_before_token = true;
              }
              if (this._input.peek() === ":") {
                this._ch = this._input.next();
                this.print_string("::");
              } else {
                this.print_string(":");
              }
            }
          } else if (this._ch === '"' || this._ch === "'") {
            var preserveQuoteSpace = previous_ch === '"' || previous_ch === "'";
            this.preserveSingleSpace(preserveQuoteSpace || isAfterSpace);
            this.print_string(this._ch + this.eatString(this._ch));
            this.eatWhitespace(true);
          } else if (this._ch === ";") {
            insideNonSemiColonValues = false;
            if (parenLevel === 0) {
              if (insidePropertyValue) {
                this.outdent();
                insidePropertyValue = false;
              }
              insideNonNestedAtRule = false;
              this.print_string(this._ch);
              this.eatWhitespace(true);
              if (this._input.peek() !== "/") {
                this._output.add_new_line();
              }
            } else {
              this.print_string(this._ch);
              this.eatWhitespace(true);
              this._output.space_before_token = true;
            }
          } else if (this._ch === "(") {
            if (this._input.lookBack("url")) {
              this.print_string(this._ch);
              this.eatWhitespace();
              parenLevel++;
              this.indent();
              this._ch = this._input.next();
              if (this._ch === ")" || this._ch === '"' || this._ch === "'") {
                this._input.back();
              } else if (this._ch) {
                this.print_string(this._ch + this.eatString(")"));
                if (parenLevel) {
                  parenLevel--;
                  this.outdent();
                }
              }
            } else {
              var space_needed = false;
              if (this._input.lookBack("with")) {
                space_needed = true;
              }
              this.preserveSingleSpace(isAfterSpace || space_needed);
              this.print_string(this._ch);
              if (insidePropertyValue && previous_ch === "$" && this._options.selector_separator_newline) {
                this._output.add_new_line();
                insideScssMap = true;
              } else {
                this.eatWhitespace();
                parenLevel++;
                this.indent();
              }
            }
          } else if (this._ch === ")") {
            if (parenLevel) {
              parenLevel--;
              this.outdent();
            }
            if (insideScssMap && this._input.peek() === ";" && this._options.selector_separator_newline) {
              insideScssMap = false;
              this.outdent();
              this._output.add_new_line();
            }
            this.print_string(this._ch);
          } else if (this._ch === ",") {
            this.print_string(this._ch);
            this.eatWhitespace(true);
            if (this._options.selector_separator_newline && (!insidePropertyValue || insideScssMap) && parenLevel === 0 && !insideNonNestedAtRule) {
              this._output.add_new_line();
            } else {
              this._output.space_before_token = true;
            }
          } else if ((this._ch === ">" || this._ch === "+" || this._ch === "~") && !insidePropertyValue && parenLevel === 0) {
            if (this._options.space_around_combinator) {
              this._output.space_before_token = true;
              this.print_string(this._ch);
              this._output.space_before_token = true;
            } else {
              this.print_string(this._ch);
              this.eatWhitespace();
              if (this._ch && whitespaceChar.test(this._ch)) {
                this._ch = "";
              }
            }
          } else if (this._ch === "]") {
            this.print_string(this._ch);
          } else if (this._ch === "[") {
            this.preserveSingleSpace(isAfterSpace);
            this.print_string(this._ch);
          } else if (this._ch === "=") {
            this.eatWhitespace();
            this.print_string("=");
            if (whitespaceChar.test(this._ch)) {
              this._ch = "";
            }
          } else if (this._ch === "!" && !this._input.lookBack("\\")) {
            this._output.space_before_token = true;
            this.print_string(this._ch);
          } else {
            var preserveAfterSpace = previous_ch === '"' || previous_ch === "'";
            this.preserveSingleSpace(preserveAfterSpace || isAfterSpace);
            this.print_string(this._ch);
            if (!this._output.just_added_newline() && this._input.peek() === "\n" && insideNonSemiColonValues) {
              this._output.add_new_line();
            }
          }
        }
        var sweetCode = this._output.get_code(eol);
        return sweetCode;
      };
      module.exports.Beautifier = Beautifier;
    }
  });

  // node_modules/js-beautify/js/src/css/index.js
  var require_css = __commonJS({
    "node_modules/js-beautify/js/src/css/index.js"(exports, module) {
      "use strict";
      var Beautifier = require_beautifier2().Beautifier;
      var Options = require_options3().Options;
      function css_beautify(source_text, options) {
        var beautifier = new Beautifier(source_text, options);
        return beautifier.beautify();
      }
      module.exports = css_beautify;
      module.exports.defaultOptions = function() {
        return new Options();
      };
    }
  });

  // node_modules/js-beautify/js/src/html/options.js
  var require_options4 = __commonJS({
    "node_modules/js-beautify/js/src/html/options.js"(exports, module) {
      "use strict";
      var BaseOptions = require_options().Options;
      function Options(options) {
        BaseOptions.call(this, options, "html");
        if (this.templating.length === 1 && this.templating[0] === "auto") {
          this.templating = ["django", "erb", "handlebars", "php"];
        }
        this.indent_inner_html = this._get_boolean("indent_inner_html");
        this.indent_body_inner_html = this._get_boolean("indent_body_inner_html", true);
        this.indent_head_inner_html = this._get_boolean("indent_head_inner_html", true);
        this.indent_handlebars = this._get_boolean("indent_handlebars", true);
        this.wrap_attributes = this._get_selection(
          "wrap_attributes",
          ["auto", "force", "force-aligned", "force-expand-multiline", "aligned-multiple", "preserve", "preserve-aligned"]
        );
        this.wrap_attributes_min_attrs = this._get_number("wrap_attributes_min_attrs", 2);
        this.wrap_attributes_indent_size = this._get_number("wrap_attributes_indent_size", this.indent_size);
        this.extra_liners = this._get_array("extra_liners", ["head", "body", "/html"]);
        this.inline = this._get_array("inline", [
          "a",
          "abbr",
          "area",
          "audio",
          "b",
          "bdi",
          "bdo",
          "br",
          "button",
          "canvas",
          "cite",
          "code",
          "data",
          "datalist",
          "del",
          "dfn",
          "em",
          "embed",
          "i",
          "iframe",
          "img",
          "input",
          "ins",
          "kbd",
          "keygen",
          "label",
          "map",
          "mark",
          "math",
          "meter",
          "noscript",
          "object",
          "output",
          "progress",
          "q",
          "ruby",
          "s",
          "samp",
          /* 'script', */
          "select",
          "small",
          "span",
          "strong",
          "sub",
          "sup",
          "svg",
          "template",
          "textarea",
          "time",
          "u",
          "var",
          "video",
          "wbr",
          "text",
          // obsolete inline tags
          "acronym",
          "big",
          "strike",
          "tt"
        ]);
        this.inline_custom_elements = this._get_boolean("inline_custom_elements", true);
        this.void_elements = this._get_array("void_elements", [
          // HTLM void elements - aka self-closing tags - aka singletons
          // https://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
          "area",
          "base",
          "br",
          "col",
          "embed",
          "hr",
          "img",
          "input",
          "keygen",
          "link",
          "menuitem",
          "meta",
          "param",
          "source",
          "track",
          "wbr",
          // NOTE: Optional tags are too complex for a simple list
          // they are hard coded in _do_optional_end_element
          // Doctype and xml elements
          "!doctype",
          "?xml",
          // obsolete tags
          // basefont: https://www.computerhope.com/jargon/h/html-basefont-tag.htm
          // isndex: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/isindex
          "basefont",
          "isindex"
        ]);
        this.unformatted = this._get_array("unformatted", []);
        this.content_unformatted = this._get_array("content_unformatted", [
          "pre",
          "textarea"
        ]);
        this.unformatted_content_delimiter = this._get_characters("unformatted_content_delimiter");
        this.indent_scripts = this._get_selection("indent_scripts", ["normal", "keep", "separate"]);
      }
      Options.prototype = new BaseOptions();
      module.exports.Options = Options;
    }
  });

  // node_modules/js-beautify/js/src/html/tokenizer.js
  var require_tokenizer3 = __commonJS({
    "node_modules/js-beautify/js/src/html/tokenizer.js"(exports, module) {
      "use strict";
      var BaseTokenizer = require_tokenizer().Tokenizer;
      var BASETOKEN = require_tokenizer().TOKEN;
      var Directives = require_directives().Directives;
      var TemplatablePattern = require_templatablepattern().TemplatablePattern;
      var Pattern = require_pattern().Pattern;
      var TOKEN = {
        TAG_OPEN: "TK_TAG_OPEN",
        TAG_CLOSE: "TK_TAG_CLOSE",
        CONTROL_FLOW_OPEN: "TK_CONTROL_FLOW_OPEN",
        CONTROL_FLOW_CLOSE: "TK_CONTROL_FLOW_CLOSE",
        ATTRIBUTE: "TK_ATTRIBUTE",
        EQUALS: "TK_EQUALS",
        VALUE: "TK_VALUE",
        COMMENT: "TK_COMMENT",
        TEXT: "TK_TEXT",
        UNKNOWN: "TK_UNKNOWN",
        START: BASETOKEN.START,
        RAW: BASETOKEN.RAW,
        EOF: BASETOKEN.EOF
      };
      var directives_core = new Directives(/<\!--/, /-->/);
      var Tokenizer = function(input_string, options) {
        BaseTokenizer.call(this, input_string, options);
        this._current_tag_name = "";
        var templatable_reader = new TemplatablePattern(this._input).read_options(this._options);
        var pattern_reader = new Pattern(this._input);
        this.__patterns = {
          word: templatable_reader.until(/[\n\r\t <]/),
          word_control_flow_close_excluded: templatable_reader.until(/[\n\r\t <}]/),
          single_quote: templatable_reader.until_after(/'/),
          double_quote: templatable_reader.until_after(/"/),
          attribute: templatable_reader.until(/[\n\r\t =>]|\/>/),
          element_name: templatable_reader.until(/[\n\r\t >\/]/),
          angular_control_flow_start: pattern_reader.matching(/\@[a-zA-Z]+[^({]*[({]/),
          handlebars_comment: pattern_reader.starting_with(/{{!--/).until_after(/--}}/),
          handlebars: pattern_reader.starting_with(/{{/).until_after(/}}/),
          handlebars_open: pattern_reader.until(/[\n\r\t }]/),
          handlebars_raw_close: pattern_reader.until(/}}/),
          comment: pattern_reader.starting_with(/<!--/).until_after(/-->/),
          cdata: pattern_reader.starting_with(/<!\[CDATA\[/).until_after(/]]>/),
          // https://en.wikipedia.org/wiki/Conditional_comment
          conditional_comment: pattern_reader.starting_with(/<!\[/).until_after(/]>/),
          processing: pattern_reader.starting_with(/<\?/).until_after(/\?>/)
        };
        if (this._options.indent_handlebars) {
          this.__patterns.word = this.__patterns.word.exclude("handlebars");
          this.__patterns.word_control_flow_close_excluded = this.__patterns.word_control_flow_close_excluded.exclude("handlebars");
        }
        this._unformatted_content_delimiter = null;
        if (this._options.unformatted_content_delimiter) {
          var literal_regexp = this._input.get_literal_regexp(this._options.unformatted_content_delimiter);
          this.__patterns.unformatted_content_delimiter = pattern_reader.matching(literal_regexp).until_after(literal_regexp);
        }
      };
      Tokenizer.prototype = new BaseTokenizer();
      Tokenizer.prototype._is_comment = function(current_token) {
        return false;
      };
      Tokenizer.prototype._is_opening = function(current_token) {
        return current_token.type === TOKEN.TAG_OPEN || current_token.type === TOKEN.CONTROL_FLOW_OPEN;
      };
      Tokenizer.prototype._is_closing = function(current_token, open_token) {
        return current_token.type === TOKEN.TAG_CLOSE && (open_token && ((current_token.text === ">" || current_token.text === "/>") && open_token.text[0] === "<" || current_token.text === "}}" && open_token.text[0] === "{" && open_token.text[1] === "{")) || current_token.type === TOKEN.CONTROL_FLOW_CLOSE && (current_token.text === "}" && open_token.text.endsWith("{"));
      };
      Tokenizer.prototype._reset = function() {
        this._current_tag_name = "";
      };
      Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
        var token = null;
        this._readWhitespace();
        var c = this._input.peek();
        if (c === null) {
          return this._create_token(TOKEN.EOF, "");
        }
        token = token || this._read_open_handlebars(c, open_token);
        token = token || this._read_attribute(c, previous_token, open_token);
        token = token || this._read_close(c, open_token);
        token = token || this._read_script_and_style(c, previous_token);
        token = token || this._read_control_flows(c, open_token);
        token = token || this._read_raw_content(c, previous_token, open_token);
        token = token || this._read_content_word(c, open_token);
        token = token || this._read_comment_or_cdata(c);
        token = token || this._read_processing(c);
        token = token || this._read_open(c, open_token);
        token = token || this._create_token(TOKEN.UNKNOWN, this._input.next());
        return token;
      };
      Tokenizer.prototype._read_comment_or_cdata = function(c) {
        var token = null;
        var resulting_string = null;
        var directives = null;
        if (c === "<") {
          var peek1 = this._input.peek(1);
          if (peek1 === "!") {
            resulting_string = this.__patterns.comment.read();
            if (resulting_string) {
              directives = directives_core.get_directives(resulting_string);
              if (directives && directives.ignore === "start") {
                resulting_string += directives_core.readIgnored(this._input);
              }
            } else {
              resulting_string = this.__patterns.cdata.read();
            }
          }
          if (resulting_string) {
            token = this._create_token(TOKEN.COMMENT, resulting_string);
            token.directives = directives;
          }
        }
        return token;
      };
      Tokenizer.prototype._read_processing = function(c) {
        var token = null;
        var resulting_string = null;
        var directives = null;
        if (c === "<") {
          var peek1 = this._input.peek(1);
          if (peek1 === "!" || peek1 === "?") {
            resulting_string = this.__patterns.conditional_comment.read();
            resulting_string = resulting_string || this.__patterns.processing.read();
          }
          if (resulting_string) {
            token = this._create_token(TOKEN.COMMENT, resulting_string);
            token.directives = directives;
          }
        }
        return token;
      };
      Tokenizer.prototype._read_open = function(c, open_token) {
        var resulting_string = null;
        var token = null;
        if (!open_token || open_token.type === TOKEN.CONTROL_FLOW_OPEN) {
          if (c === "<") {
            resulting_string = this._input.next();
            if (this._input.peek() === "/") {
              resulting_string += this._input.next();
            }
            resulting_string += this.__patterns.element_name.read();
            token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
          }
        }
        return token;
      };
      Tokenizer.prototype._read_open_handlebars = function(c, open_token) {
        var resulting_string = null;
        var token = null;
        if (!open_token || open_token.type === TOKEN.CONTROL_FLOW_OPEN) {
          if ((this._options.templating.includes("angular") || this._options.indent_handlebars) && c === "{" && this._input.peek(1) === "{") {
            if (this._options.indent_handlebars && this._input.peek(2) === "!") {
              resulting_string = this.__patterns.handlebars_comment.read();
              resulting_string = resulting_string || this.__patterns.handlebars.read();
              token = this._create_token(TOKEN.COMMENT, resulting_string);
            } else {
              resulting_string = this.__patterns.handlebars_open.read();
              token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
            }
          }
        }
        return token;
      };
      Tokenizer.prototype._read_control_flows = function(c, open_token) {
        var resulting_string = "";
        var token = null;
        if (!this._options.templating.includes("angular")) {
          return token;
        }
        if (c === "@") {
          resulting_string = this.__patterns.angular_control_flow_start.read();
          if (resulting_string === "") {
            return token;
          }
          var opening_parentheses_count = resulting_string.endsWith("(") ? 1 : 0;
          var closing_parentheses_count = 0;
          while (!(resulting_string.endsWith("{") && opening_parentheses_count === closing_parentheses_count)) {
            var next_char = this._input.next();
            if (next_char === null) {
              break;
            } else if (next_char === "(") {
              opening_parentheses_count++;
            } else if (next_char === ")") {
              closing_parentheses_count++;
            }
            resulting_string += next_char;
          }
          token = this._create_token(TOKEN.CONTROL_FLOW_OPEN, resulting_string);
        } else if (c === "}" && open_token && open_token.type === TOKEN.CONTROL_FLOW_OPEN) {
          resulting_string = this._input.next();
          token = this._create_token(TOKEN.CONTROL_FLOW_CLOSE, resulting_string);
        }
        return token;
      };
      Tokenizer.prototype._read_close = function(c, open_token) {
        var resulting_string = null;
        var token = null;
        if (open_token && open_token.type === TOKEN.TAG_OPEN) {
          if (open_token.text[0] === "<" && (c === ">" || c === "/" && this._input.peek(1) === ">")) {
            resulting_string = this._input.next();
            if (c === "/") {
              resulting_string += this._input.next();
            }
            token = this._create_token(TOKEN.TAG_CLOSE, resulting_string);
          } else if (open_token.text[0] === "{" && c === "}" && this._input.peek(1) === "}") {
            this._input.next();
            this._input.next();
            token = this._create_token(TOKEN.TAG_CLOSE, "}}");
          }
        }
        return token;
      };
      Tokenizer.prototype._read_attribute = function(c, previous_token, open_token) {
        var token = null;
        var resulting_string = "";
        if (open_token && open_token.text[0] === "<") {
          if (c === "=") {
            token = this._create_token(TOKEN.EQUALS, this._input.next());
          } else if (c === '"' || c === "'") {
            var content = this._input.next();
            if (c === '"') {
              content += this.__patterns.double_quote.read();
            } else {
              content += this.__patterns.single_quote.read();
            }
            token = this._create_token(TOKEN.VALUE, content);
          } else {
            resulting_string = this.__patterns.attribute.read();
            if (resulting_string) {
              if (previous_token.type === TOKEN.EQUALS) {
                token = this._create_token(TOKEN.VALUE, resulting_string);
              } else {
                token = this._create_token(TOKEN.ATTRIBUTE, resulting_string);
              }
            }
          }
        }
        return token;
      };
      Tokenizer.prototype._is_content_unformatted = function(tag_name) {
        return this._options.void_elements.indexOf(tag_name) === -1 && (this._options.content_unformatted.indexOf(tag_name) !== -1 || this._options.unformatted.indexOf(tag_name) !== -1);
      };
      Tokenizer.prototype._read_raw_content = function(c, previous_token, open_token) {
        var resulting_string = "";
        if (open_token && open_token.text[0] === "{") {
          resulting_string = this.__patterns.handlebars_raw_close.read();
        } else if (previous_token.type === TOKEN.TAG_CLOSE && previous_token.opened.text[0] === "<" && previous_token.text[0] !== "/") {
          var tag_name = previous_token.opened.text.substr(1).toLowerCase();
          if (this._is_content_unformatted(tag_name)) {
            resulting_string = this._input.readUntil(new RegExp("</" + tag_name + "[\\n\\r\\t ]*?>", "ig"));
          }
        }
        if (resulting_string) {
          return this._create_token(TOKEN.TEXT, resulting_string);
        }
        return null;
      };
      Tokenizer.prototype._read_script_and_style = function(c, previous_token) {
        if (previous_token.type === TOKEN.TAG_CLOSE && previous_token.opened.text[0] === "<" && previous_token.text[0] !== "/") {
          var tag_name = previous_token.opened.text.substr(1).toLowerCase();
          if (tag_name === "script" || tag_name === "style") {
            var token = this._read_comment_or_cdata(c);
            if (token) {
              token.type = TOKEN.TEXT;
              return token;
            }
            var resulting_string = this._input.readUntil(new RegExp("</" + tag_name + "[\\n\\r\\t ]*?>", "ig"));
            if (resulting_string) {
              return this._create_token(TOKEN.TEXT, resulting_string);
            }
          }
        }
        return null;
      };
      Tokenizer.prototype._read_content_word = function(c, open_token) {
        var resulting_string = "";
        if (this._options.unformatted_content_delimiter) {
          if (c === this._options.unformatted_content_delimiter[0]) {
            resulting_string = this.__patterns.unformatted_content_delimiter.read();
          }
        }
        if (!resulting_string) {
          resulting_string = open_token && open_token.type === TOKEN.CONTROL_FLOW_OPEN ? this.__patterns.word_control_flow_close_excluded.read() : this.__patterns.word.read();
        }
        if (resulting_string) {
          return this._create_token(TOKEN.TEXT, resulting_string);
        }
        return null;
      };
      module.exports.Tokenizer = Tokenizer;
      module.exports.TOKEN = TOKEN;
    }
  });

  // node_modules/js-beautify/js/src/html/beautifier.js
  var require_beautifier3 = __commonJS({
    "node_modules/js-beautify/js/src/html/beautifier.js"(exports, module) {
      "use strict";
      var Options = require_options4().Options;
      var Output = require_output().Output;
      var Tokenizer = require_tokenizer3().Tokenizer;
      var TOKEN = require_tokenizer3().TOKEN;
      var lineBreak = /\r\n|[\r\n]/;
      var allLineBreaks = /\r\n|[\r\n]/g;
      var Printer = function(options, base_indent_string) {
        this.indent_level = 0;
        this.alignment_size = 0;
        this.max_preserve_newlines = options.max_preserve_newlines;
        this.preserve_newlines = options.preserve_newlines;
        this._output = new Output(options, base_indent_string);
      };
      Printer.prototype.current_line_has_match = function(pattern) {
        return this._output.current_line.has_match(pattern);
      };
      Printer.prototype.set_space_before_token = function(value, non_breaking) {
        this._output.space_before_token = value;
        this._output.non_breaking_space = non_breaking;
      };
      Printer.prototype.set_wrap_point = function() {
        this._output.set_indent(this.indent_level, this.alignment_size);
        this._output.set_wrap_point();
      };
      Printer.prototype.add_raw_token = function(token) {
        this._output.add_raw_token(token);
      };
      Printer.prototype.print_preserved_newlines = function(raw_token) {
        var newlines = 0;
        if (raw_token.type !== TOKEN.TEXT && raw_token.previous.type !== TOKEN.TEXT) {
          newlines = raw_token.newlines ? 1 : 0;
        }
        if (this.preserve_newlines) {
          newlines = raw_token.newlines < this.max_preserve_newlines + 1 ? raw_token.newlines : this.max_preserve_newlines + 1;
        }
        for (var n = 0; n < newlines; n++) {
          this.print_newline(n > 0);
        }
        return newlines !== 0;
      };
      Printer.prototype.traverse_whitespace = function(raw_token) {
        if (raw_token.whitespace_before || raw_token.newlines) {
          if (!this.print_preserved_newlines(raw_token)) {
            this._output.space_before_token = true;
          }
          return true;
        }
        return false;
      };
      Printer.prototype.previous_token_wrapped = function() {
        return this._output.previous_token_wrapped;
      };
      Printer.prototype.print_newline = function(force) {
        this._output.add_new_line(force);
      };
      Printer.prototype.print_token = function(token) {
        if (token.text) {
          this._output.set_indent(this.indent_level, this.alignment_size);
          this._output.add_token(token.text);
        }
      };
      Printer.prototype.indent = function() {
        this.indent_level++;
      };
      Printer.prototype.deindent = function() {
        if (this.indent_level > 0) {
          this.indent_level--;
          this._output.set_indent(this.indent_level, this.alignment_size);
        }
      };
      Printer.prototype.get_full_indent = function(level) {
        level = this.indent_level + (level || 0);
        if (level < 1) {
          return "";
        }
        return this._output.get_indent_string(level);
      };
      var get_type_attribute = function(start_token) {
        var result = null;
        var raw_token = start_token.next;
        while (raw_token.type !== TOKEN.EOF && start_token.closed !== raw_token) {
          if (raw_token.type === TOKEN.ATTRIBUTE && raw_token.text === "type") {
            if (raw_token.next && raw_token.next.type === TOKEN.EQUALS && raw_token.next.next && raw_token.next.next.type === TOKEN.VALUE) {
              result = raw_token.next.next.text;
            }
            break;
          }
          raw_token = raw_token.next;
        }
        return result;
      };
      var get_custom_beautifier_name = function(tag_check, raw_token) {
        var typeAttribute = null;
        var result = null;
        if (!raw_token.closed) {
          return null;
        }
        if (tag_check === "script") {
          typeAttribute = "text/javascript";
        } else if (tag_check === "style") {
          typeAttribute = "text/css";
        }
        typeAttribute = get_type_attribute(raw_token) || typeAttribute;
        if (typeAttribute.search("text/css") > -1) {
          result = "css";
        } else if (typeAttribute.search(/module|((text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect))/) > -1) {
          result = "javascript";
        } else if (typeAttribute.search(/(text|application|dojo)\/(x-)?(html)/) > -1) {
          result = "html";
        } else if (typeAttribute.search(/test\/null/) > -1) {
          result = "null";
        }
        return result;
      };
      function in_array(what, arr) {
        return arr.indexOf(what) !== -1;
      }
      function TagFrame(parent, parser_token, indent_level) {
        this.parent = parent || null;
        this.tag = parser_token ? parser_token.tag_name : "";
        this.indent_level = indent_level || 0;
        this.parser_token = parser_token || null;
      }
      function TagStack(printer) {
        this._printer = printer;
        this._current_frame = null;
      }
      TagStack.prototype.get_parser_token = function() {
        return this._current_frame ? this._current_frame.parser_token : null;
      };
      TagStack.prototype.record_tag = function(parser_token) {
        var new_frame = new TagFrame(this._current_frame, parser_token, this._printer.indent_level);
        this._current_frame = new_frame;
      };
      TagStack.prototype._try_pop_frame = function(frame) {
        var parser_token = null;
        if (frame) {
          parser_token = frame.parser_token;
          this._printer.indent_level = frame.indent_level;
          this._current_frame = frame.parent;
        }
        return parser_token;
      };
      TagStack.prototype._get_frame = function(tag_list, stop_list) {
        var frame = this._current_frame;
        while (frame) {
          if (tag_list.indexOf(frame.tag) !== -1) {
            break;
          } else if (stop_list && stop_list.indexOf(frame.tag) !== -1) {
            frame = null;
            break;
          }
          frame = frame.parent;
        }
        return frame;
      };
      TagStack.prototype.try_pop = function(tag, stop_list) {
        var frame = this._get_frame([tag], stop_list);
        return this._try_pop_frame(frame);
      };
      TagStack.prototype.indent_to_tag = function(tag_list) {
        var frame = this._get_frame(tag_list);
        if (frame) {
          this._printer.indent_level = frame.indent_level;
        }
      };
      function Beautifier(source_text, options, js_beautify, css_beautify) {
        this._source_text = source_text || "";
        options = options || {};
        this._js_beautify = js_beautify;
        this._css_beautify = css_beautify;
        this._tag_stack = null;
        var optionHtml = new Options(options, "html");
        this._options = optionHtml;
        this._is_wrap_attributes_force = this._options.wrap_attributes.substr(0, "force".length) === "force";
        this._is_wrap_attributes_force_expand_multiline = this._options.wrap_attributes === "force-expand-multiline";
        this._is_wrap_attributes_force_aligned = this._options.wrap_attributes === "force-aligned";
        this._is_wrap_attributes_aligned_multiple = this._options.wrap_attributes === "aligned-multiple";
        this._is_wrap_attributes_preserve = this._options.wrap_attributes.substr(0, "preserve".length) === "preserve";
        this._is_wrap_attributes_preserve_aligned = this._options.wrap_attributes === "preserve-aligned";
      }
      Beautifier.prototype.beautify = function() {
        if (this._options.disabled) {
          return this._source_text;
        }
        var source_text = this._source_text;
        var eol = this._options.eol;
        if (this._options.eol === "auto") {
          eol = "\n";
          if (source_text && lineBreak.test(source_text)) {
            eol = source_text.match(lineBreak)[0];
          }
        }
        source_text = source_text.replace(allLineBreaks, "\n");
        var baseIndentString = source_text.match(/^[\t ]*/)[0];
        var last_token = {
          text: "",
          type: ""
        };
        var last_tag_token = new TagOpenParserToken(this._options);
        var printer = new Printer(this._options, baseIndentString);
        var tokens = new Tokenizer(source_text, this._options).tokenize();
        this._tag_stack = new TagStack(printer);
        var parser_token = null;
        var raw_token = tokens.next();
        while (raw_token.type !== TOKEN.EOF) {
          if (raw_token.type === TOKEN.TAG_OPEN || raw_token.type === TOKEN.COMMENT) {
            parser_token = this._handle_tag_open(printer, raw_token, last_tag_token, last_token, tokens);
            last_tag_token = parser_token;
          } else if (raw_token.type === TOKEN.ATTRIBUTE || raw_token.type === TOKEN.EQUALS || raw_token.type === TOKEN.VALUE || raw_token.type === TOKEN.TEXT && !last_tag_token.tag_complete) {
            parser_token = this._handle_inside_tag(printer, raw_token, last_tag_token, last_token);
          } else if (raw_token.type === TOKEN.TAG_CLOSE) {
            parser_token = this._handle_tag_close(printer, raw_token, last_tag_token);
          } else if (raw_token.type === TOKEN.TEXT) {
            parser_token = this._handle_text(printer, raw_token, last_tag_token);
          } else if (raw_token.type === TOKEN.CONTROL_FLOW_OPEN) {
            parser_token = this._handle_control_flow_open(printer, raw_token);
          } else if (raw_token.type === TOKEN.CONTROL_FLOW_CLOSE) {
            parser_token = this._handle_control_flow_close(printer, raw_token);
          } else {
            printer.add_raw_token(raw_token);
          }
          last_token = parser_token;
          raw_token = tokens.next();
        }
        var sweet_code = printer._output.get_code(eol);
        return sweet_code;
      };
      Beautifier.prototype._handle_control_flow_open = function(printer, raw_token) {
        var parser_token = {
          text: raw_token.text,
          type: raw_token.type
        };
        printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
        if (raw_token.newlines) {
          printer.print_preserved_newlines(raw_token);
        } else {
          printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
        }
        printer.print_token(raw_token);
        printer.indent();
        return parser_token;
      };
      Beautifier.prototype._handle_control_flow_close = function(printer, raw_token) {
        var parser_token = {
          text: raw_token.text,
          type: raw_token.type
        };
        printer.deindent();
        if (raw_token.newlines) {
          printer.print_preserved_newlines(raw_token);
        } else {
          printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
        }
        printer.print_token(raw_token);
        return parser_token;
      };
      Beautifier.prototype._handle_tag_close = function(printer, raw_token, last_tag_token) {
        var parser_token = {
          text: raw_token.text,
          type: raw_token.type
        };
        printer.alignment_size = 0;
        last_tag_token.tag_complete = true;
        printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
        if (last_tag_token.is_unformatted) {
          printer.add_raw_token(raw_token);
        } else {
          if (last_tag_token.tag_start_char === "<") {
            printer.set_space_before_token(raw_token.text[0] === "/", true);
            if (this._is_wrap_attributes_force_expand_multiline && last_tag_token.has_wrapped_attrs) {
              printer.print_newline(false);
            }
          }
          printer.print_token(raw_token);
        }
        if (last_tag_token.indent_content && !(last_tag_token.is_unformatted || last_tag_token.is_content_unformatted)) {
          printer.indent();
          last_tag_token.indent_content = false;
        }
        if (!last_tag_token.is_inline_element && !(last_tag_token.is_unformatted || last_tag_token.is_content_unformatted)) {
          printer.set_wrap_point();
        }
        return parser_token;
      };
      Beautifier.prototype._handle_inside_tag = function(printer, raw_token, last_tag_token, last_token) {
        var wrapped = last_tag_token.has_wrapped_attrs;
        var parser_token = {
          text: raw_token.text,
          type: raw_token.type
        };
        printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
        if (last_tag_token.is_unformatted) {
          printer.add_raw_token(raw_token);
        } else if (last_tag_token.tag_start_char === "{" && raw_token.type === TOKEN.TEXT) {
          if (printer.print_preserved_newlines(raw_token)) {
            raw_token.newlines = 0;
            printer.add_raw_token(raw_token);
          } else {
            printer.print_token(raw_token);
          }
        } else {
          if (raw_token.type === TOKEN.ATTRIBUTE) {
            printer.set_space_before_token(true);
          } else if (raw_token.type === TOKEN.EQUALS) {
            printer.set_space_before_token(false);
          } else if (raw_token.type === TOKEN.VALUE && raw_token.previous.type === TOKEN.EQUALS) {
            printer.set_space_before_token(false);
          }
          if (raw_token.type === TOKEN.ATTRIBUTE && last_tag_token.tag_start_char === "<") {
            if (this._is_wrap_attributes_preserve || this._is_wrap_attributes_preserve_aligned) {
              printer.traverse_whitespace(raw_token);
              wrapped = wrapped || raw_token.newlines !== 0;
            }
            if (this._is_wrap_attributes_force && last_tag_token.attr_count >= this._options.wrap_attributes_min_attrs && (last_token.type !== TOKEN.TAG_OPEN || // ie. second attribute and beyond
            this._is_wrap_attributes_force_expand_multiline)) {
              printer.print_newline(false);
              wrapped = true;
            }
          }
          printer.print_token(raw_token);
          wrapped = wrapped || printer.previous_token_wrapped();
          last_tag_token.has_wrapped_attrs = wrapped;
        }
        return parser_token;
      };
      Beautifier.prototype._handle_text = function(printer, raw_token, last_tag_token) {
        var parser_token = {
          text: raw_token.text,
          type: "TK_CONTENT"
        };
        if (last_tag_token.custom_beautifier_name) {
          this._print_custom_beatifier_text(printer, raw_token, last_tag_token);
        } else if (last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) {
          printer.add_raw_token(raw_token);
        } else {
          printer.traverse_whitespace(raw_token);
          printer.print_token(raw_token);
        }
        return parser_token;
      };
      Beautifier.prototype._print_custom_beatifier_text = function(printer, raw_token, last_tag_token) {
        var local = this;
        if (raw_token.text !== "") {
          var text = raw_token.text, _beautifier, script_indent_level = 1, pre = "", post = "";
          if (last_tag_token.custom_beautifier_name === "javascript" && typeof this._js_beautify === "function") {
            _beautifier = this._js_beautify;
          } else if (last_tag_token.custom_beautifier_name === "css" && typeof this._css_beautify === "function") {
            _beautifier = this._css_beautify;
          } else if (last_tag_token.custom_beautifier_name === "html") {
            _beautifier = function(html_source, options) {
              var beautifier = new Beautifier(html_source, options, local._js_beautify, local._css_beautify);
              return beautifier.beautify();
            };
          }
          if (this._options.indent_scripts === "keep") {
            script_indent_level = 0;
          } else if (this._options.indent_scripts === "separate") {
            script_indent_level = -printer.indent_level;
          }
          var indentation = printer.get_full_indent(script_indent_level);
          text = text.replace(/\n[ \t]*$/, "");
          if (last_tag_token.custom_beautifier_name !== "html" && text[0] === "<" && text.match(/^(<!--|<!\[CDATA\[)/)) {
            var matched = /^(<!--[^\n]*|<!\[CDATA\[)(\n?)([ \t\n]*)([\s\S]*)(-->|]]>)$/.exec(text);
            if (!matched) {
              printer.add_raw_token(raw_token);
              return;
            }
            pre = indentation + matched[1] + "\n";
            text = matched[4];
            if (matched[5]) {
              post = indentation + matched[5];
            }
            text = text.replace(/\n[ \t]*$/, "");
            if (matched[2] || matched[3].indexOf("\n") !== -1) {
              matched = matched[3].match(/[ \t]+$/);
              if (matched) {
                raw_token.whitespace_before = matched[0];
              }
            }
          }
          if (text) {
            if (_beautifier) {
              var Child_options = function() {
                this.eol = "\n";
              };
              Child_options.prototype = this._options.raw_options;
              var child_options = new Child_options();
              text = _beautifier(indentation + text, child_options);
            } else {
              var white = raw_token.whitespace_before;
              if (white) {
                text = text.replace(new RegExp("\n(" + white + ")?", "g"), "\n");
              }
              text = indentation + text.replace(/\n/g, "\n" + indentation);
            }
          }
          if (pre) {
            if (!text) {
              text = pre + post;
            } else {
              text = pre + text + "\n" + post;
            }
          }
          printer.print_newline(false);
          if (text) {
            raw_token.text = text;
            raw_token.whitespace_before = "";
            raw_token.newlines = 0;
            printer.add_raw_token(raw_token);
            printer.print_newline(true);
          }
        }
      };
      Beautifier.prototype._handle_tag_open = function(printer, raw_token, last_tag_token, last_token, tokens) {
        var parser_token = this._get_tag_open_token(raw_token);
        if ((last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) && !last_tag_token.is_empty_element && raw_token.type === TOKEN.TAG_OPEN && !parser_token.is_start_tag) {
          printer.add_raw_token(raw_token);
          parser_token.start_tag_token = this._tag_stack.try_pop(parser_token.tag_name);
        } else {
          printer.traverse_whitespace(raw_token);
          this._set_tag_position(printer, raw_token, parser_token, last_tag_token, last_token);
          if (!parser_token.is_inline_element) {
            printer.set_wrap_point();
          }
          printer.print_token(raw_token);
        }
        if (parser_token.is_start_tag && this._is_wrap_attributes_force) {
          var peek_index = 0;
          var peek_token;
          do {
            peek_token = tokens.peek(peek_index);
            if (peek_token.type === TOKEN.ATTRIBUTE) {
              parser_token.attr_count += 1;
            }
            peek_index += 1;
          } while (peek_token.type !== TOKEN.EOF && peek_token.type !== TOKEN.TAG_CLOSE);
        }
        if (this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple || this._is_wrap_attributes_preserve_aligned) {
          parser_token.alignment_size = raw_token.text.length + 1;
        }
        if (!parser_token.tag_complete && !parser_token.is_unformatted) {
          printer.alignment_size = parser_token.alignment_size;
        }
        return parser_token;
      };
      var TagOpenParserToken = function(options, parent, raw_token) {
        this.parent = parent || null;
        this.text = "";
        this.type = "TK_TAG_OPEN";
        this.tag_name = "";
        this.is_inline_element = false;
        this.is_unformatted = false;
        this.is_content_unformatted = false;
        this.is_empty_element = false;
        this.is_start_tag = false;
        this.is_end_tag = false;
        this.indent_content = false;
        this.multiline_content = false;
        this.custom_beautifier_name = null;
        this.start_tag_token = null;
        this.attr_count = 0;
        this.has_wrapped_attrs = false;
        this.alignment_size = 0;
        this.tag_complete = false;
        this.tag_start_char = "";
        this.tag_check = "";
        if (!raw_token) {
          this.tag_complete = true;
        } else {
          var tag_check_match;
          this.tag_start_char = raw_token.text[0];
          this.text = raw_token.text;
          if (this.tag_start_char === "<") {
            tag_check_match = raw_token.text.match(/^<([^\s>]*)/);
            this.tag_check = tag_check_match ? tag_check_match[1] : "";
          } else {
            tag_check_match = raw_token.text.match(/^{{~?(?:[\^]|#\*?)?([^\s}]+)/);
            this.tag_check = tag_check_match ? tag_check_match[1] : "";
            if ((raw_token.text.startsWith("{{#>") || raw_token.text.startsWith("{{~#>")) && this.tag_check[0] === ">") {
              if (this.tag_check === ">" && raw_token.next !== null) {
                this.tag_check = raw_token.next.text.split(" ")[0];
              } else {
                this.tag_check = raw_token.text.split(">")[1];
              }
            }
          }
          this.tag_check = this.tag_check.toLowerCase();
          if (raw_token.type === TOKEN.COMMENT) {
            this.tag_complete = true;
          }
          this.is_start_tag = this.tag_check.charAt(0) !== "/";
          this.tag_name = !this.is_start_tag ? this.tag_check.substr(1) : this.tag_check;
          this.is_end_tag = !this.is_start_tag || raw_token.closed && raw_token.closed.text === "/>";
          var handlebar_starts = 2;
          if (this.tag_start_char === "{" && this.text.length >= 3) {
            if (this.text.charAt(2) === "~") {
              handlebar_starts = 3;
            }
          }
          this.is_end_tag = this.is_end_tag || this.tag_start_char === "{" && (!options.indent_handlebars || this.text.length < 3 || /[^#\^]/.test(this.text.charAt(handlebar_starts)));
        }
      };
      Beautifier.prototype._get_tag_open_token = function(raw_token) {
        var parser_token = new TagOpenParserToken(this._options, this._tag_stack.get_parser_token(), raw_token);
        parser_token.alignment_size = this._options.wrap_attributes_indent_size;
        parser_token.is_end_tag = parser_token.is_end_tag || in_array(parser_token.tag_check, this._options.void_elements);
        parser_token.is_empty_element = parser_token.tag_complete || parser_token.is_start_tag && parser_token.is_end_tag;
        parser_token.is_unformatted = !parser_token.tag_complete && in_array(parser_token.tag_check, this._options.unformatted);
        parser_token.is_content_unformatted = !parser_token.is_empty_element && in_array(parser_token.tag_check, this._options.content_unformatted);
        parser_token.is_inline_element = in_array(parser_token.tag_name, this._options.inline) || this._options.inline_custom_elements && parser_token.tag_name.includes("-") || parser_token.tag_start_char === "{";
        return parser_token;
      };
      Beautifier.prototype._set_tag_position = function(printer, raw_token, parser_token, last_tag_token, last_token) {
        if (!parser_token.is_empty_element) {
          if (parser_token.is_end_tag) {
            parser_token.start_tag_token = this._tag_stack.try_pop(parser_token.tag_name);
          } else {
            if (this._do_optional_end_element(parser_token)) {
              if (!parser_token.is_inline_element) {
                printer.print_newline(false);
              }
            }
            this._tag_stack.record_tag(parser_token);
            if ((parser_token.tag_name === "script" || parser_token.tag_name === "style") && !(parser_token.is_unformatted || parser_token.is_content_unformatted)) {
              parser_token.custom_beautifier_name = get_custom_beautifier_name(parser_token.tag_check, raw_token);
            }
          }
        }
        if (in_array(parser_token.tag_check, this._options.extra_liners)) {
          printer.print_newline(false);
          if (!printer._output.just_added_blankline()) {
            printer.print_newline(true);
          }
        }
        if (parser_token.is_empty_element) {
          if (parser_token.tag_start_char === "{" && parser_token.tag_check === "else") {
            this._tag_stack.indent_to_tag(["if", "unless", "each"]);
            parser_token.indent_content = true;
            var foundIfOnCurrentLine = printer.current_line_has_match(/{{#if/);
            if (!foundIfOnCurrentLine) {
              printer.print_newline(false);
            }
          }
          if (parser_token.tag_name === "!--" && last_token.type === TOKEN.TAG_CLOSE && last_tag_token.is_end_tag && parser_token.text.indexOf("\n") === -1) {
          } else {
            if (!(parser_token.is_inline_element || parser_token.is_unformatted)) {
              printer.print_newline(false);
            }
            this._calcluate_parent_multiline(printer, parser_token);
          }
        } else if (parser_token.is_end_tag) {
          var do_end_expand = false;
          do_end_expand = parser_token.start_tag_token && parser_token.start_tag_token.multiline_content;
          do_end_expand = do_end_expand || !parser_token.is_inline_element && !(last_tag_token.is_inline_element || last_tag_token.is_unformatted) && !(last_token.type === TOKEN.TAG_CLOSE && parser_token.start_tag_token === last_tag_token) && last_token.type !== "TK_CONTENT";
          if (parser_token.is_content_unformatted || parser_token.is_unformatted) {
            do_end_expand = false;
          }
          if (do_end_expand) {
            printer.print_newline(false);
          }
        } else {
          parser_token.indent_content = !parser_token.custom_beautifier_name;
          if (parser_token.tag_start_char === "<") {
            if (parser_token.tag_name === "html") {
              parser_token.indent_content = this._options.indent_inner_html;
            } else if (parser_token.tag_name === "head") {
              parser_token.indent_content = this._options.indent_head_inner_html;
            } else if (parser_token.tag_name === "body") {
              parser_token.indent_content = this._options.indent_body_inner_html;
            }
          }
          if (!(parser_token.is_inline_element || parser_token.is_unformatted) && (last_token.type !== "TK_CONTENT" || parser_token.is_content_unformatted)) {
            printer.print_newline(false);
          }
          this._calcluate_parent_multiline(printer, parser_token);
        }
      };
      Beautifier.prototype._calcluate_parent_multiline = function(printer, parser_token) {
        if (parser_token.parent && printer._output.just_added_newline() && !((parser_token.is_inline_element || parser_token.is_unformatted) && parser_token.parent.is_inline_element)) {
          parser_token.parent.multiline_content = true;
        }
      };
      var p_closers = ["address", "article", "aside", "blockquote", "details", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "main", "menu", "nav", "ol", "p", "pre", "section", "table", "ul"];
      var p_parent_excludes = ["a", "audio", "del", "ins", "map", "noscript", "video"];
      Beautifier.prototype._do_optional_end_element = function(parser_token) {
        var result = null;
        if (parser_token.is_empty_element || !parser_token.is_start_tag || !parser_token.parent) {
          return;
        }
        if (parser_token.tag_name === "body") {
          result = result || this._tag_stack.try_pop("head");
        } else if (parser_token.tag_name === "li") {
          result = result || this._tag_stack.try_pop("li", ["ol", "ul", "menu"]);
        } else if (parser_token.tag_name === "dd" || parser_token.tag_name === "dt") {
          result = result || this._tag_stack.try_pop("dt", ["dl"]);
          result = result || this._tag_stack.try_pop("dd", ["dl"]);
        } else if (parser_token.parent.tag_name === "p" && p_closers.indexOf(parser_token.tag_name) !== -1) {
          var p_parent = parser_token.parent.parent;
          if (!p_parent || p_parent_excludes.indexOf(p_parent.tag_name) === -1) {
            result = result || this._tag_stack.try_pop("p");
          }
        } else if (parser_token.tag_name === "rp" || parser_token.tag_name === "rt") {
          result = result || this._tag_stack.try_pop("rt", ["ruby", "rtc"]);
          result = result || this._tag_stack.try_pop("rp", ["ruby", "rtc"]);
        } else if (parser_token.tag_name === "optgroup") {
          result = result || this._tag_stack.try_pop("optgroup", ["select"]);
        } else if (parser_token.tag_name === "option") {
          result = result || this._tag_stack.try_pop("option", ["select", "datalist", "optgroup"]);
        } else if (parser_token.tag_name === "colgroup") {
          result = result || this._tag_stack.try_pop("caption", ["table"]);
        } else if (parser_token.tag_name === "thead") {
          result = result || this._tag_stack.try_pop("caption", ["table"]);
          result = result || this._tag_stack.try_pop("colgroup", ["table"]);
        } else if (parser_token.tag_name === "tbody" || parser_token.tag_name === "tfoot") {
          result = result || this._tag_stack.try_pop("caption", ["table"]);
          result = result || this._tag_stack.try_pop("colgroup", ["table"]);
          result = result || this._tag_stack.try_pop("thead", ["table"]);
          result = result || this._tag_stack.try_pop("tbody", ["table"]);
        } else if (parser_token.tag_name === "tr") {
          result = result || this._tag_stack.try_pop("caption", ["table"]);
          result = result || this._tag_stack.try_pop("colgroup", ["table"]);
          result = result || this._tag_stack.try_pop("tr", ["table", "thead", "tbody", "tfoot"]);
        } else if (parser_token.tag_name === "th" || parser_token.tag_name === "td") {
          result = result || this._tag_stack.try_pop("td", ["table", "thead", "tbody", "tfoot", "tr"]);
          result = result || this._tag_stack.try_pop("th", ["table", "thead", "tbody", "tfoot", "tr"]);
        }
        parser_token.parent = this._tag_stack.get_parser_token();
        return result;
      };
      module.exports.Beautifier = Beautifier;
    }
  });

  // node_modules/js-beautify/js/src/html/index.js
  var require_html = __commonJS({
    "node_modules/js-beautify/js/src/html/index.js"(exports, module) {
      "use strict";
      var Beautifier = require_beautifier3().Beautifier;
      var Options = require_options4().Options;
      function style_html(html_source, options, js_beautify, css_beautify) {
        var beautifier = new Beautifier(html_source, options, js_beautify, css_beautify);
        return beautifier.beautify();
      }
      module.exports = style_html;
      module.exports.defaultOptions = function() {
        return new Options();
      };
    }
  });

  // node_modules/js-beautify/js/src/index.js
  var require_src = __commonJS({
    "node_modules/js-beautify/js/src/index.js"(exports, module) {
      "use strict";
      var js_beautify = require_javascript();
      var css_beautify = require_css();
      var html_beautify = require_html();
      function style_html(html_source, options, js, css) {
        js = js || js_beautify;
        css = css || css_beautify;
        return html_beautify(html_source, options, js, css);
      }
      style_html.defaultOptions = html_beautify.defaultOptions;
      module.exports.js = js_beautify;
      module.exports.css = css_beautify;
      module.exports.html = style_html;
    }
  });

  // node_modules/js-beautify/js/index.js
  var require_js = __commonJS({
    "node_modules/js-beautify/js/index.js"(exports, module) {
      "use strict";
      function get_beautify(js_beautify, css_beautify, html_beautify) {
        var beautify = function(src, config) {
          return js_beautify.js_beautify(src, config);
        };
        beautify.js = js_beautify.js_beautify;
        beautify.css = css_beautify.css_beautify;
        beautify.html = html_beautify.html_beautify;
        beautify.js_beautify = js_beautify.js_beautify;
        beautify.css_beautify = css_beautify.css_beautify;
        beautify.html_beautify = html_beautify.html_beautify;
        return beautify;
      }
      if (typeof define === "function" && define.amd) {
        define([
          "./lib/beautify",
          "./lib/beautify-css",
          "./lib/beautify-html"
        ], function(js_beautify, css_beautify, html_beautify) {
          return get_beautify(js_beautify, css_beautify, html_beautify);
        });
      } else {
        (function(mod) {
          var beautifier = require_src();
          beautifier.js_beautify = beautifier.js;
          beautifier.css_beautify = beautifier.css;
          beautifier.html_beautify = beautifier.html;
          mod.exports = get_beautify(beautifier, beautifier, beautifier);
        })(module);
      }
    }
  });

  // node_modules/core-js-pure/internals/global-this.js
  var require_global_this = __commonJS({
    "node_modules/core-js-pure/internals/global-this.js"(exports, module) {
      "use strict";
      var check = function(it) {
        return it && it.Math === Math && it;
      };
      module.exports = // eslint-disable-next-line es/no-global-this -- safe
      check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || // eslint-disable-next-line no-restricted-globals -- safe
      check(typeof self == "object" && self) || check(typeof global == "object" && global) || check(typeof exports == "object" && exports) || // eslint-disable-next-line no-new-func -- fallback
      /* @__PURE__ */ function() {
        return this;
      }() || Function("return this")();
    }
  });

  // node_modules/core-js-pure/internals/fails.js
  var require_fails = __commonJS({
    "node_modules/core-js-pure/internals/fails.js"(exports, module) {
      "use strict";
      module.exports = function(exec) {
        try {
          return !!exec();
        } catch (error) {
          return true;
        }
      };
    }
  });

  // node_modules/core-js-pure/internals/function-bind-native.js
  var require_function_bind_native = __commonJS({
    "node_modules/core-js-pure/internals/function-bind-native.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      module.exports = !fails(function() {
        var test = function() {
        }.bind();
        return typeof test != "function" || test.hasOwnProperty("prototype");
      });
    }
  });

  // node_modules/core-js-pure/internals/function-apply.js
  var require_function_apply = __commonJS({
    "node_modules/core-js-pure/internals/function-apply.js"(exports, module) {
      "use strict";
      var NATIVE_BIND = require_function_bind_native();
      var FunctionPrototype = Function.prototype;
      var apply = FunctionPrototype.apply;
      var call = FunctionPrototype.call;
      module.exports = typeof Reflect == "object" && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function() {
        return call.apply(apply, arguments);
      });
    }
  });

  // node_modules/core-js-pure/internals/function-uncurry-this.js
  var require_function_uncurry_this = __commonJS({
    "node_modules/core-js-pure/internals/function-uncurry-this.js"(exports, module) {
      "use strict";
      var NATIVE_BIND = require_function_bind_native();
      var FunctionPrototype = Function.prototype;
      var call = FunctionPrototype.call;
      var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);
      module.exports = NATIVE_BIND ? uncurryThisWithBind : function(fn) {
        return function() {
          return call.apply(fn, arguments);
        };
      };
    }
  });

  // node_modules/core-js-pure/internals/classof-raw.js
  var require_classof_raw = __commonJS({
    "node_modules/core-js-pure/internals/classof-raw.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var toString = uncurryThis({}.toString);
      var stringSlice = uncurryThis("".slice);
      module.exports = function(it) {
        return stringSlice(toString(it), 8, -1);
      };
    }
  });

  // node_modules/core-js-pure/internals/function-uncurry-this-clause.js
  var require_function_uncurry_this_clause = __commonJS({
    "node_modules/core-js-pure/internals/function-uncurry-this-clause.js"(exports, module) {
      "use strict";
      var classofRaw = require_classof_raw();
      var uncurryThis = require_function_uncurry_this();
      module.exports = function(fn) {
        if (classofRaw(fn) === "Function")
          return uncurryThis(fn);
      };
    }
  });

  // node_modules/core-js-pure/internals/is-callable.js
  var require_is_callable = __commonJS({
    "node_modules/core-js-pure/internals/is-callable.js"(exports, module) {
      "use strict";
      var documentAll = typeof document == "object" && document.all;
      module.exports = typeof documentAll == "undefined" && documentAll !== void 0 ? function(argument) {
        return typeof argument == "function" || argument === documentAll;
      } : function(argument) {
        return typeof argument == "function";
      };
    }
  });

  // node_modules/core-js-pure/internals/descriptors.js
  var require_descriptors = __commonJS({
    "node_modules/core-js-pure/internals/descriptors.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      module.exports = !fails(function() {
        return Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1] !== 7;
      });
    }
  });

  // node_modules/core-js-pure/internals/function-call.js
  var require_function_call = __commonJS({
    "node_modules/core-js-pure/internals/function-call.js"(exports, module) {
      "use strict";
      var NATIVE_BIND = require_function_bind_native();
      var call = Function.prototype.call;
      module.exports = NATIVE_BIND ? call.bind(call) : function() {
        return call.apply(call, arguments);
      };
    }
  });

  // node_modules/core-js-pure/internals/object-property-is-enumerable.js
  var require_object_property_is_enumerable = __commonJS({
    "node_modules/core-js-pure/internals/object-property-is-enumerable.js"(exports) {
      "use strict";
      var $propertyIsEnumerable = {}.propertyIsEnumerable;
      var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);
      exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
        var descriptor = getOwnPropertyDescriptor(this, V);
        return !!descriptor && descriptor.enumerable;
      } : $propertyIsEnumerable;
    }
  });

  // node_modules/core-js-pure/internals/create-property-descriptor.js
  var require_create_property_descriptor = __commonJS({
    "node_modules/core-js-pure/internals/create-property-descriptor.js"(exports, module) {
      "use strict";
      module.exports = function(bitmap, value) {
        return {
          enumerable: !(bitmap & 1),
          configurable: !(bitmap & 2),
          writable: !(bitmap & 4),
          value
        };
      };
    }
  });

  // node_modules/core-js-pure/internals/indexed-object.js
  var require_indexed_object = __commonJS({
    "node_modules/core-js-pure/internals/indexed-object.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var fails = require_fails();
      var classof = require_classof_raw();
      var $Object = Object;
      var split = uncurryThis("".split);
      module.exports = fails(function() {
        return !$Object("z").propertyIsEnumerable(0);
      }) ? function(it) {
        return classof(it) === "String" ? split(it, "") : $Object(it);
      } : $Object;
    }
  });

  // node_modules/core-js-pure/internals/is-null-or-undefined.js
  var require_is_null_or_undefined = __commonJS({
    "node_modules/core-js-pure/internals/is-null-or-undefined.js"(exports, module) {
      "use strict";
      module.exports = function(it) {
        return it === null || it === void 0;
      };
    }
  });

  // node_modules/core-js-pure/internals/require-object-coercible.js
  var require_require_object_coercible = __commonJS({
    "node_modules/core-js-pure/internals/require-object-coercible.js"(exports, module) {
      "use strict";
      var isNullOrUndefined = require_is_null_or_undefined();
      var $TypeError = TypeError;
      module.exports = function(it) {
        if (isNullOrUndefined(it))
          throw new $TypeError("Can't call method on " + it);
        return it;
      };
    }
  });

  // node_modules/core-js-pure/internals/to-indexed-object.js
  var require_to_indexed_object = __commonJS({
    "node_modules/core-js-pure/internals/to-indexed-object.js"(exports, module) {
      "use strict";
      var IndexedObject = require_indexed_object();
      var requireObjectCoercible = require_require_object_coercible();
      module.exports = function(it) {
        return IndexedObject(requireObjectCoercible(it));
      };
    }
  });

  // node_modules/core-js-pure/internals/is-object.js
  var require_is_object = __commonJS({
    "node_modules/core-js-pure/internals/is-object.js"(exports, module) {
      "use strict";
      var isCallable = require_is_callable();
      module.exports = function(it) {
        return typeof it == "object" ? it !== null : isCallable(it);
      };
    }
  });

  // node_modules/core-js-pure/internals/path.js
  var require_path = __commonJS({
    "node_modules/core-js-pure/internals/path.js"(exports, module) {
      "use strict";
      module.exports = {};
    }
  });

  // node_modules/core-js-pure/internals/get-built-in.js
  var require_get_built_in = __commonJS({
    "node_modules/core-js-pure/internals/get-built-in.js"(exports, module) {
      "use strict";
      var path = require_path();
      var globalThis2 = require_global_this();
      var isCallable = require_is_callable();
      var aFunction = function(variable) {
        return isCallable(variable) ? variable : void 0;
      };
      module.exports = function(namespace, method) {
        return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(globalThis2[namespace]) : path[namespace] && path[namespace][method] || globalThis2[namespace] && globalThis2[namespace][method];
      };
    }
  });

  // node_modules/core-js-pure/internals/object-is-prototype-of.js
  var require_object_is_prototype_of = __commonJS({
    "node_modules/core-js-pure/internals/object-is-prototype-of.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      module.exports = uncurryThis({}.isPrototypeOf);
    }
  });

  // node_modules/core-js-pure/internals/environment-user-agent.js
  var require_environment_user_agent = __commonJS({
    "node_modules/core-js-pure/internals/environment-user-agent.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var navigator2 = globalThis2.navigator;
      var userAgent = navigator2 && navigator2.userAgent;
      module.exports = userAgent ? String(userAgent) : "";
    }
  });

  // node_modules/core-js-pure/internals/environment-v8-version.js
  var require_environment_v8_version = __commonJS({
    "node_modules/core-js-pure/internals/environment-v8-version.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var userAgent = require_environment_user_agent();
      var process = globalThis2.process;
      var Deno2 = globalThis2.Deno;
      var versions = process && process.versions || Deno2 && Deno2.version;
      var v8 = versions && versions.v8;
      var match;
      var version;
      if (v8) {
        match = v8.split(".");
        version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
      }
      if (!version && userAgent) {
        match = userAgent.match(/Edge\/(\d+)/);
        if (!match || match[1] >= 74) {
          match = userAgent.match(/Chrome\/(\d+)/);
          if (match)
            version = +match[1];
        }
      }
      module.exports = version;
    }
  });

  // node_modules/core-js-pure/internals/symbol-constructor-detection.js
  var require_symbol_constructor_detection = __commonJS({
    "node_modules/core-js-pure/internals/symbol-constructor-detection.js"(exports, module) {
      "use strict";
      var V8_VERSION = require_environment_v8_version();
      var fails = require_fails();
      var globalThis2 = require_global_this();
      var $String = globalThis2.String;
      module.exports = !!Object.getOwnPropertySymbols && !fails(function() {
        var symbol = Symbol("symbol detection");
        return !$String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
        !Symbol.sham && V8_VERSION && V8_VERSION < 41;
      });
    }
  });

  // node_modules/core-js-pure/internals/use-symbol-as-uid.js
  var require_use_symbol_as_uid = __commonJS({
    "node_modules/core-js-pure/internals/use-symbol-as-uid.js"(exports, module) {
      "use strict";
      var NATIVE_SYMBOL = require_symbol_constructor_detection();
      module.exports = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == "symbol";
    }
  });

  // node_modules/core-js-pure/internals/is-symbol.js
  var require_is_symbol = __commonJS({
    "node_modules/core-js-pure/internals/is-symbol.js"(exports, module) {
      "use strict";
      var getBuiltIn = require_get_built_in();
      var isCallable = require_is_callable();
      var isPrototypeOf = require_object_is_prototype_of();
      var USE_SYMBOL_AS_UID = require_use_symbol_as_uid();
      var $Object = Object;
      module.exports = USE_SYMBOL_AS_UID ? function(it) {
        return typeof it == "symbol";
      } : function(it) {
        var $Symbol = getBuiltIn("Symbol");
        return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
      };
    }
  });

  // node_modules/core-js-pure/internals/try-to-string.js
  var require_try_to_string = __commonJS({
    "node_modules/core-js-pure/internals/try-to-string.js"(exports, module) {
      "use strict";
      var $String = String;
      module.exports = function(argument) {
        try {
          return $String(argument);
        } catch (error) {
          return "Object";
        }
      };
    }
  });

  // node_modules/core-js-pure/internals/a-callable.js
  var require_a_callable = __commonJS({
    "node_modules/core-js-pure/internals/a-callable.js"(exports, module) {
      "use strict";
      var isCallable = require_is_callable();
      var tryToString = require_try_to_string();
      var $TypeError = TypeError;
      module.exports = function(argument) {
        if (isCallable(argument))
          return argument;
        throw new $TypeError(tryToString(argument) + " is not a function");
      };
    }
  });

  // node_modules/core-js-pure/internals/get-method.js
  var require_get_method = __commonJS({
    "node_modules/core-js-pure/internals/get-method.js"(exports, module) {
      "use strict";
      var aCallable = require_a_callable();
      var isNullOrUndefined = require_is_null_or_undefined();
      module.exports = function(V, P) {
        var func = V[P];
        return isNullOrUndefined(func) ? void 0 : aCallable(func);
      };
    }
  });

  // node_modules/core-js-pure/internals/ordinary-to-primitive.js
  var require_ordinary_to_primitive = __commonJS({
    "node_modules/core-js-pure/internals/ordinary-to-primitive.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var isCallable = require_is_callable();
      var isObject = require_is_object();
      var $TypeError = TypeError;
      module.exports = function(input, pref) {
        var fn, val;
        if (pref === "string" && isCallable(fn = input.toString) && !isObject(val = call(fn, input)))
          return val;
        if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input)))
          return val;
        if (pref !== "string" && isCallable(fn = input.toString) && !isObject(val = call(fn, input)))
          return val;
        throw new $TypeError("Can't convert object to primitive value");
      };
    }
  });

  // node_modules/core-js-pure/internals/is-pure.js
  var require_is_pure = __commonJS({
    "node_modules/core-js-pure/internals/is-pure.js"(exports, module) {
      "use strict";
      module.exports = true;
    }
  });

  // node_modules/core-js-pure/internals/define-global-property.js
  var require_define_global_property = __commonJS({
    "node_modules/core-js-pure/internals/define-global-property.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var defineProperty = Object.defineProperty;
      module.exports = function(key, value) {
        try {
          defineProperty(globalThis2, key, { value, configurable: true, writable: true });
        } catch (error) {
          globalThis2[key] = value;
        }
        return value;
      };
    }
  });

  // node_modules/core-js-pure/internals/shared-store.js
  var require_shared_store = __commonJS({
    "node_modules/core-js-pure/internals/shared-store.js"(exports, module) {
      "use strict";
      var IS_PURE = require_is_pure();
      var globalThis2 = require_global_this();
      var defineGlobalProperty = require_define_global_property();
      var SHARED = "__core-js_shared__";
      var store = module.exports = globalThis2[SHARED] || defineGlobalProperty(SHARED, {});
      (store.versions || (store.versions = [])).push({
        version: "3.45.1",
        mode: IS_PURE ? "pure" : "global",
        copyright: "\xA9 2014-2025 Denis Pushkarev (zloirock.ru)",
        license: "https://github.com/zloirock/core-js/blob/v3.45.1/LICENSE",
        source: "https://github.com/zloirock/core-js"
      });
    }
  });

  // node_modules/core-js-pure/internals/shared.js
  var require_shared = __commonJS({
    "node_modules/core-js-pure/internals/shared.js"(exports, module) {
      "use strict";
      var store = require_shared_store();
      module.exports = function(key, value) {
        return store[key] || (store[key] = value || {});
      };
    }
  });

  // node_modules/core-js-pure/internals/to-object.js
  var require_to_object = __commonJS({
    "node_modules/core-js-pure/internals/to-object.js"(exports, module) {
      "use strict";
      var requireObjectCoercible = require_require_object_coercible();
      var $Object = Object;
      module.exports = function(argument) {
        return $Object(requireObjectCoercible(argument));
      };
    }
  });

  // node_modules/core-js-pure/internals/has-own-property.js
  var require_has_own_property = __commonJS({
    "node_modules/core-js-pure/internals/has-own-property.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var toObject = require_to_object();
      var hasOwnProperty = uncurryThis({}.hasOwnProperty);
      module.exports = Object.hasOwn || function hasOwn(it, key) {
        return hasOwnProperty(toObject(it), key);
      };
    }
  });

  // node_modules/core-js-pure/internals/uid.js
  var require_uid = __commonJS({
    "node_modules/core-js-pure/internals/uid.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var id = 0;
      var postfix = Math.random();
      var toString = uncurryThis(1.1.toString);
      module.exports = function(key) {
        return "Symbol(" + (key === void 0 ? "" : key) + ")_" + toString(++id + postfix, 36);
      };
    }
  });

  // node_modules/core-js-pure/internals/well-known-symbol.js
  var require_well_known_symbol = __commonJS({
    "node_modules/core-js-pure/internals/well-known-symbol.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var shared = require_shared();
      var hasOwn = require_has_own_property();
      var uid = require_uid();
      var NATIVE_SYMBOL = require_symbol_constructor_detection();
      var USE_SYMBOL_AS_UID = require_use_symbol_as_uid();
      var Symbol2 = globalThis2.Symbol;
      var WellKnownSymbolsStore = shared("wks");
      var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol2["for"] || Symbol2 : Symbol2 && Symbol2.withoutSetter || uid;
      module.exports = function(name) {
        if (!hasOwn(WellKnownSymbolsStore, name)) {
          WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol2, name) ? Symbol2[name] : createWellKnownSymbol("Symbol." + name);
        }
        return WellKnownSymbolsStore[name];
      };
    }
  });

  // node_modules/core-js-pure/internals/to-primitive.js
  var require_to_primitive = __commonJS({
    "node_modules/core-js-pure/internals/to-primitive.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var isObject = require_is_object();
      var isSymbol = require_is_symbol();
      var getMethod = require_get_method();
      var ordinaryToPrimitive = require_ordinary_to_primitive();
      var wellKnownSymbol = require_well_known_symbol();
      var $TypeError = TypeError;
      var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");
      module.exports = function(input, pref) {
        if (!isObject(input) || isSymbol(input))
          return input;
        var exoticToPrim = getMethod(input, TO_PRIMITIVE);
        var result;
        if (exoticToPrim) {
          if (pref === void 0)
            pref = "default";
          result = call(exoticToPrim, input, pref);
          if (!isObject(result) || isSymbol(result))
            return result;
          throw new $TypeError("Can't convert object to primitive value");
        }
        if (pref === void 0)
          pref = "number";
        return ordinaryToPrimitive(input, pref);
      };
    }
  });

  // node_modules/core-js-pure/internals/to-property-key.js
  var require_to_property_key = __commonJS({
    "node_modules/core-js-pure/internals/to-property-key.js"(exports, module) {
      "use strict";
      var toPrimitive = require_to_primitive();
      var isSymbol = require_is_symbol();
      module.exports = function(argument) {
        var key = toPrimitive(argument, "string");
        return isSymbol(key) ? key : key + "";
      };
    }
  });

  // node_modules/core-js-pure/internals/document-create-element.js
  var require_document_create_element = __commonJS({
    "node_modules/core-js-pure/internals/document-create-element.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var isObject = require_is_object();
      var document2 = globalThis2.document;
      var EXISTS = isObject(document2) && isObject(document2.createElement);
      module.exports = function(it) {
        return EXISTS ? document2.createElement(it) : {};
      };
    }
  });

  // node_modules/core-js-pure/internals/ie8-dom-define.js
  var require_ie8_dom_define = __commonJS({
    "node_modules/core-js-pure/internals/ie8-dom-define.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var fails = require_fails();
      var createElement = require_document_create_element();
      module.exports = !DESCRIPTORS && !fails(function() {
        return Object.defineProperty(createElement("div"), "a", {
          get: function() {
            return 7;
          }
        }).a !== 7;
      });
    }
  });

  // node_modules/core-js-pure/internals/object-get-own-property-descriptor.js
  var require_object_get_own_property_descriptor = __commonJS({
    "node_modules/core-js-pure/internals/object-get-own-property-descriptor.js"(exports) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var call = require_function_call();
      var propertyIsEnumerableModule = require_object_property_is_enumerable();
      var createPropertyDescriptor = require_create_property_descriptor();
      var toIndexedObject = require_to_indexed_object();
      var toPropertyKey = require_to_property_key();
      var hasOwn = require_has_own_property();
      var IE8_DOM_DEFINE = require_ie8_dom_define();
      var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
        O = toIndexedObject(O);
        P = toPropertyKey(P);
        if (IE8_DOM_DEFINE)
          try {
            return $getOwnPropertyDescriptor(O, P);
          } catch (error) {
          }
        if (hasOwn(O, P))
          return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
      };
    }
  });

  // node_modules/core-js-pure/internals/is-forced.js
  var require_is_forced = __commonJS({
    "node_modules/core-js-pure/internals/is-forced.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      var isCallable = require_is_callable();
      var replacement = /#|\.prototype\./;
      var isForced = function(feature, detection) {
        var value = data[normalize(feature)];
        return value === POLYFILL ? true : value === NATIVE ? false : isCallable(detection) ? fails(detection) : !!detection;
      };
      var normalize = isForced.normalize = function(string) {
        return String(string).replace(replacement, ".").toLowerCase();
      };
      var data = isForced.data = {};
      var NATIVE = isForced.NATIVE = "N";
      var POLYFILL = isForced.POLYFILL = "P";
      module.exports = isForced;
    }
  });

  // node_modules/core-js-pure/internals/function-bind-context.js
  var require_function_bind_context = __commonJS({
    "node_modules/core-js-pure/internals/function-bind-context.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this_clause();
      var aCallable = require_a_callable();
      var NATIVE_BIND = require_function_bind_native();
      var bind = uncurryThis(uncurryThis.bind);
      module.exports = function(fn, that) {
        aCallable(fn);
        return that === void 0 ? fn : NATIVE_BIND ? bind(fn, that) : function() {
          return fn.apply(that, arguments);
        };
      };
    }
  });

  // node_modules/core-js-pure/internals/v8-prototype-define-bug.js
  var require_v8_prototype_define_bug = __commonJS({
    "node_modules/core-js-pure/internals/v8-prototype-define-bug.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var fails = require_fails();
      module.exports = DESCRIPTORS && fails(function() {
        return Object.defineProperty(function() {
        }, "prototype", {
          value: 42,
          writable: false
        }).prototype !== 42;
      });
    }
  });

  // node_modules/core-js-pure/internals/an-object.js
  var require_an_object = __commonJS({
    "node_modules/core-js-pure/internals/an-object.js"(exports, module) {
      "use strict";
      var isObject = require_is_object();
      var $String = String;
      var $TypeError = TypeError;
      module.exports = function(argument) {
        if (isObject(argument))
          return argument;
        throw new $TypeError($String(argument) + " is not an object");
      };
    }
  });

  // node_modules/core-js-pure/internals/object-define-property.js
  var require_object_define_property = __commonJS({
    "node_modules/core-js-pure/internals/object-define-property.js"(exports) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var IE8_DOM_DEFINE = require_ie8_dom_define();
      var V8_PROTOTYPE_DEFINE_BUG = require_v8_prototype_define_bug();
      var anObject = require_an_object();
      var toPropertyKey = require_to_property_key();
      var $TypeError = TypeError;
      var $defineProperty = Object.defineProperty;
      var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var ENUMERABLE = "enumerable";
      var CONFIGURABLE = "configurable";
      var WRITABLE = "writable";
      exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPropertyKey(P);
        anObject(Attributes);
        if (typeof O === "function" && P === "prototype" && "value" in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
          var current = $getOwnPropertyDescriptor(O, P);
          if (current && current[WRITABLE]) {
            O[P] = Attributes.value;
            Attributes = {
              configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
              enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
              writable: false
            };
          }
        }
        return $defineProperty(O, P, Attributes);
      } : $defineProperty : function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPropertyKey(P);
        anObject(Attributes);
        if (IE8_DOM_DEFINE)
          try {
            return $defineProperty(O, P, Attributes);
          } catch (error) {
          }
        if ("get" in Attributes || "set" in Attributes)
          throw new $TypeError("Accessors not supported");
        if ("value" in Attributes)
          O[P] = Attributes.value;
        return O;
      };
    }
  });

  // node_modules/core-js-pure/internals/create-non-enumerable-property.js
  var require_create_non_enumerable_property = __commonJS({
    "node_modules/core-js-pure/internals/create-non-enumerable-property.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var definePropertyModule = require_object_define_property();
      var createPropertyDescriptor = require_create_property_descriptor();
      module.exports = DESCRIPTORS ? function(object, key, value) {
        return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
      } : function(object, key, value) {
        object[key] = value;
        return object;
      };
    }
  });

  // node_modules/core-js-pure/internals/export.js
  var require_export = __commonJS({
    "node_modules/core-js-pure/internals/export.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var apply = require_function_apply();
      var uncurryThis = require_function_uncurry_this_clause();
      var isCallable = require_is_callable();
      var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
      var isForced = require_is_forced();
      var path = require_path();
      var bind = require_function_bind_context();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var hasOwn = require_has_own_property();
      require_shared_store();
      var wrapConstructor = function(NativeConstructor) {
        var Wrapper = function(a, b, c) {
          if (this instanceof Wrapper) {
            switch (arguments.length) {
              case 0:
                return new NativeConstructor();
              case 1:
                return new NativeConstructor(a);
              case 2:
                return new NativeConstructor(a, b);
            }
            return new NativeConstructor(a, b, c);
          }
          return apply(NativeConstructor, this, arguments);
        };
        Wrapper.prototype = NativeConstructor.prototype;
        return Wrapper;
      };
      module.exports = function(options, source) {
        var TARGET = options.target;
        var GLOBAL = options.global;
        var STATIC = options.stat;
        var PROTO = options.proto;
        var nativeSource = GLOBAL ? globalThis2 : STATIC ? globalThis2[TARGET] : globalThis2[TARGET] && globalThis2[TARGET].prototype;
        var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
        var targetPrototype = target.prototype;
        var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
        var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;
        for (key in source) {
          FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced);
          USE_NATIVE = !FORCED && nativeSource && hasOwn(nativeSource, key);
          targetProperty = target[key];
          if (USE_NATIVE)
            if (options.dontCallGetSet) {
              descriptor = getOwnPropertyDescriptor(nativeSource, key);
              nativeProperty = descriptor && descriptor.value;
            } else
              nativeProperty = nativeSource[key];
          sourceProperty = USE_NATIVE && nativeProperty ? nativeProperty : source[key];
          if (!FORCED && !PROTO && typeof targetProperty == typeof sourceProperty)
            continue;
          if (options.bind && USE_NATIVE)
            resultProperty = bind(sourceProperty, globalThis2);
          else if (options.wrap && USE_NATIVE)
            resultProperty = wrapConstructor(sourceProperty);
          else if (PROTO && isCallable(sourceProperty))
            resultProperty = uncurryThis(sourceProperty);
          else
            resultProperty = sourceProperty;
          if (options.sham || sourceProperty && sourceProperty.sham || targetProperty && targetProperty.sham) {
            createNonEnumerableProperty(resultProperty, "sham", true);
          }
          createNonEnumerableProperty(target, key, resultProperty);
          if (PROTO) {
            VIRTUAL_PROTOTYPE = TARGET + "Prototype";
            if (!hasOwn(path, VIRTUAL_PROTOTYPE)) {
              createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
            }
            createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key, sourceProperty);
            if (options.real && targetPrototype && (FORCED || !targetPrototype[key])) {
              createNonEnumerableProperty(targetPrototype, key, sourceProperty);
            }
          }
        }
      };
    }
  });

  // node_modules/core-js-pure/modules/es.object.define-property.js
  var require_es_object_define_property = __commonJS({
    "node_modules/core-js-pure/modules/es.object.define-property.js"() {
      "use strict";
      var $ = require_export();
      var DESCRIPTORS = require_descriptors();
      var defineProperty = require_object_define_property().f;
      $({ target: "Object", stat: true, forced: Object.defineProperty !== defineProperty, sham: !DESCRIPTORS }, {
        defineProperty
      });
    }
  });

  // node_modules/core-js-pure/es/object/define-property.js
  var require_define_property = __commonJS({
    "node_modules/core-js-pure/es/object/define-property.js"(exports, module) {
      "use strict";
      require_es_object_define_property();
      var path = require_path();
      var Object2 = path.Object;
      var defineProperty = module.exports = function defineProperty2(it, key, desc) {
        return Object2.defineProperty(it, key, desc);
      };
      if (Object2.defineProperty.sham)
        defineProperty.sham = true;
    }
  });

  // node_modules/core-js-pure/stable/object/define-property.js
  var require_define_property2 = __commonJS({
    "node_modules/core-js-pure/stable/object/define-property.js"(exports, module) {
      "use strict";
      var parent = require_define_property();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/object/define-property.js
  var require_define_property3 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/object/define-property.js"(exports, module) {
      module.exports = require_define_property2();
    }
  });

  // node_modules/@babel/runtime-corejs3/helpers/interopRequireDefault.js
  var require_interopRequireDefault = __commonJS({
    "node_modules/@babel/runtime-corejs3/helpers/interopRequireDefault.js"(exports, module) {
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : {
          "default": e
        };
      }
      module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/core-js-pure/internals/is-array.js
  var require_is_array = __commonJS({
    "node_modules/core-js-pure/internals/is-array.js"(exports, module) {
      "use strict";
      var classof = require_classof_raw();
      module.exports = Array.isArray || function isArray(argument) {
        return classof(argument) === "Array";
      };
    }
  });

  // node_modules/core-js-pure/internals/to-string-tag-support.js
  var require_to_string_tag_support = __commonJS({
    "node_modules/core-js-pure/internals/to-string-tag-support.js"(exports, module) {
      "use strict";
      var wellKnownSymbol = require_well_known_symbol();
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      var test = {};
      test[TO_STRING_TAG] = "z";
      module.exports = String(test) === "[object z]";
    }
  });

  // node_modules/core-js-pure/internals/classof.js
  var require_classof = __commonJS({
    "node_modules/core-js-pure/internals/classof.js"(exports, module) {
      "use strict";
      var TO_STRING_TAG_SUPPORT = require_to_string_tag_support();
      var isCallable = require_is_callable();
      var classofRaw = require_classof_raw();
      var wellKnownSymbol = require_well_known_symbol();
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      var $Object = Object;
      var CORRECT_ARGUMENTS = classofRaw(/* @__PURE__ */ function() {
        return arguments;
      }()) === "Arguments";
      var tryGet = function(it, key) {
        try {
          return it[key];
        } catch (error) {
        }
      };
      module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function(it) {
        var O, tag, result;
        return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O) : (result = classofRaw(O)) === "Object" && isCallable(O.callee) ? "Arguments" : result;
      };
    }
  });

  // node_modules/core-js-pure/internals/inspect-source.js
  var require_inspect_source = __commonJS({
    "node_modules/core-js-pure/internals/inspect-source.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var isCallable = require_is_callable();
      var store = require_shared_store();
      var functionToString = uncurryThis(Function.toString);
      if (!isCallable(store.inspectSource)) {
        store.inspectSource = function(it) {
          return functionToString(it);
        };
      }
      module.exports = store.inspectSource;
    }
  });

  // node_modules/core-js-pure/internals/is-constructor.js
  var require_is_constructor = __commonJS({
    "node_modules/core-js-pure/internals/is-constructor.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var fails = require_fails();
      var isCallable = require_is_callable();
      var classof = require_classof();
      var getBuiltIn = require_get_built_in();
      var inspectSource = require_inspect_source();
      var noop = function() {
      };
      var construct = getBuiltIn("Reflect", "construct");
      var constructorRegExp = /^\s*(?:class|function)\b/;
      var exec = uncurryThis(constructorRegExp.exec);
      var INCORRECT_TO_STRING = !constructorRegExp.test(noop);
      var isConstructorModern = function isConstructor(argument) {
        if (!isCallable(argument))
          return false;
        try {
          construct(noop, [], argument);
          return true;
        } catch (error) {
          return false;
        }
      };
      var isConstructorLegacy = function isConstructor(argument) {
        if (!isCallable(argument))
          return false;
        switch (classof(argument)) {
          case "AsyncFunction":
          case "GeneratorFunction":
          case "AsyncGeneratorFunction":
            return false;
        }
        try {
          return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
        } catch (error) {
          return true;
        }
      };
      isConstructorLegacy.sham = true;
      module.exports = !construct || fails(function() {
        var called;
        return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function() {
          called = true;
        }) || called;
      }) ? isConstructorLegacy : isConstructorModern;
    }
  });

  // node_modules/core-js-pure/internals/math-trunc.js
  var require_math_trunc = __commonJS({
    "node_modules/core-js-pure/internals/math-trunc.js"(exports, module) {
      "use strict";
      var ceil = Math.ceil;
      var floor = Math.floor;
      module.exports = Math.trunc || function trunc(x) {
        var n = +x;
        return (n > 0 ? floor : ceil)(n);
      };
    }
  });

  // node_modules/core-js-pure/internals/to-integer-or-infinity.js
  var require_to_integer_or_infinity = __commonJS({
    "node_modules/core-js-pure/internals/to-integer-or-infinity.js"(exports, module) {
      "use strict";
      var trunc = require_math_trunc();
      module.exports = function(argument) {
        var number = +argument;
        return number !== number || number === 0 ? 0 : trunc(number);
      };
    }
  });

  // node_modules/core-js-pure/internals/to-absolute-index.js
  var require_to_absolute_index = __commonJS({
    "node_modules/core-js-pure/internals/to-absolute-index.js"(exports, module) {
      "use strict";
      var toIntegerOrInfinity = require_to_integer_or_infinity();
      var max = Math.max;
      var min = Math.min;
      module.exports = function(index, length) {
        var integer = toIntegerOrInfinity(index);
        return integer < 0 ? max(integer + length, 0) : min(integer, length);
      };
    }
  });

  // node_modules/core-js-pure/internals/to-length.js
  var require_to_length = __commonJS({
    "node_modules/core-js-pure/internals/to-length.js"(exports, module) {
      "use strict";
      var toIntegerOrInfinity = require_to_integer_or_infinity();
      var min = Math.min;
      module.exports = function(argument) {
        var len = toIntegerOrInfinity(argument);
        return len > 0 ? min(len, 9007199254740991) : 0;
      };
    }
  });

  // node_modules/core-js-pure/internals/length-of-array-like.js
  var require_length_of_array_like = __commonJS({
    "node_modules/core-js-pure/internals/length-of-array-like.js"(exports, module) {
      "use strict";
      var toLength = require_to_length();
      module.exports = function(obj) {
        return toLength(obj.length);
      };
    }
  });

  // node_modules/core-js-pure/internals/create-property.js
  var require_create_property = __commonJS({
    "node_modules/core-js-pure/internals/create-property.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var definePropertyModule = require_object_define_property();
      var createPropertyDescriptor = require_create_property_descriptor();
      module.exports = function(object, key, value) {
        if (DESCRIPTORS)
          definePropertyModule.f(object, key, createPropertyDescriptor(0, value));
        else
          object[key] = value;
      };
    }
  });

  // node_modules/core-js-pure/internals/array-method-has-species-support.js
  var require_array_method_has_species_support = __commonJS({
    "node_modules/core-js-pure/internals/array-method-has-species-support.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      var wellKnownSymbol = require_well_known_symbol();
      var V8_VERSION = require_environment_v8_version();
      var SPECIES = wellKnownSymbol("species");
      module.exports = function(METHOD_NAME) {
        return V8_VERSION >= 51 || !fails(function() {
          var array = [];
          var constructor = array.constructor = {};
          constructor[SPECIES] = function() {
            return { foo: 1 };
          };
          return array[METHOD_NAME](Boolean).foo !== 1;
        });
      };
    }
  });

  // node_modules/core-js-pure/internals/array-slice.js
  var require_array_slice = __commonJS({
    "node_modules/core-js-pure/internals/array-slice.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      module.exports = uncurryThis([].slice);
    }
  });

  // node_modules/core-js-pure/modules/es.array.slice.js
  var require_es_array_slice = __commonJS({
    "node_modules/core-js-pure/modules/es.array.slice.js"() {
      "use strict";
      var $ = require_export();
      var isArray = require_is_array();
      var isConstructor = require_is_constructor();
      var isObject = require_is_object();
      var toAbsoluteIndex = require_to_absolute_index();
      var lengthOfArrayLike = require_length_of_array_like();
      var toIndexedObject = require_to_indexed_object();
      var createProperty = require_create_property();
      var wellKnownSymbol = require_well_known_symbol();
      var arrayMethodHasSpeciesSupport = require_array_method_has_species_support();
      var nativeSlice = require_array_slice();
      var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("slice");
      var SPECIES = wellKnownSymbol("species");
      var $Array = Array;
      var max = Math.max;
      $({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT }, {
        slice: function slice(start, end) {
          var O = toIndexedObject(this);
          var length = lengthOfArrayLike(O);
          var k = toAbsoluteIndex(start, length);
          var fin = toAbsoluteIndex(end === void 0 ? length : end, length);
          var Constructor, result, n;
          if (isArray(O)) {
            Constructor = O.constructor;
            if (isConstructor(Constructor) && (Constructor === $Array || isArray(Constructor.prototype))) {
              Constructor = void 0;
            } else if (isObject(Constructor)) {
              Constructor = Constructor[SPECIES];
              if (Constructor === null)
                Constructor = void 0;
            }
            if (Constructor === $Array || Constructor === void 0) {
              return nativeSlice(O, k, fin);
            }
          }
          result = new (Constructor === void 0 ? $Array : Constructor)(max(fin - k, 0));
          for (n = 0; k < fin; k++, n++)
            if (k in O)
              createProperty(result, n, O[k]);
          result.length = n;
          return result;
        }
      });
    }
  });

  // node_modules/core-js-pure/internals/get-built-in-prototype-method.js
  var require_get_built_in_prototype_method = __commonJS({
    "node_modules/core-js-pure/internals/get-built-in-prototype-method.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var path = require_path();
      module.exports = function(CONSTRUCTOR, METHOD) {
        var Namespace = path[CONSTRUCTOR + "Prototype"];
        var pureMethod = Namespace && Namespace[METHOD];
        if (pureMethod)
          return pureMethod;
        var NativeConstructor = globalThis2[CONSTRUCTOR];
        var NativePrototype = NativeConstructor && NativeConstructor.prototype;
        return NativePrototype && NativePrototype[METHOD];
      };
    }
  });

  // node_modules/core-js-pure/es/array/virtual/slice.js
  var require_slice = __commonJS({
    "node_modules/core-js-pure/es/array/virtual/slice.js"(exports, module) {
      "use strict";
      require_es_array_slice();
      var getBuiltInPrototypeMethod = require_get_built_in_prototype_method();
      module.exports = getBuiltInPrototypeMethod("Array", "slice");
    }
  });

  // node_modules/core-js-pure/es/instance/slice.js
  var require_slice2 = __commonJS({
    "node_modules/core-js-pure/es/instance/slice.js"(exports, module) {
      "use strict";
      var isPrototypeOf = require_object_is_prototype_of();
      var method = require_slice();
      var ArrayPrototype = Array.prototype;
      module.exports = function(it) {
        var own = it.slice;
        return it === ArrayPrototype || isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.slice ? method : own;
      };
    }
  });

  // node_modules/core-js-pure/stable/instance/slice.js
  var require_slice3 = __commonJS({
    "node_modules/core-js-pure/stable/instance/slice.js"(exports, module) {
      "use strict";
      var parent = require_slice2();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/instance/slice.js
  var require_slice4 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/instance/slice.js"(exports, module) {
      module.exports = require_slice3();
    }
  });

  // node_modules/core-js-pure/internals/to-string.js
  var require_to_string = __commonJS({
    "node_modules/core-js-pure/internals/to-string.js"(exports, module) {
      "use strict";
      var classof = require_classof();
      var $String = String;
      module.exports = function(argument) {
        if (classof(argument) === "Symbol")
          throw new TypeError("Cannot convert a Symbol value to a string");
        return $String(argument);
      };
    }
  });

  // node_modules/core-js-pure/internals/string-multibyte.js
  var require_string_multibyte = __commonJS({
    "node_modules/core-js-pure/internals/string-multibyte.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var toIntegerOrInfinity = require_to_integer_or_infinity();
      var toString = require_to_string();
      var requireObjectCoercible = require_require_object_coercible();
      var charAt = uncurryThis("".charAt);
      var charCodeAt = uncurryThis("".charCodeAt);
      var stringSlice = uncurryThis("".slice);
      var createMethod = function(CONVERT_TO_STRING) {
        return function($this, pos) {
          var S = toString(requireObjectCoercible($this));
          var position = toIntegerOrInfinity(pos);
          var size = S.length;
          var first, second;
          if (position < 0 || position >= size)
            return CONVERT_TO_STRING ? "" : void 0;
          first = charCodeAt(S, position);
          return first < 55296 || first > 56319 || position + 1 === size || (second = charCodeAt(S, position + 1)) < 56320 || second > 57343 ? CONVERT_TO_STRING ? charAt(S, position) : first : CONVERT_TO_STRING ? stringSlice(S, position, position + 2) : (first - 55296 << 10) + (second - 56320) + 65536;
        };
      };
      module.exports = {
        // `String.prototype.codePointAt` method
        // https://tc39.es/ecma262/#sec-string.prototype.codepointat
        codeAt: createMethod(false),
        // `String.prototype.at` method
        // https://github.com/mathiasbynens/String.prototype.at
        charAt: createMethod(true)
      };
    }
  });

  // node_modules/core-js-pure/internals/weak-map-basic-detection.js
  var require_weak_map_basic_detection = __commonJS({
    "node_modules/core-js-pure/internals/weak-map-basic-detection.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var isCallable = require_is_callable();
      var WeakMap = globalThis2.WeakMap;
      module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));
    }
  });

  // node_modules/core-js-pure/internals/shared-key.js
  var require_shared_key = __commonJS({
    "node_modules/core-js-pure/internals/shared-key.js"(exports, module) {
      "use strict";
      var shared = require_shared();
      var uid = require_uid();
      var keys = shared("keys");
      module.exports = function(key) {
        return keys[key] || (keys[key] = uid(key));
      };
    }
  });

  // node_modules/core-js-pure/internals/hidden-keys.js
  var require_hidden_keys = __commonJS({
    "node_modules/core-js-pure/internals/hidden-keys.js"(exports, module) {
      "use strict";
      module.exports = {};
    }
  });

  // node_modules/core-js-pure/internals/internal-state.js
  var require_internal_state = __commonJS({
    "node_modules/core-js-pure/internals/internal-state.js"(exports, module) {
      "use strict";
      var NATIVE_WEAK_MAP = require_weak_map_basic_detection();
      var globalThis2 = require_global_this();
      var isObject = require_is_object();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var hasOwn = require_has_own_property();
      var shared = require_shared_store();
      var sharedKey = require_shared_key();
      var hiddenKeys = require_hidden_keys();
      var OBJECT_ALREADY_INITIALIZED = "Object already initialized";
      var TypeError2 = globalThis2.TypeError;
      var WeakMap = globalThis2.WeakMap;
      var set;
      var get;
      var has;
      var enforce = function(it) {
        return has(it) ? get(it) : set(it, {});
      };
      var getterFor = function(TYPE) {
        return function(it) {
          var state;
          if (!isObject(it) || (state = get(it)).type !== TYPE) {
            throw new TypeError2("Incompatible receiver, " + TYPE + " required");
          }
          return state;
        };
      };
      if (NATIVE_WEAK_MAP || shared.state) {
        store = shared.state || (shared.state = new WeakMap());
        store.get = store.get;
        store.has = store.has;
        store.set = store.set;
        set = function(it, metadata) {
          if (store.has(it))
            throw new TypeError2(OBJECT_ALREADY_INITIALIZED);
          metadata.facade = it;
          store.set(it, metadata);
          return metadata;
        };
        get = function(it) {
          return store.get(it) || {};
        };
        has = function(it) {
          return store.has(it);
        };
      } else {
        STATE = sharedKey("state");
        hiddenKeys[STATE] = true;
        set = function(it, metadata) {
          if (hasOwn(it, STATE))
            throw new TypeError2(OBJECT_ALREADY_INITIALIZED);
          metadata.facade = it;
          createNonEnumerableProperty(it, STATE, metadata);
          return metadata;
        };
        get = function(it) {
          return hasOwn(it, STATE) ? it[STATE] : {};
        };
        has = function(it) {
          return hasOwn(it, STATE);
        };
      }
      var store;
      var STATE;
      module.exports = {
        set,
        get,
        has,
        enforce,
        getterFor
      };
    }
  });

  // node_modules/core-js-pure/internals/function-name.js
  var require_function_name = __commonJS({
    "node_modules/core-js-pure/internals/function-name.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var hasOwn = require_has_own_property();
      var FunctionPrototype = Function.prototype;
      var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
      var EXISTS = hasOwn(FunctionPrototype, "name");
      var PROPER = EXISTS && function something() {
      }.name === "something";
      var CONFIGURABLE = EXISTS && (!DESCRIPTORS || DESCRIPTORS && getDescriptor(FunctionPrototype, "name").configurable);
      module.exports = {
        EXISTS,
        PROPER,
        CONFIGURABLE
      };
    }
  });

  // node_modules/core-js-pure/internals/array-includes.js
  var require_array_includes = __commonJS({
    "node_modules/core-js-pure/internals/array-includes.js"(exports, module) {
      "use strict";
      var toIndexedObject = require_to_indexed_object();
      var toAbsoluteIndex = require_to_absolute_index();
      var lengthOfArrayLike = require_length_of_array_like();
      var createMethod = function(IS_INCLUDES) {
        return function($this, el, fromIndex) {
          var O = toIndexedObject($this);
          var length = lengthOfArrayLike(O);
          if (length === 0)
            return !IS_INCLUDES && -1;
          var index = toAbsoluteIndex(fromIndex, length);
          var value;
          if (IS_INCLUDES && el !== el)
            while (length > index) {
              value = O[index++];
              if (value !== value)
                return true;
            }
          else
            for (; length > index; index++) {
              if ((IS_INCLUDES || index in O) && O[index] === el)
                return IS_INCLUDES || index || 0;
            }
          return !IS_INCLUDES && -1;
        };
      };
      module.exports = {
        // `Array.prototype.includes` method
        // https://tc39.es/ecma262/#sec-array.prototype.includes
        includes: createMethod(true),
        // `Array.prototype.indexOf` method
        // https://tc39.es/ecma262/#sec-array.prototype.indexof
        indexOf: createMethod(false)
      };
    }
  });

  // node_modules/core-js-pure/internals/object-keys-internal.js
  var require_object_keys_internal = __commonJS({
    "node_modules/core-js-pure/internals/object-keys-internal.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var hasOwn = require_has_own_property();
      var toIndexedObject = require_to_indexed_object();
      var indexOf = require_array_includes().indexOf;
      var hiddenKeys = require_hidden_keys();
      var push = uncurryThis([].push);
      module.exports = function(object, names) {
        var O = toIndexedObject(object);
        var i = 0;
        var result = [];
        var key;
        for (key in O)
          !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
        while (names.length > i)
          if (hasOwn(O, key = names[i++])) {
            ~indexOf(result, key) || push(result, key);
          }
        return result;
      };
    }
  });

  // node_modules/core-js-pure/internals/enum-bug-keys.js
  var require_enum_bug_keys = __commonJS({
    "node_modules/core-js-pure/internals/enum-bug-keys.js"(exports, module) {
      "use strict";
      module.exports = [
        "constructor",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "toLocaleString",
        "toString",
        "valueOf"
      ];
    }
  });

  // node_modules/core-js-pure/internals/object-keys.js
  var require_object_keys = __commonJS({
    "node_modules/core-js-pure/internals/object-keys.js"(exports, module) {
      "use strict";
      var internalObjectKeys = require_object_keys_internal();
      var enumBugKeys = require_enum_bug_keys();
      module.exports = Object.keys || function keys(O) {
        return internalObjectKeys(O, enumBugKeys);
      };
    }
  });

  // node_modules/core-js-pure/internals/object-define-properties.js
  var require_object_define_properties = __commonJS({
    "node_modules/core-js-pure/internals/object-define-properties.js"(exports) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var V8_PROTOTYPE_DEFINE_BUG = require_v8_prototype_define_bug();
      var definePropertyModule = require_object_define_property();
      var anObject = require_an_object();
      var toIndexedObject = require_to_indexed_object();
      var objectKeys = require_object_keys();
      exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
        anObject(O);
        var props = toIndexedObject(Properties);
        var keys = objectKeys(Properties);
        var length = keys.length;
        var index = 0;
        var key;
        while (length > index)
          definePropertyModule.f(O, key = keys[index++], props[key]);
        return O;
      };
    }
  });

  // node_modules/core-js-pure/internals/html.js
  var require_html2 = __commonJS({
    "node_modules/core-js-pure/internals/html.js"(exports, module) {
      "use strict";
      var getBuiltIn = require_get_built_in();
      module.exports = getBuiltIn("document", "documentElement");
    }
  });

  // node_modules/core-js-pure/internals/object-create.js
  var require_object_create = __commonJS({
    "node_modules/core-js-pure/internals/object-create.js"(exports, module) {
      "use strict";
      var anObject = require_an_object();
      var definePropertiesModule = require_object_define_properties();
      var enumBugKeys = require_enum_bug_keys();
      var hiddenKeys = require_hidden_keys();
      var html = require_html2();
      var documentCreateElement = require_document_create_element();
      var sharedKey = require_shared_key();
      var GT = ">";
      var LT = "<";
      var PROTOTYPE = "prototype";
      var SCRIPT = "script";
      var IE_PROTO = sharedKey("IE_PROTO");
      var EmptyConstructor = function() {
      };
      var scriptTag = function(content) {
        return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
      };
      var NullProtoObjectViaActiveX = function(activeXDocument2) {
        activeXDocument2.write(scriptTag(""));
        activeXDocument2.close();
        var temp = activeXDocument2.parentWindow.Object;
        activeXDocument2 = null;
        return temp;
      };
      var NullProtoObjectViaIFrame = function() {
        var iframe = documentCreateElement("iframe");
        var JS = "java" + SCRIPT + ":";
        var iframeDocument;
        iframe.style.display = "none";
        html.appendChild(iframe);
        iframe.src = String(JS);
        iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(scriptTag("document.F=Object"));
        iframeDocument.close();
        return iframeDocument.F;
      };
      var activeXDocument;
      var NullProtoObject = function() {
        try {
          activeXDocument = new ActiveXObject("htmlfile");
        } catch (error) {
        }
        NullProtoObject = typeof document != "undefined" ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument);
        var length = enumBugKeys.length;
        while (length--)
          delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
        return NullProtoObject();
      };
      hiddenKeys[IE_PROTO] = true;
      module.exports = Object.create || function create(O, Properties) {
        var result;
        if (O !== null) {
          EmptyConstructor[PROTOTYPE] = anObject(O);
          result = new EmptyConstructor();
          EmptyConstructor[PROTOTYPE] = null;
          result[IE_PROTO] = O;
        } else
          result = NullProtoObject();
        return Properties === void 0 ? result : definePropertiesModule.f(result, Properties);
      };
    }
  });

  // node_modules/core-js-pure/internals/correct-prototype-getter.js
  var require_correct_prototype_getter = __commonJS({
    "node_modules/core-js-pure/internals/correct-prototype-getter.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      module.exports = !fails(function() {
        function F() {
        }
        F.prototype.constructor = null;
        return Object.getPrototypeOf(new F()) !== F.prototype;
      });
    }
  });

  // node_modules/core-js-pure/internals/object-get-prototype-of.js
  var require_object_get_prototype_of = __commonJS({
    "node_modules/core-js-pure/internals/object-get-prototype-of.js"(exports, module) {
      "use strict";
      var hasOwn = require_has_own_property();
      var isCallable = require_is_callable();
      var toObject = require_to_object();
      var sharedKey = require_shared_key();
      var CORRECT_PROTOTYPE_GETTER = require_correct_prototype_getter();
      var IE_PROTO = sharedKey("IE_PROTO");
      var $Object = Object;
      var ObjectPrototype = $Object.prototype;
      module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function(O) {
        var object = toObject(O);
        if (hasOwn(object, IE_PROTO))
          return object[IE_PROTO];
        var constructor = object.constructor;
        if (isCallable(constructor) && object instanceof constructor) {
          return constructor.prototype;
        }
        return object instanceof $Object ? ObjectPrototype : null;
      };
    }
  });

  // node_modules/core-js-pure/internals/define-built-in.js
  var require_define_built_in = __commonJS({
    "node_modules/core-js-pure/internals/define-built-in.js"(exports, module) {
      "use strict";
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      module.exports = function(target, key, value, options) {
        if (options && options.enumerable)
          target[key] = value;
        else
          createNonEnumerableProperty(target, key, value);
        return target;
      };
    }
  });

  // node_modules/core-js-pure/internals/iterators-core.js
  var require_iterators_core = __commonJS({
    "node_modules/core-js-pure/internals/iterators-core.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      var isCallable = require_is_callable();
      var isObject = require_is_object();
      var create = require_object_create();
      var getPrototypeOf = require_object_get_prototype_of();
      var defineBuiltIn = require_define_built_in();
      var wellKnownSymbol = require_well_known_symbol();
      var IS_PURE = require_is_pure();
      var ITERATOR = wellKnownSymbol("iterator");
      var BUGGY_SAFARI_ITERATORS = false;
      var IteratorPrototype;
      var PrototypeOfArrayIteratorPrototype;
      var arrayIterator;
      if ([].keys) {
        arrayIterator = [].keys();
        if (!("next" in arrayIterator))
          BUGGY_SAFARI_ITERATORS = true;
        else {
          PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
          if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
            IteratorPrototype = PrototypeOfArrayIteratorPrototype;
        }
      }
      var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function() {
        var test = {};
        return IteratorPrototype[ITERATOR].call(test) !== test;
      });
      if (NEW_ITERATOR_PROTOTYPE)
        IteratorPrototype = {};
      else if (IS_PURE)
        IteratorPrototype = create(IteratorPrototype);
      if (!isCallable(IteratorPrototype[ITERATOR])) {
        defineBuiltIn(IteratorPrototype, ITERATOR, function() {
          return this;
        });
      }
      module.exports = {
        IteratorPrototype,
        BUGGY_SAFARI_ITERATORS
      };
    }
  });

  // node_modules/core-js-pure/internals/object-to-string.js
  var require_object_to_string = __commonJS({
    "node_modules/core-js-pure/internals/object-to-string.js"(exports, module) {
      "use strict";
      var TO_STRING_TAG_SUPPORT = require_to_string_tag_support();
      var classof = require_classof();
      module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
        return "[object " + classof(this) + "]";
      };
    }
  });

  // node_modules/core-js-pure/internals/set-to-string-tag.js
  var require_set_to_string_tag = __commonJS({
    "node_modules/core-js-pure/internals/set-to-string-tag.js"(exports, module) {
      "use strict";
      var TO_STRING_TAG_SUPPORT = require_to_string_tag_support();
      var defineProperty = require_object_define_property().f;
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var hasOwn = require_has_own_property();
      var toString = require_object_to_string();
      var wellKnownSymbol = require_well_known_symbol();
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      module.exports = function(it, TAG, STATIC, SET_METHOD) {
        var target = STATIC ? it : it && it.prototype;
        if (target) {
          if (!hasOwn(target, TO_STRING_TAG)) {
            defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
          }
          if (SET_METHOD && !TO_STRING_TAG_SUPPORT) {
            createNonEnumerableProperty(target, "toString", toString);
          }
        }
      };
    }
  });

  // node_modules/core-js-pure/internals/iterators.js
  var require_iterators = __commonJS({
    "node_modules/core-js-pure/internals/iterators.js"(exports, module) {
      "use strict";
      module.exports = {};
    }
  });

  // node_modules/core-js-pure/internals/iterator-create-constructor.js
  var require_iterator_create_constructor = __commonJS({
    "node_modules/core-js-pure/internals/iterator-create-constructor.js"(exports, module) {
      "use strict";
      var IteratorPrototype = require_iterators_core().IteratorPrototype;
      var create = require_object_create();
      var createPropertyDescriptor = require_create_property_descriptor();
      var setToStringTag = require_set_to_string_tag();
      var Iterators = require_iterators();
      var returnThis = function() {
        return this;
      };
      module.exports = function(IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
        var TO_STRING_TAG = NAME + " Iterator";
        IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
        setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
        Iterators[TO_STRING_TAG] = returnThis;
        return IteratorConstructor;
      };
    }
  });

  // node_modules/core-js-pure/internals/function-uncurry-this-accessor.js
  var require_function_uncurry_this_accessor = __commonJS({
    "node_modules/core-js-pure/internals/function-uncurry-this-accessor.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var aCallable = require_a_callable();
      module.exports = function(object, key, method) {
        try {
          return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
        } catch (error) {
        }
      };
    }
  });

  // node_modules/core-js-pure/internals/is-possible-prototype.js
  var require_is_possible_prototype = __commonJS({
    "node_modules/core-js-pure/internals/is-possible-prototype.js"(exports, module) {
      "use strict";
      var isObject = require_is_object();
      module.exports = function(argument) {
        return isObject(argument) || argument === null;
      };
    }
  });

  // node_modules/core-js-pure/internals/a-possible-prototype.js
  var require_a_possible_prototype = __commonJS({
    "node_modules/core-js-pure/internals/a-possible-prototype.js"(exports, module) {
      "use strict";
      var isPossiblePrototype = require_is_possible_prototype();
      var $String = String;
      var $TypeError = TypeError;
      module.exports = function(argument) {
        if (isPossiblePrototype(argument))
          return argument;
        throw new $TypeError("Can't set " + $String(argument) + " as a prototype");
      };
    }
  });

  // node_modules/core-js-pure/internals/object-set-prototype-of.js
  var require_object_set_prototype_of = __commonJS({
    "node_modules/core-js-pure/internals/object-set-prototype-of.js"(exports, module) {
      "use strict";
      var uncurryThisAccessor = require_function_uncurry_this_accessor();
      var isObject = require_is_object();
      var requireObjectCoercible = require_require_object_coercible();
      var aPossiblePrototype = require_a_possible_prototype();
      module.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var CORRECT_SETTER = false;
        var test = {};
        var setter;
        try {
          setter = uncurryThisAccessor(Object.prototype, "__proto__", "set");
          setter(test, []);
          CORRECT_SETTER = test instanceof Array;
        } catch (error) {
        }
        return function setPrototypeOf(O, proto) {
          requireObjectCoercible(O);
          aPossiblePrototype(proto);
          if (!isObject(O))
            return O;
          if (CORRECT_SETTER)
            setter(O, proto);
          else
            O.__proto__ = proto;
          return O;
        };
      }() : void 0);
    }
  });

  // node_modules/core-js-pure/internals/iterator-define.js
  var require_iterator_define = __commonJS({
    "node_modules/core-js-pure/internals/iterator-define.js"(exports, module) {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var IS_PURE = require_is_pure();
      var FunctionName = require_function_name();
      var isCallable = require_is_callable();
      var createIteratorConstructor = require_iterator_create_constructor();
      var getPrototypeOf = require_object_get_prototype_of();
      var setPrototypeOf = require_object_set_prototype_of();
      var setToStringTag = require_set_to_string_tag();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var defineBuiltIn = require_define_built_in();
      var wellKnownSymbol = require_well_known_symbol();
      var Iterators = require_iterators();
      var IteratorsCore = require_iterators_core();
      var PROPER_FUNCTION_NAME = FunctionName.PROPER;
      var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
      var IteratorPrototype = IteratorsCore.IteratorPrototype;
      var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
      var ITERATOR = wellKnownSymbol("iterator");
      var KEYS = "keys";
      var VALUES = "values";
      var ENTRIES = "entries";
      var returnThis = function() {
        return this;
      };
      module.exports = function(Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
        createIteratorConstructor(IteratorConstructor, NAME, next);
        var getIterationMethod = function(KIND) {
          if (KIND === DEFAULT && defaultIterator)
            return defaultIterator;
          if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype)
            return IterablePrototype[KIND];
          switch (KIND) {
            case KEYS:
              return function keys() {
                return new IteratorConstructor(this, KIND);
              };
            case VALUES:
              return function values() {
                return new IteratorConstructor(this, KIND);
              };
            case ENTRIES:
              return function entries() {
                return new IteratorConstructor(this, KIND);
              };
          }
          return function() {
            return new IteratorConstructor(this);
          };
        };
        var TO_STRING_TAG = NAME + " Iterator";
        var INCORRECT_VALUES_NAME = false;
        var IterablePrototype = Iterable.prototype;
        var nativeIterator = IterablePrototype[ITERATOR] || IterablePrototype["@@iterator"] || DEFAULT && IterablePrototype[DEFAULT];
        var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
        var anyNativeIterator = NAME === "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
        var CurrentIteratorPrototype, methods, KEY;
        if (anyNativeIterator) {
          CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
          if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
            if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
              if (setPrototypeOf) {
                setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
              } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
                defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
              }
            }
            setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
            if (IS_PURE)
              Iterators[TO_STRING_TAG] = returnThis;
          }
        }
        if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
          if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
            createNonEnumerableProperty(IterablePrototype, "name", VALUES);
          } else {
            INCORRECT_VALUES_NAME = true;
            defaultIterator = function values() {
              return call(nativeIterator, this);
            };
          }
        }
        if (DEFAULT) {
          methods = {
            values: getIterationMethod(VALUES),
            keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
            entries: getIterationMethod(ENTRIES)
          };
          if (FORCED)
            for (KEY in methods) {
              if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
                defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
              }
            }
          else
            $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
        }
        if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
          defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
        }
        Iterators[NAME] = defaultIterator;
        return methods;
      };
    }
  });

  // node_modules/core-js-pure/internals/create-iter-result-object.js
  var require_create_iter_result_object = __commonJS({
    "node_modules/core-js-pure/internals/create-iter-result-object.js"(exports, module) {
      "use strict";
      module.exports = function(value, done) {
        return { value, done };
      };
    }
  });

  // node_modules/core-js-pure/modules/es.string.iterator.js
  var require_es_string_iterator = __commonJS({
    "node_modules/core-js-pure/modules/es.string.iterator.js"() {
      "use strict";
      var charAt = require_string_multibyte().charAt;
      var toString = require_to_string();
      var InternalStateModule = require_internal_state();
      var defineIterator = require_iterator_define();
      var createIterResultObject = require_create_iter_result_object();
      var STRING_ITERATOR = "String Iterator";
      var setInternalState = InternalStateModule.set;
      var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);
      defineIterator(String, "String", function(iterated) {
        setInternalState(this, {
          type: STRING_ITERATOR,
          string: toString(iterated),
          index: 0
        });
      }, function next() {
        var state = getInternalState(this);
        var string = state.string;
        var index = state.index;
        var point;
        if (index >= string.length)
          return createIterResultObject(void 0, true);
        point = charAt(string, index);
        state.index += point.length;
        return createIterResultObject(point, false);
      });
    }
  });

  // node_modules/core-js-pure/internals/iterator-close.js
  var require_iterator_close = __commonJS({
    "node_modules/core-js-pure/internals/iterator-close.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var anObject = require_an_object();
      var getMethod = require_get_method();
      module.exports = function(iterator, kind, value) {
        var innerResult, innerError;
        anObject(iterator);
        try {
          innerResult = getMethod(iterator, "return");
          if (!innerResult) {
            if (kind === "throw")
              throw value;
            return value;
          }
          innerResult = call(innerResult, iterator);
        } catch (error) {
          innerError = true;
          innerResult = error;
        }
        if (kind === "throw")
          throw value;
        if (innerError)
          throw innerResult;
        anObject(innerResult);
        return value;
      };
    }
  });

  // node_modules/core-js-pure/internals/call-with-safe-iteration-closing.js
  var require_call_with_safe_iteration_closing = __commonJS({
    "node_modules/core-js-pure/internals/call-with-safe-iteration-closing.js"(exports, module) {
      "use strict";
      var anObject = require_an_object();
      var iteratorClose = require_iterator_close();
      module.exports = function(iterator, fn, value, ENTRIES) {
        try {
          return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
        } catch (error) {
          iteratorClose(iterator, "throw", error);
        }
      };
    }
  });

  // node_modules/core-js-pure/internals/is-array-iterator-method.js
  var require_is_array_iterator_method = __commonJS({
    "node_modules/core-js-pure/internals/is-array-iterator-method.js"(exports, module) {
      "use strict";
      var wellKnownSymbol = require_well_known_symbol();
      var Iterators = require_iterators();
      var ITERATOR = wellKnownSymbol("iterator");
      var ArrayPrototype = Array.prototype;
      module.exports = function(it) {
        return it !== void 0 && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
      };
    }
  });

  // node_modules/core-js-pure/internals/get-iterator-method.js
  var require_get_iterator_method = __commonJS({
    "node_modules/core-js-pure/internals/get-iterator-method.js"(exports, module) {
      "use strict";
      var classof = require_classof();
      var getMethod = require_get_method();
      var isNullOrUndefined = require_is_null_or_undefined();
      var Iterators = require_iterators();
      var wellKnownSymbol = require_well_known_symbol();
      var ITERATOR = wellKnownSymbol("iterator");
      module.exports = function(it) {
        if (!isNullOrUndefined(it))
          return getMethod(it, ITERATOR) || getMethod(it, "@@iterator") || Iterators[classof(it)];
      };
    }
  });

  // node_modules/core-js-pure/internals/get-iterator.js
  var require_get_iterator = __commonJS({
    "node_modules/core-js-pure/internals/get-iterator.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var aCallable = require_a_callable();
      var anObject = require_an_object();
      var tryToString = require_try_to_string();
      var getIteratorMethod = require_get_iterator_method();
      var $TypeError = TypeError;
      module.exports = function(argument, usingIterator) {
        var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
        if (aCallable(iteratorMethod))
          return anObject(call(iteratorMethod, argument));
        throw new $TypeError(tryToString(argument) + " is not iterable");
      };
    }
  });

  // node_modules/core-js-pure/internals/array-from.js
  var require_array_from = __commonJS({
    "node_modules/core-js-pure/internals/array-from.js"(exports, module) {
      "use strict";
      var bind = require_function_bind_context();
      var call = require_function_call();
      var toObject = require_to_object();
      var callWithSafeIterationClosing = require_call_with_safe_iteration_closing();
      var isArrayIteratorMethod = require_is_array_iterator_method();
      var isConstructor = require_is_constructor();
      var lengthOfArrayLike = require_length_of_array_like();
      var createProperty = require_create_property();
      var getIterator = require_get_iterator();
      var getIteratorMethod = require_get_iterator_method();
      var $Array = Array;
      module.exports = function from(arrayLike) {
        var O = toObject(arrayLike);
        var IS_CONSTRUCTOR = isConstructor(this);
        var argumentsLength = arguments.length;
        var mapfn = argumentsLength > 1 ? arguments[1] : void 0;
        var mapping = mapfn !== void 0;
        if (mapping)
          mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : void 0);
        var iteratorMethod = getIteratorMethod(O);
        var index = 0;
        var length, result, step, iterator, next, value;
        if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
          result = IS_CONSTRUCTOR ? new this() : [];
          iterator = getIterator(O, iteratorMethod);
          next = iterator.next;
          for (; !(step = call(next, iterator)).done; index++) {
            value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
            createProperty(result, index, value);
          }
        } else {
          length = lengthOfArrayLike(O);
          result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
          for (; length > index; index++) {
            value = mapping ? mapfn(O[index], index) : O[index];
            createProperty(result, index, value);
          }
        }
        result.length = index;
        return result;
      };
    }
  });

  // node_modules/core-js-pure/internals/check-correctness-of-iteration.js
  var require_check_correctness_of_iteration = __commonJS({
    "node_modules/core-js-pure/internals/check-correctness-of-iteration.js"(exports, module) {
      "use strict";
      var wellKnownSymbol = require_well_known_symbol();
      var ITERATOR = wellKnownSymbol("iterator");
      var SAFE_CLOSING = false;
      try {
        called = 0;
        iteratorWithReturn = {
          next: function() {
            return { done: !!called++ };
          },
          "return": function() {
            SAFE_CLOSING = true;
          }
        };
        iteratorWithReturn[ITERATOR] = function() {
          return this;
        };
        Array.from(iteratorWithReturn, function() {
          throw 2;
        });
      } catch (error) {
      }
      var called;
      var iteratorWithReturn;
      module.exports = function(exec, SKIP_CLOSING) {
        try {
          if (!SKIP_CLOSING && !SAFE_CLOSING)
            return false;
        } catch (error) {
          return false;
        }
        var ITERATION_SUPPORT = false;
        try {
          var object = {};
          object[ITERATOR] = function() {
            return {
              next: function() {
                return { done: ITERATION_SUPPORT = true };
              }
            };
          };
          exec(object);
        } catch (error) {
        }
        return ITERATION_SUPPORT;
      };
    }
  });

  // node_modules/core-js-pure/modules/es.array.from.js
  var require_es_array_from = __commonJS({
    "node_modules/core-js-pure/modules/es.array.from.js"() {
      "use strict";
      var $ = require_export();
      var from = require_array_from();
      var checkCorrectnessOfIteration = require_check_correctness_of_iteration();
      var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function(iterable) {
        Array.from(iterable);
      });
      $({ target: "Array", stat: true, forced: INCORRECT_ITERATION }, {
        from
      });
    }
  });

  // node_modules/core-js-pure/es/array/from.js
  var require_from = __commonJS({
    "node_modules/core-js-pure/es/array/from.js"(exports, module) {
      "use strict";
      require_es_string_iterator();
      require_es_array_from();
      var path = require_path();
      module.exports = path.Array.from;
    }
  });

  // node_modules/core-js-pure/stable/array/from.js
  var require_from2 = __commonJS({
    "node_modules/core-js-pure/stable/array/from.js"(exports, module) {
      "use strict";
      var parent = require_from();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/array/from.js
  var require_from3 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/array/from.js"(exports, module) {
      module.exports = require_from2();
    }
  });

  // node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js
  var require_does_not_exceed_safe_integer = __commonJS({
    "node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js"(exports, module) {
      "use strict";
      var $TypeError = TypeError;
      var MAX_SAFE_INTEGER = 9007199254740991;
      module.exports = function(it) {
        if (it > MAX_SAFE_INTEGER)
          throw $TypeError("Maximum allowed index exceeded");
        return it;
      };
    }
  });

  // node_modules/core-js-pure/internals/array-species-constructor.js
  var require_array_species_constructor = __commonJS({
    "node_modules/core-js-pure/internals/array-species-constructor.js"(exports, module) {
      "use strict";
      var isArray = require_is_array();
      var isConstructor = require_is_constructor();
      var isObject = require_is_object();
      var wellKnownSymbol = require_well_known_symbol();
      var SPECIES = wellKnownSymbol("species");
      var $Array = Array;
      module.exports = function(originalArray) {
        var C;
        if (isArray(originalArray)) {
          C = originalArray.constructor;
          if (isConstructor(C) && (C === $Array || isArray(C.prototype)))
            C = void 0;
          else if (isObject(C)) {
            C = C[SPECIES];
            if (C === null)
              C = void 0;
          }
        }
        return C === void 0 ? $Array : C;
      };
    }
  });

  // node_modules/core-js-pure/internals/array-species-create.js
  var require_array_species_create = __commonJS({
    "node_modules/core-js-pure/internals/array-species-create.js"(exports, module) {
      "use strict";
      var arraySpeciesConstructor = require_array_species_constructor();
      module.exports = function(originalArray, length) {
        return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
      };
    }
  });

  // node_modules/core-js-pure/modules/es.array.concat.js
  var require_es_array_concat = __commonJS({
    "node_modules/core-js-pure/modules/es.array.concat.js"() {
      "use strict";
      var $ = require_export();
      var fails = require_fails();
      var isArray = require_is_array();
      var isObject = require_is_object();
      var toObject = require_to_object();
      var lengthOfArrayLike = require_length_of_array_like();
      var doesNotExceedSafeInteger = require_does_not_exceed_safe_integer();
      var createProperty = require_create_property();
      var arraySpeciesCreate = require_array_species_create();
      var arrayMethodHasSpeciesSupport = require_array_method_has_species_support();
      var wellKnownSymbol = require_well_known_symbol();
      var V8_VERSION = require_environment_v8_version();
      var IS_CONCAT_SPREADABLE = wellKnownSymbol("isConcatSpreadable");
      var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function() {
        var array = [];
        array[IS_CONCAT_SPREADABLE] = false;
        return array.concat()[0] !== array;
      });
      var isConcatSpreadable = function(O) {
        if (!isObject(O))
          return false;
        var spreadable = O[IS_CONCAT_SPREADABLE];
        return spreadable !== void 0 ? !!spreadable : isArray(O);
      };
      var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport("concat");
      $({ target: "Array", proto: true, arity: 1, forced: FORCED }, {
        // eslint-disable-next-line no-unused-vars -- required for `.length`
        concat: function concat(arg) {
          var O = toObject(this);
          var A = arraySpeciesCreate(O, 0);
          var n = 0;
          var i, k, length, len, E;
          for (i = -1, length = arguments.length; i < length; i++) {
            E = i === -1 ? O : arguments[i];
            if (isConcatSpreadable(E)) {
              len = lengthOfArrayLike(E);
              doesNotExceedSafeInteger(n + len);
              for (k = 0; k < len; k++, n++)
                if (k in E)
                  createProperty(A, n, E[k]);
            } else {
              doesNotExceedSafeInteger(n + 1);
              createProperty(A, n++, E);
            }
          }
          A.length = n;
          return A;
        }
      });
    }
  });

  // node_modules/core-js-pure/modules/es.object.to-string.js
  var require_es_object_to_string = __commonJS({
    "node_modules/core-js-pure/modules/es.object.to-string.js"() {
    }
  });

  // node_modules/core-js-pure/internals/object-get-own-property-names.js
  var require_object_get_own_property_names = __commonJS({
    "node_modules/core-js-pure/internals/object-get-own-property-names.js"(exports) {
      "use strict";
      var internalObjectKeys = require_object_keys_internal();
      var enumBugKeys = require_enum_bug_keys();
      var hiddenKeys = enumBugKeys.concat("length", "prototype");
      exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
        return internalObjectKeys(O, hiddenKeys);
      };
    }
  });

  // node_modules/core-js-pure/internals/object-get-own-property-names-external.js
  var require_object_get_own_property_names_external = __commonJS({
    "node_modules/core-js-pure/internals/object-get-own-property-names-external.js"(exports, module) {
      "use strict";
      var classof = require_classof_raw();
      var toIndexedObject = require_to_indexed_object();
      var $getOwnPropertyNames = require_object_get_own_property_names().f;
      var arraySlice = require_array_slice();
      var windowNames = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
      var getWindowNames = function(it) {
        try {
          return $getOwnPropertyNames(it);
        } catch (error) {
          return arraySlice(windowNames);
        }
      };
      module.exports.f = function getOwnPropertyNames(it) {
        return windowNames && classof(it) === "Window" ? getWindowNames(it) : $getOwnPropertyNames(toIndexedObject(it));
      };
    }
  });

  // node_modules/core-js-pure/internals/object-get-own-property-symbols.js
  var require_object_get_own_property_symbols = __commonJS({
    "node_modules/core-js-pure/internals/object-get-own-property-symbols.js"(exports) {
      "use strict";
      exports.f = Object.getOwnPropertySymbols;
    }
  });

  // node_modules/core-js-pure/internals/define-built-in-accessor.js
  var require_define_built_in_accessor = __commonJS({
    "node_modules/core-js-pure/internals/define-built-in-accessor.js"(exports, module) {
      "use strict";
      var defineProperty = require_object_define_property();
      module.exports = function(target, name, descriptor) {
        return defineProperty.f(target, name, descriptor);
      };
    }
  });

  // node_modules/core-js-pure/internals/well-known-symbol-wrapped.js
  var require_well_known_symbol_wrapped = __commonJS({
    "node_modules/core-js-pure/internals/well-known-symbol-wrapped.js"(exports) {
      "use strict";
      var wellKnownSymbol = require_well_known_symbol();
      exports.f = wellKnownSymbol;
    }
  });

  // node_modules/core-js-pure/internals/well-known-symbol-define.js
  var require_well_known_symbol_define = __commonJS({
    "node_modules/core-js-pure/internals/well-known-symbol-define.js"(exports, module) {
      "use strict";
      var path = require_path();
      var hasOwn = require_has_own_property();
      var wrappedWellKnownSymbolModule = require_well_known_symbol_wrapped();
      var defineProperty = require_object_define_property().f;
      module.exports = function(NAME) {
        var Symbol2 = path.Symbol || (path.Symbol = {});
        if (!hasOwn(Symbol2, NAME))
          defineProperty(Symbol2, NAME, {
            value: wrappedWellKnownSymbolModule.f(NAME)
          });
      };
    }
  });

  // node_modules/core-js-pure/internals/symbol-define-to-primitive.js
  var require_symbol_define_to_primitive = __commonJS({
    "node_modules/core-js-pure/internals/symbol-define-to-primitive.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var getBuiltIn = require_get_built_in();
      var wellKnownSymbol = require_well_known_symbol();
      var defineBuiltIn = require_define_built_in();
      module.exports = function() {
        var Symbol2 = getBuiltIn("Symbol");
        var SymbolPrototype = Symbol2 && Symbol2.prototype;
        var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
        var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");
        if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
          defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function(hint) {
            return call(valueOf, this);
          }, { arity: 1 });
        }
      };
    }
  });

  // node_modules/core-js-pure/internals/array-iteration.js
  var require_array_iteration = __commonJS({
    "node_modules/core-js-pure/internals/array-iteration.js"(exports, module) {
      "use strict";
      var bind = require_function_bind_context();
      var uncurryThis = require_function_uncurry_this();
      var IndexedObject = require_indexed_object();
      var toObject = require_to_object();
      var lengthOfArrayLike = require_length_of_array_like();
      var arraySpeciesCreate = require_array_species_create();
      var push = uncurryThis([].push);
      var createMethod = function(TYPE) {
        var IS_MAP = TYPE === 1;
        var IS_FILTER = TYPE === 2;
        var IS_SOME = TYPE === 3;
        var IS_EVERY = TYPE === 4;
        var IS_FIND_INDEX = TYPE === 6;
        var IS_FILTER_REJECT = TYPE === 7;
        var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
        return function($this, callbackfn, that, specificCreate) {
          var O = toObject($this);
          var self2 = IndexedObject(O);
          var length = lengthOfArrayLike(self2);
          var boundFunction = bind(callbackfn, that);
          var index = 0;
          var create = specificCreate || arraySpeciesCreate;
          var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : void 0;
          var value, result;
          for (; length > index; index++)
            if (NO_HOLES || index in self2) {
              value = self2[index];
              result = boundFunction(value, index, O);
              if (TYPE) {
                if (IS_MAP)
                  target[index] = result;
                else if (result)
                  switch (TYPE) {
                    case 3:
                      return true;
                    case 5:
                      return value;
                    case 6:
                      return index;
                    case 2:
                      push(target, value);
                  }
                else
                  switch (TYPE) {
                    case 4:
                      return false;
                    case 7:
                      push(target, value);
                  }
              }
            }
          return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
        };
      };
      module.exports = {
        // `Array.prototype.forEach` method
        // https://tc39.es/ecma262/#sec-array.prototype.foreach
        forEach: createMethod(0),
        // `Array.prototype.map` method
        // https://tc39.es/ecma262/#sec-array.prototype.map
        map: createMethod(1),
        // `Array.prototype.filter` method
        // https://tc39.es/ecma262/#sec-array.prototype.filter
        filter: createMethod(2),
        // `Array.prototype.some` method
        // https://tc39.es/ecma262/#sec-array.prototype.some
        some: createMethod(3),
        // `Array.prototype.every` method
        // https://tc39.es/ecma262/#sec-array.prototype.every
        every: createMethod(4),
        // `Array.prototype.find` method
        // https://tc39.es/ecma262/#sec-array.prototype.find
        find: createMethod(5),
        // `Array.prototype.findIndex` method
        // https://tc39.es/ecma262/#sec-array.prototype.findIndex
        findIndex: createMethod(6),
        // `Array.prototype.filterReject` method
        // https://github.com/tc39/proposal-array-filtering
        filterReject: createMethod(7)
      };
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.constructor.js
  var require_es_symbol_constructor = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.constructor.js"() {
      "use strict";
      var $ = require_export();
      var globalThis2 = require_global_this();
      var call = require_function_call();
      var uncurryThis = require_function_uncurry_this();
      var IS_PURE = require_is_pure();
      var DESCRIPTORS = require_descriptors();
      var NATIVE_SYMBOL = require_symbol_constructor_detection();
      var fails = require_fails();
      var hasOwn = require_has_own_property();
      var isPrototypeOf = require_object_is_prototype_of();
      var anObject = require_an_object();
      var toIndexedObject = require_to_indexed_object();
      var toPropertyKey = require_to_property_key();
      var $toString = require_to_string();
      var createPropertyDescriptor = require_create_property_descriptor();
      var nativeObjectCreate = require_object_create();
      var objectKeys = require_object_keys();
      var getOwnPropertyNamesModule = require_object_get_own_property_names();
      var getOwnPropertyNamesExternal = require_object_get_own_property_names_external();
      var getOwnPropertySymbolsModule = require_object_get_own_property_symbols();
      var getOwnPropertyDescriptorModule = require_object_get_own_property_descriptor();
      var definePropertyModule = require_object_define_property();
      var definePropertiesModule = require_object_define_properties();
      var propertyIsEnumerableModule = require_object_property_is_enumerable();
      var defineBuiltIn = require_define_built_in();
      var defineBuiltInAccessor = require_define_built_in_accessor();
      var shared = require_shared();
      var sharedKey = require_shared_key();
      var hiddenKeys = require_hidden_keys();
      var uid = require_uid();
      var wellKnownSymbol = require_well_known_symbol();
      var wrappedWellKnownSymbolModule = require_well_known_symbol_wrapped();
      var defineWellKnownSymbol = require_well_known_symbol_define();
      var defineSymbolToPrimitive = require_symbol_define_to_primitive();
      var setToStringTag = require_set_to_string_tag();
      var InternalStateModule = require_internal_state();
      var $forEach = require_array_iteration().forEach;
      var HIDDEN = sharedKey("hidden");
      var SYMBOL = "Symbol";
      var PROTOTYPE = "prototype";
      var setInternalState = InternalStateModule.set;
      var getInternalState = InternalStateModule.getterFor(SYMBOL);
      var ObjectPrototype = Object[PROTOTYPE];
      var $Symbol = globalThis2.Symbol;
      var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
      var RangeError = globalThis2.RangeError;
      var TypeError2 = globalThis2.TypeError;
      var QObject = globalThis2.QObject;
      var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
      var nativeDefineProperty = definePropertyModule.f;
      var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
      var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
      var push = uncurryThis([].push);
      var AllSymbols = shared("symbols");
      var ObjectPrototypeSymbols = shared("op-symbols");
      var WellKnownSymbolsStore = shared("wks");
      var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
      var fallbackDefineProperty = function(O, P, Attributes) {
        var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
        if (ObjectPrototypeDescriptor)
          delete ObjectPrototype[P];
        nativeDefineProperty(O, P, Attributes);
        if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
          nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
        }
      };
      var setSymbolDescriptor = DESCRIPTORS && fails(function() {
        return nativeObjectCreate(nativeDefineProperty({}, "a", {
          get: function() {
            return nativeDefineProperty(this, "a", { value: 7 }).a;
          }
        })).a !== 7;
      }) ? fallbackDefineProperty : nativeDefineProperty;
      var wrap = function(tag, description) {
        var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
        setInternalState(symbol, {
          type: SYMBOL,
          tag,
          description
        });
        if (!DESCRIPTORS)
          symbol.description = description;
        return symbol;
      };
      var $defineProperty = function defineProperty(O, P, Attributes) {
        if (O === ObjectPrototype)
          $defineProperty(ObjectPrototypeSymbols, P, Attributes);
        anObject(O);
        var key = toPropertyKey(P);
        anObject(Attributes);
        if (hasOwn(AllSymbols, key)) {
          if (!Attributes.enumerable) {
            if (!hasOwn(O, HIDDEN))
              nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, nativeObjectCreate(null)));
            O[HIDDEN][key] = true;
          } else {
            if (hasOwn(O, HIDDEN) && O[HIDDEN][key])
              O[HIDDEN][key] = false;
            Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
          }
          return setSymbolDescriptor(O, key, Attributes);
        }
        return nativeDefineProperty(O, key, Attributes);
      };
      var $defineProperties = function defineProperties(O, Properties) {
        anObject(O);
        var properties = toIndexedObject(Properties);
        var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
        $forEach(keys, function(key) {
          if (!DESCRIPTORS || call($propertyIsEnumerable, properties, key))
            $defineProperty(O, key, properties[key]);
        });
        return O;
      };
      var $create = function create(O, Properties) {
        return Properties === void 0 ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
      };
      var $propertyIsEnumerable = function propertyIsEnumerable(V) {
        var P = toPropertyKey(V);
        var enumerable = call(nativePropertyIsEnumerable, this, P);
        if (this === ObjectPrototype && hasOwn(AllSymbols, P) && !hasOwn(ObjectPrototypeSymbols, P))
          return false;
        return enumerable || !hasOwn(this, P) || !hasOwn(AllSymbols, P) || hasOwn(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
      };
      var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
        var it = toIndexedObject(O);
        var key = toPropertyKey(P);
        if (it === ObjectPrototype && hasOwn(AllSymbols, key) && !hasOwn(ObjectPrototypeSymbols, key))
          return;
        var descriptor = nativeGetOwnPropertyDescriptor(it, key);
        if (descriptor && hasOwn(AllSymbols, key) && !(hasOwn(it, HIDDEN) && it[HIDDEN][key])) {
          descriptor.enumerable = true;
        }
        return descriptor;
      };
      var $getOwnPropertyNames = function getOwnPropertyNames(O) {
        var names = nativeGetOwnPropertyNames(toIndexedObject(O));
        var result = [];
        $forEach(names, function(key) {
          if (!hasOwn(AllSymbols, key) && !hasOwn(hiddenKeys, key))
            push(result, key);
        });
        return result;
      };
      var $getOwnPropertySymbols = function(O) {
        var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
        var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
        var result = [];
        $forEach(names, function(key) {
          if (hasOwn(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn(ObjectPrototype, key))) {
            push(result, AllSymbols[key]);
          }
        });
        return result;
      };
      if (!NATIVE_SYMBOL) {
        $Symbol = function Symbol2() {
          if (isPrototypeOf(SymbolPrototype, this))
            throw new TypeError2("Symbol is not a constructor");
          var description = !arguments.length || arguments[0] === void 0 ? void 0 : $toString(arguments[0]);
          var tag = uid(description);
          var setter = function(value) {
            var $this = this === void 0 ? globalThis2 : this;
            if ($this === ObjectPrototype)
              call(setter, ObjectPrototypeSymbols, value);
            if (hasOwn($this, HIDDEN) && hasOwn($this[HIDDEN], tag))
              $this[HIDDEN][tag] = false;
            var descriptor = createPropertyDescriptor(1, value);
            try {
              setSymbolDescriptor($this, tag, descriptor);
            } catch (error) {
              if (!(error instanceof RangeError))
                throw error;
              fallbackDefineProperty($this, tag, descriptor);
            }
          };
          if (DESCRIPTORS && USE_SETTER)
            setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
          return wrap(tag, description);
        };
        SymbolPrototype = $Symbol[PROTOTYPE];
        defineBuiltIn(SymbolPrototype, "toString", function toString() {
          return getInternalState(this).tag;
        });
        defineBuiltIn($Symbol, "withoutSetter", function(description) {
          return wrap(uid(description), description);
        });
        propertyIsEnumerableModule.f = $propertyIsEnumerable;
        definePropertyModule.f = $defineProperty;
        definePropertiesModule.f = $defineProperties;
        getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
        getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
        getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;
        wrappedWellKnownSymbolModule.f = function(name) {
          return wrap(wellKnownSymbol(name), name);
        };
        if (DESCRIPTORS) {
          defineBuiltInAccessor(SymbolPrototype, "description", {
            configurable: true,
            get: function description() {
              return getInternalState(this).description;
            }
          });
          if (!IS_PURE) {
            defineBuiltIn(ObjectPrototype, "propertyIsEnumerable", $propertyIsEnumerable, { unsafe: true });
          }
        }
      }
      $({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
        Symbol: $Symbol
      });
      $forEach(objectKeys(WellKnownSymbolsStore), function(name) {
        defineWellKnownSymbol(name);
      });
      $({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
        useSetter: function() {
          USE_SETTER = true;
        },
        useSimple: function() {
          USE_SETTER = false;
        }
      });
      $({ target: "Object", stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
        // `Object.create` method
        // https://tc39.es/ecma262/#sec-object.create
        create: $create,
        // `Object.defineProperty` method
        // https://tc39.es/ecma262/#sec-object.defineproperty
        defineProperty: $defineProperty,
        // `Object.defineProperties` method
        // https://tc39.es/ecma262/#sec-object.defineproperties
        defineProperties: $defineProperties,
        // `Object.getOwnPropertyDescriptor` method
        // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
        getOwnPropertyDescriptor: $getOwnPropertyDescriptor
      });
      $({ target: "Object", stat: true, forced: !NATIVE_SYMBOL }, {
        // `Object.getOwnPropertyNames` method
        // https://tc39.es/ecma262/#sec-object.getownpropertynames
        getOwnPropertyNames: $getOwnPropertyNames
      });
      defineSymbolToPrimitive();
      setToStringTag($Symbol, SYMBOL);
      hiddenKeys[HIDDEN] = true;
    }
  });

  // node_modules/core-js-pure/internals/symbol-registry-detection.js
  var require_symbol_registry_detection = __commonJS({
    "node_modules/core-js-pure/internals/symbol-registry-detection.js"(exports, module) {
      "use strict";
      var NATIVE_SYMBOL = require_symbol_constructor_detection();
      module.exports = NATIVE_SYMBOL && !!Symbol["for"] && !!Symbol.keyFor;
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.for.js
  var require_es_symbol_for = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.for.js"() {
      "use strict";
      var $ = require_export();
      var getBuiltIn = require_get_built_in();
      var hasOwn = require_has_own_property();
      var toString = require_to_string();
      var shared = require_shared();
      var NATIVE_SYMBOL_REGISTRY = require_symbol_registry_detection();
      var StringToSymbolRegistry = shared("string-to-symbol-registry");
      var SymbolToStringRegistry = shared("symbol-to-string-registry");
      $({ target: "Symbol", stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
        "for": function(key) {
          var string = toString(key);
          if (hasOwn(StringToSymbolRegistry, string))
            return StringToSymbolRegistry[string];
          var symbol = getBuiltIn("Symbol")(string);
          StringToSymbolRegistry[string] = symbol;
          SymbolToStringRegistry[symbol] = string;
          return symbol;
        }
      });
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.key-for.js
  var require_es_symbol_key_for = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.key-for.js"() {
      "use strict";
      var $ = require_export();
      var hasOwn = require_has_own_property();
      var isSymbol = require_is_symbol();
      var tryToString = require_try_to_string();
      var shared = require_shared();
      var NATIVE_SYMBOL_REGISTRY = require_symbol_registry_detection();
      var SymbolToStringRegistry = shared("symbol-to-string-registry");
      $({ target: "Symbol", stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
        keyFor: function keyFor(sym) {
          if (!isSymbol(sym))
            throw new TypeError(tryToString(sym) + " is not a symbol");
          if (hasOwn(SymbolToStringRegistry, sym))
            return SymbolToStringRegistry[sym];
        }
      });
    }
  });

  // node_modules/core-js-pure/internals/get-json-replacer-function.js
  var require_get_json_replacer_function = __commonJS({
    "node_modules/core-js-pure/internals/get-json-replacer-function.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var isArray = require_is_array();
      var isCallable = require_is_callable();
      var classof = require_classof_raw();
      var toString = require_to_string();
      var push = uncurryThis([].push);
      module.exports = function(replacer) {
        if (isCallable(replacer))
          return replacer;
        if (!isArray(replacer))
          return;
        var rawLength = replacer.length;
        var keys = [];
        for (var i = 0; i < rawLength; i++) {
          var element = replacer[i];
          if (typeof element == "string")
            push(keys, element);
          else if (typeof element == "number" || classof(element) === "Number" || classof(element) === "String")
            push(keys, toString(element));
        }
        var keysLength = keys.length;
        var root = true;
        return function(key, value) {
          if (root) {
            root = false;
            return value;
          }
          if (isArray(this))
            return value;
          for (var j = 0; j < keysLength; j++)
            if (keys[j] === key)
              return value;
        };
      };
    }
  });

  // node_modules/core-js-pure/modules/es.json.stringify.js
  var require_es_json_stringify = __commonJS({
    "node_modules/core-js-pure/modules/es.json.stringify.js"() {
      "use strict";
      var $ = require_export();
      var getBuiltIn = require_get_built_in();
      var apply = require_function_apply();
      var call = require_function_call();
      var uncurryThis = require_function_uncurry_this();
      var fails = require_fails();
      var isCallable = require_is_callable();
      var isSymbol = require_is_symbol();
      var arraySlice = require_array_slice();
      var getReplacerFunction = require_get_json_replacer_function();
      var NATIVE_SYMBOL = require_symbol_constructor_detection();
      var $String = String;
      var $stringify = getBuiltIn("JSON", "stringify");
      var exec = uncurryThis(/./.exec);
      var charAt = uncurryThis("".charAt);
      var charCodeAt = uncurryThis("".charCodeAt);
      var replace = uncurryThis("".replace);
      var numberToString = uncurryThis(1.1.toString);
      var tester = /[\uD800-\uDFFF]/g;
      var low = /^[\uD800-\uDBFF]$/;
      var hi = /^[\uDC00-\uDFFF]$/;
      var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function() {
        var symbol = getBuiltIn("Symbol")("stringify detection");
        return $stringify([symbol]) !== "[null]" || $stringify({ a: symbol }) !== "{}" || $stringify(Object(symbol)) !== "{}";
      });
      var ILL_FORMED_UNICODE = fails(function() {
        return $stringify("\uDF06\uD834") !== '"\\udf06\\ud834"' || $stringify("\uDEAD") !== '"\\udead"';
      });
      var stringifyWithSymbolsFix = function(it, replacer) {
        var args = arraySlice(arguments);
        var $replacer = getReplacerFunction(replacer);
        if (!isCallable($replacer) && (it === void 0 || isSymbol(it)))
          return;
        args[1] = function(key, value) {
          if (isCallable($replacer))
            value = call($replacer, this, $String(key), value);
          if (!isSymbol(value))
            return value;
        };
        return apply($stringify, null, args);
      };
      var fixIllFormed = function(match, offset, string) {
        var prev = charAt(string, offset - 1);
        var next = charAt(string, offset + 1);
        if (exec(low, match) && !exec(hi, next) || exec(hi, match) && !exec(low, prev)) {
          return "\\u" + numberToString(charCodeAt(match, 0), 16);
        }
        return match;
      };
      if ($stringify) {
        $({ target: "JSON", stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
          // eslint-disable-next-line no-unused-vars -- required for `.length`
          stringify: function stringify(it, replacer, space) {
            var args = arraySlice(arguments);
            var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
            return ILL_FORMED_UNICODE && typeof result == "string" ? replace(result, tester, fixIllFormed) : result;
          }
        });
      }
    }
  });

  // node_modules/core-js-pure/modules/es.object.get-own-property-symbols.js
  var require_es_object_get_own_property_symbols = __commonJS({
    "node_modules/core-js-pure/modules/es.object.get-own-property-symbols.js"() {
      "use strict";
      var $ = require_export();
      var NATIVE_SYMBOL = require_symbol_constructor_detection();
      var fails = require_fails();
      var getOwnPropertySymbolsModule = require_object_get_own_property_symbols();
      var toObject = require_to_object();
      var FORCED = !NATIVE_SYMBOL || fails(function() {
        getOwnPropertySymbolsModule.f(1);
      });
      $({ target: "Object", stat: true, forced: FORCED }, {
        getOwnPropertySymbols: function getOwnPropertySymbols(it) {
          var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
          return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
        }
      });
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.js
  var require_es_symbol = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.js"() {
      "use strict";
      require_es_symbol_constructor();
      require_es_symbol_for();
      require_es_symbol_key_for();
      require_es_json_stringify();
      require_es_object_get_own_property_symbols();
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.async-dispose.js
  var require_es_symbol_async_dispose = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.async-dispose.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("asyncDispose");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.async-iterator.js
  var require_es_symbol_async_iterator = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.async-iterator.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("asyncIterator");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.description.js
  var require_es_symbol_description = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.description.js"() {
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.dispose.js
  var require_es_symbol_dispose = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.dispose.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("dispose");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.has-instance.js
  var require_es_symbol_has_instance = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.has-instance.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("hasInstance");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.is-concat-spreadable.js
  var require_es_symbol_is_concat_spreadable = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.is-concat-spreadable.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("isConcatSpreadable");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.iterator.js
  var require_es_symbol_iterator = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.iterator.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("iterator");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.match.js
  var require_es_symbol_match = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.match.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("match");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.match-all.js
  var require_es_symbol_match_all = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.match-all.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("matchAll");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.replace.js
  var require_es_symbol_replace = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.replace.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("replace");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.search.js
  var require_es_symbol_search = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.search.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("search");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.species.js
  var require_es_symbol_species = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.species.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("species");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.split.js
  var require_es_symbol_split = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.split.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("split");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.to-primitive.js
  var require_es_symbol_to_primitive = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.to-primitive.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      var defineSymbolToPrimitive = require_symbol_define_to_primitive();
      defineWellKnownSymbol("toPrimitive");
      defineSymbolToPrimitive();
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.to-string-tag.js
  var require_es_symbol_to_string_tag = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.to-string-tag.js"() {
      "use strict";
      var getBuiltIn = require_get_built_in();
      var defineWellKnownSymbol = require_well_known_symbol_define();
      var setToStringTag = require_set_to_string_tag();
      defineWellKnownSymbol("toStringTag");
      setToStringTag(getBuiltIn("Symbol"), "Symbol");
    }
  });

  // node_modules/core-js-pure/modules/es.symbol.unscopables.js
  var require_es_symbol_unscopables = __commonJS({
    "node_modules/core-js-pure/modules/es.symbol.unscopables.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("unscopables");
    }
  });

  // node_modules/core-js-pure/modules/es.json.to-string-tag.js
  var require_es_json_to_string_tag = __commonJS({
    "node_modules/core-js-pure/modules/es.json.to-string-tag.js"() {
      "use strict";
      var globalThis2 = require_global_this();
      var setToStringTag = require_set_to_string_tag();
      setToStringTag(globalThis2.JSON, "JSON", true);
    }
  });

  // node_modules/core-js-pure/modules/es.math.to-string-tag.js
  var require_es_math_to_string_tag = __commonJS({
    "node_modules/core-js-pure/modules/es.math.to-string-tag.js"() {
    }
  });

  // node_modules/core-js-pure/modules/es.reflect.to-string-tag.js
  var require_es_reflect_to_string_tag = __commonJS({
    "node_modules/core-js-pure/modules/es.reflect.to-string-tag.js"() {
    }
  });

  // node_modules/core-js-pure/es/symbol/index.js
  var require_symbol = __commonJS({
    "node_modules/core-js-pure/es/symbol/index.js"(exports, module) {
      "use strict";
      require_es_array_concat();
      require_es_object_to_string();
      require_es_symbol();
      require_es_symbol_async_dispose();
      require_es_symbol_async_iterator();
      require_es_symbol_description();
      require_es_symbol_dispose();
      require_es_symbol_has_instance();
      require_es_symbol_is_concat_spreadable();
      require_es_symbol_iterator();
      require_es_symbol_match();
      require_es_symbol_match_all();
      require_es_symbol_replace();
      require_es_symbol_search();
      require_es_symbol_species();
      require_es_symbol_split();
      require_es_symbol_to_primitive();
      require_es_symbol_to_string_tag();
      require_es_symbol_unscopables();
      require_es_json_to_string_tag();
      require_es_math_to_string_tag();
      require_es_reflect_to_string_tag();
      var path = require_path();
      module.exports = path.Symbol;
    }
  });

  // node_modules/core-js-pure/internals/add-to-unscopables.js
  var require_add_to_unscopables = __commonJS({
    "node_modules/core-js-pure/internals/add-to-unscopables.js"(exports, module) {
      "use strict";
      module.exports = function() {
      };
    }
  });

  // node_modules/core-js-pure/modules/es.array.iterator.js
  var require_es_array_iterator = __commonJS({
    "node_modules/core-js-pure/modules/es.array.iterator.js"(exports, module) {
      "use strict";
      var toIndexedObject = require_to_indexed_object();
      var addToUnscopables = require_add_to_unscopables();
      var Iterators = require_iterators();
      var InternalStateModule = require_internal_state();
      var defineProperty = require_object_define_property().f;
      var defineIterator = require_iterator_define();
      var createIterResultObject = require_create_iter_result_object();
      var IS_PURE = require_is_pure();
      var DESCRIPTORS = require_descriptors();
      var ARRAY_ITERATOR = "Array Iterator";
      var setInternalState = InternalStateModule.set;
      var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);
      module.exports = defineIterator(Array, "Array", function(iterated, kind) {
        setInternalState(this, {
          type: ARRAY_ITERATOR,
          target: toIndexedObject(iterated),
          // target
          index: 0,
          // next index
          kind
          // kind
        });
      }, function() {
        var state = getInternalState(this);
        var target = state.target;
        var index = state.index++;
        if (!target || index >= target.length) {
          state.target = null;
          return createIterResultObject(void 0, true);
        }
        switch (state.kind) {
          case "keys":
            return createIterResultObject(index, false);
          case "values":
            return createIterResultObject(target[index], false);
        }
        return createIterResultObject([index, target[index]], false);
      }, "values");
      var values = Iterators.Arguments = Iterators.Array;
      addToUnscopables("keys");
      addToUnscopables("values");
      addToUnscopables("entries");
      if (!IS_PURE && DESCRIPTORS && values.name !== "values")
        try {
          defineProperty(values, "name", { value: "values" });
        } catch (error) {
        }
    }
  });

  // node_modules/core-js-pure/internals/dom-iterables.js
  var require_dom_iterables = __commonJS({
    "node_modules/core-js-pure/internals/dom-iterables.js"(exports, module) {
      "use strict";
      module.exports = {
        CSSRuleList: 0,
        CSSStyleDeclaration: 0,
        CSSValueList: 0,
        ClientRectList: 0,
        DOMRectList: 0,
        DOMStringList: 0,
        DOMTokenList: 1,
        DataTransferItemList: 0,
        FileList: 0,
        HTMLAllCollection: 0,
        HTMLCollection: 0,
        HTMLFormElement: 0,
        HTMLSelectElement: 0,
        MediaList: 0,
        MimeTypeArray: 0,
        NamedNodeMap: 0,
        NodeList: 1,
        PaintRequestList: 0,
        Plugin: 0,
        PluginArray: 0,
        SVGLengthList: 0,
        SVGNumberList: 0,
        SVGPathSegList: 0,
        SVGPointList: 0,
        SVGStringList: 0,
        SVGTransformList: 0,
        SourceBufferList: 0,
        StyleSheetList: 0,
        TextTrackCueList: 0,
        TextTrackList: 0,
        TouchList: 0
      };
    }
  });

  // node_modules/core-js-pure/modules/web.dom-collections.iterator.js
  var require_web_dom_collections_iterator = __commonJS({
    "node_modules/core-js-pure/modules/web.dom-collections.iterator.js"() {
      "use strict";
      require_es_array_iterator();
      var DOMIterables = require_dom_iterables();
      var globalThis2 = require_global_this();
      var setToStringTag = require_set_to_string_tag();
      var Iterators = require_iterators();
      for (COLLECTION_NAME in DOMIterables) {
        setToStringTag(globalThis2[COLLECTION_NAME], COLLECTION_NAME);
        Iterators[COLLECTION_NAME] = Iterators.Array;
      }
      var COLLECTION_NAME;
    }
  });

  // node_modules/core-js-pure/stable/symbol/index.js
  var require_symbol2 = __commonJS({
    "node_modules/core-js-pure/stable/symbol/index.js"(exports, module) {
      "use strict";
      var parent = require_symbol();
      require_web_dom_collections_iterator();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/symbol.js
  var require_symbol3 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/symbol.js"(exports, module) {
      module.exports = require_symbol2();
    }
  });

  // node_modules/core-js-pure/es/get-iterator-method.js
  var require_get_iterator_method2 = __commonJS({
    "node_modules/core-js-pure/es/get-iterator-method.js"(exports, module) {
      "use strict";
      require_es_array_iterator();
      require_es_string_iterator();
      var getIteratorMethod = require_get_iterator_method();
      module.exports = getIteratorMethod;
    }
  });

  // node_modules/core-js-pure/stable/get-iterator-method.js
  var require_get_iterator_method3 = __commonJS({
    "node_modules/core-js-pure/stable/get-iterator-method.js"(exports, module) {
      "use strict";
      var parent = require_get_iterator_method2();
      require_web_dom_collections_iterator();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/actual/get-iterator-method.js
  var require_get_iterator_method4 = __commonJS({
    "node_modules/core-js-pure/actual/get-iterator-method.js"(exports, module) {
      "use strict";
      var parent = require_get_iterator_method3();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/full/get-iterator-method.js
  var require_get_iterator_method5 = __commonJS({
    "node_modules/core-js-pure/full/get-iterator-method.js"(exports, module) {
      "use strict";
      var parent = require_get_iterator_method4();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/features/get-iterator-method.js
  var require_get_iterator_method6 = __commonJS({
    "node_modules/core-js-pure/features/get-iterator-method.js"(exports, module) {
      "use strict";
      module.exports = require_get_iterator_method5();
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js/get-iterator-method.js
  var require_get_iterator_method7 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js/get-iterator-method.js"(exports, module) {
      module.exports = require_get_iterator_method6();
    }
  });

  // node_modules/core-js-pure/modules/es.array.is-array.js
  var require_es_array_is_array = __commonJS({
    "node_modules/core-js-pure/modules/es.array.is-array.js"() {
      "use strict";
      var $ = require_export();
      var isArray = require_is_array();
      $({ target: "Array", stat: true }, {
        isArray
      });
    }
  });

  // node_modules/core-js-pure/es/array/is-array.js
  var require_is_array2 = __commonJS({
    "node_modules/core-js-pure/es/array/is-array.js"(exports, module) {
      "use strict";
      require_es_array_is_array();
      var path = require_path();
      module.exports = path.Array.isArray;
    }
  });

  // node_modules/core-js-pure/stable/array/is-array.js
  var require_is_array3 = __commonJS({
    "node_modules/core-js-pure/stable/array/is-array.js"(exports, module) {
      "use strict";
      var parent = require_is_array2();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/array/is-array.js
  var require_is_array4 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/array/is-array.js"(exports, module) {
      module.exports = require_is_array3();
    }
  });

  // node_modules/core-js-pure/actual/array/is-array.js
  var require_is_array5 = __commonJS({
    "node_modules/core-js-pure/actual/array/is-array.js"(exports, module) {
      "use strict";
      var parent = require_is_array3();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/full/array/is-array.js
  var require_is_array6 = __commonJS({
    "node_modules/core-js-pure/full/array/is-array.js"(exports, module) {
      "use strict";
      var parent = require_is_array5();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/features/array/is-array.js
  var require_is_array7 = __commonJS({
    "node_modules/core-js-pure/features/array/is-array.js"(exports, module) {
      "use strict";
      module.exports = require_is_array6();
    }
  });

  // node_modules/@babel/runtime-corejs3/helpers/arrayWithHoles.js
  var require_arrayWithHoles = __commonJS({
    "node_modules/@babel/runtime-corejs3/helpers/arrayWithHoles.js"(exports, module) {
      var _Array$isArray = require_is_array7();
      function _arrayWithHoles(r) {
        if (_Array$isArray(r))
          return r;
      }
      module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/core-js-pure/modules/esnext.function.metadata.js
  var require_esnext_function_metadata = __commonJS({
    "node_modules/core-js-pure/modules/esnext.function.metadata.js"() {
      "use strict";
      var wellKnownSymbol = require_well_known_symbol();
      var defineProperty = require_object_define_property().f;
      var METADATA = wellKnownSymbol("metadata");
      var FunctionPrototype = Function.prototype;
      if (FunctionPrototype[METADATA] === void 0) {
        defineProperty(FunctionPrototype, METADATA, {
          value: null
        });
      }
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.async-dispose.js
  var require_esnext_symbol_async_dispose = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.async-dispose.js"() {
      "use strict";
      require_es_symbol_async_dispose();
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.dispose.js
  var require_esnext_symbol_dispose = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.dispose.js"() {
      "use strict";
      require_es_symbol_dispose();
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.metadata.js
  var require_esnext_symbol_metadata = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.metadata.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("metadata");
    }
  });

  // node_modules/core-js-pure/actual/symbol/index.js
  var require_symbol4 = __commonJS({
    "node_modules/core-js-pure/actual/symbol/index.js"(exports, module) {
      "use strict";
      var parent = require_symbol2();
      require_esnext_function_metadata();
      require_esnext_symbol_async_dispose();
      require_esnext_symbol_dispose();
      require_esnext_symbol_metadata();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/internals/symbol-is-registered.js
  var require_symbol_is_registered = __commonJS({
    "node_modules/core-js-pure/internals/symbol-is-registered.js"(exports, module) {
      "use strict";
      var getBuiltIn = require_get_built_in();
      var uncurryThis = require_function_uncurry_this();
      var Symbol2 = getBuiltIn("Symbol");
      var keyFor = Symbol2.keyFor;
      var thisSymbolValue = uncurryThis(Symbol2.prototype.valueOf);
      module.exports = Symbol2.isRegisteredSymbol || function isRegisteredSymbol(value) {
        try {
          return keyFor(thisSymbolValue(value)) !== void 0;
        } catch (error) {
          return false;
        }
      };
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.is-registered-symbol.js
  var require_esnext_symbol_is_registered_symbol = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.is-registered-symbol.js"() {
      "use strict";
      var $ = require_export();
      var isRegisteredSymbol = require_symbol_is_registered();
      $({ target: "Symbol", stat: true }, {
        isRegisteredSymbol
      });
    }
  });

  // node_modules/core-js-pure/internals/symbol-is-well-known.js
  var require_symbol_is_well_known = __commonJS({
    "node_modules/core-js-pure/internals/symbol-is-well-known.js"(exports, module) {
      "use strict";
      var shared = require_shared();
      var getBuiltIn = require_get_built_in();
      var uncurryThis = require_function_uncurry_this();
      var isSymbol = require_is_symbol();
      var wellKnownSymbol = require_well_known_symbol();
      var Symbol2 = getBuiltIn("Symbol");
      var $isWellKnownSymbol = Symbol2.isWellKnownSymbol;
      var getOwnPropertyNames = getBuiltIn("Object", "getOwnPropertyNames");
      var thisSymbolValue = uncurryThis(Symbol2.prototype.valueOf);
      var WellKnownSymbolsStore = shared("wks");
      for (i = 0, symbolKeys = getOwnPropertyNames(Symbol2), symbolKeysLength = symbolKeys.length; i < symbolKeysLength; i++) {
        try {
          symbolKey = symbolKeys[i];
          if (isSymbol(Symbol2[symbolKey]))
            wellKnownSymbol(symbolKey);
        } catch (error) {
        }
      }
      var symbolKey;
      var i;
      var symbolKeys;
      var symbolKeysLength;
      module.exports = function isWellKnownSymbol(value) {
        if ($isWellKnownSymbol && $isWellKnownSymbol(value))
          return true;
        try {
          var symbol = thisSymbolValue(value);
          for (var j = 0, keys = getOwnPropertyNames(WellKnownSymbolsStore), keysLength = keys.length; j < keysLength; j++) {
            if (WellKnownSymbolsStore[keys[j]] == symbol)
              return true;
          }
        } catch (error) {
        }
        return false;
      };
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.is-well-known-symbol.js
  var require_esnext_symbol_is_well_known_symbol = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.is-well-known-symbol.js"() {
      "use strict";
      var $ = require_export();
      var isWellKnownSymbol = require_symbol_is_well_known();
      $({ target: "Symbol", stat: true, forced: true }, {
        isWellKnownSymbol
      });
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.custom-matcher.js
  var require_esnext_symbol_custom_matcher = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.custom-matcher.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("customMatcher");
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.observable.js
  var require_esnext_symbol_observable = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.observable.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("observable");
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.is-registered.js
  var require_esnext_symbol_is_registered = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.is-registered.js"() {
      "use strict";
      var $ = require_export();
      var isRegisteredSymbol = require_symbol_is_registered();
      $({ target: "Symbol", stat: true, name: "isRegisteredSymbol" }, {
        isRegistered: isRegisteredSymbol
      });
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.is-well-known.js
  var require_esnext_symbol_is_well_known = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.is-well-known.js"() {
      "use strict";
      var $ = require_export();
      var isWellKnownSymbol = require_symbol_is_well_known();
      $({ target: "Symbol", stat: true, name: "isWellKnownSymbol", forced: true }, {
        isWellKnown: isWellKnownSymbol
      });
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.matcher.js
  var require_esnext_symbol_matcher = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.matcher.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("matcher");
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.metadata-key.js
  var require_esnext_symbol_metadata_key = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.metadata-key.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("metadataKey");
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.pattern-match.js
  var require_esnext_symbol_pattern_match = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.pattern-match.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("patternMatch");
    }
  });

  // node_modules/core-js-pure/modules/esnext.symbol.replace-all.js
  var require_esnext_symbol_replace_all = __commonJS({
    "node_modules/core-js-pure/modules/esnext.symbol.replace-all.js"() {
      "use strict";
      var defineWellKnownSymbol = require_well_known_symbol_define();
      defineWellKnownSymbol("replaceAll");
    }
  });

  // node_modules/core-js-pure/full/symbol/index.js
  var require_symbol5 = __commonJS({
    "node_modules/core-js-pure/full/symbol/index.js"(exports, module) {
      "use strict";
      var parent = require_symbol4();
      require_esnext_symbol_is_registered_symbol();
      require_esnext_symbol_is_well_known_symbol();
      require_esnext_symbol_custom_matcher();
      require_esnext_symbol_observable();
      require_esnext_symbol_is_registered();
      require_esnext_symbol_is_well_known();
      require_esnext_symbol_matcher();
      require_esnext_symbol_metadata_key();
      require_esnext_symbol_pattern_match();
      require_esnext_symbol_replace_all();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/features/symbol/index.js
  var require_symbol6 = __commonJS({
    "node_modules/core-js-pure/features/symbol/index.js"(exports, module) {
      "use strict";
      module.exports = require_symbol5();
    }
  });

  // node_modules/core-js-pure/internals/array-set-length.js
  var require_array_set_length = __commonJS({
    "node_modules/core-js-pure/internals/array-set-length.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var isArray = require_is_array();
      var $TypeError = TypeError;
      var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function() {
        if (this !== void 0)
          return true;
        try {
          Object.defineProperty([], "length", { writable: false }).length = 1;
        } catch (error) {
          return error instanceof TypeError;
        }
      }();
      module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function(O, length) {
        if (isArray(O) && !getOwnPropertyDescriptor(O, "length").writable) {
          throw new $TypeError("Cannot set read only .length");
        }
        return O.length = length;
      } : function(O, length) {
        return O.length = length;
      };
    }
  });

  // node_modules/core-js-pure/modules/es.array.push.js
  var require_es_array_push = __commonJS({
    "node_modules/core-js-pure/modules/es.array.push.js"() {
      "use strict";
      var $ = require_export();
      var toObject = require_to_object();
      var lengthOfArrayLike = require_length_of_array_like();
      var setArrayLength = require_array_set_length();
      var doesNotExceedSafeInteger = require_does_not_exceed_safe_integer();
      var fails = require_fails();
      var INCORRECT_TO_LENGTH = fails(function() {
        return [].push.call({ length: 4294967296 }, 1) !== 4294967297;
      });
      var properErrorOnNonWritableLength = function() {
        try {
          Object.defineProperty([], "length", { writable: false }).push();
        } catch (error) {
          return error instanceof TypeError;
        }
      };
      var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();
      $({ target: "Array", proto: true, arity: 1, forced: FORCED }, {
        // eslint-disable-next-line no-unused-vars -- required for `.length`
        push: function push(item) {
          var O = toObject(this);
          var len = lengthOfArrayLike(O);
          var argCount = arguments.length;
          doesNotExceedSafeInteger(len + argCount);
          for (var i = 0; i < argCount; i++) {
            O[len] = arguments[i];
            len++;
          }
          setArrayLength(O, len);
          return len;
        }
      });
    }
  });

  // node_modules/core-js-pure/es/array/virtual/push.js
  var require_push = __commonJS({
    "node_modules/core-js-pure/es/array/virtual/push.js"(exports, module) {
      "use strict";
      require_es_array_push();
      var getBuiltInPrototypeMethod = require_get_built_in_prototype_method();
      module.exports = getBuiltInPrototypeMethod("Array", "push");
    }
  });

  // node_modules/core-js-pure/es/instance/push.js
  var require_push2 = __commonJS({
    "node_modules/core-js-pure/es/instance/push.js"(exports, module) {
      "use strict";
      var isPrototypeOf = require_object_is_prototype_of();
      var method = require_push();
      var ArrayPrototype = Array.prototype;
      module.exports = function(it) {
        var own = it.push;
        return it === ArrayPrototype || isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.push ? method : own;
      };
    }
  });

  // node_modules/core-js-pure/stable/instance/push.js
  var require_push3 = __commonJS({
    "node_modules/core-js-pure/stable/instance/push.js"(exports, module) {
      "use strict";
      var parent = require_push2();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/actual/instance/push.js
  var require_push4 = __commonJS({
    "node_modules/core-js-pure/actual/instance/push.js"(exports, module) {
      "use strict";
      var parent = require_push3();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/full/instance/push.js
  var require_push5 = __commonJS({
    "node_modules/core-js-pure/full/instance/push.js"(exports, module) {
      "use strict";
      var parent = require_push4();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/features/instance/push.js
  var require_push6 = __commonJS({
    "node_modules/core-js-pure/features/instance/push.js"(exports, module) {
      "use strict";
      module.exports = require_push5();
    }
  });

  // node_modules/@babel/runtime-corejs3/helpers/iterableToArrayLimit.js
  var require_iterableToArrayLimit = __commonJS({
    "node_modules/@babel/runtime-corejs3/helpers/iterableToArrayLimit.js"(exports, module) {
      var _Symbol = require_symbol6();
      var _getIteratorMethod = require_get_iterator_method6();
      var _pushInstanceProperty = require_push6();
      function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof _Symbol && _getIteratorMethod(r) || r["@@iterator"];
        if (null != t) {
          var e, n, i, u, a = [], f = true, o = false;
          try {
            if (i = (t = t.call(r)).next, 0 === l) {
              if (Object(t) !== t)
                return;
              f = false;
            } else
              for (; !(f = (e = i.call(t)).done) && (_pushInstanceProperty(a).call(a, e.value), a.length !== l); f = true)
                ;
          } catch (r2) {
            o = true, n = r2;
          } finally {
            try {
              if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
                return;
            } finally {
              if (o)
                throw n;
            }
          }
          return a;
        }
      }
      module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/core-js-pure/actual/instance/slice.js
  var require_slice5 = __commonJS({
    "node_modules/core-js-pure/actual/instance/slice.js"(exports, module) {
      "use strict";
      var parent = require_slice3();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/full/instance/slice.js
  var require_slice6 = __commonJS({
    "node_modules/core-js-pure/full/instance/slice.js"(exports, module) {
      "use strict";
      var parent = require_slice5();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/features/instance/slice.js
  var require_slice7 = __commonJS({
    "node_modules/core-js-pure/features/instance/slice.js"(exports, module) {
      "use strict";
      module.exports = require_slice6();
    }
  });

  // node_modules/core-js-pure/actual/array/from.js
  var require_from4 = __commonJS({
    "node_modules/core-js-pure/actual/array/from.js"(exports, module) {
      "use strict";
      var parent = require_from2();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/full/array/from.js
  var require_from5 = __commonJS({
    "node_modules/core-js-pure/full/array/from.js"(exports, module) {
      "use strict";
      var parent = require_from4();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/features/array/from.js
  var require_from6 = __commonJS({
    "node_modules/core-js-pure/features/array/from.js"(exports, module) {
      "use strict";
      module.exports = require_from5();
    }
  });

  // node_modules/@babel/runtime-corejs3/helpers/arrayLikeToArray.js
  var require_arrayLikeToArray = __commonJS({
    "node_modules/@babel/runtime-corejs3/helpers/arrayLikeToArray.js"(exports, module) {
      function _arrayLikeToArray(r, a) {
        (null == a || a > r.length) && (a = r.length);
        for (var e = 0, n = Array(a); e < a; e++)
          n[e] = r[e];
        return n;
      }
      module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime-corejs3/helpers/unsupportedIterableToArray.js
  var require_unsupportedIterableToArray = __commonJS({
    "node_modules/@babel/runtime-corejs3/helpers/unsupportedIterableToArray.js"(exports, module) {
      var _sliceInstanceProperty = require_slice7();
      var _Array$from = require_from6();
      var arrayLikeToArray = require_arrayLikeToArray();
      function _unsupportedIterableToArray(r, a) {
        if (r) {
          var _context;
          if ("string" == typeof r)
            return arrayLikeToArray(r, a);
          var t = _sliceInstanceProperty(_context = {}.toString.call(r)).call(_context, 8, -1);
          return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? _Array$from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? arrayLikeToArray(r, a) : void 0;
        }
      }
      module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime-corejs3/helpers/nonIterableRest.js
  var require_nonIterableRest = __commonJS({
    "node_modules/@babel/runtime-corejs3/helpers/nonIterableRest.js"(exports, module) {
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime-corejs3/helpers/slicedToArray.js
  var require_slicedToArray = __commonJS({
    "node_modules/@babel/runtime-corejs3/helpers/slicedToArray.js"(exports, module) {
      var arrayWithHoles = require_arrayWithHoles();
      var iterableToArrayLimit = require_iterableToArrayLimit();
      var unsupportedIterableToArray = require_unsupportedIterableToArray();
      var nonIterableRest = require_nonIterableRest();
      function _slicedToArray(r, e) {
        return arrayWithHoles(r) || iterableToArrayLimit(r, e) || unsupportedIterableToArray(r, e) || nonIterableRest();
      }
      module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/core-js-pure/modules/es.object.create.js
  var require_es_object_create = __commonJS({
    "node_modules/core-js-pure/modules/es.object.create.js"() {
      "use strict";
      var $ = require_export();
      var DESCRIPTORS = require_descriptors();
      var create = require_object_create();
      $({ target: "Object", stat: true, sham: !DESCRIPTORS }, {
        create
      });
    }
  });

  // node_modules/core-js-pure/es/object/create.js
  var require_create = __commonJS({
    "node_modules/core-js-pure/es/object/create.js"(exports, module) {
      "use strict";
      require_es_object_create();
      var path = require_path();
      var Object2 = path.Object;
      module.exports = function create(P, D) {
        return Object2.create(P, D);
      };
    }
  });

  // node_modules/core-js-pure/stable/object/create.js
  var require_create2 = __commonJS({
    "node_modules/core-js-pure/stable/object/create.js"(exports, module) {
      "use strict";
      var parent = require_create();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/object/create.js
  var require_create3 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/object/create.js"(exports, module) {
      module.exports = require_create2();
    }
  });

  // node_modules/core-js-pure/modules/es.regexp.flags.js
  var require_es_regexp_flags = __commonJS({
    "node_modules/core-js-pure/modules/es.regexp.flags.js"() {
    }
  });

  // node_modules/core-js-pure/internals/regexp-flags-detection.js
  var require_regexp_flags_detection = __commonJS({
    "node_modules/core-js-pure/internals/regexp-flags-detection.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var fails = require_fails();
      var RegExp2 = globalThis2.RegExp;
      var FLAGS_GETTER_IS_CORRECT = !fails(function() {
        var INDICES_SUPPORT = true;
        try {
          RegExp2(".", "d");
        } catch (error) {
          INDICES_SUPPORT = false;
        }
        var O = {};
        var calls = "";
        var expected = INDICES_SUPPORT ? "dgimsy" : "gimsy";
        var addGetter = function(key2, chr) {
          Object.defineProperty(O, key2, { get: function() {
            calls += chr;
            return true;
          } });
        };
        var pairs = {
          dotAll: "s",
          global: "g",
          ignoreCase: "i",
          multiline: "m",
          sticky: "y"
        };
        if (INDICES_SUPPORT)
          pairs.hasIndices = "d";
        for (var key in pairs)
          addGetter(key, pairs[key]);
        var result = Object.getOwnPropertyDescriptor(RegExp2.prototype, "flags").get.call(O);
        return result !== expected || calls !== expected;
      });
      module.exports = { correct: FLAGS_GETTER_IS_CORRECT };
    }
  });

  // node_modules/core-js-pure/internals/regexp-flags.js
  var require_regexp_flags = __commonJS({
    "node_modules/core-js-pure/internals/regexp-flags.js"(exports, module) {
      "use strict";
      var anObject = require_an_object();
      module.exports = function() {
        var that = anObject(this);
        var result = "";
        if (that.hasIndices)
          result += "d";
        if (that.global)
          result += "g";
        if (that.ignoreCase)
          result += "i";
        if (that.multiline)
          result += "m";
        if (that.dotAll)
          result += "s";
        if (that.unicode)
          result += "u";
        if (that.unicodeSets)
          result += "v";
        if (that.sticky)
          result += "y";
        return result;
      };
    }
  });

  // node_modules/core-js-pure/internals/regexp-get-flags.js
  var require_regexp_get_flags = __commonJS({
    "node_modules/core-js-pure/internals/regexp-get-flags.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var hasOwn = require_has_own_property();
      var isPrototypeOf = require_object_is_prototype_of();
      var regExpFlagsDetection = require_regexp_flags_detection();
      var regExpFlagsGetterImplementation = require_regexp_flags();
      var RegExpPrototype = RegExp.prototype;
      module.exports = regExpFlagsDetection.correct ? function(it) {
        return it.flags;
      } : function(it) {
        return !regExpFlagsDetection.correct && isPrototypeOf(RegExpPrototype, it) && !hasOwn(it, "flags") ? call(regExpFlagsGetterImplementation, it) : it.flags;
      };
    }
  });

  // node_modules/core-js-pure/es/regexp/flags.js
  var require_flags = __commonJS({
    "node_modules/core-js-pure/es/regexp/flags.js"(exports, module) {
      "use strict";
      require_es_regexp_flags();
      var getRegExpFlags = require_regexp_get_flags();
      module.exports = getRegExpFlags;
    }
  });

  // node_modules/core-js-pure/es/instance/flags.js
  var require_flags2 = __commonJS({
    "node_modules/core-js-pure/es/instance/flags.js"(exports, module) {
      "use strict";
      var isPrototypeOf = require_object_is_prototype_of();
      var flags = require_flags();
      var RegExpPrototype = RegExp.prototype;
      module.exports = function(it) {
        return it === RegExpPrototype || isPrototypeOf(RegExpPrototype, it) ? flags(it) : it.flags;
      };
    }
  });

  // node_modules/core-js-pure/stable/instance/flags.js
  var require_flags3 = __commonJS({
    "node_modules/core-js-pure/stable/instance/flags.js"(exports, module) {
      "use strict";
      var parent = require_flags2();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/instance/flags.js
  var require_flags4 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/instance/flags.js"(exports, module) {
      module.exports = require_flags3();
    }
  });

  // node_modules/core-js-pure/internals/delete-property-or-throw.js
  var require_delete_property_or_throw = __commonJS({
    "node_modules/core-js-pure/internals/delete-property-or-throw.js"(exports, module) {
      "use strict";
      var tryToString = require_try_to_string();
      var $TypeError = TypeError;
      module.exports = function(O, P) {
        if (!delete O[P])
          throw new $TypeError("Cannot delete property " + tryToString(P) + " of " + tryToString(O));
      };
    }
  });

  // node_modules/core-js-pure/internals/array-sort.js
  var require_array_sort = __commonJS({
    "node_modules/core-js-pure/internals/array-sort.js"(exports, module) {
      "use strict";
      var arraySlice = require_array_slice();
      var floor = Math.floor;
      var sort = function(array, comparefn) {
        var length = array.length;
        if (length < 8) {
          var i = 1;
          var element, j;
          while (i < length) {
            j = i;
            element = array[i];
            while (j && comparefn(array[j - 1], element) > 0) {
              array[j] = array[--j];
            }
            if (j !== i++)
              array[j] = element;
          }
        } else {
          var middle = floor(length / 2);
          var left = sort(arraySlice(array, 0, middle), comparefn);
          var right = sort(arraySlice(array, middle), comparefn);
          var llength = left.length;
          var rlength = right.length;
          var lindex = 0;
          var rindex = 0;
          while (lindex < llength || rindex < rlength) {
            array[lindex + rindex] = lindex < llength && rindex < rlength ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++] : lindex < llength ? left[lindex++] : right[rindex++];
          }
        }
        return array;
      };
      module.exports = sort;
    }
  });

  // node_modules/core-js-pure/internals/array-method-is-strict.js
  var require_array_method_is_strict = __commonJS({
    "node_modules/core-js-pure/internals/array-method-is-strict.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      module.exports = function(METHOD_NAME, argument) {
        var method = [][METHOD_NAME];
        return !!method && fails(function() {
          method.call(null, argument || function() {
            return 1;
          }, 1);
        });
      };
    }
  });

  // node_modules/core-js-pure/internals/environment-ff-version.js
  var require_environment_ff_version = __commonJS({
    "node_modules/core-js-pure/internals/environment-ff-version.js"(exports, module) {
      "use strict";
      var userAgent = require_environment_user_agent();
      var firefox = userAgent.match(/firefox\/(\d+)/i);
      module.exports = !!firefox && +firefox[1];
    }
  });

  // node_modules/core-js-pure/internals/environment-is-ie-or-edge.js
  var require_environment_is_ie_or_edge = __commonJS({
    "node_modules/core-js-pure/internals/environment-is-ie-or-edge.js"(exports, module) {
      "use strict";
      var UA = require_environment_user_agent();
      module.exports = /MSIE|Trident/.test(UA);
    }
  });

  // node_modules/core-js-pure/internals/environment-webkit-version.js
  var require_environment_webkit_version = __commonJS({
    "node_modules/core-js-pure/internals/environment-webkit-version.js"(exports, module) {
      "use strict";
      var userAgent = require_environment_user_agent();
      var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);
      module.exports = !!webkit && +webkit[1];
    }
  });

  // node_modules/core-js-pure/modules/es.array.sort.js
  var require_es_array_sort = __commonJS({
    "node_modules/core-js-pure/modules/es.array.sort.js"() {
      "use strict";
      var $ = require_export();
      var uncurryThis = require_function_uncurry_this();
      var aCallable = require_a_callable();
      var toObject = require_to_object();
      var lengthOfArrayLike = require_length_of_array_like();
      var deletePropertyOrThrow = require_delete_property_or_throw();
      var toString = require_to_string();
      var fails = require_fails();
      var internalSort = require_array_sort();
      var arrayMethodIsStrict = require_array_method_is_strict();
      var FF = require_environment_ff_version();
      var IE_OR_EDGE = require_environment_is_ie_or_edge();
      var V8 = require_environment_v8_version();
      var WEBKIT = require_environment_webkit_version();
      var test = [];
      var nativeSort = uncurryThis(test.sort);
      var push = uncurryThis(test.push);
      var FAILS_ON_UNDEFINED = fails(function() {
        test.sort(void 0);
      });
      var FAILS_ON_NULL = fails(function() {
        test.sort(null);
      });
      var STRICT_METHOD = arrayMethodIsStrict("sort");
      var STABLE_SORT = !fails(function() {
        if (V8)
          return V8 < 70;
        if (FF && FF > 3)
          return;
        if (IE_OR_EDGE)
          return true;
        if (WEBKIT)
          return WEBKIT < 603;
        var result = "";
        var code, chr, value, index;
        for (code = 65; code < 76; code++) {
          chr = String.fromCharCode(code);
          switch (code) {
            case 66:
            case 69:
            case 70:
            case 72:
              value = 3;
              break;
            case 68:
            case 71:
              value = 4;
              break;
            default:
              value = 2;
          }
          for (index = 0; index < 47; index++) {
            test.push({ k: chr + index, v: value });
          }
        }
        test.sort(function(a, b) {
          return b.v - a.v;
        });
        for (index = 0; index < test.length; index++) {
          chr = test[index].k.charAt(0);
          if (result.charAt(result.length - 1) !== chr)
            result += chr;
        }
        return result !== "DGBEFHACIJK";
      });
      var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT;
      var getSortCompare = function(comparefn) {
        return function(x, y) {
          if (y === void 0)
            return -1;
          if (x === void 0)
            return 1;
          if (comparefn !== void 0)
            return +comparefn(x, y) || 0;
          return toString(x) > toString(y) ? 1 : -1;
        };
      };
      $({ target: "Array", proto: true, forced: FORCED }, {
        sort: function sort(comparefn) {
          if (comparefn !== void 0)
            aCallable(comparefn);
          var array = toObject(this);
          if (STABLE_SORT)
            return comparefn === void 0 ? nativeSort(array) : nativeSort(array, comparefn);
          var items = [];
          var arrayLength = lengthOfArrayLike(array);
          var itemsLength, index;
          for (index = 0; index < arrayLength; index++) {
            if (index in array)
              push(items, array[index]);
          }
          internalSort(items, getSortCompare(comparefn));
          itemsLength = lengthOfArrayLike(items);
          index = 0;
          while (index < itemsLength)
            array[index] = items[index++];
          while (index < arrayLength)
            deletePropertyOrThrow(array, index++);
          return array;
        }
      });
    }
  });

  // node_modules/core-js-pure/es/array/virtual/sort.js
  var require_sort = __commonJS({
    "node_modules/core-js-pure/es/array/virtual/sort.js"(exports, module) {
      "use strict";
      require_es_array_sort();
      var getBuiltInPrototypeMethod = require_get_built_in_prototype_method();
      module.exports = getBuiltInPrototypeMethod("Array", "sort");
    }
  });

  // node_modules/core-js-pure/es/instance/sort.js
  var require_sort2 = __commonJS({
    "node_modules/core-js-pure/es/instance/sort.js"(exports, module) {
      "use strict";
      var isPrototypeOf = require_object_is_prototype_of();
      var method = require_sort();
      var ArrayPrototype = Array.prototype;
      module.exports = function(it) {
        var own = it.sort;
        return it === ArrayPrototype || isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.sort ? method : own;
      };
    }
  });

  // node_modules/core-js-pure/stable/instance/sort.js
  var require_sort3 = __commonJS({
    "node_modules/core-js-pure/stable/instance/sort.js"(exports, module) {
      "use strict";
      var parent = require_sort2();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/instance/sort.js
  var require_sort4 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/instance/sort.js"(exports, module) {
      module.exports = require_sort3();
    }
  });

  // node_modules/core-js-pure/internals/whitespaces.js
  var require_whitespaces = __commonJS({
    "node_modules/core-js-pure/internals/whitespaces.js"(exports, module) {
      "use strict";
      module.exports = "	\n\v\f\r \xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
    }
  });

  // node_modules/core-js-pure/internals/string-trim.js
  var require_string_trim = __commonJS({
    "node_modules/core-js-pure/internals/string-trim.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var requireObjectCoercible = require_require_object_coercible();
      var toString = require_to_string();
      var whitespaces = require_whitespaces();
      var replace = uncurryThis("".replace);
      var ltrim = RegExp("^[" + whitespaces + "]+");
      var rtrim = RegExp("(^|[^" + whitespaces + "])[" + whitespaces + "]+$");
      var createMethod = function(TYPE) {
        return function($this) {
          var string = toString(requireObjectCoercible($this));
          if (TYPE & 1)
            string = replace(string, ltrim, "");
          if (TYPE & 2)
            string = replace(string, rtrim, "$1");
          return string;
        };
      };
      module.exports = {
        // `String.prototype.{ trimLeft, trimStart }` methods
        // https://tc39.es/ecma262/#sec-string.prototype.trimstart
        start: createMethod(1),
        // `String.prototype.{ trimRight, trimEnd }` methods
        // https://tc39.es/ecma262/#sec-string.prototype.trimend
        end: createMethod(2),
        // `String.prototype.trim` method
        // https://tc39.es/ecma262/#sec-string.prototype.trim
        trim: createMethod(3)
      };
    }
  });

  // node_modules/core-js-pure/internals/number-parse-int.js
  var require_number_parse_int = __commonJS({
    "node_modules/core-js-pure/internals/number-parse-int.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var fails = require_fails();
      var uncurryThis = require_function_uncurry_this();
      var toString = require_to_string();
      var trim = require_string_trim().trim;
      var whitespaces = require_whitespaces();
      var $parseInt = globalThis2.parseInt;
      var Symbol2 = globalThis2.Symbol;
      var ITERATOR = Symbol2 && Symbol2.iterator;
      var hex = /^[+-]?0x/i;
      var exec = uncurryThis(hex.exec);
      var FORCED = $parseInt(whitespaces + "08") !== 8 || $parseInt(whitespaces + "0x16") !== 22 || ITERATOR && !fails(function() {
        $parseInt(Object(ITERATOR));
      });
      module.exports = FORCED ? function parseInt2(string, radix) {
        var S = trim(toString(string));
        return $parseInt(S, radix >>> 0 || (exec(hex, S) ? 16 : 10));
      } : $parseInt;
    }
  });

  // node_modules/core-js-pure/modules/es.parse-int.js
  var require_es_parse_int = __commonJS({
    "node_modules/core-js-pure/modules/es.parse-int.js"() {
      "use strict";
      var $ = require_export();
      var $parseInt = require_number_parse_int();
      $({ global: true, forced: parseInt !== $parseInt }, {
        parseInt: $parseInt
      });
    }
  });

  // node_modules/core-js-pure/es/parse-int.js
  var require_parse_int = __commonJS({
    "node_modules/core-js-pure/es/parse-int.js"(exports, module) {
      "use strict";
      require_es_parse_int();
      var path = require_path();
      module.exports = path.parseInt;
    }
  });

  // node_modules/core-js-pure/stable/parse-int.js
  var require_parse_int2 = __commonJS({
    "node_modules/core-js-pure/stable/parse-int.js"(exports, module) {
      "use strict";
      var parent = require_parse_int();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/parse-int.js
  var require_parse_int3 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/parse-int.js"(exports, module) {
      module.exports = require_parse_int2();
    }
  });

  // node_modules/core-js-pure/modules/es.array.index-of.js
  var require_es_array_index_of = __commonJS({
    "node_modules/core-js-pure/modules/es.array.index-of.js"() {
      "use strict";
      var $ = require_export();
      var uncurryThis = require_function_uncurry_this_clause();
      var $indexOf = require_array_includes().indexOf;
      var arrayMethodIsStrict = require_array_method_is_strict();
      var nativeIndexOf = uncurryThis([].indexOf);
      var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
      var FORCED = NEGATIVE_ZERO || !arrayMethodIsStrict("indexOf");
      $({ target: "Array", proto: true, forced: FORCED }, {
        indexOf: function indexOf(searchElement) {
          var fromIndex = arguments.length > 1 ? arguments[1] : void 0;
          return NEGATIVE_ZERO ? nativeIndexOf(this, searchElement, fromIndex) || 0 : $indexOf(this, searchElement, fromIndex);
        }
      });
    }
  });

  // node_modules/core-js-pure/es/array/virtual/index-of.js
  var require_index_of = __commonJS({
    "node_modules/core-js-pure/es/array/virtual/index-of.js"(exports, module) {
      "use strict";
      require_es_array_index_of();
      var getBuiltInPrototypeMethod = require_get_built_in_prototype_method();
      module.exports = getBuiltInPrototypeMethod("Array", "indexOf");
    }
  });

  // node_modules/core-js-pure/es/instance/index-of.js
  var require_index_of2 = __commonJS({
    "node_modules/core-js-pure/es/instance/index-of.js"(exports, module) {
      "use strict";
      var isPrototypeOf = require_object_is_prototype_of();
      var method = require_index_of();
      var ArrayPrototype = Array.prototype;
      module.exports = function(it) {
        var own = it.indexOf;
        return it === ArrayPrototype || isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.indexOf ? method : own;
      };
    }
  });

  // node_modules/core-js-pure/stable/instance/index-of.js
  var require_index_of3 = __commonJS({
    "node_modules/core-js-pure/stable/instance/index-of.js"(exports, module) {
      "use strict";
      var parent = require_index_of2();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/instance/index-of.js
  var require_index_of4 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/instance/index-of.js"(exports, module) {
      module.exports = require_index_of3();
    }
  });

  // node_modules/core-js-pure/internals/array-for-each.js
  var require_array_for_each = __commonJS({
    "node_modules/core-js-pure/internals/array-for-each.js"(exports, module) {
      "use strict";
      var $forEach = require_array_iteration().forEach;
      var arrayMethodIsStrict = require_array_method_is_strict();
      var STRICT_METHOD = arrayMethodIsStrict("forEach");
      module.exports = !STRICT_METHOD ? function forEach(callbackfn) {
        return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
      } : [].forEach;
    }
  });

  // node_modules/core-js-pure/modules/es.array.for-each.js
  var require_es_array_for_each = __commonJS({
    "node_modules/core-js-pure/modules/es.array.for-each.js"() {
      "use strict";
      var $ = require_export();
      var forEach = require_array_for_each();
      $({ target: "Array", proto: true, forced: [].forEach !== forEach }, {
        forEach
      });
    }
  });

  // node_modules/core-js-pure/es/array/virtual/for-each.js
  var require_for_each = __commonJS({
    "node_modules/core-js-pure/es/array/virtual/for-each.js"(exports, module) {
      "use strict";
      require_es_array_for_each();
      var getBuiltInPrototypeMethod = require_get_built_in_prototype_method();
      module.exports = getBuiltInPrototypeMethod("Array", "forEach");
    }
  });

  // node_modules/core-js-pure/stable/array/virtual/for-each.js
  var require_for_each2 = __commonJS({
    "node_modules/core-js-pure/stable/array/virtual/for-each.js"(exports, module) {
      "use strict";
      var parent = require_for_each();
      module.exports = parent;
    }
  });

  // node_modules/core-js-pure/modules/web.dom-collections.for-each.js
  var require_web_dom_collections_for_each = __commonJS({
    "node_modules/core-js-pure/modules/web.dom-collections.for-each.js"() {
    }
  });

  // node_modules/core-js-pure/stable/instance/for-each.js
  var require_for_each3 = __commonJS({
    "node_modules/core-js-pure/stable/instance/for-each.js"(exports, module) {
      "use strict";
      var classof = require_classof();
      var hasOwn = require_has_own_property();
      var isPrototypeOf = require_object_is_prototype_of();
      var method = require_for_each2();
      require_web_dom_collections_for_each();
      var ArrayPrototype = Array.prototype;
      var DOMIterables = {
        DOMTokenList: true,
        NodeList: true
      };
      module.exports = function(it) {
        var own = it.forEach;
        return it === ArrayPrototype || isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.forEach || hasOwn(DOMIterables, classof(it)) ? method : own;
      };
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/instance/for-each.js
  var require_for_each4 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/instance/for-each.js"(exports, module) {
      module.exports = require_for_each3();
    }
  });

  // node_modules/core-js-pure/es/array/virtual/concat.js
  var require_concat = __commonJS({
    "node_modules/core-js-pure/es/array/virtual/concat.js"(exports, module) {
      "use strict";
      require_es_array_concat();
      var getBuiltInPrototypeMethod = require_get_built_in_prototype_method();
      module.exports = getBuiltInPrototypeMethod("Array", "concat");
    }
  });

  // node_modules/core-js-pure/es/instance/concat.js
  var require_concat2 = __commonJS({
    "node_modules/core-js-pure/es/instance/concat.js"(exports, module) {
      "use strict";
      var isPrototypeOf = require_object_is_prototype_of();
      var method = require_concat();
      var ArrayPrototype = Array.prototype;
      module.exports = function(it) {
        var own = it.concat;
        return it === ArrayPrototype || isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.concat ? method : own;
      };
    }
  });

  // node_modules/core-js-pure/stable/instance/concat.js
  var require_concat3 = __commonJS({
    "node_modules/core-js-pure/stable/instance/concat.js"(exports, module) {
      "use strict";
      var parent = require_concat2();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/instance/concat.js
  var require_concat4 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/instance/concat.js"(exports, module) {
      module.exports = require_concat3();
    }
  });

  // node_modules/xregexp/lib/xregexp.js
  var require_xregexp = __commonJS({
    "node_modules/xregexp/lib/xregexp.js"(exports, module) {
      "use strict";
      var _sliceInstanceProperty2 = require_slice4();
      var _Array$from = require_from3();
      var _Symbol = require_symbol3();
      var _getIteratorMethod = require_get_iterator_method7();
      var _Array$isArray = require_is_array4();
      var _Object$defineProperty = require_define_property3();
      var _interopRequireDefault = require_interopRequireDefault();
      _Object$defineProperty(exports, "__esModule", {
        value: true
      });
      exports["default"] = void 0;
      var _slicedToArray2 = _interopRequireDefault(require_slicedToArray());
      var _create = _interopRequireDefault(require_create3());
      var _flags = _interopRequireDefault(require_flags4());
      var _sort = _interopRequireDefault(require_sort4());
      var _slice = _interopRequireDefault(require_slice4());
      var _parseInt2 = _interopRequireDefault(require_parse_int3());
      var _indexOf = _interopRequireDefault(require_index_of4());
      var _forEach = _interopRequireDefault(require_for_each4());
      var _concat = _interopRequireDefault(require_concat4());
      function _createForOfIteratorHelper(r, e) {
        var t = "undefined" != typeof _Symbol && _getIteratorMethod(r) || r["@@iterator"];
        if (!t) {
          if (_Array$isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
            t && (r = t);
            var _n2 = 0, F = function F2() {
            };
            return { s: F, n: function n() {
              return _n2 >= r.length ? { done: true } : { done: false, value: r[_n2++] };
            }, e: function e2(r2) {
              throw r2;
            }, f: F };
          }
          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        var o, a = true, u = false;
        return { s: function s() {
          t = t.call(r);
        }, n: function n() {
          var r2 = t.next();
          return a = r2.done, r2;
        }, e: function e2(r2) {
          u = true, o = r2;
        }, f: function f() {
          try {
            a || null == t["return"] || t["return"]();
          } finally {
            if (u)
              throw o;
          }
        } };
      }
      function _unsupportedIterableToArray(r, a) {
        if (r) {
          var _context9;
          if ("string" == typeof r)
            return _arrayLikeToArray(r, a);
          var t = _sliceInstanceProperty2(_context9 = {}.toString.call(r)).call(_context9, 8, -1);
          return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? _Array$from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
        }
      }
      function _arrayLikeToArray(r, a) {
        (null == a || a > r.length) && (a = r.length);
        for (var e = 0, n = Array(a); e < a; e++)
          n[e] = r[e];
        return n;
      }
      var REGEX_DATA = "xregexp";
      var features = {
        astral: false,
        namespacing: true
      };
      var fixed = {};
      var regexCache = (0, _create["default"])(null);
      var patternCache = (0, _create["default"])(null);
      var tokens = [];
      var defaultScope = "default";
      var classScope = "class";
      var nativeTokens = {
        // Any native multicharacter token in default scope, or any single character
        "default": /\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|\(\?(?:[:=!]|<[=!])|[?*+]\?|{\d+(?:,\d*)?}\??|[\s\S]/,
        // Any native multicharacter token in character class scope, or any single character
        "class": /\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|[\s\S]/
      };
      var replacementToken = /\$(?:\{([^\}]+)\}|<([^>]+)>|(\d\d?|[\s\S]?))/g;
      var correctExecNpcg = /()??/.exec("")[1] === void 0;
      var hasFlagsProp = (0, _flags["default"])(/x/) !== void 0;
      function hasNativeFlag(flag) {
        var isSupported = true;
        try {
          new RegExp("", flag);
          if (flag === "y") {
            var gy = /* @__PURE__ */ function() {
              return "gy";
            }();
            var incompleteY = ".a".replace(new RegExp("a", gy), ".") === "..";
            if (incompleteY) {
              isSupported = false;
            }
          }
        } catch (exception) {
          isSupported = false;
        }
        return isSupported;
      }
      var hasNativeD = hasNativeFlag("d");
      var hasNativeS = hasNativeFlag("s");
      var hasNativeU = hasNativeFlag("u");
      var hasNativeY = hasNativeFlag("y");
      var registeredFlags = {
        d: hasNativeD,
        g: true,
        i: true,
        m: true,
        s: hasNativeS,
        u: hasNativeU,
        y: hasNativeY
      };
      var nonnativeFlags = hasNativeS ? /[^dgimsuy]+/g : /[^dgimuy]+/g;
      function augment(regex, captureNames, xSource, xFlags, isInternalOnly) {
        var _context;
        regex[REGEX_DATA] = {
          captureNames
        };
        if (isInternalOnly) {
          return regex;
        }
        if (regex.__proto__) {
          regex.__proto__ = XRegExp.prototype;
        } else {
          for (var p in XRegExp.prototype) {
            regex[p] = XRegExp.prototype[p];
          }
        }
        regex[REGEX_DATA].source = xSource;
        regex[REGEX_DATA].flags = xFlags ? (0, _sort["default"])(_context = xFlags.split("")).call(_context).join("") : xFlags;
        return regex;
      }
      function clipDuplicates(str) {
        return str.replace(/([\s\S])(?=[\s\S]*\1)/g, "");
      }
      function copyRegex(regex, options) {
        var _context2;
        if (!XRegExp.isRegExp(regex)) {
          throw new TypeError("Type RegExp expected");
        }
        var xData = regex[REGEX_DATA] || {};
        var flags = getNativeFlags(regex);
        var flagsToAdd = "";
        var flagsToRemove = "";
        var xregexpSource = null;
        var xregexpFlags = null;
        options = options || {};
        if (options.removeG) {
          flagsToRemove += "g";
        }
        if (options.removeY) {
          flagsToRemove += "y";
        }
        if (flagsToRemove) {
          flags = flags.replace(new RegExp("[".concat(flagsToRemove, "]+"), "g"), "");
        }
        if (options.addG) {
          flagsToAdd += "g";
        }
        if (options.addY) {
          flagsToAdd += "y";
        }
        if (flagsToAdd) {
          flags = clipDuplicates(flags + flagsToAdd);
        }
        if (!options.isInternalOnly) {
          if (xData.source !== void 0) {
            xregexpSource = xData.source;
          }
          if ((0, _flags["default"])(xData) != null) {
            xregexpFlags = flagsToAdd ? clipDuplicates((0, _flags["default"])(xData) + flagsToAdd) : (0, _flags["default"])(xData);
          }
        }
        regex = augment(new RegExp(options.source || regex.source, flags), hasNamedCapture(regex) ? (0, _slice["default"])(_context2 = xData.captureNames).call(_context2, 0) : null, xregexpSource, xregexpFlags, options.isInternalOnly);
        return regex;
      }
      function dec(hex2) {
        return (0, _parseInt2["default"])(hex2, 16);
      }
      function getContextualTokenSeparator(match, scope, flags) {
        var matchEndPos = match.index + match[0].length;
        var precedingChar = match.input[match.index - 1];
        var followingChar = match.input[matchEndPos];
        if (
          // No need to separate tokens if at the beginning or end of a group, before or after a
          // group, or before or after a `|`
          /^[()|]$/.test(precedingChar) || /^[()|]$/.test(followingChar) || // No need to separate tokens if at the beginning or end of the pattern
          match.index === 0 || matchEndPos === match.input.length || // No need to separate tokens if at the beginning of a noncapturing group or lookaround.
          // Looks only at the last 4 chars (at most) for perf when constructing long regexes.
          /\(\?(?:[:=!]|<[=!])$/.test(match.input.substring(match.index - 4, match.index)) || // Avoid separating tokens when the following token is a quantifier
          isQuantifierNext(match.input, matchEndPos, flags)
        ) {
          return "";
        }
        return "(?:)";
      }
      function getNativeFlags(regex) {
        return hasFlagsProp ? (0, _flags["default"])(regex) : (
          // Explicitly using `RegExp.prototype.toString` (rather than e.g. `String` or concatenation
          // with an empty string) allows this to continue working predictably when
          // `XRegExp.proptotype.toString` is overridden
          /\/([a-z]*)$/i.exec(RegExp.prototype.toString.call(regex))[1]
        );
      }
      function hasNamedCapture(regex) {
        return !!(regex[REGEX_DATA] && regex[REGEX_DATA].captureNames);
      }
      function hex(dec2) {
        return (0, _parseInt2["default"])(dec2, 10).toString(16);
      }
      function isQuantifierNext(pattern, pos, flags) {
        var inlineCommentPattern = "\\(\\?#[^)]*\\)";
        var lineCommentPattern = "#[^#\\n]*";
        var quantifierPattern = "[?*+]|{\\d+(?:,\\d*)?}";
        var regex = (0, _indexOf["default"])(flags).call(flags, "x") !== -1 ? (
          // Ignore any leading whitespace, line comments, and inline comments
          /^(?:\s|#[^#\n]*|\(\?#[^)]*\))*(?:[?*+]|{\d+(?:,\d*)?})/
        ) : (
          // Ignore any leading inline comments
          /^(?:\(\?#[^)]*\))*(?:[?*+]|{\d+(?:,\d*)?})/
        );
        return regex.test((0, _slice["default"])(pattern).call(pattern, pos));
      }
      function isType(value, type) {
        return Object.prototype.toString.call(value) === "[object ".concat(type, "]");
      }
      function nullThrows(value) {
        if (value == null) {
          throw new TypeError("Cannot convert null or undefined to object");
        }
        return value;
      }
      function pad4(str) {
        while (str.length < 4) {
          str = "0".concat(str);
        }
        return str;
      }
      function prepareFlags(pattern, flags) {
        if (clipDuplicates(flags) !== flags) {
          throw new SyntaxError("Invalid duplicate regex flag ".concat(flags));
        }
        pattern = pattern.replace(/^\(\?([\w$]+)\)/, function($0, $1) {
          if (/[dgy]/.test($1)) {
            throw new SyntaxError("Cannot use flags dgy in mode modifier ".concat($0));
          }
          flags = clipDuplicates(flags + $1);
          return "";
        });
        var _iterator = _createForOfIteratorHelper(flags), _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done; ) {
            var flag = _step.value;
            if (!registeredFlags[flag]) {
              throw new SyntaxError("Unknown regex flag ".concat(flag));
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return {
          pattern,
          flags
        };
      }
      function prepareOptions(value) {
        var options = {};
        if (isType(value, "String")) {
          (0, _forEach["default"])(XRegExp).call(XRegExp, value, /[^\s,]+/, function(match) {
            options[match] = true;
          });
          return options;
        }
        return value;
      }
      function registerFlag(flag) {
        if (!/^[\w$]$/.test(flag)) {
          throw new Error("Flag must be a single character A-Za-z0-9_$");
        }
        registeredFlags[flag] = true;
      }
      function runTokens(pattern, flags, pos, scope, context) {
        var i = tokens.length;
        var leadChar = pattern[pos];
        var result = null;
        var match;
        var t;
        while (i--) {
          t = tokens[i];
          if (t.leadChar && t.leadChar !== leadChar || t.scope !== scope && t.scope !== "all" || t.flag && !((0, _indexOf["default"])(flags).call(flags, t.flag) !== -1)) {
            continue;
          }
          match = XRegExp.exec(pattern, t.regex, pos, "sticky");
          if (match) {
            result = {
              matchLength: match[0].length,
              output: t.handler.call(context, match, scope, flags),
              reparse: t.reparse
            };
            break;
          }
        }
        return result;
      }
      function setAstral(on) {
        features.astral = on;
      }
      function setNamespacing(on) {
        features.namespacing = on;
      }
      function XRegExp(pattern, flags) {
        if (XRegExp.isRegExp(pattern)) {
          if (flags !== void 0) {
            throw new TypeError("Cannot supply flags when copying a RegExp");
          }
          return copyRegex(pattern);
        }
        pattern = pattern === void 0 ? "" : String(pattern);
        flags = flags === void 0 ? "" : String(flags);
        if (XRegExp.isInstalled("astral") && !((0, _indexOf["default"])(flags).call(flags, "A") !== -1)) {
          flags += "A";
        }
        if (!patternCache[pattern]) {
          patternCache[pattern] = {};
        }
        if (!patternCache[pattern][flags]) {
          var context = {
            hasNamedCapture: false,
            captureNames: []
          };
          var scope = defaultScope;
          var output = "";
          var pos = 0;
          var result;
          var applied = prepareFlags(pattern, flags);
          var appliedPattern = applied.pattern;
          var appliedFlags = (0, _flags["default"])(applied);
          while (pos < appliedPattern.length) {
            do {
              result = runTokens(appliedPattern, appliedFlags, pos, scope, context);
              if (result && result.reparse) {
                appliedPattern = (0, _slice["default"])(appliedPattern).call(appliedPattern, 0, pos) + result.output + (0, _slice["default"])(appliedPattern).call(appliedPattern, pos + result.matchLength);
              }
            } while (result && result.reparse);
            if (result) {
              output += result.output;
              pos += result.matchLength || 1;
            } else {
              var _XRegExp$exec = XRegExp.exec(appliedPattern, nativeTokens[scope], pos, "sticky"), _XRegExp$exec2 = (0, _slicedToArray2["default"])(_XRegExp$exec, 1), token = _XRegExp$exec2[0];
              output += token;
              pos += token.length;
              if (token === "[" && scope === defaultScope) {
                scope = classScope;
              } else if (token === "]" && scope === classScope) {
                scope = defaultScope;
              }
            }
          }
          patternCache[pattern][flags] = {
            // Use basic cleanup to collapse repeated empty groups like `(?:)(?:)` to `(?:)`. Empty
            // groups are sometimes inserted during regex transpilation in order to keep tokens
            // separated. However, more than one empty group in a row is never needed.
            pattern: output.replace(/(?:\(\?:\))+/g, "(?:)"),
            // Strip all but native flags
            flags: appliedFlags.replace(nonnativeFlags, ""),
            // `context.captureNames` has an item for each capturing group, even if unnamed
            captures: context.hasNamedCapture ? context.captureNames : null
          };
        }
        var generated = patternCache[pattern][flags];
        return augment(new RegExp(generated.pattern, (0, _flags["default"])(generated)), generated.captures, pattern, flags);
      }
      XRegExp.prototype = /(?:)/;
      XRegExp.version = "5.1.2";
      XRegExp._clipDuplicates = clipDuplicates;
      XRegExp._hasNativeFlag = hasNativeFlag;
      XRegExp._dec = dec;
      XRegExp._hex = hex;
      XRegExp._pad4 = pad4;
      XRegExp.addToken = function(regex, handler, options) {
        options = options || {};
        var _options = options, optionalFlags = _options.optionalFlags;
        if (options.flag) {
          registerFlag(options.flag);
        }
        if (optionalFlags) {
          optionalFlags = optionalFlags.split("");
          var _iterator2 = _createForOfIteratorHelper(optionalFlags), _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
              var flag = _step2.value;
              registerFlag(flag);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
        tokens.push({
          regex: copyRegex(regex, {
            addG: true,
            addY: hasNativeY,
            isInternalOnly: true
          }),
          handler,
          scope: options.scope || defaultScope,
          flag: options.flag,
          reparse: options.reparse,
          leadChar: options.leadChar
        });
        XRegExp.cache.flush("patterns");
      };
      XRegExp.cache = function(pattern, flags) {
        if (!regexCache[pattern]) {
          regexCache[pattern] = {};
        }
        return regexCache[pattern][flags] || (regexCache[pattern][flags] = XRegExp(pattern, flags));
      };
      XRegExp.cache.flush = function(cacheName) {
        if (cacheName === "patterns") {
          patternCache = (0, _create["default"])(null);
        } else {
          regexCache = (0, _create["default"])(null);
        }
      };
      XRegExp.escape = function(str) {
        return String(nullThrows(str)).replace(/[\\\[\]{}()*+?.^$|]/g, "\\$&").replace(/[\s#\-,]/g, function(match) {
          return "\\u".concat(pad4(hex(match.charCodeAt(0))));
        });
      };
      XRegExp.exec = function(str, regex, pos, sticky) {
        var cacheKey = "g";
        var addY = false;
        var fakeY = false;
        var match;
        addY = hasNativeY && !!(sticky || regex.sticky && sticky !== false);
        if (addY) {
          cacheKey += "y";
        } else if (sticky) {
          fakeY = true;
          cacheKey += "FakeY";
        }
        regex[REGEX_DATA] = regex[REGEX_DATA] || {};
        var r2 = regex[REGEX_DATA][cacheKey] || (regex[REGEX_DATA][cacheKey] = copyRegex(regex, {
          addG: true,
          addY,
          source: fakeY ? "".concat(regex.source, "|()") : void 0,
          removeY: sticky === false,
          isInternalOnly: true
        }));
        pos = pos || 0;
        r2.lastIndex = pos;
        match = fixed.exec.call(r2, str);
        if (fakeY && match && match.pop() === "") {
          match = null;
        }
        if (regex.global) {
          regex.lastIndex = match ? r2.lastIndex : 0;
        }
        return match;
      };
      XRegExp.forEach = function(str, regex, callback) {
        var pos = 0;
        var i = -1;
        var match;
        while (match = XRegExp.exec(str, regex, pos)) {
          callback(match, ++i, str, regex);
          pos = match.index + (match[0].length || 1);
        }
      };
      XRegExp.globalize = function(regex) {
        return copyRegex(regex, {
          addG: true
        });
      };
      XRegExp.install = function(options) {
        options = prepareOptions(options);
        if (!features.astral && options.astral) {
          setAstral(true);
        }
        if (!features.namespacing && options.namespacing) {
          setNamespacing(true);
        }
      };
      XRegExp.isInstalled = function(feature) {
        return !!features[feature];
      };
      XRegExp.isRegExp = function(value) {
        return Object.prototype.toString.call(value) === "[object RegExp]";
      };
      XRegExp.match = function(str, regex, scope) {
        var global2 = regex.global && scope !== "one" || scope === "all";
        var cacheKey = (global2 ? "g" : "") + (regex.sticky ? "y" : "") || "noGY";
        regex[REGEX_DATA] = regex[REGEX_DATA] || {};
        var r2 = regex[REGEX_DATA][cacheKey] || (regex[REGEX_DATA][cacheKey] = copyRegex(regex, {
          addG: !!global2,
          removeG: scope === "one",
          isInternalOnly: true
        }));
        var result = String(nullThrows(str)).match(r2);
        if (regex.global) {
          regex.lastIndex = scope === "one" && result ? (
            // Can't use `r2.lastIndex` since `r2` is nonglobal in this case
            result.index + result[0].length
          ) : 0;
        }
        return global2 ? result || [] : result && result[0];
      };
      XRegExp.matchChain = function(str, chain) {
        return function recurseChain(values, level) {
          var item = chain[level].regex ? chain[level] : {
            regex: chain[level]
          };
          var matches = [];
          function addMatch(match) {
            if (item.backref) {
              var ERR_UNDEFINED_GROUP = "Backreference to undefined group: ".concat(item.backref);
              var isNamedBackref = isNaN(item.backref);
              if (isNamedBackref && XRegExp.isInstalled("namespacing")) {
                if (!(match.groups && item.backref in match.groups)) {
                  throw new ReferenceError(ERR_UNDEFINED_GROUP);
                }
              } else if (!match.hasOwnProperty(item.backref)) {
                throw new ReferenceError(ERR_UNDEFINED_GROUP);
              }
              var backrefValue = isNamedBackref && XRegExp.isInstalled("namespacing") ? match.groups[item.backref] : match[item.backref];
              matches.push(backrefValue || "");
            } else {
              matches.push(match[0]);
            }
          }
          var _iterator3 = _createForOfIteratorHelper(values), _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
              var value = _step3.value;
              (0, _forEach["default"])(XRegExp).call(XRegExp, value, item.regex, addMatch);
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
          return level === chain.length - 1 || !matches.length ? matches : recurseChain(matches, level + 1);
        }([str], 0);
      };
      XRegExp.replace = function(str, search, replacement, scope) {
        var isRegex = XRegExp.isRegExp(search);
        var global2 = search.global && scope !== "one" || scope === "all";
        var cacheKey = (global2 ? "g" : "") + (search.sticky ? "y" : "") || "noGY";
        var s2 = search;
        if (isRegex) {
          search[REGEX_DATA] = search[REGEX_DATA] || {};
          s2 = search[REGEX_DATA][cacheKey] || (search[REGEX_DATA][cacheKey] = copyRegex(search, {
            addG: !!global2,
            removeG: scope === "one",
            isInternalOnly: true
          }));
        } else if (global2) {
          s2 = new RegExp(XRegExp.escape(String(search)), "g");
        }
        var result = fixed.replace.call(nullThrows(str), s2, replacement);
        if (isRegex && search.global) {
          search.lastIndex = 0;
        }
        return result;
      };
      XRegExp.replaceEach = function(str, replacements) {
        var _iterator4 = _createForOfIteratorHelper(replacements), _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done; ) {
            var r = _step4.value;
            str = XRegExp.replace(str, r[0], r[1], r[2]);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
        return str;
      };
      XRegExp.split = function(str, separator, limit) {
        return fixed.split.call(nullThrows(str), separator, limit);
      };
      XRegExp.test = function(str, regex, pos, sticky) {
        return !!XRegExp.exec(str, regex, pos, sticky);
      };
      XRegExp.uninstall = function(options) {
        options = prepareOptions(options);
        if (features.astral && options.astral) {
          setAstral(false);
        }
        if (features.namespacing && options.namespacing) {
          setNamespacing(false);
        }
      };
      XRegExp.union = function(patterns, flags, options) {
        options = options || {};
        var conjunction = options.conjunction || "or";
        var numCaptures = 0;
        var numPriorCaptures;
        var captureNames;
        function rewrite(match, paren, backref) {
          var name = captureNames[numCaptures - numPriorCaptures];
          if (paren) {
            ++numCaptures;
            if (name) {
              return "(?<".concat(name, ">");
            }
          } else if (backref) {
            return "\\".concat(+backref + numPriorCaptures);
          }
          return match;
        }
        if (!(isType(patterns, "Array") && patterns.length)) {
          throw new TypeError("Must provide a nonempty array of patterns to merge");
        }
        var parts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*\]/g;
        var output = [];
        var _iterator5 = _createForOfIteratorHelper(patterns), _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done; ) {
            var pattern = _step5.value;
            if (XRegExp.isRegExp(pattern)) {
              numPriorCaptures = numCaptures;
              captureNames = pattern[REGEX_DATA] && pattern[REGEX_DATA].captureNames || [];
              output.push(XRegExp(pattern.source).source.replace(parts, rewrite));
            } else {
              output.push(XRegExp.escape(pattern));
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
        var separator = conjunction === "none" ? "" : "|";
        return XRegExp(output.join(separator), flags);
      };
      fixed.exec = function(str) {
        var origLastIndex = this.lastIndex;
        var match = RegExp.prototype.exec.apply(this, arguments);
        if (match) {
          if (!correctExecNpcg && match.length > 1 && (0, _indexOf["default"])(match).call(match, "") !== -1) {
            var _context3;
            var r2 = copyRegex(this, {
              removeG: true,
              isInternalOnly: true
            });
            (0, _slice["default"])(_context3 = String(str)).call(_context3, match.index).replace(r2, function() {
              var len = arguments.length;
              for (var i2 = 1; i2 < len - 2; ++i2) {
                if ((i2 < 0 || arguments.length <= i2 ? void 0 : arguments[i2]) === void 0) {
                  match[i2] = void 0;
                }
              }
            });
          }
          if (this[REGEX_DATA] && this[REGEX_DATA].captureNames) {
            var groupsObject = match;
            if (XRegExp.isInstalled("namespacing")) {
              match.groups = (0, _create["default"])(null);
              groupsObject = match.groups;
            }
            for (var i = 1; i < match.length; ++i) {
              var name = this[REGEX_DATA].captureNames[i - 1];
              if (name) {
                groupsObject[name] = match[i];
              }
            }
          } else if (!match.groups && XRegExp.isInstalled("namespacing")) {
            match.groups = void 0;
          }
          if (this.global && !match[0].length && this.lastIndex > match.index) {
            this.lastIndex = match.index;
          }
        }
        if (!this.global) {
          this.lastIndex = origLastIndex;
        }
        return match;
      };
      fixed.test = function(str) {
        return !!fixed.exec.call(this, str);
      };
      fixed.match = function(regex) {
        if (!XRegExp.isRegExp(regex)) {
          regex = new RegExp(regex);
        } else if (regex.global) {
          var result = String.prototype.match.apply(this, arguments);
          regex.lastIndex = 0;
          return result;
        }
        return fixed.exec.call(regex, nullThrows(this));
      };
      fixed.replace = function(search, replacement) {
        var isRegex = XRegExp.isRegExp(search);
        var origLastIndex;
        var captureNames;
        var result;
        if (isRegex) {
          if (search[REGEX_DATA]) {
            captureNames = search[REGEX_DATA].captureNames;
          }
          origLastIndex = search.lastIndex;
        } else {
          search += "";
        }
        if (isType(replacement, "Function")) {
          result = String(this).replace(search, function() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            if (captureNames) {
              var groupsObject;
              if (XRegExp.isInstalled("namespacing")) {
                groupsObject = (0, _create["default"])(null);
                args.push(groupsObject);
              } else {
                args[0] = new String(args[0]);
                groupsObject = args[0];
              }
              for (var i = 0; i < captureNames.length; ++i) {
                if (captureNames[i]) {
                  groupsObject[captureNames[i]] = args[i + 1];
                }
              }
            }
            return replacement.apply(void 0, args);
          });
        } else {
          result = String(nullThrows(this)).replace(search, function() {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }
            return String(replacement).replace(replacementToken, replacer);
            function replacer($0, bracketed, angled, dollarToken) {
              bracketed = bracketed || angled;
              var numNonCaptureArgs = isType(args[args.length - 1], "Object") ? 4 : 3;
              var numCaptures = args.length - numNonCaptureArgs;
              if (bracketed) {
                if (/^\d+$/.test(bracketed)) {
                  var _n = +bracketed;
                  if (_n <= numCaptures) {
                    return args[_n] || "";
                  }
                }
                var n = captureNames ? (0, _indexOf["default"])(captureNames).call(captureNames, bracketed) : -1;
                if (n < 0) {
                  throw new SyntaxError("Backreference to undefined group ".concat($0));
                }
                return args[n + 1] || "";
              }
              if (dollarToken === "" || dollarToken === " ") {
                throw new SyntaxError("Invalid token ".concat($0));
              }
              if (dollarToken === "&" || +dollarToken === 0) {
                return args[0];
              }
              if (dollarToken === "$") {
                return "$";
              }
              if (dollarToken === "`") {
                var _context4;
                return (0, _slice["default"])(_context4 = args[args.length - 1]).call(_context4, 0, args[args.length - 2]);
              }
              if (dollarToken === "'") {
                var _context5;
                return (0, _slice["default"])(_context5 = args[args.length - 1]).call(_context5, args[args.length - 2] + args[0].length);
              }
              dollarToken = +dollarToken;
              if (!isNaN(dollarToken)) {
                if (dollarToken > numCaptures) {
                  throw new SyntaxError("Backreference to undefined group ".concat($0));
                }
                return args[dollarToken] || "";
              }
              throw new SyntaxError("Invalid token ".concat($0));
            }
          });
        }
        if (isRegex) {
          if (search.global) {
            search.lastIndex = 0;
          } else {
            search.lastIndex = origLastIndex;
          }
        }
        return result;
      };
      fixed.split = function(separator, limit) {
        if (!XRegExp.isRegExp(separator)) {
          return String.prototype.split.apply(this, arguments);
        }
        var str = String(this);
        var output = [];
        var origLastIndex = separator.lastIndex;
        var lastLastIndex = 0;
        var lastLength;
        limit = (limit === void 0 ? -1 : limit) >>> 0;
        (0, _forEach["default"])(XRegExp).call(XRegExp, str, separator, function(match) {
          if (match.index + match[0].length > lastLastIndex) {
            output.push((0, _slice["default"])(str).call(str, lastLastIndex, match.index));
            if (match.length > 1 && match.index < str.length) {
              Array.prototype.push.apply(output, (0, _slice["default"])(match).call(match, 1));
            }
            lastLength = match[0].length;
            lastLastIndex = match.index + lastLength;
          }
        });
        if (lastLastIndex === str.length) {
          if (!separator.test("") || lastLength) {
            output.push("");
          }
        } else {
          output.push((0, _slice["default"])(str).call(str, lastLastIndex));
        }
        separator.lastIndex = origLastIndex;
        return output.length > limit ? (0, _slice["default"])(output).call(output, 0, limit) : output;
      };
      XRegExp.addToken(/\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4}|{[\dA-Fa-f]+})|x(?![\dA-Fa-f]{2}))/, function(match, scope) {
        if (match[1] === "B" && scope === defaultScope) {
          return match[0];
        }
        throw new SyntaxError("Invalid escape ".concat(match[0]));
      }, {
        scope: "all",
        leadChar: "\\"
      });
      XRegExp.addToken(/\\u{([\dA-Fa-f]+)}/, function(match, scope, flags) {
        var code = dec(match[1]);
        if (code > 1114111) {
          throw new SyntaxError("Invalid Unicode code point ".concat(match[0]));
        }
        if (code <= 65535) {
          return "\\u".concat(pad4(hex(code)));
        }
        if (hasNativeU && (0, _indexOf["default"])(flags).call(flags, "u") !== -1) {
          return match[0];
        }
        throw new SyntaxError("Cannot use Unicode code point above \\u{FFFF} without flag u");
      }, {
        scope: "all",
        leadChar: "\\"
      });
      XRegExp.addToken(/\(\?#[^)]*\)/, getContextualTokenSeparator, {
        leadChar: "("
      });
      XRegExp.addToken(/\s+|#[^\n]*\n?/, getContextualTokenSeparator, {
        flag: "x"
      });
      if (!hasNativeS) {
        XRegExp.addToken(/\./, function() {
          return "[\\s\\S]";
        }, {
          flag: "s",
          leadChar: "."
        });
      }
      XRegExp.addToken(/\\k<([^>]+)>/, function(match) {
        var _context6, _context7;
        var index = isNaN(match[1]) ? (0, _indexOf["default"])(_context6 = this.captureNames).call(_context6, match[1]) + 1 : +match[1];
        var endIndex = match.index + match[0].length;
        if (!index || index > this.captureNames.length) {
          throw new SyntaxError("Backreference to undefined group ".concat(match[0]));
        }
        return (0, _concat["default"])(_context7 = "\\".concat(index)).call(_context7, endIndex === match.input.length || isNaN(match.input[endIndex]) ? "" : "(?:)");
      }, {
        leadChar: "\\"
      });
      XRegExp.addToken(/\\(\d+)/, function(match, scope) {
        if (!(scope === defaultScope && /^[1-9]/.test(match[1]) && +match[1] <= this.captureNames.length) && match[1] !== "0") {
          throw new SyntaxError("Cannot use octal escape or backreference to undefined group ".concat(match[0]));
        }
        return match[0];
      }, {
        scope: "all",
        leadChar: "\\"
      });
      XRegExp.addToken(/\(\?P?<((?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CD\uA7D0\uA7D1\uA7D3\uA7D5-\uA7DC\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDDC0-\uDDF3\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDD4A-\uDD65\uDD6F-\uDD85\uDE80-\uDEA9\uDEB0\uDEB1\uDEC2-\uDEC4\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5\uDFB7\uDFD1\uDFD3]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8\uDFC0-\uDFE0]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD80E\uD80F\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46\uDC60-\uDFFF]|\uD810[\uDC00-\uDFFA]|\uD811[\uDC00-\uDE46]|\uD818[\uDD00-\uDD1D]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDD40-\uDD6C\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDCFF-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDCD0-\uDCEB\uDDD0-\uDDED\uDDF0\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0\uDFF0-\uDFFF]|\uD87B[\uDC00-\uDE5D]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF])(?:[\$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u07FD\u0800-\u082D\u0840-\u085B\u0860-\u086A\u0870-\u0887\u0889-\u088E\u0897-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3C-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C5D\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1-\u0CF3\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECE\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1715\u171F-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1ABF-\u1ACE\u1B00-\u1B4C\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CD0-\u1CD2\u1CD4-\u1CFA\u1D00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CD\uA7D0\uA7D1\uA7D3\uA7D5-\uA7DC\uA7F2-\uA827\uA82C\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF65-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDDC0-\uDDF3\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD27\uDD30-\uDD39\uDD40-\uDD65\uDD69-\uDD6D\uDD6F-\uDD85\uDE80-\uDEA9\uDEAB\uDEAC\uDEB0\uDEB1\uDEC2-\uDEC4\uDEFC-\uDF1C\uDF27\uDF30-\uDF50\uDF70-\uDF85\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC00-\uDC46\uDC66-\uDC75\uDC7F-\uDCBA\uDCC2\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD44-\uDD47\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDC9-\uDDCC\uDDCE-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E-\uDE41\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3B-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5\uDFB7-\uDFC0\uDFC2\uDFC5\uDFC7-\uDFCA\uDFCC-\uDFD3\uDFE1\uDFE2]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC5E-\uDC61\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB8\uDEC0-\uDEC9\uDED0-\uDEE3\uDF00-\uDF1A\uDF1D-\uDF2B\uDF30-\uDF39\uDF40-\uDF46]|\uD806[\uDC00-\uDC3A\uDCA0-\uDCE9\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD35\uDD37\uDD38\uDD3B-\uDD43\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDE1\uDDE3\uDDE4\uDE00-\uDE3E\uDE47\uDE50-\uDE99\uDE9D\uDEB0-\uDEF8\uDFC0-\uDFE0\uDFF0-\uDFF9]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF6\uDF00-\uDF10\uDF12-\uDF3A\uDF3E-\uDF42\uDF50-\uDF5A\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD80E\uD80F\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC40-\uDC55\uDC60-\uDFFF]|\uD810[\uDC00-\uDFFA]|\uD811[\uDC00-\uDE46]|\uD818[\uDD00-\uDD39]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDD40-\uDD6C\uDD70-\uDD79\uDE40-\uDE7F\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F\uDFE0\uDFE1\uDFE3\uDFE4\uDFF0\uDFF1]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDCFF-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD833[\uDCF0-\uDCF9\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC30-\uDC6D\uDC8F\uDD00-\uDD2C\uDD30-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAE\uDEC0-\uDEF9]|\uD839[\uDCD0-\uDCF9\uDDD0-\uDDFA\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4B\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0\uDFF0-\uDFFF]|\uD87B[\uDC00-\uDE5D]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF]|\uDB40[\uDD00-\uDDEF])*)>/, function(match) {
        var _context8;
        if (!XRegExp.isInstalled("namespacing") && (match[1] === "length" || match[1] === "__proto__")) {
          throw new SyntaxError("Cannot use reserved word as capture name ".concat(match[0]));
        }
        if ((0, _indexOf["default"])(_context8 = this.captureNames).call(_context8, match[1]) !== -1) {
          throw new SyntaxError("Cannot use same name for multiple groups ".concat(match[0]));
        }
        this.captureNames.push(match[1]);
        this.hasNamedCapture = true;
        return "(";
      }, {
        leadChar: "("
      });
      XRegExp.addToken(/\((?!\?)/, function(match, scope, flags) {
        if ((0, _indexOf["default"])(flags).call(flags, "n") !== -1) {
          return "(?:";
        }
        this.captureNames.push(null);
        return "(";
      }, {
        optionalFlags: "n",
        leadChar: "("
      });
      var _default = exports["default"] = XRegExp;
      module.exports = exports.default;
    }
  });

  // node_modules/core-js-pure/internals/array-reduce.js
  var require_array_reduce = __commonJS({
    "node_modules/core-js-pure/internals/array-reduce.js"(exports, module) {
      "use strict";
      var aCallable = require_a_callable();
      var toObject = require_to_object();
      var IndexedObject = require_indexed_object();
      var lengthOfArrayLike = require_length_of_array_like();
      var $TypeError = TypeError;
      var REDUCE_EMPTY = "Reduce of empty array with no initial value";
      var createMethod = function(IS_RIGHT) {
        return function(that, callbackfn, argumentsLength, memo) {
          var O = toObject(that);
          var self2 = IndexedObject(O);
          var length = lengthOfArrayLike(O);
          aCallable(callbackfn);
          if (length === 0 && argumentsLength < 2)
            throw new $TypeError(REDUCE_EMPTY);
          var index = IS_RIGHT ? length - 1 : 0;
          var i = IS_RIGHT ? -1 : 1;
          if (argumentsLength < 2)
            while (true) {
              if (index in self2) {
                memo = self2[index];
                index += i;
                break;
              }
              index += i;
              if (IS_RIGHT ? index < 0 : length <= index) {
                throw new $TypeError(REDUCE_EMPTY);
              }
            }
          for (; IS_RIGHT ? index >= 0 : length > index; index += i)
            if (index in self2) {
              memo = callbackfn(memo, self2[index], index, O);
            }
          return memo;
        };
      };
      module.exports = {
        // `Array.prototype.reduce` method
        // https://tc39.es/ecma262/#sec-array.prototype.reduce
        left: createMethod(false),
        // `Array.prototype.reduceRight` method
        // https://tc39.es/ecma262/#sec-array.prototype.reduceright
        right: createMethod(true)
      };
    }
  });

  // node_modules/core-js-pure/internals/environment.js
  var require_environment = __commonJS({
    "node_modules/core-js-pure/internals/environment.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var userAgent = require_environment_user_agent();
      var classof = require_classof_raw();
      var userAgentStartsWith = function(string) {
        return userAgent.slice(0, string.length) === string;
      };
      module.exports = function() {
        if (userAgentStartsWith("Bun/"))
          return "BUN";
        if (userAgentStartsWith("Cloudflare-Workers"))
          return "CLOUDFLARE";
        if (userAgentStartsWith("Deno/"))
          return "DENO";
        if (userAgentStartsWith("Node.js/"))
          return "NODE";
        if (globalThis2.Bun && typeof Bun.version == "string")
          return "BUN";
        if (globalThis2.Deno && typeof Deno.version == "object")
          return "DENO";
        if (classof(globalThis2.process) === "process")
          return "NODE";
        if (globalThis2.window && globalThis2.document)
          return "BROWSER";
        return "REST";
      }();
    }
  });

  // node_modules/core-js-pure/internals/environment-is-node.js
  var require_environment_is_node = __commonJS({
    "node_modules/core-js-pure/internals/environment-is-node.js"(exports, module) {
      "use strict";
      var ENVIRONMENT = require_environment();
      module.exports = ENVIRONMENT === "NODE";
    }
  });

  // node_modules/core-js-pure/modules/es.array.reduce.js
  var require_es_array_reduce = __commonJS({
    "node_modules/core-js-pure/modules/es.array.reduce.js"() {
      "use strict";
      var $ = require_export();
      var $reduce = require_array_reduce().left;
      var arrayMethodIsStrict = require_array_method_is_strict();
      var CHROME_VERSION = require_environment_v8_version();
      var IS_NODE = require_environment_is_node();
      var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;
      var FORCED = CHROME_BUG || !arrayMethodIsStrict("reduce");
      $({ target: "Array", proto: true, forced: FORCED }, {
        reduce: function reduce(callbackfn) {
          var length = arguments.length;
          return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : void 0);
        }
      });
    }
  });

  // node_modules/core-js-pure/es/array/virtual/reduce.js
  var require_reduce = __commonJS({
    "node_modules/core-js-pure/es/array/virtual/reduce.js"(exports, module) {
      "use strict";
      require_es_array_reduce();
      var getBuiltInPrototypeMethod = require_get_built_in_prototype_method();
      module.exports = getBuiltInPrototypeMethod("Array", "reduce");
    }
  });

  // node_modules/core-js-pure/es/instance/reduce.js
  var require_reduce2 = __commonJS({
    "node_modules/core-js-pure/es/instance/reduce.js"(exports, module) {
      "use strict";
      var isPrototypeOf = require_object_is_prototype_of();
      var method = require_reduce();
      var ArrayPrototype = Array.prototype;
      module.exports = function(it) {
        var own = it.reduce;
        return it === ArrayPrototype || isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.reduce ? method : own;
      };
    }
  });

  // node_modules/core-js-pure/stable/instance/reduce.js
  var require_reduce3 = __commonJS({
    "node_modules/core-js-pure/stable/instance/reduce.js"(exports, module) {
      "use strict";
      var parent = require_reduce2();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/instance/reduce.js
  var require_reduce4 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/instance/reduce.js"(exports, module) {
      module.exports = require_reduce3();
    }
  });

  // node_modules/core-js-pure/modules/es.array.map.js
  var require_es_array_map = __commonJS({
    "node_modules/core-js-pure/modules/es.array.map.js"() {
      "use strict";
      var $ = require_export();
      var $map = require_array_iteration().map;
      var arrayMethodHasSpeciesSupport = require_array_method_has_species_support();
      var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("map");
      $({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT }, {
        map: function map(callbackfn) {
          return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
        }
      });
    }
  });

  // node_modules/core-js-pure/es/array/virtual/map.js
  var require_map = __commonJS({
    "node_modules/core-js-pure/es/array/virtual/map.js"(exports, module) {
      "use strict";
      require_es_array_map();
      var getBuiltInPrototypeMethod = require_get_built_in_prototype_method();
      module.exports = getBuiltInPrototypeMethod("Array", "map");
    }
  });

  // node_modules/core-js-pure/es/instance/map.js
  var require_map2 = __commonJS({
    "node_modules/core-js-pure/es/instance/map.js"(exports, module) {
      "use strict";
      var isPrototypeOf = require_object_is_prototype_of();
      var method = require_map();
      var ArrayPrototype = Array.prototype;
      module.exports = function(it) {
        var own = it.map;
        return it === ArrayPrototype || isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.map ? method : own;
      };
    }
  });

  // node_modules/core-js-pure/stable/instance/map.js
  var require_map3 = __commonJS({
    "node_modules/core-js-pure/stable/instance/map.js"(exports, module) {
      "use strict";
      var parent = require_map2();
      module.exports = parent;
    }
  });

  // node_modules/@babel/runtime-corejs3/core-js-stable/instance/map.js
  var require_map4 = __commonJS({
    "node_modules/@babel/runtime-corejs3/core-js-stable/instance/map.js"(exports, module) {
      module.exports = require_map3();
    }
  });

  // node_modules/xregexp/lib/addons/build.js
  var require_build = __commonJS({
    "node_modules/xregexp/lib/addons/build.js"(exports, module) {
      "use strict";
      var _Object$defineProperty = require_define_property3();
      var _interopRequireDefault = require_interopRequireDefault();
      _Object$defineProperty(exports, "__esModule", {
        value: true
      });
      exports["default"] = void 0;
      var _reduce = _interopRequireDefault(require_reduce4());
      var _map = _interopRequireDefault(require_map4());
      var _indexOf = _interopRequireDefault(require_index_of4());
      var _concat = _interopRequireDefault(require_concat4());
      var _default = exports["default"] = function _default2(XRegExp) {
        var REGEX_DATA = "xregexp";
        var subParts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*\]/g;
        var parts = XRegExp.union([/\({{([\w$]+)}}\)|{{([\w$]+)}}/, subParts], "g", {
          conjunction: "or"
        });
        function deanchor(pattern) {
          var leadingAnchor = /^(?:\(\?:\))*\^/;
          var trailingAnchor = /\$(?:\(\?:\))*$/;
          if (leadingAnchor.test(pattern) && trailingAnchor.test(pattern) && // Ensure that the trailing `$` isn't escaped
          trailingAnchor.test(pattern.replace(/\\[\s\S]/g, ""))) {
            return pattern.replace(leadingAnchor, "").replace(trailingAnchor, "");
          }
          return pattern;
        }
        function asXRegExp(value, addFlagX) {
          var flags = addFlagX ? "x" : "";
          return XRegExp.isRegExp(value) ? value[REGEX_DATA] && value[REGEX_DATA].captureNames ? (
            // Don't recompile, to preserve capture names
            value
          ) : (
            // Recompile as XRegExp
            XRegExp(value.source, flags)
          ) : (
            // Compile string as XRegExp
            XRegExp(value, flags)
          );
        }
        function interpolate(substitution) {
          return substitution instanceof RegExp ? substitution : XRegExp.escape(substitution);
        }
        function reduceToSubpatternsObject(subpatterns, interpolated, subpatternIndex) {
          subpatterns["subpattern".concat(subpatternIndex)] = interpolated;
          return subpatterns;
        }
        function embedSubpatternAfter(raw, subpatternIndex, rawLiterals) {
          var hasSubpattern = subpatternIndex < rawLiterals.length - 1;
          return raw + (hasSubpattern ? "{{subpattern".concat(subpatternIndex, "}}") : "");
        }
        XRegExp.tag = function(flags) {
          return function(literals) {
            var _context, _context2;
            for (var _len = arguments.length, substitutions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              substitutions[_key - 1] = arguments[_key];
            }
            var subpatterns = (0, _reduce["default"])(_context = (0, _map["default"])(substitutions).call(substitutions, interpolate)).call(_context, reduceToSubpatternsObject, {});
            var pattern = (0, _map["default"])(_context2 = literals.raw).call(_context2, embedSubpatternAfter).join("");
            return XRegExp.build(pattern, subpatterns, flags);
          };
        };
        XRegExp.build = function(pattern, subs, flags) {
          flags = flags || "";
          var addFlagX = (0, _indexOf["default"])(flags).call(flags, "x") !== -1;
          var inlineFlags = /^\(\?([\w$]+)\)/.exec(pattern);
          if (inlineFlags) {
            flags = XRegExp._clipDuplicates(flags + inlineFlags[1]);
          }
          var data = {};
          for (var p in subs) {
            if (subs.hasOwnProperty(p)) {
              var sub = asXRegExp(subs[p], addFlagX);
              data[p] = {
                // Deanchoring allows embedding independently useful anchored regexes. If you
                // really need to keep your anchors, double them (i.e., `^^...$$`).
                pattern: deanchor(sub.source),
                names: sub[REGEX_DATA].captureNames || []
              };
            }
          }
          var patternAsRegex = asXRegExp(pattern, addFlagX);
          var numCaps = 0;
          var numPriorCaps;
          var numOuterCaps = 0;
          var outerCapsMap = [0];
          var outerCapNames = patternAsRegex[REGEX_DATA].captureNames || [];
          var output = patternAsRegex.source.replace(parts, function($0, $1, $2, $3, $4) {
            var subName = $1 || $2;
            var capName;
            var intro;
            var localCapIndex;
            if (subName) {
              var _context3;
              if (!data.hasOwnProperty(subName)) {
                throw new ReferenceError("Undefined property ".concat($0));
              }
              if ($1) {
                capName = outerCapNames[numOuterCaps];
                outerCapsMap[++numOuterCaps] = ++numCaps;
                intro = "(?<".concat(capName || subName, ">");
              } else {
                intro = "(?:";
              }
              numPriorCaps = numCaps;
              var rewrittenSubpattern = data[subName].pattern.replace(subParts, function(match, paren, backref) {
                if (paren) {
                  capName = data[subName].names[numCaps - numPriorCaps];
                  ++numCaps;
                  if (capName) {
                    return "(?<".concat(capName, ">");
                  }
                } else if (backref) {
                  localCapIndex = +backref - 1;
                  return data[subName].names[localCapIndex] ? (
                    // Need to preserve the backreference name in case using flag `n`
                    "\\k<".concat(data[subName].names[localCapIndex], ">")
                  ) : "\\".concat(+backref + numPriorCaps);
                }
                return match;
              });
              return (0, _concat["default"])(_context3 = "".concat(intro)).call(_context3, rewrittenSubpattern, ")");
            }
            if ($3) {
              capName = outerCapNames[numOuterCaps];
              outerCapsMap[++numOuterCaps] = ++numCaps;
              if (capName) {
                return "(?<".concat(capName, ">");
              }
            } else if ($4) {
              localCapIndex = +$4 - 1;
              return outerCapNames[localCapIndex] ? (
                // Need to preserve the backreference name in case using flag `n`
                "\\k<".concat(outerCapNames[localCapIndex], ">")
              ) : "\\".concat(outerCapsMap[+$4]);
            }
            return $0;
          });
          return XRegExp(output, flags);
        };
      };
      module.exports = exports.default;
    }
  });

  // node_modules/xregexp/lib/addons/matchrecursive.js
  var require_matchrecursive = __commonJS({
    "node_modules/xregexp/lib/addons/matchrecursive.js"(exports, module) {
      "use strict";
      var _Object$defineProperty = require_define_property3();
      var _interopRequireDefault = require_interopRequireDefault();
      _Object$defineProperty(exports, "__esModule", {
        value: true
      });
      exports["default"] = void 0;
      var _indexOf = _interopRequireDefault(require_index_of4());
      var _concat = _interopRequireDefault(require_concat4());
      var _slice = _interopRequireDefault(require_slice4());
      var _default = exports["default"] = function _default2(XRegExp) {
        function row(name, value, start, end) {
          return {
            name,
            value,
            start,
            end
          };
        }
        XRegExp.matchRecursive = function(str, left, right, flags, options) {
          flags = flags || "";
          options = options || {};
          var global2 = (0, _indexOf["default"])(flags).call(flags, "g") !== -1;
          var sticky = (0, _indexOf["default"])(flags).call(flags, "y") !== -1;
          var basicFlags = flags.replace(/y/g, "");
          left = XRegExp(left, basicFlags);
          right = XRegExp(right, basicFlags);
          var esc;
          var _options = options, escapeChar = _options.escapeChar;
          if (escapeChar) {
            var _context, _context2;
            if (escapeChar.length > 1) {
              throw new Error("Cannot use more than one escape character");
            }
            escapeChar = XRegExp.escape(escapeChar);
            esc = new RegExp(
              (0, _concat["default"])(_context = (0, _concat["default"])(_context2 = "(?:".concat(escapeChar, "[\\S\\s]|(?:(?!")).call(
                _context2,
                // Using `XRegExp.union` safely rewrites backreferences in `left` and `right`.
                // Intentionally not passing `basicFlags` to `XRegExp.union` since any syntax
                // transformation resulting from those flags was already applied to `left` and
                // `right` when they were passed through the XRegExp constructor above.
                XRegExp.union([left, right], "", {
                  conjunction: "or"
                }).source,
                ")[^"
              )).call(_context, escapeChar, "])+)+"),
              // Flags `dgy` not needed here
              flags.replace(XRegExp._hasNativeFlag("s") ? /[^imsu]/g : /[^imu]/g, "")
            );
          }
          var openTokens = 0;
          var delimStart = 0;
          var delimEnd = 0;
          var lastOuterEnd = 0;
          var outerStart;
          var innerStart;
          var leftMatch;
          var rightMatch;
          var vN = options.valueNames;
          var output = [];
          while (true) {
            if (escapeChar) {
              delimEnd += (XRegExp.exec(str, esc, delimEnd, "sticky") || [""])[0].length;
            }
            leftMatch = XRegExp.exec(str, left, delimEnd);
            rightMatch = XRegExp.exec(str, right, delimEnd);
            if (leftMatch && rightMatch) {
              if (leftMatch.index <= rightMatch.index) {
                rightMatch = null;
              } else {
                leftMatch = null;
              }
            }
            if (leftMatch || rightMatch) {
              delimStart = (leftMatch || rightMatch).index;
              delimEnd = delimStart + (leftMatch || rightMatch)[0].length;
            } else if (!openTokens) {
              break;
            }
            if (sticky && !openTokens && delimStart > lastOuterEnd) {
              break;
            }
            if (leftMatch) {
              if (!openTokens) {
                outerStart = delimStart;
                innerStart = delimEnd;
              }
              openTokens += 1;
            } else if (rightMatch && openTokens) {
              openTokens -= 1;
              if (!openTokens) {
                if (vN) {
                  if (vN[0] && outerStart > lastOuterEnd) {
                    output.push(row(vN[0], (0, _slice["default"])(str).call(str, lastOuterEnd, outerStart), lastOuterEnd, outerStart));
                  }
                  if (vN[1]) {
                    output.push(row(vN[1], (0, _slice["default"])(str).call(str, outerStart, innerStart), outerStart, innerStart));
                  }
                  if (vN[2]) {
                    output.push(row(vN[2], (0, _slice["default"])(str).call(str, innerStart, delimStart), innerStart, delimStart));
                  }
                  if (vN[3]) {
                    output.push(row(vN[3], (0, _slice["default"])(str).call(str, delimStart, delimEnd), delimStart, delimEnd));
                  }
                } else {
                  output.push((0, _slice["default"])(str).call(str, innerStart, delimStart));
                }
                lastOuterEnd = delimEnd;
                if (!global2) {
                  break;
                }
              }
            } else {
              var unbalanced = options.unbalanced || "error";
              if (unbalanced === "skip" || unbalanced === "skip-lazy") {
                if (rightMatch) {
                  rightMatch = null;
                } else {
                  if (unbalanced === "skip") {
                    var outerStartDelimLength = XRegExp.exec(str, left, outerStart, "sticky")[0].length;
                    delimEnd = outerStart + (outerStartDelimLength || 1);
                  } else {
                    delimEnd = outerStart + 1;
                  }
                  openTokens = 0;
                }
              } else if (unbalanced === "error") {
                var _context3;
                var delimSide = rightMatch ? "right" : "left";
                var errorPos = rightMatch ? delimStart : outerStart;
                throw new Error((0, _concat["default"])(_context3 = "Unbalanced ".concat(delimSide, " delimiter found in string at position ")).call(_context3, errorPos));
              } else {
                throw new Error("Unsupported value for unbalanced: ".concat(unbalanced));
              }
            }
            if (delimStart === delimEnd) {
              delimEnd += 1;
            }
          }
          if (global2 && output.length > 0 && !sticky && vN && vN[0] && str.length > lastOuterEnd) {
            output.push(row(vN[0], (0, _slice["default"])(str).call(str, lastOuterEnd), lastOuterEnd, str.length));
          }
          return output;
        };
      };
      module.exports = exports.default;
    }
  });

  // node_modules/xregexp/lib/addons/unicode-base.js
  var require_unicode_base = __commonJS({
    "node_modules/xregexp/lib/addons/unicode-base.js"(exports, module) {
      "use strict";
      var _sliceInstanceProperty = require_slice4();
      var _Array$from = require_from3();
      var _Symbol = require_symbol3();
      var _getIteratorMethod = require_get_iterator_method7();
      var _Array$isArray = require_is_array4();
      var _Object$defineProperty = require_define_property3();
      var _interopRequireDefault = require_interopRequireDefault();
      _Object$defineProperty(exports, "__esModule", {
        value: true
      });
      exports["default"] = void 0;
      var _slicedToArray2 = _interopRequireDefault(require_slicedToArray());
      var _forEach = _interopRequireDefault(require_for_each4());
      var _concat = _interopRequireDefault(require_concat4());
      var _indexOf = _interopRequireDefault(require_index_of4());
      function _createForOfIteratorHelper(r, e) {
        var t = "undefined" != typeof _Symbol && _getIteratorMethod(r) || r["@@iterator"];
        if (!t) {
          if (_Array$isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
            t && (r = t);
            var _n = 0, F = function F2() {
            };
            return { s: F, n: function n() {
              return _n >= r.length ? { done: true } : { done: false, value: r[_n++] };
            }, e: function e2(r2) {
              throw r2;
            }, f: F };
          }
          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        var o, a = true, u = false;
        return { s: function s() {
          t = t.call(r);
        }, n: function n() {
          var r2 = t.next();
          return a = r2.done, r2;
        }, e: function e2(r2) {
          u = true, o = r2;
        }, f: function f() {
          try {
            a || null == t["return"] || t["return"]();
          } finally {
            if (u)
              throw o;
          }
        } };
      }
      function _unsupportedIterableToArray(r, a) {
        if (r) {
          var _context4;
          if ("string" == typeof r)
            return _arrayLikeToArray(r, a);
          var t = _sliceInstanceProperty(_context4 = {}.toString.call(r)).call(_context4, 8, -1);
          return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? _Array$from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
        }
      }
      function _arrayLikeToArray(r, a) {
        (null == a || a > r.length) && (a = r.length);
        for (var e = 0, n = Array(a); e < a; e++)
          n[e] = r[e];
        return n;
      }
      var _default = exports["default"] = function _default2(XRegExp) {
        var unicode = {};
        var unicodeTypes = {};
        var dec = XRegExp._dec;
        var hex = XRegExp._hex;
        var pad4 = XRegExp._pad4;
        function normalize(name) {
          return name.replace(/[- _]+/g, "").toLowerCase();
        }
        function charCode(chr) {
          var esc = /^\\[xu](.+)/.exec(chr);
          return esc ? dec(esc[1]) : chr.charCodeAt(chr[0] === "\\" ? 1 : 0);
        }
        function invertBmp(range) {
          var output = "";
          var lastEnd = -1;
          (0, _forEach["default"])(XRegExp).call(XRegExp, range, /(\\x..|\\u....|\\?[\s\S])(?:-(\\x..|\\u....|\\?[\s\S]))?/, function(m) {
            var start = charCode(m[1]);
            if (start > lastEnd + 1) {
              output += "\\u".concat(pad4(hex(lastEnd + 1)));
              if (start > lastEnd + 2) {
                output += "-\\u".concat(pad4(hex(start - 1)));
              }
            }
            lastEnd = charCode(m[2] || m[1]);
          });
          if (lastEnd < 65535) {
            output += "\\u".concat(pad4(hex(lastEnd + 1)));
            if (lastEnd < 65534) {
              output += "-\\uFFFF";
            }
          }
          return output;
        }
        function cacheInvertedBmp(slug) {
          var prop = "b!";
          return unicode[slug][prop] || (unicode[slug][prop] = invertBmp(unicode[slug].bmp));
        }
        function buildAstral(slug, isNegated) {
          var item = unicode[slug];
          var combined = "";
          if (item.bmp && !item.isBmpLast) {
            var _context;
            combined = (0, _concat["default"])(_context = "[".concat(item.bmp, "]")).call(_context, item.astral ? "|" : "");
          }
          if (item.astral) {
            combined += item.astral;
          }
          if (item.isBmpLast && item.bmp) {
            var _context2;
            combined += (0, _concat["default"])(_context2 = "".concat(item.astral ? "|" : "", "[")).call(_context2, item.bmp, "]");
          }
          return isNegated ? "(?:(?!".concat(combined, ")(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[\0-\uFFFF]))") : "(?:".concat(combined, ")");
        }
        function cacheAstral(slug, isNegated) {
          var prop = isNegated ? "a!" : "a=";
          return unicode[slug][prop] || (unicode[slug][prop] = buildAstral(slug, isNegated));
        }
        XRegExp.addToken(
          // Use `*` instead of `+` to avoid capturing `^` as the token name in `\p{^}`
          /\\([pP])(?:{(\^?)(?:(\w+)=)?([^}]*)}|([A-Za-z]))/,
          function(match, scope, flags) {
            var ERR_DOUBLE_NEG = "Invalid double negation ";
            var ERR_UNKNOWN_NAME = "Unknown Unicode token ";
            var ERR_UNKNOWN_REF = "Unicode token missing data ";
            var ERR_ASTRAL_ONLY = "Astral mode required for Unicode token ";
            var ERR_ASTRAL_IN_CLASS = "Astral mode does not support Unicode tokens within character classes";
            var _match = (0, _slicedToArray2["default"])(match, 6), fullToken = _match[0], pPrefix = _match[1], caretNegation = _match[2], typePrefix = _match[3], tokenName = _match[4], tokenSingleCharName = _match[5];
            var isNegated = pPrefix === "P" || !!caretNegation;
            var isAstralMode = (0, _indexOf["default"])(flags).call(flags, "A") !== -1;
            var slug = normalize(tokenSingleCharName || tokenName);
            var item = unicode[slug];
            if (pPrefix === "P" && caretNegation) {
              throw new SyntaxError(ERR_DOUBLE_NEG + fullToken);
            }
            if (!unicode.hasOwnProperty(slug)) {
              throw new SyntaxError(ERR_UNKNOWN_NAME + fullToken);
            }
            if (typePrefix) {
              if (!(unicodeTypes[typePrefix] && unicodeTypes[typePrefix][slug])) {
                throw new SyntaxError(ERR_UNKNOWN_NAME + fullToken);
              }
            }
            if (item.inverseOf) {
              slug = normalize(item.inverseOf);
              if (!unicode.hasOwnProperty(slug)) {
                var _context3;
                throw new ReferenceError((0, _concat["default"])(_context3 = "".concat(ERR_UNKNOWN_REF + fullToken, " -> ")).call(_context3, item.inverseOf));
              }
              item = unicode[slug];
              isNegated = !isNegated;
            }
            if (!(item.bmp || isAstralMode)) {
              throw new SyntaxError(ERR_ASTRAL_ONLY + fullToken);
            }
            if (isAstralMode) {
              if (scope === "class") {
                throw new SyntaxError(ERR_ASTRAL_IN_CLASS);
              }
              return cacheAstral(slug, isNegated);
            }
            return scope === "class" ? isNegated ? cacheInvertedBmp(slug) : item.bmp : "".concat((isNegated ? "[^" : "[") + item.bmp, "]");
          },
          {
            scope: "all",
            optionalFlags: "A",
            leadChar: "\\"
          }
        );
        XRegExp.addUnicodeData = function(data, typePrefix) {
          var ERR_NO_NAME = "Unicode token requires name";
          var ERR_NO_DATA = "Unicode token has no character data ";
          if (typePrefix) {
            unicodeTypes[typePrefix] = {};
          }
          var _iterator = _createForOfIteratorHelper(data), _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
              var item = _step.value;
              if (!item.name) {
                throw new Error(ERR_NO_NAME);
              }
              if (!(item.inverseOf || item.bmp || item.astral)) {
                throw new Error(ERR_NO_DATA + item.name);
              }
              var normalizedName = normalize(item.name);
              unicode[normalizedName] = item;
              if (typePrefix) {
                unicodeTypes[typePrefix][normalizedName] = true;
              }
              if (item.alias) {
                var normalizedAlias = normalize(item.alias);
                unicode[normalizedAlias] = item;
                if (typePrefix) {
                  unicodeTypes[typePrefix][normalizedAlias] = true;
                }
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          XRegExp.cache.flush("patterns");
        };
        XRegExp._getUnicodeProperty = function(name) {
          var slug = normalize(name);
          return unicode[slug];
        };
      };
      module.exports = exports.default;
    }
  });

  // node_modules/xregexp/tools/output/categories.js
  var require_categories = __commonJS({
    "node_modules/xregexp/tools/output/categories.js"(exports, module) {
      module.exports = [
        {
          "name": "C",
          "alias": "Other",
          "isBmpLast": true,
          "bmp": "\0-\x7F-\x9F\xAD\u0378\u0379\u0380-\u0383\u038B\u038D\u03A2\u0530\u0557\u0558\u058B\u058C\u0590\u05C8-\u05CF\u05EB-\u05EE\u05F5-\u0605\u061C\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB\u07FC\u082E\u082F\u083F\u085C\u085D\u085F\u086B-\u086F\u088F-\u0897\u08E2\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A77-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B54\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0BFF\u0C0D\u0C11\u0C29\u0C3A\u0C3B\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B\u0C5C\u0C5E\u0C5F\u0C64\u0C65\u0C70-\u0C76\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDC\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0CFF\u0D0D\u0D11\u0D45\u0D49\u0D50-\u0D53\u0D64\u0D65\u0D80\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F6\u13F7\u13FE\u13FF\u169D-\u169F\u16F9-\u16FF\u1716-\u171E\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180E\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE\u1AAF\u1ACF-\u1AFF\u1B4D-\u1B4F\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C89-\u1C8F\u1CBB\u1CBC\u1CC8-\u1CCF\u1CFB-\u1CFF\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20C1-\u20CF\u20F1-\u20FF\u218C-\u218F\u2427-\u243F\u244B-\u245F\u2B74\u2B75\u2B96\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E5E-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u3130\u318F\u31E4-\u31EF\u321F\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA6F8-\uA6FF\uA7CB-\uA7CF\uA7D2\uA7D4\uA7DA-\uA7F1\uA82D-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C6-\uA8CD\uA8DA-\uA8DF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB6C-\uAB6F\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC3-\uFBD2\uFD90\uFD91\uFDC8-\uFDCE\uFDD0-\uFDEF\uFE1A-\uFE1F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF",
          "astral": "\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDCFF\uDD03-\uDD06\uDD34-\uDD36\uDD8F\uDD9D-\uDD9F\uDDA1-\uDDCF\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEFC-\uDEFF\uDF24-\uDF2C\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDFC4-\uDFC7\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDD6E\uDD7B\uDD8B\uDD93\uDD96\uDDA2\uDDB2\uDDBA\uDDBD-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDF7F\uDF86\uDFB1\uDFBB-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC9F-\uDCA6\uDCB0-\uDCDF\uDCF3\uDCF6-\uDCFA\uDD1C-\uDD1E\uDD3A-\uDD3E\uDD40-\uDD7F\uDDB8-\uDDBB\uDDD0\uDDD1\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE36\uDE37\uDE3B-\uDE3E\uDE49-\uDE4F\uDE59-\uDE5F\uDEA0-\uDEBF\uDEE7-\uDEEA\uDEF7-\uDEFF\uDF36-\uDF38\uDF56\uDF57\uDF73-\uDF77\uDF92-\uDF98\uDF9D-\uDFA8\uDFB0-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCF9\uDD28-\uDD2F\uDD3A-\uDE5F\uDE7F\uDEAA\uDEAE\uDEAF\uDEB2-\uDEFF\uDF28-\uDF2F\uDF5A-\uDF6F\uDF8A-\uDFAF\uDFCC-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC4E-\uDC51\uDC76-\uDC7E\uDCBD\uDCC3-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD48-\uDD4F\uDD77-\uDD7F\uDDE0\uDDF5-\uDDFF\uDE12\uDE3F-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEAA-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC5C\uDC62-\uDC7F\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDDE-\uDDFF\uDE45-\uDE4F\uDE5A-\uDE5F\uDE6D-\uDE7F\uDEBA-\uDEBF\uDECA-\uDEFF\uDF1B\uDF1C\uDF2C-\uDF2F\uDF47-\uDFFF]|\uD806[\uDC3C-\uDC9F\uDCF3-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD36\uDD39\uDD3A\uDD47-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD8\uDDD9\uDDE5-\uDDFF\uDE48-\uDE4F\uDEA3-\uDEAF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC37\uDC46-\uDC4F\uDC6D-\uDC6F\uDC90\uDC91\uDCA8\uDCB7-\uDCFF\uDD07\uDD0A\uDD37-\uDD39\uDD3B\uDD3E\uDD48-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8F\uDD92\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF9-\uDFAF\uDFB1-\uDFBF\uDFF2-\uDFFE]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F\uDC75-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80E-\uD810\uD812-\uD819\uD824-\uD82A\uD82D\uD82E\uD830-\uD832\uD83F\uD87B-\uD87D\uD87F\uD885-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD80B[\uDC00-\uDF8F\uDFF3-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDE6D\uDEBF\uDECA-\uDECF\uDEEE\uDEEF\uDEF6-\uDEFF\uDF46-\uDF4F\uDF5A\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE9B-\uDEFF\uDF4B-\uDF4E\uDF88-\uDF8E\uDFA0-\uDFDF\uDFE5-\uDFEF\uDFF2-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFF\uDD09-\uDFFF]|\uD82B[\uDC00-\uDFEF\uDFF4\uDFFC\uDFFF]|\uD82C[\uDD23-\uDD4F\uDD53-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A\uDC9B\uDCA0-\uDFFF]|\uD833[\uDC00-\uDEFF\uDF2E\uDF2F\uDF47-\uDF4F\uDFC4-\uDFFF]|\uD834[\uDCF6-\uDCFF\uDD27\uDD28\uDD73-\uDD7A\uDDEB-\uDDFF\uDE46-\uDEDF\uDEF4-\uDEFF\uDF57-\uDF5F\uDF79-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]|\uD836[\uDE8C-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD837[\uDC00-\uDEFF\uDF1F-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDCFF\uDD2D-\uDD2F\uDD3E\uDD3F\uDD4A-\uDD4D\uDD50-\uDE8F\uDEAF-\uDEBF\uDEFA-\uDEFE\uDF00-\uDFFF]|\uD839[\uDC00-\uDFDF\uDFE7\uDFEC\uDFEF\uDFFF]|\uD83A[\uDCC5\uDCC6\uDCD7-\uDCFF\uDD4C-\uDD4F\uDD5A-\uDD5D\uDD60-\uDFFF]|\uD83B[\uDC00-\uDC70\uDCB5-\uDD00\uDD3E-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDEEF\uDEF2-\uDFFF]|\uD83C[\uDC2C-\uDC2F\uDC94-\uDC9F\uDCAF\uDCB0\uDCC0\uDCD0\uDCF6-\uDCFF\uDDAE-\uDDE5\uDE03-\uDE0F\uDE3C-\uDE3F\uDE49-\uDE4F\uDE52-\uDE5F\uDE66-\uDEFF]|\uD83D[\uDED8-\uDEDC\uDEED-\uDEEF\uDEFD-\uDEFF\uDF74-\uDF7F\uDFD9-\uDFDF\uDFEC-\uDFEF\uDFF1-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE\uDCAF\uDCB2-\uDCFF\uDE54-\uDE5F\uDE6E\uDE6F\uDE75-\uDE77\uDE7D-\uDE7F\uDE87-\uDE8F\uDEAD-\uDEAF\uDEBB-\uDEBF\uDEC6-\uDECF\uDEDA-\uDEDF\uDEE8-\uDEEF\uDEF7-\uDEFF\uDF93\uDFCB-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEE0-\uDEFF]|\uD86D[\uDF39-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]"
        },
        {
          "name": "Cc",
          "alias": "Control",
          "bmp": "\0-\x7F-\x9F"
        },
        {
          "name": "Cf",
          "alias": "Format",
          "bmp": "\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB",
          "astral": "\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC38]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]"
        },
        {
          "name": "Cn",
          "alias": "Unassigned",
          "bmp": "\u0378\u0379\u0380-\u0383\u038B\u038D\u03A2\u0530\u0557\u0558\u058B\u058C\u0590\u05C8-\u05CF\u05EB-\u05EE\u05F5-\u05FF\u070E\u074B\u074C\u07B2-\u07BF\u07FB\u07FC\u082E\u082F\u083F\u085C\u085D\u085F\u086B-\u086F\u088F\u0892-\u0897\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A77-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B54\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0BFF\u0C0D\u0C11\u0C29\u0C3A\u0C3B\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B\u0C5C\u0C5E\u0C5F\u0C64\u0C65\u0C70-\u0C76\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDC\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0CFF\u0D0D\u0D11\u0D45\u0D49\u0D50-\u0D53\u0D64\u0D65\u0D80\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F6\u13F7\u13FE\u13FF\u169D-\u169F\u16F9-\u16FF\u1716-\u171E\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE\u1AAF\u1ACF-\u1AFF\u1B4D-\u1B4F\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C89-\u1C8F\u1CBB\u1CBC\u1CC8-\u1CCF\u1CFB-\u1CFF\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u2065\u2072\u2073\u208F\u209D-\u209F\u20C1-\u20CF\u20F1-\u20FF\u218C-\u218F\u2427-\u243F\u244B-\u245F\u2B74\u2B75\u2B96\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E5E-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u3130\u318F\u31E4-\u31EF\u321F\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA6F8-\uA6FF\uA7CB-\uA7CF\uA7D2\uA7D4\uA7DA-\uA7F1\uA82D-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C6-\uA8CD\uA8DA-\uA8DF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB6C-\uAB6F\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC3-\uFBD2\uFD90\uFD91\uFDC8-\uFDCE\uFDD0-\uFDEF\uFE1A-\uFE1F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD\uFEFE\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFF8\uFFFE\uFFFF",
          "astral": "\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDCFF\uDD03-\uDD06\uDD34-\uDD36\uDD8F\uDD9D-\uDD9F\uDDA1-\uDDCF\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEFC-\uDEFF\uDF24-\uDF2C\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDFC4-\uDFC7\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDD6E\uDD7B\uDD8B\uDD93\uDD96\uDDA2\uDDB2\uDDBA\uDDBD-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDF7F\uDF86\uDFB1\uDFBB-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC9F-\uDCA6\uDCB0-\uDCDF\uDCF3\uDCF6-\uDCFA\uDD1C-\uDD1E\uDD3A-\uDD3E\uDD40-\uDD7F\uDDB8-\uDDBB\uDDD0\uDDD1\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE36\uDE37\uDE3B-\uDE3E\uDE49-\uDE4F\uDE59-\uDE5F\uDEA0-\uDEBF\uDEE7-\uDEEA\uDEF7-\uDEFF\uDF36-\uDF38\uDF56\uDF57\uDF73-\uDF77\uDF92-\uDF98\uDF9D-\uDFA8\uDFB0-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCF9\uDD28-\uDD2F\uDD3A-\uDE5F\uDE7F\uDEAA\uDEAE\uDEAF\uDEB2-\uDEFF\uDF28-\uDF2F\uDF5A-\uDF6F\uDF8A-\uDFAF\uDFCC-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC4E-\uDC51\uDC76-\uDC7E\uDCC3-\uDCCC\uDCCE\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD48-\uDD4F\uDD77-\uDD7F\uDDE0\uDDF5-\uDDFF\uDE12\uDE3F-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEAA-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC5C\uDC62-\uDC7F\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDDE-\uDDFF\uDE45-\uDE4F\uDE5A-\uDE5F\uDE6D-\uDE7F\uDEBA-\uDEBF\uDECA-\uDEFF\uDF1B\uDF1C\uDF2C-\uDF2F\uDF47-\uDFFF]|\uD806[\uDC3C-\uDC9F\uDCF3-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD36\uDD39\uDD3A\uDD47-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD8\uDDD9\uDDE5-\uDDFF\uDE48-\uDE4F\uDEA3-\uDEAF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC37\uDC46-\uDC4F\uDC6D-\uDC6F\uDC90\uDC91\uDCA8\uDCB7-\uDCFF\uDD07\uDD0A\uDD37-\uDD39\uDD3B\uDD3E\uDD48-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8F\uDD92\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF9-\uDFAF\uDFB1-\uDFBF\uDFF2-\uDFFE]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F\uDC75-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80E-\uD810\uD812-\uD819\uD824-\uD82A\uD82D\uD82E\uD830-\uD832\uD83F\uD87B-\uD87D\uD87F\uD885-\uDB3F\uDB41-\uDB7F][\uDC00-\uDFFF]|\uD80B[\uDC00-\uDF8F\uDFF3-\uDFFF]|\uD80D[\uDC2F\uDC39-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDE6D\uDEBF\uDECA-\uDECF\uDEEE\uDEEF\uDEF6-\uDEFF\uDF46-\uDF4F\uDF5A\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE9B-\uDEFF\uDF4B-\uDF4E\uDF88-\uDF8E\uDFA0-\uDFDF\uDFE5-\uDFEF\uDFF2-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFF\uDD09-\uDFFF]|\uD82B[\uDC00-\uDFEF\uDFF4\uDFFC\uDFFF]|\uD82C[\uDD23-\uDD4F\uDD53-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A\uDC9B\uDCA4-\uDFFF]|\uD833[\uDC00-\uDEFF\uDF2E\uDF2F\uDF47-\uDF4F\uDFC4-\uDFFF]|\uD834[\uDCF6-\uDCFF\uDD27\uDD28\uDDEB-\uDDFF\uDE46-\uDEDF\uDEF4-\uDEFF\uDF57-\uDF5F\uDF79-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]|\uD836[\uDE8C-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD837[\uDC00-\uDEFF\uDF1F-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDCFF\uDD2D-\uDD2F\uDD3E\uDD3F\uDD4A-\uDD4D\uDD50-\uDE8F\uDEAF-\uDEBF\uDEFA-\uDEFE\uDF00-\uDFFF]|\uD839[\uDC00-\uDFDF\uDFE7\uDFEC\uDFEF\uDFFF]|\uD83A[\uDCC5\uDCC6\uDCD7-\uDCFF\uDD4C-\uDD4F\uDD5A-\uDD5D\uDD60-\uDFFF]|\uD83B[\uDC00-\uDC70\uDCB5-\uDD00\uDD3E-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDEEF\uDEF2-\uDFFF]|\uD83C[\uDC2C-\uDC2F\uDC94-\uDC9F\uDCAF\uDCB0\uDCC0\uDCD0\uDCF6-\uDCFF\uDDAE-\uDDE5\uDE03-\uDE0F\uDE3C-\uDE3F\uDE49-\uDE4F\uDE52-\uDE5F\uDE66-\uDEFF]|\uD83D[\uDED8-\uDEDC\uDEED-\uDEEF\uDEFD-\uDEFF\uDF74-\uDF7F\uDFD9-\uDFDF\uDFEC-\uDFEF\uDFF1-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE\uDCAF\uDCB2-\uDCFF\uDE54-\uDE5F\uDE6E\uDE6F\uDE75-\uDE77\uDE7D-\uDE7F\uDE87-\uDE8F\uDEAD-\uDEAF\uDEBB-\uDEBF\uDEC6-\uDECF\uDEDA-\uDEDF\uDEE8-\uDEEF\uDEF7-\uDEFF\uDF93\uDFCB-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEE0-\uDEFF]|\uD86D[\uDF39-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDFFF]|\uDB40[\uDC00\uDC02-\uDC1F\uDC80-\uDCFF\uDDF0-\uDFFF]|[\uDBBF\uDBFF][\uDFFE\uDFFF]"
        },
        {
          "name": "Co",
          "alias": "Private_Use",
          "bmp": "\uE000-\uF8FF",
          "astral": "[\uDB80-\uDBBE\uDBC0-\uDBFE][\uDC00-\uDFFF]|[\uDBBF\uDBFF][\uDC00-\uDFFD]"
        },
        {
          "name": "Cs",
          "alias": "Surrogate",
          "bmp": "\uD800-\uDFFF"
        },
        {
          "name": "L",
          "alias": "Letter",
          "bmp": "A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC",
          "astral": "\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A]"
        },
        {
          "name": "LC",
          "alias": "Cased_Letter",
          "bmp": "A-Za-z\xB5\xC0-\xD6\xD8-\xF6\xF8-\u01BA\u01BC-\u01BF\u01C4-\u0293\u0295-\u02AF\u0370-\u0373\u0376\u0377\u037B-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0560-\u0588\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FD-\u10FF\u13A0-\u13F5\u13F8-\u13FD\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2134\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C7B\u2C7E-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA640-\uA66D\uA680-\uA69B\uA722-\uA76F\uA771-\uA787\uA78B-\uA78E\uA790-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F5\uA7F6\uA7FA\uAB30-\uAB5A\uAB60-\uAB68\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF21-\uFF3A\uFF41-\uFF5A",
          "astral": "\uD801[\uDC00-\uDC4F\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC]|\uD803[\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD806[\uDCA0-\uDCDF]|\uD81B[\uDE40-\uDE7F]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF09\uDF0B-\uDF1E]|\uD83A[\uDD00-\uDD43]"
        },
        {
          "name": "Ll",
          "alias": "Lowercase_Letter",
          "bmp": "a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0560-\u0588\u10D0-\u10FA\u10FD-\u10FF\u13F8-\u13FD\u1C80-\u1C88\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5F\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7AF\uA7B5\uA7B7\uA7B9\uA7BB\uA7BD\uA7BF\uA7C1\uA7C3\uA7C8\uA7CA\uA7D1\uA7D3\uA7D5\uA7D7\uA7D9\uA7F6\uA7FA\uAB30-\uAB5A\uAB60-\uAB68\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A",
          "astral": "\uD801[\uDC28-\uDC4F\uDCD8-\uDCFB\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC]|\uD803[\uDCC0-\uDCF2]|\uD806[\uDCC0-\uDCDF]|\uD81B[\uDE60-\uDE7F]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD837[\uDF00-\uDF09\uDF0B-\uDF1E]|\uD83A[\uDD22-\uDD43]"
        },
        {
          "name": "Lm",
          "alias": "Modifier_Letter",
          "bmp": "\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u08C9\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA69C\uA69D\uA717-\uA71F\uA770\uA788\uA7F2-\uA7F4\uA7F8\uA7F9\uA9CF\uA9E6\uAA70\uAADD\uAAF3\uAAF4\uAB5C-\uAB5F\uAB69\uFF70\uFF9E\uFF9F",
          "astral": "\uD801[\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD81A[\uDF40-\uDF43]|\uD81B[\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD838[\uDD37-\uDD3D]|\u{1E94B}"
        },
        {
          "name": "Lo",
          "alias": "Other_Letter",
          "bmp": "\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05EF-\u05F2\u0620-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C8\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1100-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A\uA62B\uA66E\uA6A0-\uA6E5\uA78F\uA7F7\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC",
          "astral": "\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC50-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF4A\uDF50]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\u{1DF0A}|\uD838[\uDD00-\uDD2C\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A]"
        },
        {
          "name": "Lt",
          "alias": "Titlecase_Letter",
          "bmp": "\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC"
        },
        {
          "name": "Lu",
          "alias": "Uppercase_Letter",
          "bmp": "A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1C90-\u1CBA\u1CBD-\u1CBF\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2F\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AE\uA7B0-\uA7B4\uA7B6\uA7B8\uA7BA\uA7BC\uA7BE\uA7C0\uA7C2\uA7C4-\uA7C7\uA7C9\uA7D0\uA7D6\uA7D8\uA7F5\uFF21-\uFF3A",
          "astral": "\uD801[\uDC00-\uDC27\uDCB0-\uDCD3\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95]|\uD803[\uDC80-\uDCB2]|\uD806[\uDCA0-\uDCBF]|\uD81B[\uDE40-\uDE5F]|\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]|\uD83A[\uDD00-\uDD21]"
        },
        {
          "name": "M",
          "alias": "Mark",
          "bmp": "\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F",
          "astral": "\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC82\uDCB0-\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD34\uDD45\uDD46\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDDC9-\uDDCC\uDDCE\uDDCF\uDE2C-\uDE37\uDE3E\uDEDF-\uDEEA\uDF00-\uDF03\uDF3B\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC35-\uDC46\uDC5E\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDDDC\uDDDD\uDE30-\uDE40\uDEAB-\uDEB7\uDF1D-\uDF2B]|\uD806[\uDC2C-\uDC3A\uDD30-\uDD35\uDD37\uDD38\uDD3B-\uDD3E\uDD40\uDD42\uDD43\uDDD1-\uDDD7\uDDDA-\uDDE0\uDDE4\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE3E\uDE47\uDE51-\uDE5B\uDE8A-\uDE99]|\uD807[\uDC2F-\uDC36\uDC38-\uDC3F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD8A-\uDD8E\uDD90\uDD91\uDD93-\uDD97\uDEF3-\uDEF6]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF51-\uDF87\uDF8F-\uDF92\uDFE4\uDFF0\uDFF1]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uDB40[\uDD00-\uDDEF]"
        },
        {
          "name": "Mc",
          "alias": "Spacing_Mark",
          "bmp": "\u0903\u093B\u093E-\u0940\u0949-\u094C\u094E\u094F\u0982\u0983\u09BE-\u09C0\u09C7\u09C8\u09CB\u09CC\u09D7\u0A03\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB\u0ACC\u0B02\u0B03\u0B3E\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0B57\u0BBE\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD7\u0C01-\u0C03\u0C41-\u0C44\u0C82\u0C83\u0CBE\u0CC0-\u0CC4\u0CC7\u0CC8\u0CCA\u0CCB\u0CD5\u0CD6\u0D02\u0D03\u0D3E-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D57\u0D82\u0D83\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DF2\u0DF3\u0F3E\u0F3F\u0F7F\u102B\u102C\u1031\u1038\u103B\u103C\u1056\u1057\u1062-\u1064\u1067-\u106D\u1083\u1084\u1087-\u108C\u108F\u109A-\u109C\u1715\u1734\u17B6\u17BE-\u17C5\u17C7\u17C8\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1A19\u1A1A\u1A55\u1A57\u1A61\u1A63\u1A64\u1A6D-\u1A72\u1B04\u1B35\u1B3B\u1B3D-\u1B41\u1B43\u1B44\u1B82\u1BA1\u1BA6\u1BA7\u1BAA\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1C24-\u1C2B\u1C34\u1C35\u1CE1\u1CF7\u302E\u302F\uA823\uA824\uA827\uA880\uA881\uA8B4-\uA8C3\uA952\uA953\uA983\uA9B4\uA9B5\uA9BA\uA9BB\uA9BE-\uA9C0\uAA2F\uAA30\uAA33\uAA34\uAA4D\uAA7B\uAA7D\uAAEB\uAAEE\uAAEF\uAAF5\uABE3\uABE4\uABE6\uABE7\uABE9\uABEA\uABEC",
          "astral": "\uD804[\uDC00\uDC02\uDC82\uDCB0-\uDCB2\uDCB7\uDCB8\uDD2C\uDD45\uDD46\uDD82\uDDB3-\uDDB5\uDDBF\uDDC0\uDDCE\uDE2C-\uDE2E\uDE32\uDE33\uDE35\uDEE0-\uDEE2\uDF02\uDF03\uDF3E\uDF3F\uDF41-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63]|\uD805[\uDC35-\uDC37\uDC40\uDC41\uDC45\uDCB0-\uDCB2\uDCB9\uDCBB-\uDCBE\uDCC1\uDDAF-\uDDB1\uDDB8-\uDDBB\uDDBE\uDE30-\uDE32\uDE3B\uDE3C\uDE3E\uDEAC\uDEAE\uDEAF\uDEB6\uDF20\uDF21\uDF26]|\uD806[\uDC2C-\uDC2E\uDC38\uDD30-\uDD35\uDD37\uDD38\uDD3D\uDD40\uDD42\uDDD1-\uDDD3\uDDDC-\uDDDF\uDDE4\uDE39\uDE57\uDE58\uDE97]|\uD807[\uDC2F\uDC3E\uDCA9\uDCB1\uDCB4\uDD8A-\uDD8E\uDD93\uDD94\uDD96\uDEF5\uDEF6]|\uD81B[\uDF51-\uDF87\uDFF0\uDFF1]|\uD834[\uDD65\uDD66\uDD6D-\uDD72]"
        },
        {
          "name": "Me",
          "alias": "Enclosing_Mark",
          "bmp": "\u0488\u0489\u1ABE\u20DD-\u20E0\u20E2-\u20E4\uA670-\uA672"
        },
        {
          "name": "Mn",
          "alias": "Nonspacing_Mark",
          "bmp": "\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B55\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0D81\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABD\u1ABF-\u1ACE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F",
          "astral": "\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDEAB\uDEAC\uDF46-\uDF50\uDF82-\uDF85]|\uD804[\uDC01\uDC38-\uDC46\uDC70\uDC73\uDC74\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDCC2\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDDCF\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF40\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB3-\uDCB8\uDCBA\uDCBF\uDCC0\uDCC2\uDCC3\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDD3B\uDD3C\uDD3E\uDD43\uDDD4-\uDDD7\uDDDA\uDDDB\uDDE0\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF8F-\uDF92\uDFE4]|\uD82F[\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD67-\uDD69\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDD30-\uDD36\uDEAE\uDEEC-\uDEEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uDB40[\uDD00-\uDDEF]"
        },
        {
          "name": "N",
          "alias": "Number",
          "bmp": "0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D58-\u0D5E\u0D66-\u0D78\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19",
          "astral": "\uD800[\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDEE1-\uDEFB\uDF20-\uDF23\uDF41\uDF4A\uDFD1-\uDFD5]|\uD801[\uDCA0-\uDCA9]|\uD802[\uDC58-\uDC5F\uDC79-\uDC7F\uDCA7-\uDCAF\uDCFB-\uDCFF\uDD16-\uDD1B\uDDBC\uDDBD\uDDC0-\uDDCF\uDDD2-\uDDFF\uDE40-\uDE48\uDE7D\uDE7E\uDE9D-\uDE9F\uDEEB-\uDEEF\uDF58-\uDF5F\uDF78-\uDF7F\uDFA9-\uDFAF]|\uD803[\uDCFA-\uDCFF\uDD30-\uDD39\uDE60-\uDE7E\uDF1D-\uDF26\uDF51-\uDF54\uDFC5-\uDFCB]|\uD804[\uDC52-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9\uDDE1-\uDDF4\uDEF0-\uDEF9]|\uD805[\uDC50-\uDC59\uDCD0-\uDCD9\uDE50-\uDE59\uDEC0-\uDEC9\uDF30-\uDF3B]|\uD806[\uDCE0-\uDCF2\uDD50-\uDD59]|\uD807[\uDC50-\uDC6C\uDD50-\uDD59\uDDA0-\uDDA9\uDFC0-\uDFD4]|\uD809[\uDC00-\uDC6E]|\uD81A[\uDE60-\uDE69\uDEC0-\uDEC9\uDF50-\uDF59\uDF5B-\uDF61]|\uD81B[\uDE80-\uDE96]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDFCE-\uDFFF]|\uD838[\uDD40-\uDD49\uDEF0-\uDEF9]|\uD83A[\uDCC7-\uDCCF\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]"
        },
        {
          "name": "Nd",
          "alias": "Decimal_Number",
          "bmp": "0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19",
          "astral": "\uD801[\uDCA0-\uDCA9]|\uD803[\uDD30-\uDD39]|\uD804[\uDC66-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9\uDEF0-\uDEF9]|\uD805[\uDC50-\uDC59\uDCD0-\uDCD9\uDE50-\uDE59\uDEC0-\uDEC9\uDF30-\uDF39]|\uD806[\uDCE0-\uDCE9\uDD50-\uDD59]|\uD807[\uDC50-\uDC59\uDD50-\uDD59\uDDA0-\uDDA9]|\uD81A[\uDE60-\uDE69\uDEC0-\uDEC9\uDF50-\uDF59]|\uD835[\uDFCE-\uDFFF]|\uD838[\uDD40-\uDD49\uDEF0-\uDEF9]|\uD83A[\uDD50-\uDD59]|\uD83E[\uDFF0-\uDFF9]"
        },
        {
          "name": "Nl",
          "alias": "Letter_Number",
          "bmp": "\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF",
          "astral": "\uD800[\uDD40-\uDD74\uDF41\uDF4A\uDFD1-\uDFD5]|\uD809[\uDC00-\uDC6E]"
        },
        {
          "name": "No",
          "alias": "Other_Number",
          "bmp": "\xB2\xB3\xB9\xBC-\xBE\u09F4-\u09F9\u0B72-\u0B77\u0BF0-\u0BF2\u0C78-\u0C7E\u0D58-\u0D5E\u0D70-\u0D78\u0F2A-\u0F33\u1369-\u137C\u17F0-\u17F9\u19DA\u2070\u2074-\u2079\u2080-\u2089\u2150-\u215F\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA830-\uA835",
          "astral": "\uD800[\uDD07-\uDD33\uDD75-\uDD78\uDD8A\uDD8B\uDEE1-\uDEFB\uDF20-\uDF23]|\uD802[\uDC58-\uDC5F\uDC79-\uDC7F\uDCA7-\uDCAF\uDCFB-\uDCFF\uDD16-\uDD1B\uDDBC\uDDBD\uDDC0-\uDDCF\uDDD2-\uDDFF\uDE40-\uDE48\uDE7D\uDE7E\uDE9D-\uDE9F\uDEEB-\uDEEF\uDF58-\uDF5F\uDF78-\uDF7F\uDFA9-\uDFAF]|\uD803[\uDCFA-\uDCFF\uDE60-\uDE7E\uDF1D-\uDF26\uDF51-\uDF54\uDFC5-\uDFCB]|\uD804[\uDC52-\uDC65\uDDE1-\uDDF4]|\uD805[\uDF3A\uDF3B]|\uD806[\uDCEA-\uDCF2]|\uD807[\uDC5A-\uDC6C\uDFC0-\uDFD4]|\uD81A[\uDF5B-\uDF61]|\uD81B[\uDE80-\uDE96]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD83A[\uDCC7-\uDCCF]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D]|\uD83C[\uDD00-\uDD0C]"
        },
        {
          "name": "P",
          "alias": "Punctuation",
          "bmp": "!-#%-\\*,-\\/:;\\?@\\[-\\]_\\{\\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65",
          "astral": "\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\u{1056F}|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\u{1BC9F}|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]"
        },
        {
          "name": "Pc",
          "alias": "Connector_Punctuation",
          "bmp": "_\u203F\u2040\u2054\uFE33\uFE34\uFE4D-\uFE4F\uFF3F"
        },
        {
          "name": "Pd",
          "alias": "Dash_Punctuation",
          "bmp": "\\-\u058A\u05BE\u1400\u1806\u2010-\u2015\u2E17\u2E1A\u2E3A\u2E3B\u2E40\u2E5D\u301C\u3030\u30A0\uFE31\uFE32\uFE58\uFE63\uFF0D",
          "astral": "\u{10EAD}"
        },
        {
          "name": "Pe",
          "alias": "Close_Punctuation",
          "bmp": "\\)\\]\\}\u0F3B\u0F3D\u169C\u2046\u207E\u208E\u2309\u230B\u232A\u2769\u276B\u276D\u276F\u2771\u2773\u2775\u27C6\u27E7\u27E9\u27EB\u27ED\u27EF\u2984\u2986\u2988\u298A\u298C\u298E\u2990\u2992\u2994\u2996\u2998\u29D9\u29DB\u29FD\u2E23\u2E25\u2E27\u2E29\u2E56\u2E58\u2E5A\u2E5C\u3009\u300B\u300D\u300F\u3011\u3015\u3017\u3019\u301B\u301E\u301F\uFD3E\uFE18\uFE36\uFE38\uFE3A\uFE3C\uFE3E\uFE40\uFE42\uFE44\uFE48\uFE5A\uFE5C\uFE5E\uFF09\uFF3D\uFF5D\uFF60\uFF63"
        },
        {
          "name": "Pf",
          "alias": "Final_Punctuation",
          "bmp": "\xBB\u2019\u201D\u203A\u2E03\u2E05\u2E0A\u2E0D\u2E1D\u2E21"
        },
        {
          "name": "Pi",
          "alias": "Initial_Punctuation",
          "bmp": "\xAB\u2018\u201B\u201C\u201F\u2039\u2E02\u2E04\u2E09\u2E0C\u2E1C\u2E20"
        },
        {
          "name": "Po",
          "alias": "Other_Punctuation",
          "bmp": "!-#%-'\\*,\\.\\/:;\\?@\\\xA1\xA7\xB6\xB7\xBF\u037E\u0387\u055A-\u055F\u0589\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u166E\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u1805\u1807-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2016\u2017\u2020-\u2027\u2030-\u2038\u203B-\u203E\u2041-\u2043\u2047-\u2051\u2053\u2055-\u205E\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00\u2E01\u2E06-\u2E08\u2E0B\u2E0E-\u2E16\u2E18\u2E19\u2E1B\u2E1E\u2E1F\u2E2A-\u2E2E\u2E30-\u2E39\u2E3C-\u2E3F\u2E41\u2E43-\u2E4F\u2E52-\u2E54\u3001-\u3003\u303D\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFE10-\uFE16\uFE19\uFE30\uFE45\uFE46\uFE49-\uFE4C\uFE50-\uFE52\uFE54-\uFE57\uFE5F-\uFE61\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF07\uFF0A\uFF0C\uFF0E\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3C\uFF61\uFF64\uFF65",
          "astral": "\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\u{1056F}|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\u{1BC9F}|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]"
        },
        {
          "name": "Ps",
          "alias": "Open_Punctuation",
          "bmp": "\\(\\[\\{\u0F3A\u0F3C\u169B\u201A\u201E\u2045\u207D\u208D\u2308\u230A\u2329\u2768\u276A\u276C\u276E\u2770\u2772\u2774\u27C5\u27E6\u27E8\u27EA\u27EC\u27EE\u2983\u2985\u2987\u2989\u298B\u298D\u298F\u2991\u2993\u2995\u2997\u29D8\u29DA\u29FC\u2E22\u2E24\u2E26\u2E28\u2E42\u2E55\u2E57\u2E59\u2E5B\u3008\u300A\u300C\u300E\u3010\u3014\u3016\u3018\u301A\u301D\uFD3F\uFE17\uFE35\uFE37\uFE39\uFE3B\uFE3D\uFE3F\uFE41\uFE43\uFE47\uFE59\uFE5B\uFE5D\uFF08\uFF3B\uFF5B\uFF5F\uFF62"
        },
        {
          "name": "S",
          "alias": "Symbol",
          "bmp": "\\$\\+<->\\^`\\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD",
          "astral": "\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\u{1173F}|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\u{1BC9C}|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDD-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7C\uDE80-\uDE86\uDE90-\uDEAC\uDEB0-\uDEBA\uDEC0-\uDEC5\uDED0-\uDED9\uDEE0-\uDEE7\uDEF0-\uDEF6\uDF00-\uDF92\uDF94-\uDFCA]"
        },
        {
          "name": "Sc",
          "alias": "Currency_Symbol",
          "bmp": "\\$\xA2-\xA5\u058F\u060B\u07FE\u07FF\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20C0\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6",
          "astral": "\uD807[\uDFDD-\uDFE0]|\u{1E2FF}|\u{1ECB0}"
        },
        {
          "name": "Sk",
          "alias": "Modifier_Symbol",
          "bmp": "\\^`\xA8\xAF\xB4\xB8\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u0888\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u309B\u309C\uA700-\uA716\uA720\uA721\uA789\uA78A\uAB5B\uAB6A\uAB6B\uFBB2-\uFBC2\uFF3E\uFF40\uFFE3",
          "astral": "\uD83C[\uDFFB-\uDFFF]"
        },
        {
          "name": "Sm",
          "alias": "Math_Symbol",
          "bmp": "\\+<->\\|~\xAC\xB1\xD7\xF7\u03F6\u0606-\u0608\u2044\u2052\u207A-\u207C\u208A-\u208C\u2118\u2140-\u2144\u214B\u2190-\u2194\u219A\u219B\u21A0\u21A3\u21A6\u21AE\u21CE\u21CF\u21D2\u21D4\u21F4-\u22FF\u2320\u2321\u237C\u239B-\u23B3\u23DC-\u23E1\u25B7\u25C1\u25F8-\u25FF\u266F\u27C0-\u27C4\u27C7-\u27E5\u27F0-\u27FF\u2900-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2AFF\u2B30-\u2B44\u2B47-\u2B4C\uFB29\uFE62\uFE64-\uFE66\uFF0B\uFF1C-\uFF1E\uFF5C\uFF5E\uFFE2\uFFE9-\uFFEC",
          "astral": "\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD83B[\uDEF0\uDEF1]"
        },
        {
          "name": "So",
          "alias": "Other_Symbol",
          "bmp": "\xA6\xA9\xAE\xB0\u0482\u058D\u058E\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u09FA\u0B70\u0BF3-\u0BF8\u0BFA\u0C7F\u0D4F\u0D79\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116\u2117\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u214A\u214C\u214D\u214F\u218A\u218B\u2195-\u2199\u219C-\u219F\u21A1\u21A2\u21A4\u21A5\u21A7-\u21AD\u21AF-\u21CD\u21D0\u21D1\u21D3\u21D5-\u21F3\u2300-\u2307\u230C-\u231F\u2322-\u2328\u232B-\u237B\u237D-\u239A\u23B4-\u23DB\u23E2-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u25B6\u25B8-\u25C0\u25C2-\u25F7\u2600-\u266E\u2670-\u2767\u2794-\u27BF\u2800-\u28FF\u2B00-\u2B2F\u2B45\u2B46\u2B4D-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA828-\uA82B\uA836\uA837\uA839\uAA77-\uAA79\uFD40-\uFD4F\uFDCF\uFDFD-\uFDFF\uFFE4\uFFE8\uFFED\uFFEE\uFFFC\uFFFD",
          "astral": "\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\u{1173F}|\uD807[\uDFD5-\uDFDC\uDFE1-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\u{1BC9C}|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\u{1E14F}|\uD83B[\uDCAC\uDD2E]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFA]|\uD83D[\uDC00-\uDED7\uDEDD-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7C\uDE80-\uDE86\uDE90-\uDEAC\uDEB0-\uDEBA\uDEC0-\uDEC5\uDED0-\uDED9\uDEE0-\uDEE7\uDEF0-\uDEF6\uDF00-\uDF92\uDF94-\uDFCA]"
        },
        {
          "name": "Z",
          "alias": "Separator",
          "bmp": " \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000"
        },
        {
          "name": "Zl",
          "alias": "Line_Separator",
          "bmp": "\u2028"
        },
        {
          "name": "Zp",
          "alias": "Paragraph_Separator",
          "bmp": "\u2029"
        },
        {
          "name": "Zs",
          "alias": "Space_Separator",
          "bmp": " \xA0\u1680\u2000-\u200A\u202F\u205F\u3000"
        }
      ];
    }
  });

  // node_modules/xregexp/lib/addons/unicode-categories.js
  var require_unicode_categories = __commonJS({
    "node_modules/xregexp/lib/addons/unicode-categories.js"(exports, module) {
      "use strict";
      var _Object$defineProperty = require_define_property3();
      var _interopRequireDefault = require_interopRequireDefault();
      _Object$defineProperty(exports, "__esModule", {
        value: true
      });
      exports["default"] = void 0;
      var _categories = _interopRequireDefault(require_categories());
      var _default = exports["default"] = function _default2(XRegExp) {
        if (!XRegExp.addUnicodeData) {
          throw new ReferenceError("Unicode Base must be loaded before Unicode Categories");
        }
        XRegExp.addUnicodeData(_categories["default"]);
      };
      module.exports = exports.default;
    }
  });

  // node_modules/xregexp/tools/output/properties.js
  var require_properties = __commonJS({
    "node_modules/xregexp/tools/output/properties.js"(exports, module) {
      module.exports = [
        {
          "name": "ASCII",
          "bmp": "\0-\x7F"
        },
        {
          "name": "Alphabetic",
          "bmp": "A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0345\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u0657\u0659-\u065F\u066E-\u06D3\u06D5-\u06DC\u06E1-\u06E8\u06ED-\u06EF\u06FA-\u06FC\u06FF\u0710-\u073F\u074D-\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0817\u081A-\u082C\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u08D4-\u08DF\u08E3-\u08E9\u08F0-\u093B\u093D-\u094C\u094E-\u0950\u0955-\u0963\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C4\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09F0\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A42\u0A47\u0A48\u0A4B\u0A4C\u0A51\u0A59-\u0A5C\u0A5E\u0A70-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC5\u0AC7-\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0-\u0AE3\u0AF9-\u0AFC\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D-\u0B44\u0B47\u0B48\u0B4B\u0B4C\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4C\u0C55\u0C56\u0C58-\u0C5A\u0C5D\u0C60-\u0C63\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCC\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0-\u0CE3\u0CF1\u0CF2\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D7A-\u0D7F\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E46\u0E4D\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0ECD\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F71-\u0F81\u0F88-\u0F97\u0F99-\u0FBC\u1000-\u1036\u1038\u103B-\u103F\u1050-\u108F\u109A-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1713\u171F-\u1733\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17B3\u17B6-\u17C8\u17D7\u17DC\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u1938\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A1B\u1A20-\u1A5E\u1A61-\u1A74\u1AA7\u1ABF\u1AC0\u1ACC-\u1ACE\u1B00-\u1B33\u1B35-\u1B43\u1B45-\u1B4C\u1B80-\u1BA9\u1BAC-\u1BAF\u1BBA-\u1BE5\u1BE7-\u1BF1\u1C00-\u1C36\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1DE7-\u1DF4\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u24B6-\u24E9\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA674-\uA67B\uA67F-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA805\uA807-\uA827\uA840-\uA873\uA880-\uA8C3\uA8C5\uA8F2-\uA8F7\uA8FB\uA8FD-\uA8FF\uA90A-\uA92A\uA930-\uA952\uA960-\uA97C\uA980-\uA9B2\uA9B4-\uA9BF\uA9CF\uA9E0-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA60-\uAA76\uAA7A-\uAABE\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABEA\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC",
          "astral": "\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD27\uDE80-\uDEA9\uDEAB\uDEAC\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC00-\uDC45\uDC71-\uDC75\uDC82-\uDCB8\uDCC2\uDCD0-\uDCE8\uDD00-\uDD32\uDD44-\uDD47\uDD50-\uDD72\uDD76\uDD80-\uDDBF\uDDC1-\uDDC4\uDDCE\uDDCF\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE34\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEE8\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D-\uDF44\uDF47\uDF48\uDF4B\uDF4C\uDF50\uDF57\uDF5D-\uDF63]|\uD805[\uDC00-\uDC41\uDC43-\uDC45\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCC1\uDCC4\uDCC5\uDCC7\uDD80-\uDDB5\uDDB8-\uDDBE\uDDD8-\uDDDD\uDE00-\uDE3E\uDE40\uDE44\uDE80-\uDEB5\uDEB8\uDF00-\uDF1A\uDF1D-\uDF2A\uDF40-\uDF46]|\uD806[\uDC00-\uDC38\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD35\uDD37\uDD38\uDD3B\uDD3C\uDD3F-\uDD42\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDDF\uDDE1\uDDE3\uDDE4\uDE00-\uDE32\uDE35-\uDE3E\uDE50-\uDE97\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC3E\uDC40\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD41\uDD43\uDD46\uDD47\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD96\uDD98\uDEE0-\uDEF6\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F\uDFE0\uDFE1\uDFE3\uDFF0\uDFF1]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9E]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD47\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD30-\uDD49\uDD50-\uDD69\uDD70-\uDD89]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A]"
        },
        {
          "name": "Any",
          "isBmpLast": true,
          "bmp": "\0-\uFFFF",
          "astral": "[\uD800-\uDBFF][\uDC00-\uDFFF]"
        },
        {
          "name": "Default_Ignorable_Code_Point",
          "bmp": "\xAD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180F\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFF8",
          "astral": "\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|[\uDB40-\uDB43][\uDC00-\uDFFF]"
        },
        {
          "name": "Lowercase",
          "bmp": "a-z\xAA\xB5\xBA\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02B8\u02C0\u02C1\u02E0-\u02E4\u0345\u0371\u0373\u0377\u037A-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0560-\u0588\u10D0-\u10FA\u10FD-\u10FF\u13F8-\u13FD\u1C80-\u1C88\u1D00-\u1DBF\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u2071\u207F\u2090-\u209C\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2170-\u217F\u2184\u24D0-\u24E9\u2C30-\u2C5F\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7D\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B-\uA69D\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7AF\uA7B5\uA7B7\uA7B9\uA7BB\uA7BD\uA7BF\uA7C1\uA7C3\uA7C8\uA7CA\uA7D1\uA7D3\uA7D5\uA7D7\uA7D9\uA7F6\uA7F8-\uA7FA\uAB30-\uAB5A\uAB5C-\uAB68\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A",
          "astral": "\uD801[\uDC28-\uDC4F\uDCD8-\uDCFB\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDF80\uDF83-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD803[\uDCC0-\uDCF2]|\uD806[\uDCC0-\uDCDF]|\uD81B[\uDE60-\uDE7F]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD837[\uDF00-\uDF09\uDF0B-\uDF1E]|\uD83A[\uDD22-\uDD43]"
        },
        {
          "name": "Noncharacter_Code_Point",
          "bmp": "\uFDD0-\uFDEF\uFFFE\uFFFF",
          "astral": "[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]"
        },
        {
          "name": "Uppercase",
          "bmp": "A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1C90-\u1CBA\u1CBD-\u1CBF\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2160-\u216F\u2183\u24B6-\u24CF\u2C00-\u2C2F\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AE\uA7B0-\uA7B4\uA7B6\uA7B8\uA7BA\uA7BC\uA7BE\uA7C0\uA7C2\uA7C4-\uA7C7\uA7C9\uA7D0\uA7D6\uA7D8\uA7F5\uFF21-\uFF3A",
          "astral": "\uD801[\uDC00-\uDC27\uDCB0-\uDCD3\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95]|\uD803[\uDC80-\uDCB2]|\uD806[\uDCA0-\uDCBF]|\uD81B[\uDE40-\uDE5F]|\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]|\uD83A[\uDD00-\uDD21]|\uD83C[\uDD30-\uDD49\uDD50-\uDD69\uDD70-\uDD89]"
        },
        {
          "name": "White_Space",
          "bmp": "	-\r \x85\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000"
        }
      ];
    }
  });

  // node_modules/xregexp/lib/addons/unicode-properties.js
  var require_unicode_properties = __commonJS({
    "node_modules/xregexp/lib/addons/unicode-properties.js"(exports, module) {
      "use strict";
      var _Object$defineProperty = require_define_property3();
      var _interopRequireDefault = require_interopRequireDefault();
      _Object$defineProperty(exports, "__esModule", {
        value: true
      });
      exports["default"] = void 0;
      var _properties = _interopRequireDefault(require_properties());
      var _default = exports["default"] = function _default2(XRegExp) {
        if (!XRegExp.addUnicodeData) {
          throw new ReferenceError("Unicode Base must be loaded before Unicode Properties");
        }
        var unicodeData = _properties["default"];
        unicodeData.push({
          name: "Assigned",
          // Since this is defined as the inverse of Unicode category Cn (Unassigned), the Unicode
          // Categories addon is required to use this property
          inverseOf: "Cn"
        });
        XRegExp.addUnicodeData(unicodeData);
      };
      module.exports = exports.default;
    }
  });

  // node_modules/xregexp/tools/output/scripts.js
  var require_scripts = __commonJS({
    "node_modules/xregexp/tools/output/scripts.js"(exports, module) {
      module.exports = [
        {
          "name": "Adlam",
          "astral": "\uD83A[\uDD00-\uDD4B\uDD50-\uDD59\uDD5E\uDD5F]"
        },
        {
          "name": "Ahom",
          "astral": "\uD805[\uDF00-\uDF1A\uDF1D-\uDF2B\uDF30-\uDF46]"
        },
        {
          "name": "Anatolian_Hieroglyphs",
          "astral": "\uD811[\uDC00-\uDE46]"
        },
        {
          "name": "Arabic",
          "bmp": "\u0600-\u0604\u0606-\u060B\u060D-\u061A\u061C-\u061E\u0620-\u063F\u0641-\u064A\u0656-\u066F\u0671-\u06DC\u06DE-\u06FF\u0750-\u077F\u0870-\u088E\u0890\u0891\u0898-\u08E1\u08E3-\u08FF\uFB50-\uFBC2\uFBD3-\uFD3D\uFD40-\uFD8F\uFD92-\uFDC7\uFDCF\uFDF0-\uFDFF\uFE70-\uFE74\uFE76-\uFEFC",
          "astral": "\uD803[\uDE60-\uDE7E]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB\uDEF0\uDEF1]"
        },
        {
          "name": "Armenian",
          "bmp": "\u0531-\u0556\u0559-\u058A\u058D-\u058F\uFB13-\uFB17"
        },
        {
          "name": "Avestan",
          "astral": "\uD802[\uDF00-\uDF35\uDF39-\uDF3F]"
        },
        {
          "name": "Balinese",
          "bmp": "\u1B00-\u1B4C\u1B50-\u1B7E"
        },
        {
          "name": "Bamum",
          "bmp": "\uA6A0-\uA6F7",
          "astral": "\uD81A[\uDC00-\uDE38]"
        },
        {
          "name": "Bassa_Vah",
          "astral": "\uD81A[\uDED0-\uDEED\uDEF0-\uDEF5]"
        },
        {
          "name": "Batak",
          "bmp": "\u1BC0-\u1BF3\u1BFC-\u1BFF"
        },
        {
          "name": "Bengali",
          "bmp": "\u0980-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FE"
        },
        {
          "name": "Bhaiksuki",
          "astral": "\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC45\uDC50-\uDC6C]"
        },
        {
          "name": "Bopomofo",
          "bmp": "\u02EA\u02EB\u3105-\u312F\u31A0-\u31BF"
        },
        {
          "name": "Brahmi",
          "astral": "\uD804[\uDC00-\uDC4D\uDC52-\uDC75\uDC7F]"
        },
        {
          "name": "Braille",
          "bmp": "\u2800-\u28FF"
        },
        {
          "name": "Buginese",
          "bmp": "\u1A00-\u1A1B\u1A1E\u1A1F"
        },
        {
          "name": "Buhid",
          "bmp": "\u1740-\u1753"
        },
        {
          "name": "Canadian_Aboriginal",
          "bmp": "\u1400-\u167F\u18B0-\u18F5",
          "astral": "\uD806[\uDEB0-\uDEBF]"
        },
        {
          "name": "Carian",
          "astral": "\uD800[\uDEA0-\uDED0]"
        },
        {
          "name": "Caucasian_Albanian",
          "astral": "\uD801[\uDD30-\uDD63\uDD6F]"
        },
        {
          "name": "Chakma",
          "astral": "\uD804[\uDD00-\uDD34\uDD36-\uDD47]"
        },
        {
          "name": "Cham",
          "bmp": "\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA5C-\uAA5F"
        },
        {
          "name": "Cherokee",
          "bmp": "\u13A0-\u13F5\u13F8-\u13FD\uAB70-\uABBF"
        },
        {
          "name": "Chorasmian",
          "astral": "\uD803[\uDFB0-\uDFCB]"
        },
        {
          "name": "Common",
          "bmp": "\0-@\\[-`\\{-\xA9\xAB-\xB9\xBB-\xBF\xD7\xF7\u02B9-\u02DF\u02E5-\u02E9\u02EC-\u02FF\u0374\u037E\u0385\u0387\u0605\u060C\u061B\u061F\u0640\u06DD\u08E2\u0964\u0965\u0E3F\u0FD5-\u0FD8\u10FB\u16EB-\u16ED\u1735\u1736\u1802\u1803\u1805\u1CD3\u1CE1\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5-\u1CF7\u1CFA\u2000-\u200B\u200E-\u2064\u2066-\u2070\u2074-\u207E\u2080-\u208E\u20A0-\u20C0\u2100-\u2125\u2127-\u2129\u212C-\u2131\u2133-\u214D\u214F-\u215F\u2189-\u218B\u2190-\u2426\u2440-\u244A\u2460-\u27FF\u2900-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2E00-\u2E5D\u2FF0-\u2FFB\u3000-\u3004\u3006\u3008-\u3020\u3030-\u3037\u303C-\u303F\u309B\u309C\u30A0\u30FB\u30FC\u3190-\u319F\u31C0-\u31E3\u3220-\u325F\u327F-\u32CF\u32FF\u3358-\u33FF\u4DC0-\u4DFF\uA700-\uA721\uA788-\uA78A\uA830-\uA839\uA92E\uA9CF\uAB5B\uAB6A\uAB6B\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFF70\uFF9E\uFF9F\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD",
          "astral": "\uD800[\uDD00-\uDD02\uDD07-\uDD33\uDD37-\uDD3F\uDD90-\uDD9C\uDDD0-\uDDFC\uDEE1-\uDEFB]|\uD82F[\uDCA0-\uDCA3]|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD66\uDD6A-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDEE0-\uDEF3\uDF00-\uDF56\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDFCB\uDFCE-\uDFFF]|\uD83B[\uDC71-\uDCB4\uDD01-\uDD3D]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD00-\uDDAD\uDDE6-\uDDFF\uDE01\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDD-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7C\uDE80-\uDE86\uDE90-\uDEAC\uDEB0-\uDEBA\uDEC0-\uDEC5\uDED0-\uDED9\uDEE0-\uDEE7\uDEF0-\uDEF6\uDF00-\uDF92\uDF94-\uDFCA\uDFF0-\uDFF9]|\uDB40[\uDC01\uDC20-\uDC7F]"
        },
        {
          "name": "Coptic",
          "bmp": "\u03E2-\u03EF\u2C80-\u2CF3\u2CF9-\u2CFF"
        },
        {
          "name": "Cuneiform",
          "astral": "\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC70-\uDC74\uDC80-\uDD43]"
        },
        {
          "name": "Cypriot",
          "astral": "\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F]"
        },
        {
          "name": "Cypro_Minoan",
          "astral": "\uD80B[\uDF90-\uDFF2]"
        },
        {
          "name": "Cyrillic",
          "bmp": "\u0400-\u0484\u0487-\u052F\u1C80-\u1C88\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA69F\uFE2E\uFE2F"
        },
        {
          "name": "Deseret",
          "astral": "\uD801[\uDC00-\uDC4F]"
        },
        {
          "name": "Devanagari",
          "bmp": "\u0900-\u0950\u0955-\u0963\u0966-\u097F\uA8E0-\uA8FF"
        },
        {
          "name": "Dives_Akuru",
          "astral": "\uD806[\uDD00-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD35\uDD37\uDD38\uDD3B-\uDD46\uDD50-\uDD59]"
        },
        {
          "name": "Dogra",
          "astral": "\uD806[\uDC00-\uDC3B]"
        },
        {
          "name": "Duployan",
          "astral": "\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9C-\uDC9F]"
        },
        {
          "name": "Egyptian_Hieroglyphs",
          "astral": "\uD80C[\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E\uDC30-\uDC38]"
        },
        {
          "name": "Elbasan",
          "astral": "\uD801[\uDD00-\uDD27]"
        },
        {
          "name": "Elymaic",
          "astral": "\uD803[\uDFE0-\uDFF6]"
        },
        {
          "name": "Ethiopic",
          "bmp": "\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u137C\u1380-\u1399\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E",
          "astral": "\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]"
        },
        {
          "name": "Georgian",
          "bmp": "\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u10FF\u1C90-\u1CBA\u1CBD-\u1CBF\u2D00-\u2D25\u2D27\u2D2D"
        },
        {
          "name": "Glagolitic",
          "bmp": "\u2C00-\u2C5F",
          "astral": "\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]"
        },
        {
          "name": "Gothic",
          "astral": "\uD800[\uDF30-\uDF4A]"
        },
        {
          "name": "Grantha",
          "astral": "\uD804[\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]"
        },
        {
          "name": "Greek",
          "bmp": "\u0370-\u0373\u0375-\u0377\u037A-\u037D\u037F\u0384\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03E1\u03F0-\u03FF\u1D26-\u1D2A\u1D5D-\u1D61\u1D66-\u1D6A\u1DBF\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u2126\uAB65",
          "astral": "\uD800[\uDD40-\uDD8E\uDDA0]|\uD834[\uDE00-\uDE45]"
        },
        {
          "name": "Gujarati",
          "bmp": "\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AF1\u0AF9-\u0AFF"
        },
        {
          "name": "Gunjala_Gondi",
          "astral": "\uD807[\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDDA0-\uDDA9]"
        },
        {
          "name": "Gurmukhi",
          "bmp": "\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A76"
        },
        {
          "name": "Han",
          "bmp": "\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFA6D\uFA70-\uFAD9",
          "astral": "\uD81B[\uDFE2\uDFE3\uDFF0\uDFF1]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A]"
        },
        {
          "name": "Hangul",
          "bmp": "\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC"
        },
        {
          "name": "Hanifi_Rohingya",
          "astral": "\uD803[\uDD00-\uDD27\uDD30-\uDD39]"
        },
        {
          "name": "Hanunoo",
          "bmp": "\u1720-\u1734"
        },
        {
          "name": "Hatran",
          "astral": "\uD802[\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDCFF]"
        },
        {
          "name": "Hebrew",
          "bmp": "\u0591-\u05C7\u05D0-\u05EA\u05EF-\u05F4\uFB1D-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFB4F"
        },
        {
          "name": "Hiragana",
          "bmp": "\u3041-\u3096\u309D-\u309F",
          "astral": "\uD82C[\uDC01-\uDD1F\uDD50-\uDD52]|\u{1F200}"
        },
        {
          "name": "Imperial_Aramaic",
          "astral": "\uD802[\uDC40-\uDC55\uDC57-\uDC5F]"
        },
        {
          "name": "Inherited",
          "bmp": "\u0300-\u036F\u0485\u0486\u064B-\u0655\u0670\u0951-\u0954\u1AB0-\u1ACE\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u200C\u200D\u20D0-\u20F0\u302A-\u302D\u3099\u309A\uFE00-\uFE0F\uFE20-\uFE2D",
          "astral": "\uD800[\uDDFD\uDEE0]|\u{1133B}|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD67-\uDD69\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD]|\uDB40[\uDD00-\uDDEF]"
        },
        {
          "name": "Inscriptional_Pahlavi",
          "astral": "\uD802[\uDF60-\uDF72\uDF78-\uDF7F]"
        },
        {
          "name": "Inscriptional_Parthian",
          "astral": "\uD802[\uDF40-\uDF55\uDF58-\uDF5F]"
        },
        {
          "name": "Javanese",
          "bmp": "\uA980-\uA9CD\uA9D0-\uA9D9\uA9DE\uA9DF"
        },
        {
          "name": "Kaithi",
          "astral": "\uD804[\uDC80-\uDCC2\uDCCD]"
        },
        {
          "name": "Kannada",
          "bmp": "\u0C80-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2"
        },
        {
          "name": "Katakana",
          "bmp": "\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D",
          "astral": "\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00\uDD20-\uDD22\uDD64-\uDD67]"
        },
        {
          "name": "Kayah_Li",
          "bmp": "\uA900-\uA92D\uA92F"
        },
        {
          "name": "Kharoshthi",
          "astral": "\uD802[\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F-\uDE48\uDE50-\uDE58]"
        },
        {
          "name": "Khitan_Small_Script",
          "astral": "\u{16FE4}|\uD822[\uDF00-\uDFFF]|\uD823[\uDC00-\uDCD5]"
        },
        {
          "name": "Khmer",
          "bmp": "\u1780-\u17DD\u17E0-\u17E9\u17F0-\u17F9\u19E0-\u19FF"
        },
        {
          "name": "Khojki",
          "astral": "\uD804[\uDE00-\uDE11\uDE13-\uDE3E]"
        },
        {
          "name": "Khudawadi",
          "astral": "\uD804[\uDEB0-\uDEEA\uDEF0-\uDEF9]"
        },
        {
          "name": "Lao",
          "bmp": "\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF"
        },
        {
          "name": "Latin",
          "bmp": "A-Za-z\xAA\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB64\uAB66-\uAB69\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A",
          "astral": "\uD801[\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD837[\uDF00-\uDF1E]"
        },
        {
          "name": "Lepcha",
          "bmp": "\u1C00-\u1C37\u1C3B-\u1C49\u1C4D-\u1C4F"
        },
        {
          "name": "Limbu",
          "bmp": "\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1940\u1944-\u194F"
        },
        {
          "name": "Linear_A",
          "astral": "\uD801[\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]"
        },
        {
          "name": "Linear_B",
          "astral": "\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA]"
        },
        {
          "name": "Lisu",
          "bmp": "\uA4D0-\uA4FF",
          "astral": "\u{11FB0}"
        },
        {
          "name": "Lycian",
          "astral": "\uD800[\uDE80-\uDE9C]"
        },
        {
          "name": "Lydian",
          "astral": "\uD802[\uDD20-\uDD39\uDD3F]"
        },
        {
          "name": "Mahajani",
          "astral": "\uD804[\uDD50-\uDD76]"
        },
        {
          "name": "Makasar",
          "astral": "\uD807[\uDEE0-\uDEF8]"
        },
        {
          "name": "Malayalam",
          "bmp": "\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4F\u0D54-\u0D63\u0D66-\u0D7F"
        },
        {
          "name": "Mandaic",
          "bmp": "\u0840-\u085B\u085E"
        },
        {
          "name": "Manichaean",
          "astral": "\uD802[\uDEC0-\uDEE6\uDEEB-\uDEF6]"
        },
        {
          "name": "Marchen",
          "astral": "\uD807[\uDC70-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]"
        },
        {
          "name": "Masaram_Gondi",
          "astral": "\uD807[\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]"
        },
        {
          "name": "Medefaidrin",
          "astral": "\uD81B[\uDE40-\uDE9A]"
        },
        {
          "name": "Meetei_Mayek",
          "bmp": "\uAAE0-\uAAF6\uABC0-\uABED\uABF0-\uABF9"
        },
        {
          "name": "Mende_Kikakui",
          "astral": "\uD83A[\uDC00-\uDCC4\uDCC7-\uDCD6]"
        },
        {
          "name": "Meroitic_Cursive",
          "astral": "\uD802[\uDDA0-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDDFF]"
        },
        {
          "name": "Meroitic_Hieroglyphs",
          "astral": "\uD802[\uDD80-\uDD9F]"
        },
        {
          "name": "Miao",
          "astral": "\uD81B[\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F]"
        },
        {
          "name": "Modi",
          "astral": "\uD805[\uDE00-\uDE44\uDE50-\uDE59]"
        },
        {
          "name": "Mongolian",
          "bmp": "\u1800\u1801\u1804\u1806-\u1819\u1820-\u1878\u1880-\u18AA",
          "astral": "\uD805[\uDE60-\uDE6C]"
        },
        {
          "name": "Mro",
          "astral": "\uD81A[\uDE40-\uDE5E\uDE60-\uDE69\uDE6E\uDE6F]"
        },
        {
          "name": "Multani",
          "astral": "\uD804[\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA9]"
        },
        {
          "name": "Myanmar",
          "bmp": "\u1000-\u109F\uA9E0-\uA9FE\uAA60-\uAA7F"
        },
        {
          "name": "Nabataean",
          "astral": "\uD802[\uDC80-\uDC9E\uDCA7-\uDCAF]"
        },
        {
          "name": "Nandinagari",
          "astral": "\uD806[\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDE4]"
        },
        {
          "name": "New_Tai_Lue",
          "bmp": "\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u19DE\u19DF"
        },
        {
          "name": "Newa",
          "astral": "\uD805[\uDC00-\uDC5B\uDC5D-\uDC61]"
        },
        {
          "name": "Nko",
          "bmp": "\u07C0-\u07FA\u07FD-\u07FF"
        },
        {
          "name": "Nushu",
          "astral": "\u{16FE1}|\uD82C[\uDD70-\uDEFB]"
        },
        {
          "name": "Nyiakeng_Puachue_Hmong",
          "astral": "\uD838[\uDD00-\uDD2C\uDD30-\uDD3D\uDD40-\uDD49\uDD4E\uDD4F]"
        },
        {
          "name": "Ogham",
          "bmp": "\u1680-\u169C"
        },
        {
          "name": "Ol_Chiki",
          "bmp": "\u1C50-\u1C7F"
        },
        {
          "name": "Old_Hungarian",
          "astral": "\uD803[\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDCFF]"
        },
        {
          "name": "Old_Italic",
          "astral": "\uD800[\uDF00-\uDF23\uDF2D-\uDF2F]"
        },
        {
          "name": "Old_North_Arabian",
          "astral": "\uD802[\uDE80-\uDE9F]"
        },
        {
          "name": "Old_Permic",
          "astral": "\uD800[\uDF50-\uDF7A]"
        },
        {
          "name": "Old_Persian",
          "astral": "\uD800[\uDFA0-\uDFC3\uDFC8-\uDFD5]"
        },
        {
          "name": "Old_Sogdian",
          "astral": "\uD803[\uDF00-\uDF27]"
        },
        {
          "name": "Old_South_Arabian",
          "astral": "\uD802[\uDE60-\uDE7F]"
        },
        {
          "name": "Old_Turkic",
          "astral": "\uD803[\uDC00-\uDC48]"
        },
        {
          "name": "Old_Uyghur",
          "astral": "\uD803[\uDF70-\uDF89]"
        },
        {
          "name": "Oriya",
          "bmp": "\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B77"
        },
        {
          "name": "Osage",
          "astral": "\uD801[\uDCB0-\uDCD3\uDCD8-\uDCFB]"
        },
        {
          "name": "Osmanya",
          "astral": "\uD801[\uDC80-\uDC9D\uDCA0-\uDCA9]"
        },
        {
          "name": "Pahawh_Hmong",
          "astral": "\uD81A[\uDF00-\uDF45\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]"
        },
        {
          "name": "Palmyrene",
          "astral": "\uD802[\uDC60-\uDC7F]"
        },
        {
          "name": "Pau_Cin_Hau",
          "astral": "\uD806[\uDEC0-\uDEF8]"
        },
        {
          "name": "Phags_Pa",
          "bmp": "\uA840-\uA877"
        },
        {
          "name": "Phoenician",
          "astral": "\uD802[\uDD00-\uDD1B\uDD1F]"
        },
        {
          "name": "Psalter_Pahlavi",
          "astral": "\uD802[\uDF80-\uDF91\uDF99-\uDF9C\uDFA9-\uDFAF]"
        },
        {
          "name": "Rejang",
          "bmp": "\uA930-\uA953\uA95F"
        },
        {
          "name": "Runic",
          "bmp": "\u16A0-\u16EA\u16EE-\u16F8"
        },
        {
          "name": "Samaritan",
          "bmp": "\u0800-\u082D\u0830-\u083E"
        },
        {
          "name": "Saurashtra",
          "bmp": "\uA880-\uA8C5\uA8CE-\uA8D9"
        },
        {
          "name": "Sharada",
          "astral": "\uD804[\uDD80-\uDDDF]"
        },
        {
          "name": "Shavian",
          "astral": "\uD801[\uDC50-\uDC7F]"
        },
        {
          "name": "Siddham",
          "astral": "\uD805[\uDD80-\uDDB5\uDDB8-\uDDDD]"
        },
        {
          "name": "SignWriting",
          "astral": "\uD836[\uDC00-\uDE8B\uDE9B-\uDE9F\uDEA1-\uDEAF]"
        },
        {
          "name": "Sinhala",
          "bmp": "\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4",
          "astral": "\uD804[\uDDE1-\uDDF4]"
        },
        {
          "name": "Sogdian",
          "astral": "\uD803[\uDF30-\uDF59]"
        },
        {
          "name": "Sora_Sompeng",
          "astral": "\uD804[\uDCD0-\uDCE8\uDCF0-\uDCF9]"
        },
        {
          "name": "Soyombo",
          "astral": "\uD806[\uDE50-\uDEA2]"
        },
        {
          "name": "Sundanese",
          "bmp": "\u1B80-\u1BBF\u1CC0-\u1CC7"
        },
        {
          "name": "Syloti_Nagri",
          "bmp": "\uA800-\uA82C"
        },
        {
          "name": "Syriac",
          "bmp": "\u0700-\u070D\u070F-\u074A\u074D-\u074F\u0860-\u086A"
        },
        {
          "name": "Tagalog",
          "bmp": "\u1700-\u1715\u171F"
        },
        {
          "name": "Tagbanwa",
          "bmp": "\u1760-\u176C\u176E-\u1770\u1772\u1773"
        },
        {
          "name": "Tai_Le",
          "bmp": "\u1950-\u196D\u1970-\u1974"
        },
        {
          "name": "Tai_Tham",
          "bmp": "\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD"
        },
        {
          "name": "Tai_Viet",
          "bmp": "\uAA80-\uAAC2\uAADB-\uAADF"
        },
        {
          "name": "Takri",
          "astral": "\uD805[\uDE80-\uDEB9\uDEC0-\uDEC9]"
        },
        {
          "name": "Tamil",
          "bmp": "\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BFA",
          "astral": "\uD807[\uDFC0-\uDFF1\uDFFF]"
        },
        {
          "name": "Tangsa",
          "astral": "\uD81A[\uDE70-\uDEBE\uDEC0-\uDEC9]"
        },
        {
          "name": "Tangut",
          "astral": "\u{16FE0}|[\uD81C-\uD820][\uDC00-\uDFFF]|\uD821[\uDC00-\uDFF7]|\uD822[\uDC00-\uDEFF]|\uD823[\uDD00-\uDD08]"
        },
        {
          "name": "Telugu",
          "bmp": "\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3C-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C5D\u0C60-\u0C63\u0C66-\u0C6F\u0C77-\u0C7F"
        },
        {
          "name": "Thaana",
          "bmp": "\u0780-\u07B1"
        },
        {
          "name": "Thai",
          "bmp": "\u0E01-\u0E3A\u0E40-\u0E5B"
        },
        {
          "name": "Tibetan",
          "bmp": "\u0F00-\u0F47\u0F49-\u0F6C\u0F71-\u0F97\u0F99-\u0FBC\u0FBE-\u0FCC\u0FCE-\u0FD4\u0FD9\u0FDA"
        },
        {
          "name": "Tifinagh",
          "bmp": "\u2D30-\u2D67\u2D6F\u2D70\u2D7F"
        },
        {
          "name": "Tirhuta",
          "astral": "\uD805[\uDC80-\uDCC7\uDCD0-\uDCD9]"
        },
        {
          "name": "Toto",
          "astral": "\uD838[\uDE90-\uDEAE]"
        },
        {
          "name": "Ugaritic",
          "astral": "\uD800[\uDF80-\uDF9D\uDF9F]"
        },
        {
          "name": "Vai",
          "bmp": "\uA500-\uA62B"
        },
        {
          "name": "Vithkuqi",
          "astral": "\uD801[\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC]"
        },
        {
          "name": "Wancho",
          "astral": "\uD838[\uDEC0-\uDEF9\uDEFF]"
        },
        {
          "name": "Warang_Citi",
          "astral": "\uD806[\uDCA0-\uDCF2\uDCFF]"
        },
        {
          "name": "Yezidi",
          "astral": "\uD803[\uDE80-\uDEA9\uDEAB-\uDEAD\uDEB0\uDEB1]"
        },
        {
          "name": "Yi",
          "bmp": "\uA000-\uA48C\uA490-\uA4C6"
        },
        {
          "name": "Zanabazar_Square",
          "astral": "\uD806[\uDE00-\uDE47]"
        }
      ];
    }
  });

  // node_modules/xregexp/lib/addons/unicode-scripts.js
  var require_unicode_scripts = __commonJS({
    "node_modules/xregexp/lib/addons/unicode-scripts.js"(exports, module) {
      "use strict";
      var _Object$defineProperty = require_define_property3();
      var _interopRequireDefault = require_interopRequireDefault();
      _Object$defineProperty(exports, "__esModule", {
        value: true
      });
      exports["default"] = void 0;
      var _scripts = _interopRequireDefault(require_scripts());
      var _default = exports["default"] = function _default2(XRegExp) {
        if (!XRegExp.addUnicodeData) {
          throw new ReferenceError("Unicode Base must be loaded before Unicode Scripts");
        }
        XRegExp.addUnicodeData(_scripts["default"], "Script");
      };
      module.exports = exports.default;
    }
  });

  // node_modules/xregexp/lib/index.js
  var require_lib = __commonJS({
    "node_modules/xregexp/lib/index.js"(exports, module) {
      "use strict";
      var _Object$defineProperty = require_define_property3();
      var _interopRequireDefault = require_interopRequireDefault();
      _Object$defineProperty(exports, "__esModule", {
        value: true
      });
      exports["default"] = void 0;
      var _xregexp = _interopRequireDefault(require_xregexp());
      var _build = _interopRequireDefault(require_build());
      var _matchrecursive = _interopRequireDefault(require_matchrecursive());
      var _unicodeBase = _interopRequireDefault(require_unicode_base());
      var _unicodeCategories = _interopRequireDefault(require_unicode_categories());
      var _unicodeProperties = _interopRequireDefault(require_unicode_properties());
      var _unicodeScripts = _interopRequireDefault(require_unicode_scripts());
      (0, _build["default"])(_xregexp["default"]);
      (0, _matchrecursive["default"])(_xregexp["default"]);
      (0, _unicodeBase["default"])(_xregexp["default"]);
      (0, _unicodeCategories["default"])(_xregexp["default"]);
      (0, _unicodeProperties["default"])(_xregexp["default"]);
      (0, _unicodeScripts["default"])(_xregexp["default"]);
      var _default = exports["default"] = _xregexp["default"];
      module.exports = exports.default;
    }
  });

  // src/utils/formatehtml.js
  var import_js_beautify = __toESM(require_js(), 1);
  var HubLFormatter = class {
    constructor() {
      this.tab = "    ";
    }
    protectPlaceholders(html) {
      const placeholders = [];
      const protectedHtml = html.replace(/(\{\{[\s\S]*?\}\}|\{%\s*[\s\S]*?\s*%\})/g, (match) => {
        if (match.startsWith("{{")) {
          let inner = match.slice(2, -2);
          inner = inner.replace(/[\r\n]+/g, " ");
          inner = inner.replace(/\s+/g, " ");
          inner = inner.trim();
          const collapsed = `{{ ${inner} }}`;
          placeholders.push({ type: "expression", value: collapsed });
          return `__HUBL_EXPR_${placeholders.length - 1}__`;
        } else {
          placeholders.push({ type: "tag", value: match });
          return `__HUBL_EXPR_${placeholders.length - 1}__`;
        }
      });
      return { html: protectedHtml, placeholders };
    }
    restorePlaceholders(html, placeholders) {
      return html.replace(/__HUBL_EXPR_(\d+)__/g, (_, i) => placeholders[i].value);
    }
    formatHubL(content, baseIndent = 0) {
      const lines = content.split("\n").map((line) => line.trim()).filter((line) => line);
      if (!lines.length)
        return "";
      const result = [];
      let indentLevel = baseIndent;
      const blockStart = /^{%-?\s*(if|for|macro|block|autoescape|filter|trans|with|call|raw|spaceless|compress|set)\b/;
      const blockEnd = /^{%-?\s*end(if|for|macro|block|autoescape|filter|trans|with|call|raw|spaceless|compress)\b/;
      const blockMiddle = /^{%-?\s*(else|elif|elsif|elseif)\b/;
      const standalone = /^{%-?\s*(include|import|from|extends|load)\b/;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let currentIndent = indentLevel;
        if (blockEnd.test(line)) {
          currentIndent = Math.max(0, indentLevel - 1);
          indentLevel = currentIndent;
        } else if (blockMiddle.test(line)) {
          currentIndent = Math.max(0, indentLevel - 1);
        }
        result.push(this.tab.repeat(currentIndent) + line);
        if (blockStart.test(line) && !standalone.test(line)) {
          indentLevel++;
        }
      }
      return result.join("\n");
    }
    formatHTMLContent(content, baseIndent = 0) {
      const lines = content.split("\n").map((line) => line.trim()).filter((line) => line);
      if (!lines.length)
        return "";
      const result = [];
      let indentLevel = baseIndent;
      const stack = [];
      const selfClosing = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
      const inline = /* @__PURE__ */ new Set(["a", "abbr", "b", "bdo", "br", "button", "cite", "code", "dfn", "em", "i", "img", "input", "kbd", "label", "map", "object", "q", "samp", "script", "select", "small", "span", "strong", "sub", "sup", "textarea", "var"]);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let currentIndent = indentLevel;
        const tagMatch = line.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
        if (tagMatch) {
          const tagName = tagMatch[1].toLowerCase();
          const isClosing = line.startsWith("</");
          const isSelfClosing = line.endsWith("/>") || selfClosing.has(tagName);
          const isInline = inline.has(tagName);
          if (isClosing) {
            let found = false;
            for (let j = stack.length - 1; j >= 0; j--) {
              if (stack[j].tagName === tagName) {
                const removed = stack.splice(j);
                indentLevel -= removed.length;
                found = true;
                break;
              }
            }
            currentIndent = indentLevel;
          }
          result.push(this.tab.repeat(currentIndent) + line);
          if (!isClosing && !isSelfClosing && !isInline) {
            stack.push({ tagName, line: i });
            indentLevel++;
          }
        } else {
          result.push(this.tab.repeat(currentIndent) + line);
        }
      }
      return result.join("\n");
    }
    async formatJavaScript(content, baseIndent = 0) {
      try {
        const { js: beautifyJs } = await Promise.resolve().then(() => __toESM(require_js(), 1));
        let formatted = beautifyJs(content, {
          indent_size: 2,
          preserve_newlines: false,
          max_preserve_newlines: 1,
          wrap_line_length: 100,
          end_with_newline: false
        });
        if (baseIndent > 0) {
          const indent = this.tab.repeat(baseIndent);
          formatted = formatted.split("\n").map((line) => line.trim() ? indent + line : line).join("\n");
        }
        return formatted;
      } catch (error) {
        console.error("JavaScript formatting error:", error);
        return content;
      }
    }
    async formatCSS(content, baseIndent = 0) {
      try {
        const { css: beautifyCss } = await Promise.resolve().then(() => __toESM(require_js(), 1));
        let formatted = beautifyCss(content, {
          indent_size: 2,
          newline_between_rules: true,
          preserve_newlines: false,
          max_preserve_newlines: 1,
          end_with_newline: false
        });
        if (baseIndent > 0) {
          const indent = this.tab.repeat(baseIndent);
          formatted = formatted.split("\n").map((line) => line.trim() ? indent + line : line).join("\n");
        }
        return formatted;
      } catch (error) {
        console.error("CSS formatting error:", error);
        return content;
      }
    }
    normalizeContent(content) {
      let normalized = content;
      normalized = normalized.replace(/(<[^>]*?)\n([^<]*?>)/g, "$1 $2");
      normalized = normalized.replace(/({%-?\s*)\n(\s*\w+[^%]*?%})/g, "$1$2");
      normalized = normalized.replace(/({%-?[^%]*?)\n(\s*%})/g, "$1 $2");
      normalized = normalized.replace(/{%-?\s*(\w+)\s+([^%]*?)\s*-?%}/g, (match, keyword, content2) => {
        const cleanContent = content2.trim();
        return `{% ${keyword}${cleanContent ? " " + cleanContent : ""} %}`;
      });
      return normalized;
    }
    async formatHTML(content) {
      if (!content || !content.trim())
        return "";
      content = content.trim();
      content = content.replace(/<([a-zA-Z][\w:-]*)([\s\S]*?)(\/?)>/g, (match, tag, attrs, selfclose) => {
        let collapsedAttrs = attrs.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
        collapsedAttrs = collapsedAttrs.replace(/([\w:-]+)=(".*?"|'.*?')/g, (m, attr, val) => {
          if (val[0] === '"' || val[0] === "'") {
            let v = val.slice(1, -1).replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
            if (attr === "style") {
              v = v.replace(/\s*:\s*/g, ": ").replace(/;\s*/g, "; ").trim();
            }
            if (attr === "class") {
              v = v.replace(/\s+/g, " ").trim();
            }
            return `${attr}=${val[0]}${v}${val[0]}`;
          }
          return m;
        });
        return `<${tag}${collapsedAttrs ? " " + collapsedAttrs : ""}${selfclose}>`;
      });
      const scriptStyleBlocks = this.extractScriptStyleBlocks(content);
      let processedContent = scriptStyleBlocks.content;
      const formatted = await this.formatMixedContent(processedContent);
      let result = await this.restoreScriptStyleBlocks(formatted, scriptStyleBlocks.blocks);
      result = result.replace(/\n{2,}/g, "\n");
      return result.trim();
    }
    extractScriptStyleBlocks(content) {
      const blocks = [];
      let processedContent = content;
      let blockIndex = 0;
      function extractBlocks(tagName, regex, type) {
        processedContent = processedContent.replace(regex, (match) => {
          const placeholder = `__${type.toUpperCase()}_BLOCK_${blockIndex}__`;
          blocks.push({ type, content: match, placeholder });
          blockIndex++;
          return placeholder;
        });
      }
      extractBlocks(
        "script",
        /<script\b[^>]*>[\s\S]*?<\/script>/gi,
        "script"
      );
      extractBlocks(
        "style",
        /<style\b[^>]*>[\s\S]*?<\/style>/gi,
        "style"
      );
      return { content: processedContent, blocks };
    }
    async restoreScriptStyleBlocks(content, blocks) {
      let result = content;
      for (const block of blocks) {
        let formattedBlock = "";
        let match;
        if (block.type === "script" || block.type === "style") {
          const tagRegex = block.type === "script" ? /^(\s*<script\b[^>]*>)([\s\S]*?)(<\/script>\s*)$/i : /^(\s*<style\b[^>]*>)([\s\S]*?)(<\/style>\s*)$/i;
          match = block.content.match(tagRegex);
          if (match) {
            const openingTag = match[1];
            const innerContent = match[2];
            const closingTag = match[3];
            const openingTagIndentMatch = openingTag.match(/^(\s*)/);
            const baseIndent = openingTagIndentMatch ? Math.floor(openingTagIndentMatch[1].replace(/\t/g, "    ").length / this.tab.length) : 0;
            const { html: protectedContent, placeholders } = this.protectPlaceholders(innerContent);
            let formattedInner;
            if (block.type === "script") {
              formattedInner = await this.formatJavaScript(protectedContent, baseIndent + 1);
            } else {
              formattedInner = await this.formatCSS(protectedContent, baseIndent + 1);
            }
            formattedInner = this.restorePlaceholders(formattedInner, placeholders);
            formattedBlock = `${openingTag}
${formattedInner}
${closingTag}`;
          } else {
            formattedBlock = block.content;
          }
        } else {
          formattedBlock = block.content;
        }
        result = result.replace(block.placeholder, formattedBlock);
      }
      return result;
    }
    async formatMixedContent(content) {
      let XRegExp;
      try {
        XRegExp = (await Promise.resolve().then(() => __toESM(require_lib(), 1))).default || await Promise.resolve().then(() => __toESM(require_lib(), 1));
      } catch (e) {
        XRegExp = require_lib();
      }
      let normalizedContent = this.normalizeContent(content);
      normalizedContent = normalizedContent.replace(
        /<([a-zA-Z][\w:-]*)([\s\S]*?)(\/?)>/g,
        (match, tag, attrs, selfclose) => {
          let collapsedAttrs = attrs.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
          collapsedAttrs = collapsedAttrs.replace(/([\w:-]+)=(".*?"|'.*?')/g, (m, attr, val) => {
            if (val[0] === '"' || val[0] === "'") {
              let v = val.slice(1, -1).replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
              if (attr === "style") {
                v = v.replace(/\s*:\s*/g, ": ").replace(/;\s*/g, "; ").trim();
              }
              if (attr === "class") {
                v = v.replace(/\s+/g, " ").trim();
              }
              return `${attr}=${val[0]}${v}${val[0]}`;
            }
            return m;
          });
          return `<${tag}${collapsedAttrs ? " " + collapsedAttrs : ""}${selfclose}>`;
        }
      );
      const hublBlockPattern = XRegExp("({%-?\\s*[\\s\\S]*?\\s*-?%})", "g");
      const hublExprPattern = XRegExp("({{[\\s\\S]*?}})", "g");
      const htmlTagPattern = XRegExp("(<[!/]?[a-zA-Z][\\w:-]*(?:\\s+[^<>]*?)?>)", "g");
      const masterPattern = XRegExp.union([hublBlockPattern, hublExprPattern, htmlTagPattern], "g");
      let tokens = [];
      let lastIndex = 0;
      let input = normalizedContent;
      XRegExp.forEach(input, masterPattern, (match, i) => {
        if (match.index > lastIndex) {
          const text = input.slice(lastIndex, match.index);
          if (text && text.trim().length > 0) {
            tokens.push({ type: "text", value: text });
          }
        }
        const val = match[0];
        if (XRegExp.exec(val, hublBlockPattern)) {
          tokens.push({ type: "hubltag", value: val });
        } else if (XRegExp.exec(val, hublExprPattern)) {
          tokens.push({ type: "hubltag", value: val });
        } else if (XRegExp.exec(val, htmlTagPattern)) {
          tokens.push({ type: "htmltag", value: val });
        }
        lastIndex = match.index + val.length;
      });
      if (lastIndex < input.length) {
        const text = input.slice(lastIndex);
        if (text && text.trim().length > 0) {
          tokens.push({ type: "text", value: text });
        }
      }
      tokens = tokens.filter((t) => t.type !== "text" || t.value.trim() !== "");
      let htmlIndent = 0;
      let hublIndent = 0;
      const htmlStack = [];
      const hublStack = [];
      const result = [];
      const selfClosing = /* @__PURE__ */ new Set([
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr"
      ]);
      const inline = /* @__PURE__ */ new Set([
        "a",
        "abbr",
        "b",
        "bdo",
        "br",
        "button",
        "cite",
        "code",
        "dfn",
        "em",
        "i",
        "img",
        "input",
        "kbd",
        "label",
        "map",
        "object",
        "q",
        "samp",
        "script",
        "select",
        "small",
        "span",
        "strong",
        "sub",
        "sup",
        "textarea",
        "var"
      ]);
      const blockStart = XRegExp("^{%-?\\s*(if|for|macro|block|autoescape|filter|trans|with|call|raw|spaceless|compress|set)\\b");
      const blockEnd = XRegExp("^{%-?\\s*end(if|for|macro|block|autoescape|filter|trans|with|call|raw|spaceless|compress)\\b");
      const blockMiddle = XRegExp("^{%-?\\s*(else|elif|elsif|elseif)\\b");
      const standalone = XRegExp("^{%-?\\s*(include|import|from|extends|load)\\b");
      const isHubLTag = (val) => XRegExp.exec(val, hublBlockPattern) || XRegExp.exec(val, hublExprPattern);
      let middleBlockActive = false;
      let middleBlockBaseIndent = 0;
      let middleBlockBaseIndentHtml = 0;
      let middleBlockBaseIndentHubl = 0;
      let lastWasMiddleBlock = false;
      const blockLevelTags = /* @__PURE__ */ new Set([
        // Common block-level HTML tags
        "address",
        "article",
        "aside",
        "blockquote",
        "canvas",
        "dd",
        "div",
        "dl",
        "dt",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "header",
        "hr",
        "li",
        "main",
        "nav",
        "noscript",
        "ol",
        "p",
        "pre",
        "section",
        "table",
        "tfoot",
        "ul",
        "video"
      ]);
      const blockStack = [];
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        let currentHtmlIndent = htmlIndent;
        let currentHublIndent = hublIndent;
        let currentIndent;
        if (middleBlockActive) {
          currentIndent = middleBlockBaseIndent + (htmlIndent - middleBlockBaseIndentHtml) + (hublIndent - middleBlockBaseIndentHubl);
        } else {
          currentIndent = htmlIndent + hublIndent;
        }
        if (token.type === "hubltag") {
          const line = token.value.trim();
          if (XRegExp.test(line, blockEnd)) {
            if (hublStack.length > 0) {
              hublStack.pop();
              hublIndent = Math.max(0, hublIndent - 1);
            }
            middleBlockActive = false;
            middleBlockBaseIndent = 0;
            middleBlockBaseIndentHtml = 0;
            middleBlockBaseIndentHubl = 0;
            currentHtmlIndent = htmlIndent;
            currentHublIndent = hublIndent;
            currentIndent = htmlIndent + hublIndent;
            lastWasMiddleBlock = false;
          } else if (XRegExp.test(line, blockMiddle)) {
            if (hublStack.length > 0) {
              hublStack.pop();
              hublIndent = Math.max(0, hublIndent - 1);
            }
            middleBlockActive = true;
            middleBlockBaseIndentHtml = htmlIndent;
            middleBlockBaseIndentHubl = hublIndent;
            middleBlockBaseIndent = htmlIndent + hublIndent;
            currentHtmlIndent = htmlIndent;
            currentHublIndent = hublIndent;
            currentIndent = middleBlockBaseIndent;
            lastWasMiddleBlock = true;
          } else {
            lastWasMiddleBlock = false;
          }
          result.push(this.tab.repeat(currentIndent) + line);
          if (XRegExp.test(line, blockStart) && !XRegExp.test(line, standalone)) {
            hublStack.push("block");
            hublIndent++;
            lastWasMiddleBlock = false;
          } else if (XRegExp.test(line, blockMiddle)) {
            hublStack.push("middle");
            hublIndent++;
          }
          if (blockStack.length > 0) {
            blockStack[blockStack.length - 1].childCount++;
          }
        } else if (token.type === "htmltag") {
          const tagMatch = token.value.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
          let effectiveIndent;
          if (middleBlockActive) {
            effectiveIndent = middleBlockBaseIndent + (htmlIndent - middleBlockBaseIndentHtml) + (hublIndent - middleBlockBaseIndentHubl);
          } else {
            effectiveIndent = htmlIndent + hublIndent;
          }
          if (tagMatch) {
            const tagName = tagMatch[1].toLowerCase();
            const isClosing = token.value.startsWith("</");
            const isSelfClosingTag = token.value.endsWith("/>") || selfClosing.has(tagName);
            const isInlineTag = inline.has(tagName);
            if (isClosing) {
              if (blockLevelTags.has(tagName) && blockStack.length > 0 && blockStack[blockStack.length - 1].tagName === tagName) {
                blockStack.pop();
              }
              for (let j = htmlStack.length - 1; j >= 0; j--) {
                if (htmlStack[j].tagName === tagName) {
                  const removed = htmlStack.splice(j);
                  htmlIndent -= removed.length;
                  htmlIndent = Math.max(0, htmlIndent);
                  break;
                }
              }
              if (middleBlockActive) {
                effectiveIndent = middleBlockBaseIndent + (htmlIndent - middleBlockBaseIndentHtml) + (hublIndent - middleBlockBaseIndentHubl);
              } else {
                effectiveIndent = htmlIndent + hublIndent;
              }
              result.push(this.tab.repeat(effectiveIndent) + token.value);
            } else {
              let extraIndent = 0;
              if (blockStack.length > 0 && blockLevelTags.has(tagName) && !isSelfClosingTag && !isInlineTag) {
                const parent = blockStack[blockStack.length - 1];
                if (parent.childCount === 0) {
                  extraIndent = 1;
                }
              }
              result.push(this.tab.repeat(effectiveIndent + extraIndent) + token.value);
              if (!isSelfClosingTag && !isInlineTag) {
                htmlStack.push({ tagName });
                htmlIndent++;
                if (blockLevelTags.has(tagName)) {
                  blockStack.push({ tagName, childCount: 0 });
                }
                if (blockStack.length > 1) {
                  blockStack[blockStack.length - 2].childCount++;
                }
              } else {
                if (blockStack.length > 0) {
                  blockStack[blockStack.length - 1].childCount++;
                }
              }
            }
          } else {
            result.push(this.tab.repeat(effectiveIndent) + token.value);
            if (blockStack.length > 0) {
              blockStack[blockStack.length - 1].childCount++;
            }
          }
          lastWasMiddleBlock = false;
        } else if (token.type === "text") {
          let lines = token.value.split("\n");
          for (let k = 0; k < lines.length; k++) {
            let txt = lines[k];
            if (!txt.trim())
              continue;
            let effectiveIndent;
            if (middleBlockActive) {
              effectiveIndent = middleBlockBaseIndent + (htmlIndent - middleBlockBaseIndentHtml) + (hublIndent - middleBlockBaseIndentHubl);
            } else {
              effectiveIndent = htmlIndent + hublIndent;
            }
            result.push(this.tab.repeat(effectiveIndent) + txt.trim());
            if (blockStack.length > 0) {
              blockStack[blockStack.length - 1].childCount++;
            }
          }
          lastWasMiddleBlock = false;
        }
        if (token.type === "hubltag" && XRegExp.test(token.value.trim(), blockEnd)) {
          middleBlockActive = false;
          middleBlockBaseIndent = 0;
          middleBlockBaseIndentHtml = 0;
          middleBlockBaseIndentHubl = 0;
        }
        if (i + 1 < tokens.length && tokens[i + 1].type === "hubltag" && (XRegExp.test(tokens[i + 1].value.trim(), blockStart) || XRegExp.test(tokens[i + 1].value.trim(), blockMiddle))) {
          middleBlockActive = false;
          middleBlockBaseIndent = 0;
          middleBlockBaseIndentHtml = 0;
          middleBlockBaseIndentHubl = 0;
        }
      }
      return result.join("\n").replace(/\n{2,}/g, "\n");
    }
    // This method is no longer needed as we handle mixed content in one pass
    // but keeping it for backward compatibility if needed elsewhere
    parseBlocks(content) {
      return [{ type: "mixed", content, indent: 0 }];
    }
    extractBlockContent(fullContent, startTag, endTag) {
      const lines = fullContent.split("\n");
      const contentLines = [];
      let inContent = false;
      for (const line of lines) {
        if (line.trim().includes(startTag)) {
          inContent = true;
          const afterTag = line.substring(line.indexOf(">") + 1);
          if (afterTag.trim() && !afterTag.trim().includes(endTag)) {
            contentLines.push(afterTag);
          }
          continue;
        }
        if (line.trim().includes(endTag)) {
          inContent = false;
          const beforeTag = line.substring(0, line.indexOf(endTag));
          if (beforeTag.trim()) {
            contentLines.push(beforeTag);
          }
          break;
        }
        if (inContent) {
          contentLines.push(line);
        }
      }
      return contentLines.join("\n");
    }
    wrapInTags(content, startTag, endTag, originalContent) {
      const lines = originalContent.split("\n");
      const openingLine = lines.find((line) => line.includes(startTag)) || `${startTag}>`;
      const closingLine = lines.find((line) => line.includes(endTag)) || endTag;
      if (!content.trim()) {
        return `${openingLine}
${closingLine}`;
      }
      return `${openingLine}
${content}
${closingLine}`;
    }
  };

  // src/utils/html.js
  var HTMLStatic = class {
    static html() {
      return `
        <div class="">
    <div class="p-4 flex gap-4">
        <div class="w-[300px]">
            <div id="optionsContainer">
                <div class="text-lg font-medium text-gray-900 dark:text-gray-100 pb-2">Formatting Options:</div>
                <div id="hublOptions" class="space-y-2">
                    <label class="flex items-center space-x-2 text-sm">
                        <input type="checkbox" id="useHublDashes" class="rounded border-gray-300 text-blue-600" />
                        <span>Use HubL whitespace control ({%- -%})</span>
                    </label>
                </div>
                <div id="htmlOptions" class="space-y-2 mt-2">
                    <label class="flex items-center space-x-2 text-sm">
                        <input type="checkbox" id="removeDataAttributes" class="rounded border-gray-300 text-blue-600" />
                        <span>Remove data-* attributes</span>
                    </label>
                    <label class="flex items-center space-x-2 text-sm">
                        <input type="checkbox" id="removeClasses" class="rounded border-gray-300 text-blue-600" />
                        <span>Remove class attributes</span>
                    </label>
                    <label class="flex items-center space-x-2 text-sm">
                        <input type="checkbox" id="removeStyleAttrs" class="rounded border-gray-300 text-blue-600" />
                        <span>Remove style attributes</span>
                    </label>
                </div>
            </div>
        </div>
        <div class="w-[calc(100%-300px)]">
            <div class="grid grid-cols-1 lg:grid-cols-2">
                <!-- Input Section -->
                <div class="space-y-4">
                    <div class="flex items-center gap-4 input-wrapper">
                        <label for="inputCode" class="block text-sm font-medium text-gray-700 dark:text-gray-100">Input Code</label>
                        <span id="charCount" class="text-xs text-gray-500">0 characters</span>
                    </div>
                    <div class="relative line-wrapper">
                    <textarea id="inputCode" class="" placeholder="Paste your HubL/HTML code here..." spellcheck="false"></textarea>
                    <div class="input-lines" id="inputLines"></div>
                    </div>
                </div>

                <!-- Output Section -->
                <div class="space-y-4">
                    <div class="flex items-center gap-5 ">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-100">Formatted Output</label>
                        </div>
                        <span id="outputCharCount" class="text-xs text-gray-500">0 characters</span>
                        
                    </div>
                    <div class="relative">
                        <div class="absolute top-0 right-0 z-10">
                            <button id="copyBtn" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center space-x-2">
                                <span>Copy to Clipboard</span>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div class="relative line-wrapper">
                            <pre id="outputCode"></pre>
                            <div class="output-lines" id="outputLines"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        `;
    }
  };

  // src/main.js
  var HubLFormatterApp = class {
    constructor() {
      this.app = document.getElementById("app");
      if (!this.app) {
        console.error("Could not find app element");
        return;
      }
      this.formatHTMLWrapper = new HubLFormatter();
      this.formatHTML = this.formatHTMLWrapper.formatHTML.bind(this.formatHTMLWrapper);
      this.options = {
        useHublDashes: false,
        removeDataAttributes: false,
        removeClasses: false,
        removeStyleAttrs: false
      };
      this.hasHublCode = false;
      this.hasDataAttributes = false;
      this.elements = {};
      this.initUI();
      setTimeout(() => {
        this.setupEventListeners();
      }, 10);
    }
    initUI() {
      if (!this.app)
        return;
      this.app.innerHTML = HTMLStatic.html();
      this.elements = {
        input: document.getElementById("inputCode"),
        output: document.getElementById("outputCode"),
        formatBtn: document.getElementById("formatBtn"),
        copyBtn: document.getElementById("copyBtn"),
        charCount: document.getElementById("charCount"),
        outputCharCount: document.getElementById("outputCharCount"),
        optionsContainer: document.getElementById("optionsContainer"),
        hublOptions: document.getElementById("hublOptions"),
        htmlOptions: document.getElementById("htmlOptions"),
        useHublDashes: document.getElementById("useHublDashes"),
        removeDataAttrs: document.getElementById("removeDataAttributes"),
        removeClasses: document.getElementById("removeClasses"),
        removeStyleAttrs: document.getElementById("removeStyleAttrs"),
        inputLines: document.getElementById("inputLines"),
        outputLines: document.getElementById("outputLines")
      };
    }
    setupEventListeners() {
      if (!this.elements)
        return;
      const { input, inputLines, output, outputLines, copyBtn, useHublDashes, removeDataAttrs, removeClasses } = this.elements;
      if (!input || !output || !copyBtn) {
        console.error("Required elements not found");
        return;
      }
      let isSyncingScroll = false;
      const syncScroll = (source, targets) => {
        if (isSyncingScroll)
          return;
        isSyncingScroll = true;
        const ratio = source.scrollTop / (source.scrollHeight - source.clientHeight);
        targets.forEach((target) => {
          target.scrollTop = ratio * (target.scrollHeight - target.clientHeight);
        });
        isSyncingScroll = false;
      };
      input.addEventListener("scroll", () => {
        syncScroll(input, [inputLines, output, outputLines]);
      });
      output.addEventListener("scroll", () => {
        syncScroll(output, [outputLines, input, inputLines]);
      });
      const formatInput = async () => {
        this.analyzeCode();
        await this.formatCode();
        this.updateInputLineNumbers();
      };
      input.addEventListener("paste", (e) => {
        setTimeout(formatInput, 0);
      });
      input.addEventListener("input", formatInput);
      copyBtn.addEventListener("click", () => this.copyToClipboard());
      if (useHublDashes) {
        useHublDashes.addEventListener("change", (e) => {
          this.options.useHublDashes = e.target.checked;
          this.formatCode();
        });
      }
      if (removeDataAttrs) {
        removeDataAttrs.addEventListener("change", (e) => {
          this.options.removeDataAttributes = e.target.checked;
          this.formatCode();
        });
      }
      if (removeClasses) {
        removeClasses.addEventListener("change", (e) => {
          this.options.removeClasses = e.target.checked;
          this.formatCode();
        });
      }
      if (this.elements.removeStyleAttrs) {
        this.elements.removeStyleAttrs.addEventListener("change", (e) => {
          this.options.removeStyleAttrs = e.target.checked;
          this.formatCode();
        });
      }
    }
    analyzeCode() {
      const code = this.elements.input.value;
      this.updateCharCount(code.length);
      this.toggleOptions("hublOptions", true);
      this.toggleOptions("htmlOptions", true);
      this.elements.optionsContainer.classList.remove("hidden");
      if (this.elements.useHublDashes) {
        this.elements.useHublDashes.checked = false;
      }
      this.hasHublCode = /\{\s*[%#]/.test(code) || /\{%-?/.test(code);
      this.hasDataAttributes = /\sdata-\w+\s*=/.test(code);
    }
    toggleOptions(elementId, show) {
      const element = this.elements[elementId];
      if (element) {
        element.classList.toggle("hidden", !show);
      }
    }
    async formatCode() {
      if (!this.elements)
        return;
      const input = this.elements.input.value;
      if (!input.trim()) {
        this.elements.output.textContent = "";
        this.updateCharCount(0, true);
        this.updateOutputLineNumbers();
        this.updateInputLineNumbers();
        return;
      }
      let formatted = input;
      formatted = await this.formatHTML(input);
      if (this.options.useHublDashes) {
        formatted = this.addHublDashes(formatted);
      } else {
        formatted = formatted.replace(/\{\s*%-/g, "{%").replace(/-%\s*\}/g, "%}");
      }
      if (this.options.removeDataAttributes) {
        formatted = this.removeDataAttributes(formatted);
      }
      if (this.options.removeClasses) {
        formatted = this.removeClassAttributes(formatted);
      }
      if (this.options.removeStyleAttrs) {
        formatted = this.removeStyleAttributes(formatted);
      }
      this.elements.output.textContent = formatted;
      this.updateCharCount(formatted.length, true);
      this.updateOutputLineNumbers();
      this.updateInputLineNumbers();
    }
    addHublDashes(code) {
      if (!code)
        return code;
      code = code.replace(/\{\s*%-/g, "{%").replace(/-%\s*\}/g, "%}");
      code = code.replace(/(\{\s*%)(?!--)/g, "{%-").replace(/(?<!-)(%\s*\})/g, "-%}");
      return code;
    }
    removeDataAttributes(code) {
      return code.replace(/\s+data-[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|\S+))?/gi, "");
    }
    removeClassAttributes(code) {
      return code.replace(/\s+class\s*=\s*["'][^"']*["']/gi, "").replace(/\s+class\s*=[^\s>]+/gi, "");
    }
    removeStyleAttributes(code) {
      return code.replace(/\s+style\s*=\s*["'][^"']*["']/gi, "").replace(/\s+style\s*=[^\s>]+/gi, "");
    }
    updateInputLineNumbers() {
      const { input, inputLines } = this.elements;
      if (!input || !inputLines)
        return;
      const lines = input.value.split("\n").length || 1;
      inputLines.innerHTML = "";
      for (let i = 1; i <= lines; i++) {
        inputLines.innerHTML += `<div>${i}</div>`;
      }
    }
    updateOutputLineNumbers() {
      const { output, outputLines } = this.elements;
      if (!output || !outputLines)
        return;
      const lines = output.textContent.split("\n");
      outputLines.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join("");
    }
    updateCharCount(count, isOutput = false) {
      const label = isOutput ? "Output: " : "Input: ";
      const element = isOutput ? this.elements.outputCharCount : this.elements.charCount;
      if (element) {
        element.textContent = `${label}${count} character${count !== 1 ? "s" : ""}`;
      }
    }
    async copyToClipboard() {
      try {
        const output = this.elements.output.textContent;
        if (!output.trim()) {
          this.showError("No content to copy");
          return;
        }
        await navigator.clipboard.writeText(output);
        this.showSuccess("Copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        this.showError("Failed to copy to clipboard");
      }
    }
    showError(message) {
      this.showNotification(message, "bg-red-100 border-red-400 text-red-700");
    }
    showSuccess(message) {
      this.showNotification(message, "bg-green-100 border-green-500 text-green-700");
    }
    showNotification(message, className) {
      const notification = document.createElement("div");
      notification.className = `fixed bottom-4 right-4 px-4 py-2 border rounded shadow-lg ${className}`;
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3e3);
    }
  };
  function initApp() {
    try {
      window.app = new HubLFormatterApp();
      if (!window.app.app) {
        console.error("Failed to initialize app");
      }
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    setTimeout(initApp, 10);
  }
  var main_default = HubLFormatterApp;
})();
/*! Bundled license information:

xregexp/lib/xregexp.js:
  (*!
   * XRegExp 5.1.2
   * <xregexp.com>
   * Steven Levithan (c) 2007-present MIT License
   *)

xregexp/lib/addons/build.js:
  (*!
   * XRegExp.build 5.1.2
   * <xregexp.com>
   * Steven Levithan (c) 2012-present MIT License
   *)

xregexp/lib/addons/matchrecursive.js:
  (*!
   * XRegExp.matchRecursive 5.1.2
   * <xregexp.com>
   * Steven Levithan (c) 2009-present MIT License
   *)

xregexp/lib/addons/unicode-base.js:
  (*!
   * XRegExp Unicode Base 5.1.2
   * <xregexp.com>
   * Steven Levithan (c) 2008-present MIT License
   *)

xregexp/lib/addons/unicode-categories.js:
  (*!
   * XRegExp Unicode Categories 5.1.2
   * <xregexp.com>
   * Steven Levithan (c) 2010-present MIT License
   * Unicode data by Mathias Bynens <mathiasbynens.be>
   *)

xregexp/lib/addons/unicode-properties.js:
  (*!
   * XRegExp Unicode Properties 5.1.2
   * <xregexp.com>
   * Steven Levithan (c) 2012-present MIT License
   * Unicode data by Mathias Bynens <mathiasbynens.be>
   *)

xregexp/lib/addons/unicode-scripts.js:
  (*!
   * XRegExp Unicode Scripts 5.1.2
   * <xregexp.com>
   * Steven Levithan (c) 2010-present MIT License
   * Unicode data by Mathias Bynens <mathiasbynens.be>
   *)
*/
//# sourceMappingURL=bundle.js.map
