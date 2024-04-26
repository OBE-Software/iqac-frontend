import React from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

const HelpVideosPage = () => {
    const helperVideosData = [
        {
            id: 1,
            title: 'Features to be explored in the Free Trial',
            ytLink: 'https://www.youtube.com/embed/kWt1uYajero',
            duration: '3m 36s'
        },
        {
            id: 2,
            title: 'Features to be explored in the Free Trial',
            ytLink: 'https://www.youtube.com/embed/kWt1uYajero',
            duration: '3m 36s'
        },
        {
            id: 3,
            title: 'Features to be explored in the Free Trial',
            ytLink: 'https://www.youtube.com/embed/kWt1uYajero',
            duration: '3m 36s'
        },
        {
            id: 4,
            title: 'Features to be explored in the Free Trial',
            ytLink: 'https://www.youtube.com/embed/kWt1uYajero',
            duration: '3m 36s'
        },
        {
            id: 5,
            title: 'Features to be explored in the Free Trial',
            ytLink: 'https://www.youtube.com/embed/kWt1uYajero',
            duration: '3m 36s'
        },
        {
            id: 6,
            title: 'Features to be explored in the Free Trial',
            ytLink: 'https://www.youtube.com/embed/kWt1uYajero',
            duration: '3m 36s'
        }
    ];

    return (
        <div className="p-5 layout-cotainer">
            <Container fluid className="p-0">
                <h4 className="mt-0">
                    {/* Logs ({GetAllLogsAPIData?.[DataKey]?.totalRecords ? GetAllLogsAPIData?.[DataKey]?.totalRecords : '0'}) */}
                    Help Videos
                </h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Help Videos',
                            isLink: false
                        }
                    ]}
                />
                <div className="d-flex justify-content-start flex-wrap">
                    {helperVideosData.map((video) => (
                        <div key={video.id} className="helper-video me-10" id="helper-video-1">
                            <iframe
                                src={video.ytLink}
                                title={video.title}
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen
                            ></iframe>
                            <div className="d-flex justify-content-between">
                                <p className="text-wrap">{video.title}</p>
                                <span className="ms-5 d-flex align-item-center">
                                    <i class="ri-time-line me-1"></i>
                                    {video.duration}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default HelpVideosPage;
