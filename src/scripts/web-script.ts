// @ts-nocheck
import { IRecord } from '../common.types';
// var vscode = acquireVsCodeApi();
const setContent = (id: string, htmlContent: string, onlyIfData?: boolean) => {
  const elm = document.getElementById(id);
  if (elm) {
    if (onlyIfData && !htmlContent) {
      elm.innerHTML = '';
      return;
    }
    elm.innerHTML = htmlContent;
  }
};

const showElement = (id: string, flag: boolean, blockProperty?: string) => {
  const elm = document.getElementById(id);
  if (elm) {
    if (flag === true) {
      elm.style.display = blockProperty || 'block';
    }
    if (flag === false) {
      elm.style.display = 'none';
    }
  }
};

window.addEventListener('message', (event: IRecord) => {
  const message = event.data;
  const data = message.data;

  const downloadBtn = document.getElementById('downloadLink');

  switch (message.command) {
    case 'downloadingStart':
      if (downloadBtn) {
        downloadBtn.textContent = 'Downloading...';
        downloadBtn.style.disabled = true;
      }
      break;

    case 'downloadingEnd':
      if (downloadBtn) {
        downloadBtn.textContent = 'Download';
        downloadBtn.style.disabled = false;
      }
      break;

    case 'updateDependencyTablesContent':
      setContent(`dependency_tables`, data.htmlContent);
      break;

    case 'updatePackageVulInCell':
      setContent(`td_vul_${data.id}`, data.htmlContent);
      setContent(`td_vul_fix_${data.id}`, data.fixAvlContent);
      break;

    case 'updateOutdatedPackage':
      setContent(`td_out_${data.id}`, data.htmlContent);
      setContent(`td_out_wanted_${data.id}`, data.wantedContent);
      setContent(`td_out_latest_${data.id}`, data.latestContent);
      break;

    case 'updateSummaryContent':
      setContent(`summary_table`, data.htmlContent);
      showElement(`scan_info_box`, true, 'flex');

      setContent(`scan_time`, data.scanTime || '-');
      showElement(`scan_time`, true, 'flex');

      break;

    case 'updateOutdatedSummaryContent':
      if (!data.htmlContent) {
        showElement(`outdated_summary`, false);
        return;
      }

      setContent(`outdated_summary`, data.htmlContent);
      showElement(`outdated_summary`, true, 'flex');
      break;

    case 'updateVulnerabilitySummaryContent':
      if (!data.htmlContent) {
        showElement(`vulnerability_summary`, false);
        return;
      }

      setContent(`vulnerability_summary`, data.htmlContent);
      showElement(`vulnerability_summary`, true, 'flex');
      break;

    case 'updatePackagesSummaryContent':
      if (!data.htmlContent) {
        showElement(`packages_summary`, false);
        return;
      }

      setContent(`packages_summary`, data.htmlContent);
      showElement(`packages_summary`, true, 'flex');
      break;

    case 'vulnerabilityDetailTableContent':
      if (!data.htmlContent) {
        showElement(`vulnerability_detail_table`, false);
        return;
      }

      setContent(`vulnerability_detail_table`, data.htmlContent);
      showElement(`vulnerability_detail_table`, true, 'flex');
      break;

    case 'updateAuditingStatusContent':
      if (data.isAuditing) {
        showElement(`audit_now_btn`, false);
        showElement(`auditing_now_btn`, true);

        showElement(`outdated_summary`, false);
        showElement(`vulnerability_summary`, false);
        showElement(`packages_summary`, false);
        showElement(`vulnerability_detail_table`, false);
      } else {
        showElement(`audit_now_btn`, true);
        showElement(`auditing_now_btn`, false);
      }

      break;

    case 'updateDirectPackageContent':
      setContent(`dp_${data.id}`, data.htmlContent);
      break;
  }
});
