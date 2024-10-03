import { IRecord, IWebRenderer } from './common.types';
export const sendAnalyticsEvent = (
  webRenderer: IWebRenderer,
  category: string,
  label: string,
  value?: string | IRecord
) => {
  let val = '';

  if (value) {
    val = typeof value === 'object' ? JSON.stringify(value) : value;
  }

  const MEASUREMENT_ID = 'G-BRNZ91CF58';
  const API_SEC = '8_s2IjRPQXOOGMiZtLnZQA';

  const payload = {
    client_id: 'ui_geeks_dep_ext',
    events: [
      {
        name: 'npm_dependencies_ui_geeks',
        params: {
          category: category,
          label: label,
          value: value
        }
      }
    ]
  };

  fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SEC}`,
    {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );
};
