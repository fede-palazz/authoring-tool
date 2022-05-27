import ZoomIn from './zoom-in.svg';
import ZoomOut from './zoom-out.svg';
import ResetZoom from './reset-zoom.svg';
import ExportDiag from './export-diag.svg';
import ExportDiagSvg from './export-svg.svg';
import ImportDiag from './import-diag.svg';
import NewDiag from './new-diag.svg';

function createIcon(iconPath) {
  return function Icon(className = '', altText = '', tooltipText = '') {
    // return `<img
    //     src="${iconPath}"
    //   alt="${altText}"
    //   title="${tooltipText}"
    //   class="icon ${className}"
    // />`;
    const icon = document.createElement('img');
    icon.src = iconPath;
    icon.classList.add('icon');
    if (className) icon.classList.add(className);
    icon.alt = altText;
    icon.title = tooltipText;
    return icon;
  };
}

export const ZoomInIcon = createIcon(ZoomIn);
export const ZoomOutIcon = createIcon(ZoomOut);
export const ResetZoomIcon = createIcon(ResetZoom);
export const ExportDiagIcon = createIcon(ExportDiag);
export const ExportDiagSvgIcon = createIcon(ExportDiagSvg);
export const ImportDiagIcon = createIcon(ImportDiag);
export const NewDiagIcon = createIcon(NewDiag);
