import React from 'react';
import { useSelector } from 'react-redux';
import gghLogo from '../../assets/images/ggh-logo-1.png';
import { MemberInfoAPI } from '../../helpers/APIs/CommonAPIs';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';

export const PdfHeader = ({ assessmentName, classes, id, hideAssessment }) => {
    const referralMemberAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, MemberInfoAPI));
    const referralData = referralMemberAPIData?.response?.data;

    return (
        <div id={id} className={`pdfdownload-container  align-items-center justify-content-between ${classes}`}>
            <img src={gghLogo} alt="ggh logo" height={40} width={160} />
            <div className="d-flex">
                <div>
                    {!hideAssessment && <p className="mb-1">Assessment Name </p>}
                    <p className="mb-1">Member Name </p>
                    <p className="mb-1"> Member Id </p>
                    <p className="mb-1"> Date </p>
                </div>
                <div>
                    {!hideAssessment && (
                        <p className="mb-1" id="assessmentName">
                            {assessmentName}
                        </p>
                    )}
                    <p className="mb-1" id="fullName">
                        : {referralData?.fullName}
                    </p>
                    <p className="mb-1" id="referralCode">
                        : {referralData?.referralCode}
                    </p>
                    <p className="mb-1" id="date">
                        : {new Date().toLocaleDateString('en-US')}
                    </p>
                </div>
            </div>
        </div>
    );
};
