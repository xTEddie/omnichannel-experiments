const fetchDebugConfig = () => {
  const config = {
    debug: false
  };

  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get('debug') !== null) {
    config.debug = urlParams.get('debug')?.toLocaleLowerCase() === 'true';
  }

  return config;
}

export default fetchDebugConfig;