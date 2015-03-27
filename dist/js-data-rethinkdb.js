module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var rethinkdbdash = _interopRequire(__webpack_require__(1));

	var JSData = _interopRequire(__webpack_require__(2));

	var DSUtils = JSData.DSUtils;
	var P = DSUtils.Promise;
	var contains = DSUtils.contains;
	var forOwn = DSUtils.forOwn;
	var deepMixIn = DSUtils.deepMixIn;
	var forEach = DSUtils.forEach;
	var isObject = DSUtils.isObject;
	var isArray = DSUtils.isArray;
	var isString = DSUtils.isString;
	var removeCircular = DSUtils.removeCircular;

	var keys = _interopRequire(__webpack_require__(3));

	var isEmpty = _interopRequire(__webpack_require__(4));

	var upperCase = _interopRequire(__webpack_require__(5));

	var underscore = _interopRequire(__webpack_require__(6));

	var omit = _interopRequire(__webpack_require__(7));

	var Defaults = function Defaults() {
	  _classCallCheck(this, Defaults);
	};

	Defaults.prototype.host = "localhost";
	Defaults.prototype.port = 28015;
	Defaults.prototype.authKey = "";
	Defaults.prototype.db = "test";
	Defaults.prototype.min = 10;
	Defaults.prototype.max = 50;
	Defaults.prototype.bufferSize = 10;

	var reserved = ["orderBy", "sort", "limit", "offset", "skip", "where"];

	var DSRethinkDBAdapter = (function () {
	  function DSRethinkDBAdapter(options) {
	    _classCallCheck(this, DSRethinkDBAdapter);

	    options = options || {};
	    this.defaults = new Defaults();
	    deepMixIn(this.defaults, options);
	    this.r = rethinkdbdash(this.defaults);
	    this.databases = {};
	    this.tables = {};
	    this.indices = {};
	  }

	  _createClass(DSRethinkDBAdapter, {
	    selectTable: {
	      value: function selectTable(resourceConfig, options) {
	        return this.r.db(options.db || this.defaults.db).table(resourceConfig.table || underscore(resourceConfig.name));
	      }
	    },
	    filterSequence: {
	      value: function filterSequence(sequence, params) {
	        var r = this.r;
	        params = params || {};
	        params.where = params.where || {};
	        params.orderBy = params.orderBy || params.sort;
	        params.skip = params.skip || params.offset;

	        forEach(keys(params), function (k) {
	          var v = params[k];
	          if (!contains(reserved, k)) {
	            if (isObject(v)) {
	              params.where[k] = v;
	            } else {
	              params.where[k] = {
	                "==": v
	              };
	            }
	            delete params[k];
	          }
	        });

	        var query = sequence;

	        if (!isEmpty(params.where)) {
	          query = query.filter(function (row) {
	            var subQuery = undefined;
	            forOwn(params.where, function (criteria, field) {
	              if (!isObject(criteria)) {
	                params.where[field] = {
	                  "==": criteria
	                };
	              }
	              forOwn(criteria, function (v, op) {
	                if (op === "==" || op === "===") {
	                  subQuery = subQuery ? subQuery.and(row(field)["default"](null).eq(v)) : row(field)["default"](null).eq(v);
	                } else if (op === "!=" || op === "!==") {
	                  subQuery = subQuery ? subQuery.and(row(field)["default"](null).ne(v)) : row(field)["default"](null).ne(v);
	                } else if (op === ">") {
	                  subQuery = subQuery ? subQuery.and(row(field)["default"](null).gt(v)) : row(field)["default"](null).gt(v);
	                } else if (op === ">=") {
	                  subQuery = subQuery ? subQuery.and(row(field)["default"](null).ge(v)) : row(field)["default"](null).ge(v);
	                } else if (op === "<") {
	                  subQuery = subQuery ? subQuery.and(row(field)["default"](null).lt(v)) : row(field)["default"](null).lt(v);
	                } else if (op === "<=") {
	                  subQuery = subQuery ? subQuery.and(row(field)["default"](null).le(v)) : row(field)["default"](null).le(v);
	                } else if (op === "isectEmpty") {
	                  subQuery = subQuery ? subQuery.and(row(field)["default"]([]).setIntersection(r.expr(v)["default"]([])).count().eq(0)) : row(field)["default"]([]).setIntersection(r.expr(v)["default"]([])).count().eq(0);
	                } else if (op === "isectNotEmpty") {
	                  subQuery = subQuery ? subQuery.and(row(field)["default"]([]).setIntersection(r.expr(v)["default"]([])).count().ne(0)) : row(field)["default"]([]).setIntersection(r.expr(v)["default"]([])).count().ne(0);
	                } else if (op === "in") {
	                  subQuery = subQuery ? subQuery.and(r.expr(v)["default"](r.expr([])).contains(row(field)["default"](null))) : r.expr(v)["default"](r.expr([])).contains(row(field)["default"](null));
	                } else if (op === "notIn") {
	                  subQuery = subQuery ? subQuery.and(r.expr(v)["default"](r.expr([])).contains(row(field)["default"](null)).not()) : r.expr(v)["default"](r.expr([])).contains(row(field)["default"](null)).not();
	                } else if (op === "|==" || op === "|===") {
	                  subQuery = subQuery ? subQuery.or(row(field)["default"](null).eq(v)) : row(field)["default"](null).eq(v);
	                } else if (op === "|!=" || op === "|!==") {
	                  subQuery = subQuery ? subQuery.or(row(field)["default"](null).ne(v)) : row(field)["default"](null).ne(v);
	                } else if (op === "|>") {
	                  subQuery = subQuery ? subQuery.or(row(field)["default"](null).gt(v)) : row(field)["default"](null).gt(v);
	                } else if (op === "|>=") {
	                  subQuery = subQuery ? subQuery.or(row(field)["default"](null).ge(v)) : row(field)["default"](null).ge(v);
	                } else if (op === "|<") {
	                  subQuery = subQuery ? subQuery.or(row(field)["default"](null).lt(v)) : row(field)["default"](null).lt(v);
	                } else if (op === "|<=") {
	                  subQuery = subQuery ? subQuery.or(row(field)["default"](null).le(v)) : row(field)["default"](null).le(v);
	                } else if (op === "|isectEmpty") {
	                  subQuery = subQuery ? subQuery.or(row(field)["default"]([]).setIntersection(r.expr(v)["default"]([])).count().eq(0)) : row(field)["default"]([]).setIntersection(r.expr(v)["default"]([])).count().eq(0);
	                } else if (op === "|isectNotEmpty") {
	                  subQuery = subQuery ? subQuery.or(row(field)["default"]([]).setIntersection(r.expr(v)["default"]([])).count().ne(0)) : row(field)["default"]([]).setIntersection(r.expr(v)["default"]([])).count().ne(0);
	                } else if (op === "|in") {
	                  subQuery = subQuery ? subQuery.or(r.expr(v)["default"](r.expr([])).contains(row(field)["default"](null))) : r.expr(v)["default"](r.expr([])).contains(row(field)["default"](null));
	                } else if (op === "|notIn") {
	                  subQuery = subQuery ? subQuery.or(r.expr(v)["default"](r.expr([])).contains(row(field)["default"](null)).not()) : r.expr(v)["default"](r.expr([])).contains(row(field)["default"](null)).not();
	                }
	              });
	            });
	            return subQuery;
	          });
	        }

	        if (params.orderBy) {
	          if (isString(params.orderBy)) {
	            params.orderBy = [[params.orderBy, "asc"]];
	          }
	          for (var i = 0; i < params.orderBy.length; i++) {
	            if (isString(params.orderBy[i])) {
	              params.orderBy[i] = [params.orderBy[i], "asc"];
	            }
	            query = upperCase(params.orderBy[i][1]) === "DESC" ? query.orderBy(r.desc(params.orderBy[i][0])) : query.orderBy(params.orderBy[i][0]);
	          }
	        }

	        if (params.skip) {
	          query = query.skip(params.skip);
	        }

	        if (params.limit) {
	          query = query.limit(params.limit);
	        }

	        return query;
	      }
	    },
	    waitForDb: {
	      value: function waitForDb(options) {
	        options = options || {};
	        var db = options.db || this.defaults.db;
	        if (!this.databases[db]) {
	          this.databases[db] = this.r.branch(this.r.dbList().contains(db), true, this.r.dbCreate(db)).run();
	        }
	        return this.databases[db];
	      }
	    },
	    waitForTable: {
	      value: function waitForTable(table, options) {
	        var _this = this;

	        options = options || {};
	        var db = options.db || this.defaults.db;
	        return this.waitForDb(options).then(function () {
	          _this.tables[db] = _this.tables[db] || {};
	          if (!_this.tables[db][table]) {
	            _this.tables[db][table] = _this.r.branch(_this.r.db(db).tableList().contains(table), true, _this.r.db(db).tableCreate(table)).run();
	          }
	          return _this.tables[db][table];
	        });
	      }
	    },
	    waitForIndex: {
	      value: function waitForIndex(table, index, options) {
	        var _this = this;

	        options = options || {};
	        var db = options.db || this.defaults.db;
	        return this.waitForDb(options).then(function () {
	          return _this.waitForTable(table, options);
	        }).then(function () {
	          _this.indices[db] = _this.indices[db] || {};
	          _this.indices[db][table] = _this.indices[db][table] || {};
	          if (!_this.tables[db][table][index]) {
	            _this.tables[db][table][index] = _this.r.branch(_this.r.db(db).table(table).indexList().contains(index), true, _this.r.db(db).table(table).indexCreate(index)).run().then(function () {
	              return _this.r.db(db).table(table).indexWait(index).run();
	            });
	          }
	          return _this.tables[db][table][index];
	        });
	      }
	    },
	    find: {
	      value: function find(resourceConfig, id, options) {
	        var _this = this;

	        var newModels = {};
	        var models = {};
	        var merge = {};
	        options = options || {};
	        var table = resourceConfig.table || underscore(resourceConfig.name);
	        var tasks = [this.waitForTable(table, options)];
	        forEach(resourceConfig.relationList, function (def) {
	          var relationName = def.relation;
	          var relationDef = resourceConfig.getResource(relationName);
	          if (!relationDef) {
	            throw new JSData.DSErrors.NER(relationName);
	          } else if (!options["with"] || !contains(options["with"], relationName)) {
	            return;
	          }
	          if (def.foreignKey) {
	            tasks.push(_this.waitForIndex(relationDef.table || underscore(relationDef.name), def.foreignKey, options));
	          } else if (def.localKey) {
	            tasks.push(_this.waitForIndex(resourceConfig.table || underscore(resourceConfig.name), def.localKey, options));
	          }
	        });
	        return P.all(tasks).then(function () {
	          return _this.r["do"](_this.r.table(table).get(id), function (doc) {
	            forEach(resourceConfig.relationList, function (def) {
	              var relationName = def.relation;
	              models[relationName] = resourceConfig.getResource(relationName);
	              if (!options["with"] || !contains(options["with"], relationName)) {
	                return;
	              }
	              if (!models[relationName]) {
	                throw new JSData.DSErrors.NER(relationName);
	              }
	              var localKey = def.localKey;
	              var localField = def.localField;
	              var foreignKey = def.foreignKey;
	              if (def.type === "belongsTo") {
	                merge[localField] = _this.r.table(models[relationName].table || underscore(models[relationName].name)).get(doc(localKey)["default"](""));
	                newModels[localField] = {
	                  modelName: relationName,
	                  relation: "belongsTo"
	                };
	              } else if (def.type === "hasMany") {
	                merge[localField] = _this.r.table(models[relationName].table || underscore(models[relationName].name)).getAll(id, { index: foreignKey }).coerceTo("ARRAY");

	                newModels[localField] = {
	                  modelName: relationName,
	                  relation: "hasMany"
	                };
	              } else if (def.type === "hasOne") {
	                merge[localField] = _this.r.table(models[relationName].table || underscore(models[relationName].name));

	                if (localKey) {
	                  merge[localField] = merge[localField].get(localKey);
	                } else {
	                  merge[localField] = merge[localField].getAll(id, { index: foreignKey }).coerceTo("ARRAY");
	                }

	                newModels[localField] = {
	                  modelName: relationName,
	                  relation: "hasOne"
	                };
	              }
	            });

	            if (!isEmpty(merge)) {
	              return doc.merge(merge);
	            }
	            return doc;
	          }).run();
	        }).then(function (item) {
	          if (!item) {
	            return P.reject(new Error("Not Found!"));
	          } else {
	            forOwn(item, function (localValue, localKey) {
	              if (localKey in newModels) {
	                if (isObject(localValue)) {
	                  item[localKey] = item[localKey];
	                } else if (isArray(localValue)) {
	                  if (newModels[localKey].relation === "hasOne" && localValue.length) {
	                    item[localKey] = localValue[0];
	                  } else {
	                    item[localKey] = localValue;
	                  }
	                }
	              }
	            });
	            return item;
	          }
	        });
	      }
	    },
	    findAll: {
	      value: function findAll(resourceConfig, params, options) {
	        var _this = this;

	        options = options || {};
	        var table = resourceConfig.table || underscore(resourceConfig.name);
	        var tasks = [this.waitForTable(table, options)];
	        var models = {};
	        var merge = {};
	        var newModels = {};
	        forEach(resourceConfig.relationList, function (def) {
	          var relationName = def.relation;
	          var relationDef = resourceConfig.getResource(relationName);
	          if (!relationDef) {
	            throw new JSData.DSErrors.NER(relationName);
	          } else if (!options["with"] || !contains(options["with"], relationName)) {
	            return;
	          }
	          if (def.foreignKey) {
	            tasks.push(_this.waitForIndex(relationDef.table || underscore(relationDef.name), def.foreignKey, options));
	          } else if (def.localKey) {
	            tasks.push(_this.waitForIndex(resourceConfig.table || underscore(resourceConfig.name), def.localKey, options));
	          }
	        });
	        return P.all(tasks).then(function () {
	          var query = _this.filterSequence(_this.selectTable(resourceConfig, options), params);
	          if (options["with"] && options["with"].length) {
	            query = query.map(function (doc) {
	              var id = doc(resourceConfig.idAttribute);
	              forEach(resourceConfig.relationList, function (def) {
	                var relationName = def.relation;
	                models[relationName] = resourceConfig.getResource(relationName);
	                if (!options["with"] || !contains(options["with"], relationName)) {
	                  return;
	                }
	                if (!models[relationName]) {
	                  throw new JSData.DSErrors.NER(relationName);
	                }
	                var localKey = def.localKey;
	                var localField = def.localField;
	                var foreignKey = def.foreignKey;
	                if (def.type === "belongsTo") {
	                  merge[localField] = _this.r.table(models[relationName].table || underscore(models[relationName].name)).get(doc(localKey)["default"](""));
	                  newModels[localField] = {
	                    modelName: relationName,
	                    relation: "belongsTo"
	                  };
	                } else if (def.type === "hasMany") {
	                  merge[localField] = _this.r.table(models[relationName].table || underscore(models[relationName].name)).getAll(id, { index: foreignKey }).coerceTo("ARRAY");

	                  newModels[localField] = {
	                    modelName: relationName,
	                    relation: "hasMany"
	                  };
	                } else if (def.type === "hasOne") {
	                  merge[localField] = _this.r.table(models[relationName].table || underscore(models[relationName].name));

	                  if (localKey) {
	                    merge[localField] = merge[localField].get(localKey);
	                  } else {
	                    merge[localField] = merge[localField].getAll(id, { index: foreignKey }).coerceTo("ARRAY");
	                  }

	                  newModels[localField] = {
	                    modelName: relationName,
	                    relation: "hasOne"
	                  };
	                }
	              });

	              if (!isEmpty(merge)) {
	                return doc.merge(merge);
	              }
	              return doc;
	            });
	          }
	          return query.run();
	        });
	      }
	    },
	    create: {
	      value: function create(resourceConfig, attrs, options) {
	        var _this = this;

	        attrs = removeCircular(omit(attrs, resourceConfig.relationFields || []));
	        options = options || {};
	        return this.waitForTable(resourceConfig.table || underscore(resourceConfig.name), options).then(function () {
	          return _this.r.db(options.db || _this.defaults.db).table(resourceConfig.table || underscore(resourceConfig.name)).insert(attrs, { returnChanges: true }).run();
	        }).then(function (cursor) {
	          return cursor.changes[0].new_val;
	        });
	      }
	    },
	    update: {
	      value: function update(resourceConfig, id, attrs, options) {
	        var _this = this;

	        attrs = removeCircular(omit(attrs, resourceConfig.relationFields || []));
	        options = options || {};
	        return this.waitForTable(resourceConfig.table || underscore(resourceConfig.name), options).then(function () {
	          return _this.r.db(options.db || _this.defaults.db).table(resourceConfig.table || underscore(resourceConfig.name)).get(id).update(attrs, { returnChanges: true }).run();
	        }).then(function (cursor) {
	          return cursor.changes[0].new_val;
	        });
	      }
	    },
	    updateAll: {
	      value: function updateAll(resourceConfig, attrs, params, options) {
	        var _this = this;

	        attrs = removeCircular(omit(attrs, resourceConfig.relationFields || []));
	        options = options || {};
	        params = params || {};
	        return this.waitForTable(resourceConfig.table || underscore(resourceConfig.name), options).then(function () {
	          return _this.filterSequence(_this.selectTable(resourceConfig, options), params).update(attrs, { returnChanges: true }).run();
	        }).then(function (cursor) {
	          var items = [];
	          cursor.changes.forEach(function (change) {
	            return items.push(change.new_val);
	          });
	          return items;
	        });
	      }
	    },
	    destroy: {
	      value: function destroy(resourceConfig, id, options) {
	        var _this = this;

	        options = options || {};
	        return this.waitForTable(resourceConfig.table || underscore(resourceConfig.name), options).then(function () {
	          return _this.r.db(options.db || _this.defaults.db).table(resourceConfig.table || underscore(resourceConfig.name)).get(id)["delete"]().run();
	        }).then(function () {
	          return undefined;
	        });
	      }
	    },
	    destroyAll: {
	      value: function destroyAll(resourceConfig, params, options) {
	        var _this = this;

	        options = options || {};
	        params = params || {};
	        return this.waitForTable(resourceConfig.table || underscore(resourceConfig.name), options).then(function () {
	          return _this.filterSequence(_this.selectTable(resourceConfig, options), params)["delete"]().run();
	        }).then(function () {
	          return undefined;
	        });
	      }
	    }
	  });

	  return DSRethinkDBAdapter;
	})();

	module.exports = DSRethinkDBAdapter;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("rethinkdbdash");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("js-data");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("mout/object/keys");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("mout/lang/isEmpty");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("mout/string/upperCase");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("mout/string/underscore");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("mout/object/omit");

/***/ }
/******/ ]);