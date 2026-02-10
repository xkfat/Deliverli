import { getStatusColor } from '../../utils/helpers';

const StatusBadge = ({ status, onClick }) => {
  return (
    <span
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;