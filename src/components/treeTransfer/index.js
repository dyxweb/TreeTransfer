import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import _ from 'lodash';
import { Input, Tree, Button, Icon, Checkbox } from 'antd';
import { isLastLevelKey, mapCategoryData, getLastLevelData, filterCategoryData } from '../../utils';
import styles from './index.less';

const { Search } = Input;
@CSSModules(styles)
export default class TreeTransfer extends Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired, // 全量的tree数据源
    values: PropTypes.array, // 受控 优先级高于defaultValues
    defaultValues: PropTypes.array, // 非受控
    onMove: PropTypes.func, // 左右移动时的方法
    title: PropTypes.array.isRequired, // 穿梭框的标题
    showSearch: PropTypes.bool, // 是否显示搜索框
    searchItems: PropTypes.array, // 搜索时需要匹配的搜索项的属性
    searchPlaceholder: PropTypes.array, // 搜索矿的placeholder
    notFoundContent: PropTypes.node, // 无数据时的文本
    disabled: PropTypes.bool, // 是否禁用搜索框
    leftDisabled: PropTypes.bool, // 是否禁用左侧搜索框
    rightDisabled: PropTypes.bool, // 是否禁用右侧搜索框
  };

  static defaultProps = {
    dataSource: [],
    values: [],
    defaultValues: [],
    onMove: () => {},
    title: ['左侧标题', '右侧标题'],
    showSearch: true,
    searchItems: ['label', 'key'],
    searchPlaceholder: ['请输入', '请输入'],
    notFoundContent: '暂无数据',
    disabled: false,
    leftDisabled: false,
    rightDisabled: false,
  };

  // // 当传入的受控values和全量的dataSource和原来的state不同时，重新计算左右侧的数据
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { dataSource, values, disabled, leftDisabled, rightDisabled } = nextProps;
  //   if (!_.isEqual(values, prevState.selectValues) || !_.isEqual(dataSource, prevState.dataSource)) {
  //     const newLeftTreeDataSource = filterCategoryData(values, dataSource, 'filter', disabled || leftDisabled); // 左侧Tree的的展示数据
  //     const newRightTreeDataSource = filterCategoryData(values, dataSource, 'select', disabled || rightDisabled); // 右侧Tree的展示数据
  //     return {
  //       selectValues: values,
  //       leftTree: {
  //         ...prevState.leftTree,
  //         dataSource: newLeftTreeDataSource,
  //       },
  //       rightTree: {
  //         ...prevState.rightTree,
  //         dataSource: newRightTreeDataSource,
  //       },
  //     };
  //   } else {
  //     return null;
  //   }
  // }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource, // 全量的数据
      selectValues: (this.props.values && !_.isEmpty(this.props.values)) ? this.props.values : this.props.defaultValues, // 最后选择到右侧的values(values的优先级高于defaultValues)
      leftTree: {
        // 左侧剩余的数据
        dataSource: [], // 展示的数据
        selectDataSource: [], // 选中的产品数据
        filterSelectDataSource: [], // 去除选中的产品数据
        keys: [], // 选中的keys(包括已经选择移动到右边的keys)
        checkedKeys: [], // 受控选中的keys
        expandedKeys: [], // 展开的项
        autoExpandParent: true, // 自动展开父节点
        matchedKeys: [], // 匹配搜索内容的数据
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
        matchedKeys: [], // 匹配搜索内容的数据
      },
    };
  }

  componentDidMount() {
    this.changeDataSource(this.props);
  }

  //  当传入的受控values和全量的dataSource改变时，重新计算左右侧的数据
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.values, this.props.values) ||
      !_.isEqual(nextProps.dataSource, this.props.dataSource)
    ) {
      this.changeDataSource(nextProps);
    }
  }

  // 初始的数据赋值(根据selectValues以及dataSources计算左右侧的展示数据，同时会处理disabled属性)
  changeDataSource = props => {
    const { selectValues, dataSource } = this.state;
    const { disabled, leftDisabled, rightDisabled } = props;
    let newDataSource = _.cloneDeep(dataSource); // 新的全量数据
    // 如果设置disabled时将数据源全部disabled(数据结构参考Tree组件)
    if (disabled) {
      newDataSource = mapCategoryData(dataSource);
    }
    // 有value时计算两侧的dataSource
    const newLeftTreeDataSource = filterCategoryData(selectValues, dataSource, 'filter', disabled || leftDisabled); // 左侧Tree的的展示数据
    const newRightTreeDataSource = filterCategoryData(selectValues, dataSource, 'select', disabled || rightDisabled); // 右侧Tree的展示数据
    this.setState({
      dataSource: newDataSource,
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

  // 选择checkbox时改变状态的方法
  operationOnCheck = (keys, data, direction, rightToLeft, callback) => {
    const { leftDisabled, rightDisabled } = this.props;
    const newData = filterCategoryData(keys, data, 'filter', rightToLeft ? leftDisabled : false); // 去除选中的数据
    const selectDataCategory = filterCategoryData(keys, data, 'select', rightDisabled); // 选中的数据
    const changeState = direction === 'left' ? 'leftTree' : 'rightTree';
    if (rightToLeft) {
      // rightToLeft为true时会重新计算左侧Tree的selectDataSource和filterSelectDataSource
      const { leftTree: { checkedKeys } } = this.state;
      const newLeftKeys = [ ...checkedKeys, ...keys ];
      const newLeftFilterData = filterCategoryData(newLeftKeys, data, 'filter', leftDisabled);
      const newLeftSelectData = filterCategoryData(newLeftKeys, data, 'select', leftDisabled);
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

  // 渲染transfer的全选checkBox
  renderCheckBox = direction => {
    const { disabled, leftDisabled, rightDisabled } = this.props;
    const directionDisabled = direction === 'left' ? leftDisabled : rightDisabled;
    const { leftTree, rightTree } = this.state;
    const operationState = direction === 'left' ? leftTree : rightTree;
    const allLength = getLastLevelData(operationState.dataSource).length; // 所有最后一项的数据长度
    const selectLength = operationState.checkedKeys.length; // 所选择的数据长度
    const checkAllDisabled = disabled || directionDisabled || _.isEmpty(operationState.dataSource); // 全选的checkbox是否disabled
    // 全选或者全不选的状态
    const type = allLength === selectLength ? 'clear' : 'checkAll';
    if (selectLength === 0) {
      // 非全选状态
      return (
        <div>
          <Checkbox
            checked={false}
            indeterminate={false}
            onClick={() => this.checkAll(direction, type)}
            style={{ marginRight: '6px' }}
            disabled={checkAllDisabled}
          />
          {`${allLength}项`}
        </div>
      );
    } else {
      // 全选状态
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
    const selectAllKeys = getLastLevelData(this.state[operationState].dataSource).map(
      item => item.key
    );
    // 全选右侧时所有的key
    const allRightTreeKeys = getLastLevelData(this.state.rightTree.dataSource).map(
      item => item.key
    );
    // 全选左侧时所有的key
    const allKeys = getLastLevelData(this.state.dataSource).map(item => item.key);
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