import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import _ from 'lodash';
import { Input, Tree, Button, Icon, Checkbox } from 'antd';
import styles from './index.less';

const { Search } = Input;
// 判断选择的key是否为最后一层的key
const isLastLevelKey = (dataSource, key) => {
  let flag = false;
  const deep = data => {
    return data.some(item => {
      if (item.key === key ) {
        if (!item.children || item.children.length <= 0) {
          flag = true;
          return true;
        } else {
          return deep(item.children)
        }
      } else if (item.children && item.children.length > 0) {
        return deep(item.children)
      }
    })
  }
  deep(dataSource)
  return flag;
};

// 对dataSource进行操作(主要用于disabled)
const mapCategoryData = categoryData => {
  const newData = []; 
  categoryData.forEach(item => {
    let obj = {};
    if (Array.isArray(item.children) && item.children.length > 0) {
      const tempData = mapCategoryData(item.children);
      obj = {
        ...item, // 保留原来信息
        children: tempData,
        disabled: true,
      }
    } else {
      obj = {
        ...item, // 保留原来信息
        disabled: true,
      }
    }
    newData.push(obj);
  })
  return newData;
}

@CSSModules(styles)
export default class TreeTransfer extends Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired, 
    values: PropTypes.array, // 受控 优先级高于defaultValues
    onMove: PropTypes.func,
    title: PropTypes.array.isRequired,
    searchPlaceholder: PropTypes.array,
    showSearch: PropTypes.bool,
    searchItems: PropTypes.array,
    notFoundContent: PropTypes.node,
    defaultValues: PropTypes.array, // 非受控
    disabled: PropTypes.bool,
    leftDisabled: PropTypes.bool,
    rightDisabled: PropTypes.bool,
  };

  static defaultProps = {
    dataSource: [],
    showSearch: true,
    values: [],
    searchItems: ['label', 'key'],
    searchPlaceholder: ['请输入', '请输入'],
    notFoundContent: '暂无数据',
    disabled: false,
    leftDisabled: false,
    rightDisabled: false,
    defaultValues: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource, // 全量的数据
      selectValues: this.props.defaultValues, // 最后选择的values
      leftTree: {
        // 左侧全量数据的tree
        dataSource: [], // 展示的数据
        selectDataSource: [], // 选中的产品数据
        filterSelectDataSource: [], // 去除选中的产品数据
        keys: [], // 选中的keys(包括已经选择移动到右边的keys)
        expandedKeys: [], // 展开的项
        autoExpandParent: true, // 自动展开父节点
        matchedKeys: [], // 匹配搜索内容的数据
        checkedKeys: [], // 受控选中的keys
      },
      rightTree: {
        // 右侧已选择的产品的数据
        dataSource: [], // 展示的数据
        selectDataSource: [], // 选中的产品数据
        filterSelectDataSource: [], // 去除选中的产品数据
        keys: [], // 选中的keys(和checkedKeys相同)
        expandedKeys: [], // 展开的项
        autoExpandParent: true, // 自动展开父节点
        matchedKeys: [], // 匹配搜索内容的数据
        checkedKeys: [], // 受控选中的keys
      },
    };
  }

  componentDidMount() {
    const { values, leftDisabled, rightDisabled, disabled } = this.props;
    const { selectValues } = this.state;
    let { dataSource } = this.props;
    if (disabled) {
      dataSource = mapCategoryData(dataSource);
    }
    // 设置dataSource以及计算两侧tree的数据
    const newLeftTreeDataSource = this.filterCategoryData(selectValues, dataSource, 'filter', disabled || leftDisabled); // 左侧Tree的的展示数据
    const newRightTreeDataSource = this.filterCategoryData(selectValues, dataSource, 'select', disabled || rightDisabled); // 右侧Tree的展示数据
    this.setState({
      dataSource,
      leftTree: {
        ...this.state.leftTree,
        dataSource: newLeftTreeDataSource,
      },
      rightTree: {
        ...this.state.rightTree,
        dataSource: newRightTreeDataSource,
      },
    });
    // values不为空时重新计算两侧tree数据(受控的values)
    if (!_.isEmpty(values)) {
      this.changeDataSource(this.props);
    }
  }

  componentWillReceiveProps(newProps) {
    // 编辑状态下生成树形数据结构（当选择项和数据源改变时重新计算数据）
    if (!_.isEqual(newProps.values, this.props.values) ||
      !_.isEqual(newProps.dataSource, this.props.dataSource)
    ) {
      this.changeDataSource(newProps);
    }
  }

  // 初始的数据赋值
  changeDataSource = props => {
    console.log('rece');
    const { dataSource, values, disabled, leftDisabled, rightDisabled } = props;
    // 有value时计算两侧的dataSource
    const newLeftTreeDataSource = this.filterCategoryData(values, dataSource, 'filter', disabled || leftDisabled); // 左侧Tree的的展示数据
    const newRightTreeDataSource = this.filterCategoryData(values, dataSource, 'select', disabled || rightDisabled); // 右侧Tree的展示数据
    this.setState({
      selectValues: values,
      leftTree: {
        ...this.state.leftTree,
        dataSource: newLeftTreeDataSource,
      },
      rightTree: {
        ...this.state.rightTree,
        dataSource: newRightTreeDataSource,
      },
    });
  };

  // 根据选择的keys(最后一级)生成类目结构数据的方法(type为select时为选择的数据，type为filter为过滤掉选择的数据)
  filterCategoryData = (selectKeys, data, type, disabled) => {
    const newData = [];
    data.forEach(item => {
      let obj = {};
      if (item.children && item.children.length > 0) {
        const tempData = this.filterCategoryData(selectKeys, item.children, type, disabled);
        obj = {
          ...item,
          children: tempData,
          disabled,
        };
        if (!_.isEmpty(obj.children)) {
          newData.push(obj);
        }
      } else if (
        type === 'select' ? selectKeys.includes(item.key) : !selectKeys.includes(item.key)
      ) {
        obj = {
          ...item,
          disabled,
        };
        newData.push(obj);
      }
    });
    return newData;
  };

  // 多层级数据获得最后一层数据
  getLastLevelData = categoryData => {
    const newData = [];
    function deep(data) {
      data.forEach(item => {
        if (!item.children || _.isEmpty(item.children)) {
          newData.push(item);
        } else {
          deep(item.children);
        }
      });
    }
    deep(categoryData);
    return newData;
  }

  // 选择checkbox时改变状态的方法
  operationOnCheck = (keys, data, direction, rightToLeft, callback) => {
    const { leftDisabled, rightDisabled } = this.props;
    const newData = this.filterCategoryData(keys, data, 'filter', rightToLeft ? leftDisabled : false); // 去除选中的数据
    const selectDataCategory = this.filterCategoryData(keys, data, 'select', rightDisabled); // 选中的数据
    const changeState = direction === 'left' ? 'leftTree' : 'rightTree';
    if (rightToLeft) {
      // rightToLeft为true时会重新计算左侧Tree的selectDataSource和filterSelectDataSource
      const { leftTree: { checkedKeys } } = this.state;
      const newLeftKeys = [ ...checkedKeys, ...keys ];
      const newLeftFilterData = this.filterCategoryData(newLeftKeys, data, 'filter', leftDisabled);
      const newLeftSelectData = this.filterCategoryData(newLeftKeys, data, 'select', leftDisabled);
      // 右面选中移动到左边时生成左边的数据
      this.setState({
        [changeState]: {
          ...this.state[changeState],
          dataSource: newData,
          selectDataSource: newLeftSelectData,
          filterSelectDataSource: newLeftFilterData,
        },
      }, () => callback && callback());
    } else {
      this.setState({
        [changeState]: {
          ...this.state[changeState],
          filterSelectDataSource: newData,
          selectDataSource: selectDataCategory,
        },
      });
    }
  };

  // 选中时的方法(rightToLeft表示右边移动到左边时调用该函数)
  onCheck = (keys, info, direction, rightToLeft, callback) => {
    const { dataSource } = this.props;
    // 选择的keys中是最后一级的keys
    const lastLevelKey = keys.filter(item => isLastLevelKey(dataSource, item));
    if (direction === 'left') {
      this.setState(
        {
          leftTree: {
            ...this.state.leftTree,
            // 如果rightToLeft为true时checkedKeys还是原来的checkedKeys，否则为lastLevelKey
            checkedKeys: rightToLeft ? this.state.leftTree.checkedKeys : lastLevelKey,
            // 如果rightToLeft为true时keys是原来的checkedKeys加selectValues，否则为lastLevelKey加selectValues
            keys: rightToLeft ? _.uniq([ ...this.state.selectValues, ...this.state.leftTree.checkedKeys ]) : _.uniq([ ...this.state.selectValues, ...lastLevelKey ])
          },
        },
        () => {
          const newKeys = _.uniq([...lastLevelKey, ...this.state.selectValues]);
          this.operationOnCheck(newKeys, dataSource, direction, rightToLeft, callback);
        }
      );
    } else {
      // 选择的是右侧的Tree时只需要改变受控的keys然后调用operationOnCheck方法
      this.setState(
        {
          rightTree: {
            ...this.state.rightTree,
            checkedKeys: lastLevelKey,
            keys: lastLevelKey,
          },
        },
        () => this.operationOnCheck(lastLevelKey, this.state.rightTree.dataSource, direction, rightToLeft)
      );
    }
  };

  // 左向右的按钮(左侧Tree新的数据源是左侧Tree的filterSelectDataSource，右侧Tree新的数据源是左侧Tree的selectDataSource)
  leftToRight = () => {
    const { onMove } = this.props;
    const { leftTree: { selectDataSource, filterSelectDataSource } } = this.state;
    this.setState(
      {
        selectValues: this.state.leftTree.keys,
        leftTree: {
          ...this.state.leftTree,
          dataSource: filterSelectDataSource,
          matchedKeys: [],
          checkedKeys: [],
          filterSelectDataSource: [],
          selectDataSource: [],
        },
        rightTree: {
          ...this.state.rightTree,
          dataSource: selectDataSource,
        },
      },
      () => {
        const { selectValues, leftTree, rightTree } = this.state;
        // 左向右按钮点击之后，重新计算右边tree的相关state(兼容点击左向右按钮时右侧有选中项的情况)
        if (!_.isEmpty(rightTree.checkedKeys)) {
          this.operationOnCheck(rightTree.checkedKeys, rightTree.dataSource, 'right', false);
        }
        // 返回给父组件数据
        const categoryData = JSON.stringify([leftTree.dataSource, rightTree.dataSource]);
        onMove && onMove(selectValues, categoryData);
      }
    );
  };

  // 右向左的按钮
  rightToLeft = () => {
    const { onMove } = this.props;
    // 已选择的keys中去除右侧新选择的keys
    const newLeftKeys = this.state.selectValues.filter(
      item => !this.state.rightTree.keys.includes(item)
    );
    this.setState(
      {
        selectValues: newLeftKeys,
        rightTree: {
          ...this.state.rightTree,
          dataSource: this.state.rightTree.filterSelectDataSource,
          keys: [],
          matchedKeys: [],
          selectDataSource: [],
          filterSelectDataSource: [],
          checkedKeys: [],
        },
      },
      () => {
        // 右向左移动时，左侧的数据需要重新计算
        this.onCheck(newLeftKeys, {}, 'left', true, () => {
          const { selectValues, leftTree, rightTree } = this.state;
          const categoryData = JSON.stringify([leftTree.dataSource, rightTree.dataSource]);
          onMove && onMove(selectValues, categoryData);
        });
      }
    );
  };

  // 渲染transfer的checkBox
  renderCheckBox = direction => {
    const { disabled, leftDisabled, rightDisabled } = this.props;
    const directionDisabled = direction === 'left' ? leftDisabled : rightDisabled;
    const { leftTree, rightTree } = this.state;
    const operationState = direction === 'left' ? leftTree : rightTree;
    const allLength = this.getLastLevelData(operationState.dataSource).length;
    const selectLength = operationState.checkedKeys.length;
    // 全选或者全不选的状态
    const type = allLength === selectLength ? 'clear' : 'checkAll';
    if (selectLength === 0) {
      return (
        <div>
          <Checkbox
            checked={false}
            indeterminate={false}
            onClick={() => this.checkAll(direction, type)}
            style={{ marginRight: '6px' }}
            disabled={disabled || directionDisabled}
          />
          {`${allLength}项`}
        </div>
      );
    } else {
      return (
        <div>
          <Checkbox
            checked={selectLength === allLength}
            indeterminate={selectLength !== allLength}
            onClick={() => this.checkAll(direction, type)}
            style={{ marginRight: '6px' }}
          />
          {`${selectLength}/${allLength}项`}
        </div>
      );
    }
  };

  // checkBox的全选事件
  checkAll = (direction, type) => {
    const { leftDisabled, rightDisabled } = this.props;
    const directionDisabled = direction === 'left' ? rightDisabled : leftDisabled;
    const operationState = direction === 'left' ? 'leftTree' : 'rightTree';
    const selectAllKeys = this.getLastLevelData(this.state[operationState].dataSource).map(
      item => item.key
    );
    // 全选右侧时所有的key
    const allRightTreeKeys = this.getLastLevelData(this.state.rightTree.dataSource).map(
      item => item.key
    );
    // 全选左侧时所有的key
    const allKeys = this.getLastLevelData(this.state.dataSource).map(item => item.key);
    // 根据选择的方向生成对应的key
    const generateKeys = direction === 'left' ? allKeys : allRightTreeKeys;
    this.setState({
      [operationState]: {
        ...this.state[operationState],
        selectDataSource: directionDisabled ? mapCategoryData(this.state.dataSource) : this.state.dataSource,
        filterSelectDataSource: [],
        checkedKeys: type === 'clear' ? [] : selectAllKeys,
        keys: type === 'clear' ? [] : generateKeys,
      },
    });
  };

  // 搜索筛选(设置expandedKeys和matchedKeys)
  handleSearch = (e, direction) => {
    let { value } = e.target;
    const { searchItems } = this.props;
    const changeState = direction === 'left' ? 'leftTree' : 'rightTree';
    const dataSource = this.state[changeState].dataSource;
    value = value.trim();
    if (!value) {
      this.setState({
        [changeState]: {
          ...this.state[changeState],
          matchedKeys: null,
          expandedKeys: [],
        },
      });
      return;
    }
    const matchedKeys = [];
    const loop = data => data.forEach(item => {
      if (searchItems.some(searchItem => String(item[searchItem] || '').indexOf(value) > -1)) {
        matchedKeys.push(item.key);
      }
      if (item.children && item.children.length) {
        loop(item.children);
      }
    });
    loop(dataSource);

    this.setState({
      [changeState]: {
        ...this.state[changeState],
        expandedKeys: [...matchedKeys],
        autoExpandParent: true,
        matchedKeys,
      },
    });
  };

  // 展开或收起时操作
  handleExpand = (keys, direction) => {
    const changeState = direction === 'left' ? 'leftTree' : 'rightTree';
    this.setState({
      [changeState]: {
        ...this.state[changeState],
        expandedKeys: keys,
        autoExpandParent: false,
      },
    });
  };

  render() {
    const { leftTree, rightTree } = this.state;
    const { title, showSearch, searchPlaceholder, notFoundContent } = this.props;
    const leftFilterTreeNode =
      node => leftTree.matchedKeys && leftTree.matchedKeys.indexOf(node.props.eventKey) > -1;
    const rightFilterTreeNode =
      node => rightTree.matchedKeys && rightTree.matchedKeys.indexOf(node.props.eventKey) > -1;
    return (
      <div styleName="tree-transfer">
        <div styleName="transfer-box">
          <div styleName="title">{_.get(title, 0, '选择框')}</div>
          {showSearch && (
            <div styleName="search-box">
              <Search
                style={{ width: '95%', marginBottom: '10px' }}
                onChange={e => this.handleSearch(e, 'left')}
                placeholder={_.get(searchPlaceholder, 0, '请输入')}
              />
            </div>
          )}
          {_.isEmpty(leftTree.dataSource) ? (
            <div styleName="no-data">{notFoundContent}</div>
          ) : (
            <div styleName="tree-box">
              <Tree
                expandedKeys={leftTree.expandedKeys}
                autoExpandParent={leftTree.autoExpandParent}
                filterTreeNode={leftFilterTreeNode}
                onExpand={keys => this.handleExpand(keys, 'left')}
                treeData={leftTree.dataSource}
                checkable
                onCheck={(keys, info) => this.onCheck(keys, info, 'left', false)}
                checkedStrategy="child"
                checkedKeys={leftTree.checkedKeys}
              />
            </div>
          )}
          <div styleName="bottom-select">{this.renderCheckBox('left')}</div>
        </div>
        <div styleName="exchange-button">
          <Button
            onClick={this.leftToRight}
            disabled={leftTree.checkedKeys.length === 0}
            type={leftTree.checkedKeys.length !== 0 ? 'primary' : 'normal'}
          >
            <Icon type="right" />
          </Button>
          <Button
            onClick={this.rightToLeft}
            disabled={rightTree.checkedKeys.length === 0}
            type={rightTree.checkedKeys.length !== 0 ? 'primary' : 'normal'}
          >
            <Icon type="left" />
          </Button>
        </div>
        {/* 右侧tree */}
        <div styleName="transfer-box">
          <div styleName="title">{_.get(title, 1, '已选择')}</div>
          {showSearch && (
            <div styleName="search-box">
              <Search
                style={{ width: '95%', marginBottom: '10px' }}
                onChange={e => this.handleSearch(e, 'right')}
                placeholder={_.get(searchPlaceholder, 1, '请输入')}
              />
            </div>
          )}
          {_.isEmpty(rightTree.dataSource) ? (
            <div styleName="no-data">{notFoundContent}</div>
          ) : (
            <div styleName="tree-box">
              <Tree
                expandedKeys={rightTree.expandedKeys}
                autoExpandParent={rightTree.autoExpandParent}
                filterTreeNode={rightFilterTreeNode}
                onExpand={keys => this.handleExpand(keys, 'right')}
                treeData={rightTree.dataSource}
                checkable
                onCheck={(keys, info) => this.onCheck(keys, info, 'right', false)}
                checkedStrategy="child"
                checkedKeys={rightTree.checkedKeys}
              />
            </div>
          )}
          <div styleName="bottom-select">{this.renderCheckBox('right')}</div>
        </div>
      </div>
    );
  }
}
