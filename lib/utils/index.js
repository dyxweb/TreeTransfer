'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// 判断选择的key是否为最后一层的key
var isLastLevelKey = exports.isLastLevelKey = function isLastLevelKey(dataSource, key) {
  var flag = false;
  var deep = function deep(data) {
    return data.some(function (item) {
      if (item.key === key) {
        if (!item.children || item.children.length <= 0) {
          flag = true;
          return true;
        } else {
          return deep(item.children);
        }
      } else if (item.children && item.children.length > 0) {
        return deep(item.children);
      }
    });
  };
  deep(dataSource);
  return flag;
};

// 对dataSource进行操作(主要用于disabled)
var mapCategoryData = exports.mapCategoryData = function mapCategoryData(categoryData) {
  var newData = [];
  categoryData.forEach(function (item) {
    var obj = {};
    if (Array.isArray(item.children) && item.children.length > 0) {
      var tempData = mapCategoryData(item.children);
      obj = _extends({}, item, { // 保留原来信息
        children: tempData,
        disabled: true
      });
    } else {
      obj = _extends({}, item, { // 保留原来信息
        disabled: true
      });
    }
    newData.push(obj);
  });
  return newData;
};

// 多层级数据获得最后一层的所有数据
var getLastLevelData = exports.getLastLevelData = function getLastLevelData(categoryData) {
  var newData = [];
  function deep(data) {
    data.forEach(function (item) {
      if (!item.children || _.isEmpty(item.children)) {
        newData.push(item);
      } else {
        deep(item.children);
      }
    });
  }
  deep(categoryData);
  return newData;
};

// 根据选择的keys(最后一级)生成类目结构数据的方法(type为select时为选择的数据，type为filter为过滤掉选择的数据)
var filterCategoryData = exports.filterCategoryData = function filterCategoryData(selectKeys, data, type, disabled) {
  var newData = [];
  data.forEach(function (item) {
    var obj = {};
    if (item.children && item.children.length > 0) {
      var tempData = filterCategoryData(selectKeys, item.children, type, disabled);
      obj = _extends({}, item, {
        children: tempData,
        disabled: disabled
      });
      if (!_.isEmpty(obj.children)) {
        newData.push(obj);
      }
    } else if (type === 'select' ? selectKeys.includes(item.key) : !selectKeys.includes(item.key)) {
      obj = _extends({}, item, {
        disabled: disabled
      });
      newData.push(obj);
    }
  });
  return newData;
};