import React, { Component } from "react";
import CSSModules from 'react-css-modules';
import { Tabs } from 'antd';
import TreeTransfer from '../../components/TreeTransfer'
import styles from './index.less';

const { TabPane } = Tabs;
const mockData = [
  {
    "title": '1',
    "key": "1",
    "children": [
      {
        "title": "1-0",
        "key": "1-0",
        "children": [
            {
              "title": "1-0-0",
              "key": "1-0-0"
            },
            {
              "title": "1-0-1",
              "key": "1-0-1"
            },
        ],
      },
      {
        "title": "1-1",
        "key": "1-1",
        "children": [
          {
            "title": "1-1-0",
            "key": "1-1-0"
          },
          {
            "title": "1-1-1",
            "key": "1-1-1"
          },
        ],
      }
    ],
  },
  {
    "title": '2',
    "key": "2",
    "children": [
      {
        "title": "2-0",
        "key": "2-0",
        "children": [
          {
            "title": "2-0-0",
            "key": "2-0-0"
          },
          {
            "title": "2-0-1",
            "key": "2-0-1"
          }
        ],
      },
      {
        "title": "2-1",
        "key": "2-1",
        "children": [
          {
            "title": "2-1-0",
            "key": "2-1-0"
          },
          {
            "title": "2-1-1",
            "key": "2-1-1"
          }
        ],
      },
    ],
  }
];
@CSSModules(styles)
export default class TreeTransferExer extends Component {
  onMove = (keys, info) => {
    console.log(keys);
    console.log(JSON.parse(info));
  }
  render() {
    return (
      <div styleName="container">
        <Tabs defaultActiveKey="normal">
          <TabPane tab="普通使用" key="normal">
            <TreeTransfer
              dataSource={mockData}
              title={['左侧标题', '右侧标题']}
              onMove={this.onMove}
            />
          </TabPane>
          <TabPane tab="defaultValues的使用" key="defaultValues">
            <TreeTransfer
              dataSource={mockData}
              title={['左侧标题', '右侧标题']}
              onMove={this.onMove}
              defaultValues={['1-0-0', '2-0-0']}
            />
          </TabPane>
          <TabPane tab="values的使用" key="values">
            <TreeTransfer
              dataSource={mockData}
              onMove={this.onMove}
              title={['左侧标题', '右侧标题']}
              values={['1-0-0', '2-0-0']}
            />
          </TabPane>
          <TabPane tab="禁用穿梭框" key="disabled">
            <TreeTransfer
              dataSource={mockData}
              title={['左侧标题', '右侧标题']}
              onMove={this.onMove}
              defaultValues={['1-0-0', '2-0-0']}
              disabled
            />
          </TabPane>
          <TabPane tab="左侧穿梭框禁用" key="leftDisabled">
            <TreeTransfer
              dataSource={mockData}
              title={['左侧标题', '右侧标题']}
              onMove={this.onMove}
              defaultValues={['1-0-0', '2-0-0']}
              leftDisabled
            />
          </TabPane>
          <TabPane tab="右侧穿梭框禁用" key="rightDisabled">
            <TreeTransfer
              dataSource={mockData}
              title={['左侧标题', '右侧标题']}
              onMove={this.onMove}
              defaultValues={['1-0-0', '2-0-0']}
              rightDisabled
            />
          </TabPane>
        </Tabs>
      </div>
    )  
  }
}
