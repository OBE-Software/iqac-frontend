import React from 'react';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import SearchOption from '../../Components/Common/SearchOption';
import { GetBookingAllAPI } from '../../helpers/APIs/CommonAPIs';
import InputComponent from '../../Components/Common/InputComponent';
import { FetchingKey } from '../../Store/callAPI/allAPIs';
import Flatpickr from 'react-flatpickr';
import { dateInRequireFormate, exportPDFWithMethod, exportToJson } from '../../Components/Common/Util';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';
import exportFromJSON from 'export-from-json';

const BookingTableHeader = ({
    onChangeData,
    handleSearch,
    searchValue,
    CheckedValue,
    handleCheck,
    handleDate,
    filterDate,
    setFilterDate,
    bookingData,
    selectedData
}) => {
    const GetBookingAllAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetBookingAllAPI));

    const donwloadExcel = () => {
        ExportToExcel(selectedData?.length ? selectedData : bookingData, 'bookingData.xlsx');
    };
    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : bookingData, 'bookingData.json');
    };

    const donwloadXML = () => {
        let xmlFields = ['customerName', 'patientName', 'customerMobile', 'address', 'bookingStatusText'];

        const finalData = selectedData?.length ? selectedData : bookingData;
        const data = finalData.map((da) => {
            return {
                customerName: da.customer.fullName,
                patientName: da.patient.fullName,
                customerMobile: da.customer.mobile,
                ...da
            };
        });

        exportFromJSON({
            data,
            fineName: 'bookingData.xml',
            fields: xmlFields,
            exportType: 'xml'
        });
    };
    const downloadPdf = () => {
        exportPDFWithMethod('Bookings.pdf');
    };

    return (
        <section className="d-flex justify-content-between w-100 align-items-center">
            <div className="d-flex align-items-center">
                <div className="me-8 d-flex align-items-center gap-2">
                    {/* Download :
                    <i
                        class="ri-file-excel-2-line text-success cursor-pointer fs-22"
                        onClick={() => {
                            ExportToExcel(selectedData?.length ? selectedData : bookingData, 'bookingData.xlsx');
                        }}
                    ></i> */}
                    <DownloadDataComponent
                        donwloadExcel={donwloadExcel}
                        donwloadJson={donwloadJson}
                        donwloadXML={donwloadXML}
                        downloadPdf={downloadPdf}
                    />
                </div>
                <div className="me-8">
                    <InputComponent
                        className="form-check-input"
                        type="checkbox"
                        name="insuranceProgram"
                        id={1}
                        checked={CheckedValue === '1'}
                        value={'1'}
                        onChange={handleCheck}
                        disabled={false}
                    />
                    <label className={'my-auto ms-2 '} htmlFor={'1'}>
                        At Door Step
                    </label>
                </div>
                <div className="me-5">
                    <InputComponent
                        className="form-check-input"
                        type="checkbox"
                        name="insuranceProgram"
                        id={'2'}
                        checked={CheckedValue === '2'}
                        value={'2'}
                        onChange={handleCheck}
                        disabled={false}
                    />
                    <label className={'my-auto ms-2 '} htmlFor={'2'}>
                        At Diagnostic Center
                    </label>
                </div>
                <div>
                    <Flatpickr
                        id="Date"
                        className="w-100 flatpickr-input"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e)}
                        onClose={handleDate}
                        onre
                        placeholder="From Date And To Date"
                        options={{
                            formatDate: (date) => {
                                return dateInRequireFormate(date, 'm/d/y');
                            },
                            mode: 'range'
                        }}
                    />
                </div>
            </div>
            <div className="d-flex d-flex justify-content-end align-items-center">
                <SearchOption
                    value={searchValue}
                    handleSearch={handleSearch}
                    onChangeData={onChangeData}
                    disabled={GetBookingAllAPIData?.[FetchingKey]}
                />
            </div>
        </section>
    );
};

export default BookingTableHeader;
