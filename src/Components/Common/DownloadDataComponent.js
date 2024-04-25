import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import XmlIcon from '../../assets/images/svg/expand-left-right-line.svg';
const DownloadDataComponent = ({ donwloadExcel, donwloadJson, donwloadXML, downloadPdf }) => {
    // Dropdown Toggle
    const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);

    const toggleNotificationDropdown = () => {
        setIsNotificationDropdown(!isNotificationDropdown);
    };

    return (
        <Dropdown isOpen={isNotificationDropdown} toggle={toggleNotificationDropdown} className="mb-0 bg-white">
            <DropdownToggle type="button" tag="button" className=" btn btn-primary d-flex align-items-center">
                Download <i class="ri-download-line ms-2"></i>
            </DropdownToggle>
            <DropdownMenu className="">
                <DropdownItem onClick={donwloadExcel} className="d-flex align-items-center text-success">
                    <i class="ri-file-excel-2-line me-2"></i> Excel
                </DropdownItem>
                <DropdownItem onClick={donwloadJson} className="d-flex align-items-center text-success">
                    <i class="ri-braces-line me-2"></i> JSON
                </DropdownItem>
                <DropdownItem onClick={donwloadXML} className="d-flex align-items-center text-success">
                    <img src={XmlIcon} alt="xml" className="fs-16 w-15 text-primary me-2" /> XML
                </DropdownItem>
                <DropdownItem onClick={downloadPdf} className="d-flex align-items-center text-success">
                    <i class="ri-file-pdf-line me-2"></i> Pdf
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default DownloadDataComponent;
