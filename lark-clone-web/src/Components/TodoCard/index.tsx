import React, { useContext } from 'react';
import type { MenuProps } from 'antd';
import { Button, Checkbox, Dropdown, Space } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { TodoItem } from '../../types/Todo';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: <a>查看历史记录</a>,
  },
  {
    key: '2',
    label: <a>删除任务</a>,
  },
];

interface IProps {
  data: TodoItem;
  onDetail?: (todo: TodoItem) => void;
  onHistory?: (todo: TodoItem) => void;
}

const TodoCard = (props: IProps) => {
  const { data, onDetail, onHistory } = props;
  const now = new Date().getTime();
  const expired = (data.endDate?.getTime() || 0 < now) || false;

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  const handleMenuClick: MenuProps['onClick'] = async (e) => {
    
  };


  return (
    <div className='todo-wrap' onClick={() => onDetail?.(data)}>
      <div className='todo'>
        <div className='title'>
          <div>{data.title}</div>
          <Dropdown
            placement="bottomRight"
            menu={{
              items,
              onClick: handleMenuClick
            }}
          >
            <Button type="text" size='small' onClick={handleDropdownClick}>
              <EllipsisOutlined rev={""}/>
            </Button>
          </Dropdown>
        </div>
        {
          <div className='info'>
            <Space>
              <span className={expired ? 'expired' : ''}>
                { (data.endDate?.getTime() || 0) > 0 ? `${dayjs(data.endDate).format('MM-DD')}截止` : '未安排' }
              </span>
              <span className='info-sub'>
                { data.createdBy && data.createdBy.username} 创建于 {dayjs(data.createdAt).format('MM-DD') }
              </span>
            </Space>
          </div>
        }
      </div>
    </div>
  );
}

export default TodoCard;
