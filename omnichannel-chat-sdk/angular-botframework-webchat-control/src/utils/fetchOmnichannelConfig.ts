import { environment } from './../environments/environment';

const fetchOmnichannelConfig = () => {
  const omnichannelConfig = { // Default config
    orgId: environment.omnichannelConfig.orgId || '',
    orgUrl: environment.omnichannelConfig.orgUrl || '',
    widgetId: environment.omnichannelConfig.widgetId || ''
  };

  const urlParams = new URLSearchParams(window.location.search);

  // Overrides default config if URL any param is found
  if (urlParams.get('orgUrl') !== null) {
    omnichannelConfig.orgUrl = urlParams.get('orgUrl')!;
  }

  if (urlParams.get('orgId') !== null) {
    omnichannelConfig.orgId = urlParams.get('orgId')!;
  }

  if (urlParams.get('widgetId') !== null) {
    omnichannelConfig.widgetId = urlParams.get('widgetId')!;
  }

  return omnichannelConfig;
}

export default fetchOmnichannelConfig;
