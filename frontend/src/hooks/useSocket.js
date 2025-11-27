import { useSocket as useSocketContext } from '../context/SocketContext';

// Re-export for convenience
export const useSocket = () => {
  return useSocketContext();
};
