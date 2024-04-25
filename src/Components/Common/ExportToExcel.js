import * as XLSX from 'xlsx';

const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
        const propName = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            Object.assign(acc, flattenObject(value, propName));
        } else {
            acc[propName] = value;
        }

        return acc;
    }, {});
};

const ExportToExcel = (data, fileName) => {
    // Flatten each item in the data array
    const flattenedData = data.map((item) => flattenObject(item));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert flattened data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate Excel file binary data
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the Excel data
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Trigger file download
    saveAs(excelBlob, fileName);
};

const saveAs = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
};

export default ExportToExcel;
