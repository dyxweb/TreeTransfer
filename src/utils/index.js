// 判断选择的key是否为最后一层的key
export const isLastLevelKey = (dataSource, key) => {
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
export const disabledCategoryData = categoryData => {
  const newData = []; 
  categoryData.forEach(item => {
    let obj = {};
    if (Array.isArray(item.children) && item.children.length > 0) {
      const tempData = disabledCategoryData(item.children);
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

// 多层级数据获得最后一层的所有数据
export const getLastLevelData = categoryData => {
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

// 根据选择的keys(最后一级)生成类目结构数据的方法(type为select时为选择的数据，type为filter为过滤掉选择的数据)
export const filterCategoryData = (selectKeys, data, type, disabled) => {
  const newData = [];
  data.forEach(item => {
    let obj = {};
    if (item.children && item.children.length > 0) {
      const tempData = filterCategoryData(selectKeys, item.children, type, disabled);
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
