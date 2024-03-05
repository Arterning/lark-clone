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
        </div>
        {
          <div className='info'>
            <Space>
              <span className='info-sub'>
                { data.createdBy && data.createdBy.username} 创建于 {dayjs(data.createdAt).format('MM-DD HH:mm') }
              </span>
              <span>{data.startDate? dayjs(data.startDate).format('YYYY-MM-DD') : ''}</span>
              <span>{data.startDate? '至' : ''}</span>
              <span>{data.endDate? dayjs(data.endDate).format('YYYY-MM-DD') : ''}</span>
            </Space>
          </div>
        }
      </div>
    </div>
  );
}

export default TodoCard;
