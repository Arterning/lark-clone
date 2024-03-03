import { Space } from 'antd';
import dayjs from 'dayjs';
import { TodoItem } from '../../types/Todo';


interface IProps {
  data: TodoItem;
  onDetail?: (todo: TodoItem) => void;
}

const TodoCard = (props: IProps) => {
  const { data, onDetail } = props;

  return (
    <div className='todo-wrap' onClick={() => onDetail?.(data)}>
      <div className='todo'>
        <div className='title'>
          <div>{data.title}</div>
          <div>{data.startDate? dayjs(data.startDate).format('MM-DD') : ''}</div>
          <div>{data.endDate? dayjs(data.endDate).format('MM-DD') : ''}</div>
        </div>
        {
          <div className='info'>
            <Space>
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
