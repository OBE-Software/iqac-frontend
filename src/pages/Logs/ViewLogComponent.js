import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { getLogDetailsAPI } from '../../helpers/APIs/CommonAPIs';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { callAPIAction } from '../../Store/callAPI/actions';
import { getLogDetailsURL } from '../../helpers/APIs/CustomURL';
import { CommonLoadingSkelton } from '../../Components/Common/skelton';
import { DataKey } from '../../Store/callAPI/allAPIs';

const ViewLogComponent = () => {
    const { id } = useParams();
    const [logDetails, setLogDetails] = useState({});
    const getLogDetailsApiData = useSelector((state) => SelectFullStateOfThisAPI(state, getLogDetailsAPI));
    const currentNavSub = useSelector((state) => SelectSearchValInStore(state, 'currentNavSub'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const permissionData = profileData?.permissionData && profileData.permissionData.find((item) => item.module.toLowerCase() === 'logs');

    useEffect(() => {
        callAPIAction(getLogDetailsAPI, getLogDetailsURL(id), null);
    }, []);
    useEffect(() => {
        if (getLogDetailsApiData?.[DataKey]?.isSuccess) {
            const data = getLogDetailsApiData?.[DataKey]?.data;
            setLogDetails(data);
            console.log(')))))))', data);
        } else {
            setLogDetails({});
        }
    }, [getLogDetailsApiData]);

    return (
        <section className="p-5 layout-cotainer">
            <Container fluid className="p-0">
                <h4 className="mt-0">Log Details</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Logs',
                            isLink: true,
                            link: '/logs'
                        },
                        {
                            label: logDetails?._id,
                            isLink: false
                        }
                    ]}
                />
                {/* method: { type: String },
                route: { type: String },
                status: { type: Number },
                body: { type: String },
                responseTime: { type: Number },
                timestamp: { type: String },
                referrer: { type: String },
                userAgent: { type: String },
                remoteAddress: { type: String },
                remoteUser: { type: String, default: null },
                httpVersion: { type: String } */}
                <div className="log-details">
                    <div className="flex-left">
                        <div className="info">
                            <p className="title-info">Method</p>
                            <p
                                className={`${
                                    logDetails?.method === 'GET'
                                        ? 'bg-get-method'
                                        : logDetails?.method === 'PUT'
                                        ? 'bg-put-method'
                                        : logDetails?.method === 'POST'
                                        ? 'bg-post-method '
                                        : logDetails?.method === 'DELETE'
                                        ? 'bg-delete-method'
                                        : null
                                } py-1 px-2 rounded fs-12 log-details__info-badge`}
                            >
                                {logDetails?.method || '-'}
                            </p>
                        </div>
                        <div className="info">
                            <p className="title-info">route</p>
                            <p className="body-info">{logDetails?.route || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Status</p>
                            <p className="body-info">{logDetails?.status || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Response Time</p>
                            <p className="body-info">{logDetails?.responseTime || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Referrer Url</p>
                            <p className="body-info">{logDetails?.referrer || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Timestamp</p>
                            <p className="body-info">{logDetails?.timestamp || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">User Agent</p>
                            <p className="body-info">{logDetails?.userAgent || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Remote Address (ip address)</p>
                            <p className="body-info">{logDetails?.remoteAddress || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Http Version</p>
                            <p className="body-info">{logDetails?.httpVersion || '-'}</p>
                        </div>
                    </div>
                    <div className="flex-right">
                        <div className="info">
                            <p className="title-info">Request Body</p>
                            <p className="body-info log-details__info-field">{logDetails?.body || '-'}</p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default ViewLogComponent;
