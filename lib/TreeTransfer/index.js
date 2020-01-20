'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp, _initialiseProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactCssModules = require('react-css-modules');

var _reactCssModules2 = _interopRequireDefault(_reactCssModules);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _antd = require('antd');

var _utils = require('../utils');

var _index = require('./index.less');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Search = _antd.Input.Search;
var TreeTransfer = (_dec = (0, _reactCssModules2.default)(_index2.default), _dec(_class = (_temp = _class2 = function (_Component) {
  _inherits(TreeTransfer, _Component);

  function TreeTransfer(props) {
    _classCallCheck(this, TreeTransfer);

    var _this = _possibleConstructorReturn(this, (TreeTransfer.__proto__ || Object.getPrototypeOf(TreeTransfer)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      dataSource: _this.props.dataSource, // 全量的数据
      selectValues: _this.props.values ? _this.props.values : _this.props.defaultValues, // 最后选择到右侧的values(values的优先级高于defaultValues)
      leftTree: {
        // 左侧剩余的数据
        dataSource: [], // 展示的数据
        selectDataSource: [], // 选中的产品数据
        filterSelectDataSource: [], // 去除选中的产品数据
        keys: [], // 选中的keys(包括已经选择移动到右边的keys)
        checkedKeys: [], // 受控选中的keys
        expandedKeys: [], // 展开的项
        autoExpandParent: true, // 自动展开父节点
        matchedKeys: [] // 匹配搜索内容的数据
      },
      rightTree: {
        // 右侧已选择的数据
        dataSource: [], // 展示的数据
        selectDataSource: [], // 选中的产品数据
        filterSelectDataSource: [], // 去除选中的产品数据
        keys: [], // 选中的keys(和checkedKeys相同)
        checkedKeys: [], // 受控选中的keys
        expandedKeys: [], // 展开的项
        autoExpandParent: true, // 自动展开父节点
        matchedKeys: [] // 匹配搜索内容的数据
      }
    };
    return _this;
  }

  _createClass(TreeTransfer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.changeDataSource(this.props, this.state.selectValues);
    }

    //  当传入的受控values和全量的dataSource改变时，重新计算左右侧的数据

  }, {
    key: 'UNSAFE_componentWillReceiveProps',
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var values = nextProps.values,
          dataSource = nextProps.dataSource;
      var selectValues = this.state.selectValues;
      // dataSource数据源改变时重新计算

      if (!_lodash2.default.isEqual(dataSource, this.props.dataSource)) {
        this.changeDataSource(nextProps, selectValues);
      }
      // 受控的values改变时
      if (values && !_lodash2.default.isEqual(values, this.state.selectValues)) {
        this.changeDataSource(nextProps, nextProps.values);
      }
    }

    // 初始的数据赋值(根据selectValues以及dataSources计算左右侧的展示数据，同时会处理disabled属性)


    // 选择checkbox时改变状态的方法


    // 选中时的方法(rightToLeft表示右边移动到左边时调用该函数)


    // 左向右的按钮(左侧Tree新的数据源是左侧Tree的filterSelectDataSource，右侧Tree新的数据源是左侧Tree的selectDataSource)


    // 右向左的按钮


    // 渲染transfer的全选checkBox


    // checkBox的全选事件


    // 搜索筛选(设置expandedKeys和matchedKeys)


    // 展开或收起时操作

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          leftTree = _state.leftTree,
          rightTree = _state.rightTree;
      var _props = this.props,
          title = _props.title,
          showSearch = _props.showSearch,
          searchPlaceholder = _props.searchPlaceholder,
          notFoundContent = _props.notFoundContent;

      var leftFilterTreeNode = function leftFilterTreeNode(node) {
        return leftTree.matchedKeys && leftTree.matchedKeys.indexOf(node.props.eventKey) > -1;
      };
      var rightFilterTreeNode = function rightFilterTreeNode(node) {
        return rightTree.matchedKeys && rightTree.matchedKeys.indexOf(node.props.eventKey) > -1;
      };
      return _react2.default.createElement(
        'div',
        { styleName: 'tree-transfer' },
        _react2.default.createElement(
          'div',
          { styleName: 'transfer-box' },
          _react2.default.createElement(
            'div',
            { styleName: 'title' },
            _lodash2.default.get(title, 0, '选择框')
          ),
          showSearch && _react2.default.createElement(
            'div',
            { styleName: 'search-box' },
            _react2.default.createElement(Search, {
              style: { width: '95%', marginBottom: '10px' },
              onChange: function onChange(e) {
                return _this2.handleSearch(e, 'left');
              },
              placeholder: _lodash2.default.get(searchPlaceholder, 0, '请输入')
            })
          ),
          _lodash2.default.isEmpty(leftTree.dataSource) ? _react2.default.createElement(
            'div',
            { styleName: 'no-data' },
            notFoundContent
          ) : _react2.default.createElement(
            'div',
            { styleName: 'tree-box' },
            _react2.default.createElement(_antd.Tree, {
              expandedKeys: leftTree.expandedKeys,
              autoExpandParent: leftTree.autoExpandParent,
              filterTreeNode: leftFilterTreeNode,
              onExpand: function onExpand(keys) {
                return _this2.handleExpand(keys, 'left');
              },
              treeData: leftTree.dataSource,
              checkable: true,
              onCheck: function onCheck(keys, info) {
                return _this2.onCheck(keys, info, 'left', false);
              },
              checkedStrategy: 'child',
              checkedKeys: leftTree.checkedKeys
            })
          ),
          _react2.default.createElement(
            'div',
            { styleName: 'bottom-select' },
            this.renderCheckBox('left')
          )
        ),
        _react2.default.createElement(
          'div',
          { styleName: 'exchange-button' },
          _react2.default.createElement(
            _antd.Button,
            {
              onClick: this.leftToRight,
              disabled: leftTree.checkedKeys.length === 0,
              type: leftTree.checkedKeys.length !== 0 ? 'primary' : 'normal'
            },
            _react2.default.createElement(_antd.Icon, { type: 'right' })
          ),
          _react2.default.createElement(
            _antd.Button,
            {
              onClick: this.rightToLeft,
              disabled: rightTree.checkedKeys.length === 0,
              type: rightTree.checkedKeys.length !== 0 ? 'primary' : 'normal'
            },
            _react2.default.createElement(_antd.Icon, { type: 'left' })
          )
        ),
        _react2.default.createElement(
          'div',
          { styleName: 'transfer-box' },
          _react2.default.createElement(
            'div',
            { styleName: 'title' },
            _lodash2.default.get(title, 1, '已选择')
          ),
          showSearch && _react2.default.createElement(
            'div',
            { styleName: 'search-box' },
            _react2.default.createElement(Search, {
              style: { width: '95%', marginBottom: '10px' },
              onChange: function onChange(e) {
                return _this2.handleSearch(e, 'right');
              },
              placeholder: _lodash2.default.get(searchPlaceholder, 1, '请输入')
            })
          ),
          _lodash2.default.isEmpty(rightTree.dataSource) ? _react2.default.createElement(
            'div',
            { styleName: 'no-data' },
            notFoundContent
          ) : _react2.default.createElement(
            'div',
            { styleName: 'tree-box' },
            _react2.default.createElement(_antd.Tree, {
              expandedKeys: rightTree.expandedKeys,
              autoExpandParent: rightTree.autoExpandParent,
              filterTreeNode: rightFilterTreeNode,
              onExpand: function onExpand(keys) {
                return _this2.handleExpand(keys, 'right');
              },
              treeData: rightTree.dataSource,
              checkable: true,
              onCheck: function onCheck(keys, info) {
                return _this2.onCheck(keys, info, 'right', false);
              },
              checkedStrategy: 'child',
              checkedKeys: rightTree.checkedKeys
            })
          ),
          _react2.default.createElement(
            'div',
            { styleName: 'bottom-select' },
            this.renderCheckBox('right')
          )
        )
      );
    }
  }]);

  return TreeTransfer;
}(_react.Component), _class2.propTypes = {
  dataSource: _propTypes2.default.array.isRequired, // 全量的tree数据源
  values: _propTypes2.default.array, // 受控 优先级高于defaultValues
  defaultValues: _propTypes2.default.array, // 非受控
  onMove: _propTypes2.default.func, // 左右移动时的方法
  title: _propTypes2.default.array.isRequired, // 穿梭框的标题
  showSearch: _propTypes2.default.bool, // 是否显示搜索框
  searchItems: _propTypes2.default.array, // 搜索时需要匹配的搜索项的属性
  searchPlaceholder: _propTypes2.default.array, // 搜索矿的placeholder
  notFoundContent: _propTypes2.default.node, // 无数据时的文本
  disabled: _propTypes2.default.bool, // 是否禁用搜索框
  leftDisabled: _propTypes2.default.bool, // 是否禁用左侧搜索框
  rightDisabled: _propTypes2.default.bool // 是否禁用右侧搜索框
}, _class2.defaultProps = {
  dataSource: [],
  values: undefined,
  defaultValues: [],
  onMove: function onMove() {},
  title: ['左侧标题', '右侧标题'],
  showSearch: true,
  searchItems: ['label', 'key'],
  searchPlaceholder: ['请输入', '请输入'],
  notFoundContent: '暂无数据',
  disabled: false,
  leftDisabled: false,
  rightDisabled: false
}, _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.changeDataSource = function (props, filterValues) {
    var dataSource = props.dataSource,
        disabled = props.disabled,
        leftDisabled = props.leftDisabled,
        rightDisabled = props.rightDisabled;

    var newDataSource = _lodash2.default.cloneDeep(dataSource); // 新的全量数据
    // 如果设置disabled时将数据源全部disabled(数据结构参考Tree组件)
    if (disabled) {
      newDataSource = (0, _utils.mapCategoryData)(dataSource);
    }
    // 有value时计算两侧的dataSource
    var newLeftTreeDataSource = (0, _utils.filterCategoryData)(filterValues, newDataSource, 'filter', disabled || leftDisabled); // 左侧Tree的的展示数据
    var newRightTreeDataSource = (0, _utils.filterCategoryData)(filterValues, newDataSource, 'select', disabled || rightDisabled); // 右侧Tree的展示数据
    _this3.setState({
      dataSource: newDataSource,
      leftTree: _extends({}, _this3.state.leftTree, {
        dataSource: newLeftTreeDataSource
      }),
      rightTree: _extends({}, _this3.state.rightTree, {
        dataSource: newRightTreeDataSource
      })
    });
  };

  this.operationOnCheck = function (keys, data, direction, rightToLeft, callback) {
    var _props2 = _this3.props,
        leftDisabled = _props2.leftDisabled,
        rightDisabled = _props2.rightDisabled;

    var newData = (0, _utils.filterCategoryData)(keys, data, 'filter', rightToLeft ? leftDisabled : false); // 去除选中的数据
    var selectDataCategory = (0, _utils.filterCategoryData)(keys, data, 'select', rightDisabled); // 选中的数据
    var changeState = direction === 'left' ? 'leftTree' : 'rightTree';
    if (rightToLeft) {
      // rightToLeft为true时会重新计算左侧Tree的selectDataSource和filterSelectDataSource
      var checkedKeys = _this3.state.leftTree.checkedKeys;

      var newLeftKeys = [].concat(_toConsumableArray(checkedKeys), _toConsumableArray(keys));
      var newLeftFilterData = (0, _utils.filterCategoryData)(newLeftKeys, data, 'filter', leftDisabled);
      var newLeftSelectData = (0, _utils.filterCategoryData)(newLeftKeys, data, 'select', leftDisabled);
      // 右面选中移动到左边时生成左边的数据
      _this3.setState(_defineProperty({}, changeState, _extends({}, _this3.state[changeState], {
        dataSource: newData,
        selectDataSource: newLeftSelectData,
        filterSelectDataSource: newLeftFilterData
      })), function () {
        return callback && callback();
      });
    } else {
      _this3.setState(_defineProperty({}, changeState, _extends({}, _this3.state[changeState], {
        filterSelectDataSource: newData,
        selectDataSource: selectDataCategory
      })));
    }
  };

  this.onCheck = function (keys, info, direction, rightToLeft, callback) {
    var dataSource = _this3.props.dataSource;
    // 选择的keys中是最后一级的keys

    var lastLevelKey = keys.filter(function (item) {
      return (0, _utils.isLastLevelKey)(dataSource, item);
    });
    if (direction === 'left') {
      _this3.setState({
        leftTree: _extends({}, _this3.state.leftTree, {
          // 如果rightToLeft为true时checkedKeys还是原来的checkedKeys，否则为lastLevelKey
          checkedKeys: rightToLeft ? _this3.state.leftTree.checkedKeys : lastLevelKey,
          // 如果rightToLeft为true时keys是原来的checkedKeys加selectValues，否则为lastLevelKey加selectValues
          keys: rightToLeft ? _lodash2.default.uniq([].concat(_toConsumableArray(_this3.state.selectValues), _toConsumableArray(_this3.state.leftTree.checkedKeys))) : _lodash2.default.uniq([].concat(_toConsumableArray(_this3.state.selectValues), _toConsumableArray(lastLevelKey)))
        })
      }, function () {
        var newKeys = _lodash2.default.uniq([].concat(_toConsumableArray(lastLevelKey), _toConsumableArray(_this3.state.selectValues)));
        _this3.operationOnCheck(newKeys, dataSource, direction, rightToLeft, callback);
      });
    } else {
      // 选择的是右侧的Tree时只需要改变受控的keys然后调用operationOnCheck方法
      _this3.setState({
        rightTree: _extends({}, _this3.state.rightTree, {
          checkedKeys: lastLevelKey,
          keys: lastLevelKey
        })
      }, function () {
        return _this3.operationOnCheck(lastLevelKey, _this3.state.rightTree.dataSource, direction, rightToLeft);
      });
    }
  };

  this.leftToRight = function () {
    var onMove = _this3.props.onMove;
    var _state$leftTree = _this3.state.leftTree,
        selectDataSource = _state$leftTree.selectDataSource,
        filterSelectDataSource = _state$leftTree.filterSelectDataSource;

    _this3.setState({
      selectValues: _this3.state.leftTree.keys,
      leftTree: _extends({}, _this3.state.leftTree, {
        dataSource: filterSelectDataSource,
        matchedKeys: [],
        checkedKeys: [],
        filterSelectDataSource: [],
        selectDataSource: []
      }),
      rightTree: _extends({}, _this3.state.rightTree, {
        dataSource: selectDataSource
      })
    }, function () {
      var _state2 = _this3.state,
          selectValues = _state2.selectValues,
          leftTree = _state2.leftTree,
          rightTree = _state2.rightTree;
      // 左向右按钮点击之后，重新计算右边tree的相关state(兼容点击左向右按钮时右侧有选中项的情况)

      if (!_lodash2.default.isEmpty(rightTree.checkedKeys)) {
        _this3.operationOnCheck(rightTree.checkedKeys, rightTree.dataSource, 'right', false);
      }
      // 返回给父组件数据
      var categoryData = JSON.stringify([leftTree.dataSource, rightTree.dataSource]);
      onMove && onMove(selectValues, categoryData);
    });
  };

  this.rightToLeft = function () {
    var onMove = _this3.props.onMove;
    // 已选择的keys中去除右侧新选择的keys

    var newLeftKeys = _this3.state.selectValues.filter(function (item) {
      return !_this3.state.rightTree.keys.includes(item);
    });
    _this3.setState({
      selectValues: newLeftKeys,
      rightTree: _extends({}, _this3.state.rightTree, {
        dataSource: _this3.state.rightTree.filterSelectDataSource,
        keys: [],
        matchedKeys: [],
        selectDataSource: [],
        filterSelectDataSource: [],
        checkedKeys: []
      })
    }, function () {
      // 右向左移动时，左侧的数据需要重新计算
      _this3.onCheck(newLeftKeys, {}, 'left', true, function () {
        var _state3 = _this3.state,
            selectValues = _state3.selectValues,
            leftTree = _state3.leftTree,
            rightTree = _state3.rightTree;

        var categoryData = JSON.stringify([leftTree.dataSource, rightTree.dataSource]);
        onMove && onMove(selectValues, categoryData);
      });
    });
  };

  this.renderCheckBox = function (direction) {
    var _props3 = _this3.props,
        disabled = _props3.disabled,
        leftDisabled = _props3.leftDisabled,
        rightDisabled = _props3.rightDisabled;

    var directionDisabled = direction === 'left' ? leftDisabled : rightDisabled;
    var _state4 = _this3.state,
        leftTree = _state4.leftTree,
        rightTree = _state4.rightTree;

    var operationState = direction === 'left' ? leftTree : rightTree;
    var allLength = (0, _utils.getLastLevelData)(operationState.dataSource).length; // 所有最后一项的数据长度
    var selectLength = operationState.checkedKeys.length; // 所选择的数据长度
    var checkAllDisabled = disabled || directionDisabled || _lodash2.default.isEmpty(operationState.dataSource); // 全选的checkbox是否disabled
    // 全选或者全不选的状态
    var type = allLength === selectLength ? 'clear' : 'checkAll';
    if (selectLength === 0) {
      // 非全选状态
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_antd.Checkbox, {
          checked: false,
          indeterminate: false,
          onClick: function onClick() {
            return _this3.checkAll(direction, type);
          },
          style: { marginRight: '6px' },
          disabled: checkAllDisabled
        }),
        allLength + '\u9879'
      );
    } else {
      // 全选状态
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_antd.Checkbox, {
          checked: selectLength === allLength,
          indeterminate: selectLength !== allLength,
          onClick: function onClick() {
            return _this3.checkAll(direction, type);
          },
          style: { marginRight: '6px' }
        }),
        selectLength + '/' + allLength + '\u9879'
      );
    }
  };

  this.checkAll = function (direction, type) {
    var _props4 = _this3.props,
        leftDisabled = _props4.leftDisabled,
        rightDisabled = _props4.rightDisabled;

    var directionDisabled = direction === 'left' ? rightDisabled : leftDisabled;
    var operationState = direction === 'left' ? 'leftTree' : 'rightTree';
    var selectAllKeys = (0, _utils.getLastLevelData)(_this3.state[operationState].dataSource).map(function (item) {
      return item.key;
    });
    // 全选右侧时所有的key
    var allRightTreeKeys = (0, _utils.getLastLevelData)(_this3.state.rightTree.dataSource).map(function (item) {
      return item.key;
    });
    // 全选左侧时所有的key
    var allKeys = (0, _utils.getLastLevelData)(_this3.state.dataSource).map(function (item) {
      return item.key;
    });
    // 根据选择的方向生成对应的key
    var generateKeys = direction === 'left' ? allKeys : allRightTreeKeys;
    _this3.setState(_defineProperty({}, operationState, _extends({}, _this3.state[operationState], {
      selectDataSource: directionDisabled ? (0, _utils.mapCategoryData)(_this3.state.dataSource) : _this3.state.dataSource,
      filterSelectDataSource: [],
      checkedKeys: type === 'clear' ? [] : selectAllKeys,
      keys: type === 'clear' ? [] : generateKeys
    })));
  };

  this.handleSearch = function (e, direction) {
    var value = e.target.value;
    var searchItems = _this3.props.searchItems;

    var changeState = direction === 'left' ? 'leftTree' : 'rightTree';
    var dataSource = _this3.state[changeState].dataSource;
    value = value.trim();
    if (!value) {
      _this3.setState(_defineProperty({}, changeState, _extends({}, _this3.state[changeState], {
        matchedKeys: null,
        expandedKeys: []
      })));
      return;
    }
    var matchedKeys = [];
    var loop = function loop(data) {
      return data.forEach(function (item) {
        if (searchItems.some(function (searchItem) {
          return String(item[searchItem] || '').indexOf(value) > -1;
        })) {
          matchedKeys.push(item.key);
        }
        if (item.children && item.children.length) {
          loop(item.children);
        }
      });
    };
    loop(dataSource);

    _this3.setState(_defineProperty({}, changeState, _extends({}, _this3.state[changeState], {
      expandedKeys: [].concat(matchedKeys),
      autoExpandParent: true,
      matchedKeys: matchedKeys
    })));
  };

  this.handleExpand = function (keys, direction) {
    var changeState = direction === 'left' ? 'leftTree' : 'rightTree';
    _this3.setState(_defineProperty({}, changeState, _extends({}, _this3.state[changeState], {
      expandedKeys: keys,
      autoExpandParent: false
    })));
  };
}, _temp)) || _class);
exports.default = TreeTransfer;