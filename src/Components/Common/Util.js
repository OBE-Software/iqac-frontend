import { savePDF } from '@progress/kendo-react-pdf';
import ReactDOM from 'react-dom';

const getDate = (date, dateWithoutTime) => {
    const sDate = new Date();
    if (!date) {
        date = new Date(sDate);
    }
    date = new Date(date);
    let DATE_OPTIONS = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    if (dateWithoutTime) {
        DATE_OPTIONS = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
    }
    return date.toLocaleDateString('en-US', DATE_OPTIONS);
};

const dateInRequireFormate = (param, formate) => {
    if (param === '' || param === null || (typeof param === 'object' && !Date.parse(param))) {
        return '';
    }
    const dateObj = new Date(param);
    if (isNaN(new Date(dateObj).getTime())) return 'NA';
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const min = dateObj.getMinutes();
    const seco = dateObj.getSeconds();
    switch (formate) {
        case 'm-d-y':
            return month + '-' + day + '-' + year;
        case 'd-m-y':
            return day + '-' + month + '-' + year;
        case 'm/d/y':
            return month + '/' + day + '/' + year;
        case 'd/m/y':
            return day + '/' + month + '/' + year;
        case 'm/d/y/t':
            return pad(month) + '/' + pad(day) + '/' + year + ' ' + pad(hours) + ':' + pad(min) + ':' + pad(seco);
        default:
            return day + '/' + month + '/' + year;
    }
};

function pad(n) {
    return n < 10 ? '0' + n : n;
}

const downloadFile = ({ data, fileName, fileType }) => {
    console.log(data);
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    a.dispatchEvent(clickEvt);
    a.remove();
};
const exportToJson = (data, fileName) => {
    console.log(data);
    downloadFile({
        data: JSON.stringify(data),
        fileName: fileName,
        fileType: 'text/json'
    });
};
// pdf export event
const exportPDFWithMethod = (fileName) => {
    let el = document.querySelector('.k-grid');
    const copy = el.cloneNode(true);
    let element = document.createElement('div');
    element.setAttribute('id', 'test');
    element.appendChild(copy);
    let domElement = ReactDOM.findDOMNode(element);
    document.body.appendChild(domElement);

    savePDF(
        element,
        {
            paperSize: 'A4',
            keepTogether: 'p',
            margin: { top: '1cm', bottom: '1cm', left: '0.2cm', right: '0.2cm' },
            scale: 0.5,
            fileName
        },
        () => document.querySelector('#test').remove()
    );
};
export { getDate, dateInRequireFormate, downloadFile, exportToJson, exportPDFWithMethod };
