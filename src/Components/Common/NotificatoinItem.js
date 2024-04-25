import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { callAPIAction } from '../../Store/callAPI/actions';

const NotificationItem = ({ notification, toggleNotificationDropdown, isPreview, markAllAsRead }) => {
    const [isMarkRead, setIsMarkedRead] = useState(notification.isRead);
    const [isDeleted, setIsDeleted] = useState(false);
    let displaySeperator = false;

    const splitMessage = notification.body.split(' ').join(',').split(';');
    const bodySplittedMessage = [splitMessage[0].split(','), ...splitMessage.slice(1)].flat();
    const hrefList = JSON.parse(notification.content).reduce((hrefMap, current) => {
        hrefMap[current.ReferralCode] = current.ReferralId;
        return hrefMap;
    }, {});

    useEffect(() => {
        if (markAllAsRead) {
            setIsMarkedRead(true);
        } else {
            setIsMarkedRead(notification.isRead);
        }
    }, [notification, markAllAsRead]);

    const handleMarkRead = () => {
        // callAPIAction(NotificationMarkAsReadAPI, markNotificationAsReadURL(notification.notificationId));
        setIsMarkedRead(true);
    };

    const handleDelete = () => {
        // callAPIAction(NotificationDeleteAPI, deleteNotificationURL(notification.notificationId));
        setIsDeleted(true);
    };

    if (isDeleted) {
        return null;
    }
    return (
        <React.Fragment>
            <div className="text-reset notification-item d-block dropdown-item position-relative">
                <div className="d-flex">
                    <div className="flex-1">
                        <Link to={isPreview ? '/notifications' : '#'} onClick={isPreview ? toggleNotificationDropdown : handleMarkRead}>
                            <h6 className="mt-0 mb-2 lh-base word-break ">{notification.subject}</h6>
                            <p
                                className={`mb-0 fs-11 fw-medium text-muted d-flex justify-content-between mb-2 ${
                                    isPreview ? 'notification-content-preview' : 'notification-content'
                                }`}
                            >
                                {isPreview
                                    ? notification.body
                                    : bodySplittedMessage.map((message) => {
                                          if (hrefList[message]) {
                                              const seperator = displaySeperator ? ', ' : ' ';
                                              displaySeperator = true;
                                              return (
                                                  <>
                                                      {seperator}
                                                      <Link to={`/memberinfo?refid=${hrefList[message]}`}>{message} </Link>
                                                  </>
                                              );
                                          }
                                          return `${message} `;
                                      })}
                            </p>
                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted d-flex justify-content-between">
                                <span>
                                    <i className="ri-time-line align-middle fs-18"></i>{' '}
                                </span>
                            </p>
                        </Link>
                    </div>

                    <div>
                        {isMarkRead ? (
                            <i className="ri-mail-open-line align-middle fs-18 primary-color m-1 text-primary" title={'read'}></i>
                        ) : (
                            <i
                                className="ri-mail-unread-line align-middle fs-18 cursor-pointer primary-color text-primary m-1"
                                title={'markAsRead'}
                                onClick={handleMarkRead}
                            ></i>
                        )}
                        <i
                            className="ri-delete-bin-line align-middle fs-18 danger-color cursor-pointer text-danger m-1"
                            title={'deleteNotification'}
                            onClick={handleDelete}
                        ></i>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default NotificationItem;
