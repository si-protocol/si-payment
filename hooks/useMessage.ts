import { useContext } from 'react';
import { MessageContext } from 'contexts/message';

const useMessage = () => {
  const messageContext = useContext(MessageContext);
  if (messageContext === undefined) {
    throw new Error('Messages context undefined');
  }

  return messageContext;
};

export default useMessage;
