/* eslint-disable camelcase */
/* eslint-disable no-console */
import React, { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import { useTrans } from '../Hooks/UserHooks';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { formatPhoneNumber } from '../../common/utils';
import phone from '../../assets/images/phone.png';
import { FIVE9_CAMPAIGN_ID } from '../constants/CommonConstants';
import { callAPIAction } from '../../Store/callAPI/actions';
import { UpdateContactAPI } from '../../helpers/APIs/CommonAPIs';
import _ from 'lodash';

const Five9Dialer = (props) => {
    const t = useTrans('referral');
    const contactList =
        _.uniqBy(
            props?.contacts?.length &&
                props?.contacts
                    .filter(
                        (i) =>
                            !i.dnc &&
                            i.contactState === null &&
                            i.contactType !== 'Email' &&
                            i.contactDetail &&
                            i.contactType !== 'Case Manager'
                    )
                    .reverse(),
            'contactDetail'
        ) || [];
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);

    let _f9_metadata; // The Five9 Metadata
    let _f9_baseUrl;
    let _f9_orgId;
    let _activeCall;
    let _cavs;

    async function getFive9MetaData() {
        try {
            console.info('Script: >>> getFive9MetaData');

            var response = await fetch('https://app.five9.com/appsvcs/rs/svc/auth/metadata', {
                cache: 'no-cache',
                credentials: 'include', // include, same-origin, *omit
                mode: 'cors' // no-cors, cors, *same-origin.
            });

            console.info(`Script: getFive9MetaData returned status ${response.status}`);

            let f9md;
            if (response.status === 200) {
                f9md = await response.json();
            } else {
                let resp;
                resp = await response.json();
                let errMsg = resp?.five9ExceptionDetail?.message || `Script: getFive9MetaData returned status ${response.status}`;
                throw errMsg;
            }

            _f9_metadata = f9md;

            let host = f9md.metadata.dataCenters[0].apiUrls[0].host;
            let port = f9md.metadata.dataCenters[0].apiUrls[0].port;
            _f9_baseUrl = `https://${host}:${port}`;
        } catch (err) {
            console.error('Script: getFive9MetaData failed: ' + err);
            throw err;
        }
    }

    async function getCallData(contact) {
        console.info('Script: >>> getCallData');
        try {
            let response = await fetch(
                'https://' +
                    _f9_metadata.metadata.dataCenters[0].apiUrls[0].host +
                    '/appsvcs/rs/svc/agents/' +
                    _f9_metadata.userId +
                    '/interactions/calls',
                {
                    method: 'GET',
                    cache: 'no-cache',
                    credentials: 'include', // include, same-origin, *omit
                    mode: 'cors' // no-cors, cors, *same-origin.
                }
            );

            let calls = await response.json();

            console.info('Script: Got Calls');
            console.info(calls);

            _activeCall = null;

            if (Array.isArray(calls) && calls.length > 0) {
                _activeCall = calls[0];

                // Updating Implify contact details
                callAPIAction(UpdateContactAPI, null, { ...contact, isSuccessfullyContacted: true });
            }

            if (_activeCall) {
                console.info('Script: Found active call');
                console.dir(_activeCall);
            } else {
                toast.error('Script: No active call found.');
                throw 'Script: No active call found.';
            }
        } catch (err) {
            toast.error('Script: getCallData failed: ' + err);
            console.error('Script: getCallData failed: ' + err);
            throw err;
        }
    }

    async function getCAVs() {
        try {
            console.info('Script: >>> getCAVs');
            let response = await fetch(
                'https://' +
                    _f9_metadata.metadata.dataCenters[0].apiUrls[0].host +
                    '/appsvcs/rs/svc/orgs/' +
                    _f9_metadata.orgId +
                    '/call_variables',
                {
                    cache: 'no-cache',
                    credentials: 'include', // include, same-origin, *omit
                    mode: 'cors' // no-cors, cors, *same-origin.
                }
            );

            let cavs = await response.json();

            console.info('Script: Got CAVs');
            console.dir(cavs);

            _cavs = cavs;
        } catch (err) {
            toast.error(err);
            console.error(err);
            throw err;
        }
    }

    function getCAVbyName(name) {
        if (name) {
            return _cavs.find((cav) => checkName(cav, name));
        }
        return undefined;
    }

    function checkName(cav, name) {
        if (name) {
            let parts = name.split('.');
            if (parts.length >= 2) {
                if (parts[0] === cav.group && parts[1] === cav.name) {
                    return true;
                }
            }
        }
        return false;
    }

    async function setCAV(id, value) {
        try {
            var cavPayload = {};
            cavPayload[id] = value;
            var bodyString = JSON.stringify(cavPayload);

            console.info(`Script: >>> setCav(${id}, ${value})`);
            console.info(bodyString);

            let response = await fetch(
                'https://' +
                    _f9_metadata.metadata.dataCenters[0].apiUrls[0].host +
                    '/appsvcs/rs/svc/agents/' +
                    _f9_metadata.userId +
                    '/interactions/calls/' +
                    _activeCall.id +
                    '/variables_2',
                {
                    method: 'PUT',
                    cache: 'no-cache',
                    credentials: 'include', // include, same-origin, *omit
                    mode: 'cors', // no-cors, cors, *same-origin.
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: bodyString
                }
            );

            let setCavResp = await response.json();

            console.info(`Script: Set CAV OK! ${id} --> ${value}`);
            console.dir(setCavResp);

            return setCavResp;
        } catch (err) {
            toast.error('Script: setCAV failed: ' + err);
            console.error('Script: setCAV failed: ' + err);
        }
    }

    async function clickToDial(contact) {
        const numberToDial = contact?.contactDetail?.replaceAll('-', '');
        try {
            await getFive9MetaData();

            // document.getElementById('numberInput').value;

            if (/\d{10}/.test(numberToDial) === false) {
                console.info('Invalid Number');
                return;
            }

            console.info(`Script: >>> clickToDial(${numberToDial})`);

            var url = `${_f9_baseUrl}/appsvcs/rs/svc/orgs/${_f9_metadata.orgId}/interactions/click_to_dial?`;

            var response = await fetch(
                url +
                    new URLSearchParams({
                        number: numberToDial,
                        dialImmediately: true,
                        skipDNCCheck: true,
                        campaignId: FIVE9_CAMPAIGN_ID
                    }),
                {
                    cache: 'no-cache',
                    credentials: 'include',
                    mode: 'cors'
                }
            );

            console.info(`Script: clickToDial returned status ${response.status}`);

            if (response.status === 200) {
                await getCallData(contact);

                await getCAVs();

                let sfIdCav = getCAVbyName('SalesforceContact.Id');

                setCAV(sfIdCav.id, 'bfg456');
            } else {
                toast.error(`Script: clickToDial returned status ${response.status}`);
                throw `Script: clickToDial returned status ${response.status}`;
            }
        } catch (err) {
            toast.error(err);
            console.error('Script: clickToDial failed: ' + err);
            throw err;
        }
    }
    if (props.directCall) {
        return (
            <>
                <img
                    type="button"
                    className={`rounded-circle header-profile-user me-2 ${
                        (props.contactState !== null || !props?.contact?.contactDetail || props?.contact.contactType === 'Case Manager') &&
                        'disable-img'
                    }`}
                    onClick={() => {
                        clickToDial(props.contact);
                    }}
                    src={phone}
                    alt={'Call'}
                    title={props.contactState === null ? 'Call' : null}
                />
            </>
        );
    }
    return (
        <Fragment>
            <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="start" {...props}>
                <DropdownToggle
                    className={`d-flex justify-content-start w-100 btn ps-2 rounded-0 ${
                        !contactList.length ? 'text-secondary bg-light border-0' : 'btn-soft-danger'
                    }`}
                    // size="sm"
                    disabled={!contactList.length}
                >
                    <i className="ri-phone-line "></i> <span className="ms-2">{t('translation:call')}</span>
                </DropdownToggle>
                <DropdownMenu>
                    {contactList &&
                        contactList.map((contact) => {
                            return (
                                <>
                                    <DropdownItem
                                        onClick={() => {
                                            clickToDial(contact);
                                        }}
                                    >
                                        {contact.relation}
                                        {contact.isSuccessfullyContacted && (
                                            <i class="ri-star-fill m-1 text-success" title="Last Connected"></i>
                                        )}
                                        <span className="text-muted d-block fs-12">{formatPhoneNumber(contact.contactDetail)}</span>
                                    </DropdownItem>
                                    <DropdownItem divider className="p-0 m-0" />
                                </>
                            );
                        })}
                </DropdownMenu>
            </Dropdown>
        </Fragment>
    );
};

export default Five9Dialer;
