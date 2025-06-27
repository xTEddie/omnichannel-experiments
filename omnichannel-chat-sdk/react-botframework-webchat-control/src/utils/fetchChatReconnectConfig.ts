const fetchChatReconnectConfig = () => {
  const chatReconnectConfig: any = {
    reconnectId: null
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('oc.reconnectid') !== null) {
    chatReconnectConfig.reconnectId = urlParams.get('oc.reconnectid') || null;
  }

  return chatReconnectConfig;
}

export default fetchChatReconnectConfig;