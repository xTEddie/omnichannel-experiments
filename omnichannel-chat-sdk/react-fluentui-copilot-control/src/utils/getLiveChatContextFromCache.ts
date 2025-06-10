const getLiveChatContextFromCache = () => {
  const cachedLiveChatContext = localStorage.getItem('liveChatContext');
  if (cachedLiveChatContext && Object.keys(JSON.parse(cachedLiveChatContext)).length > 0) {
    return JSON.parse(cachedLiveChatContext);
  }

  return undefined;
}

export default getLiveChatContextFromCache;