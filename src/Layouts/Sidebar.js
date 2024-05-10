import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Container, UncontrolledAccordion } from 'reactstrap';
import { SelectSearchValInStore } from '../Store/commonStore/selectors';
import { addCurrentNavToStore, addCurrentSubNavToStore } from '../Store/commonStore/actions';
import { navData } from './layoutUtils';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const Sidebar = ({ setterSidebar }) => {
    const currentNav = useSelector((state) => SelectSearchValInStore(state, 'currentNav'));
    const currentNavSub = useSelector((state) => SelectSearchValInStore(state, 'currentNavSub'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));

    const handleClickMainItem = (item) => {
        addCurrentNavToStore(item.label);
        addCurrentSubNavToStore('');
    };
    const handleClickSubItem = (item, subItem) => {
        addCurrentNavToStore(item.label);
        addCurrentSubNavToStore(subItem.label);
    };

    const [open, setOpen] = useState('1');
    const toggle = (id) => {
        if (open === id) {
            setOpen();
        } else {
            setOpen(id);
        }
    };

    const profileNavItem = {
        id: 'profile',
        label: 'Profile',
        icon: () => <AccountCircleOutlinedIcon fontSize="small" />,
        link: '/profile'
    };

    return (
        <React.Fragment>
            <div className="sidebar-container">
                {<h4 className="text-white my-5 fw-light ps-3 titleCase">{roleData?.roleName ? roleData?.roleName : 'AMS Admin'}</h4>}
                <Container fluid className="sidebar-nav">
                    <ul className="navbar-nav" id="navbar-nav">
                        {navData(roleData?.roleName, profileData).map((item, idx) =>
                            item.subItems ? (
                                <Accordion open={open} toggle={toggle} className="my-2">
                                    <AccordionItem className="rounded-0 border-0 sidebar-according-item">
                                        <AccordionHeader
                                            targetId={idx}
                                            className={`${item.label === currentNav && 'active-according-header'} px-3 py-2 rounded-3`}
                                        >
                                            <div
                                                className={`${
                                                    item.label === currentNav ? 'text-black' : 'text-white'
                                                } d-flex align-items-center fw-light`}
                                            >
                                                {/* <i className={item.icon + ' me-2 '}></i> */} {item.icon()}
                                                <span className="ms-2">{item.label}</span>
                                            </div>
                                        </AccordionHeader>
                                        <AccordionBody accordionId={idx} className="p-0 px-3">
                                            <ul>
                                                {item?.subItems?.length > 0
                                                    ? item.subItems.map((subItem, inx) => (
                                                          <li
                                                              className={`text-white fw-light my-2  ${
                                                                  currentNavSub === subItem.label && 'active-marker'
                                                              }`}
                                                              onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  handleClickSubItem(item, subItem);
                                                              }}
                                                          >
                                                              <Link
                                                                  className={`nav-link menu-link text-white fs-14 fw-light px-2 ${
                                                                      currentNavSub === subItem.label && 'active-sublink'
                                                                  }`}
                                                                  to={subItem.link ? subItem.link : '/#'}
                                                              >
                                                                  {subItem?.label}
                                                              </Link>
                                                          </li>
                                                      ))
                                                    : null}
                                            </ul>
                                        </AccordionBody>
                                    </AccordionItem>
                                </Accordion>
                            ) : (
                                <li
                                    className={`nav-item px-3 ${currentNav === item.label && 'bg-white rounded-3'}`}
                                    onClick={() => {
                                        handleClickMainItem(item);
                                    }}
                                >
                                    <Link
                                        className={`nav-link menu-link ${
                                            currentNav === item.label ? 'text-black' : 'text-white'
                                        }  fs-14 fw-light`}
                                        to={item.link ? item.link : '/#'}
                                    >
                                        {/* <i className={item.icon + ' me-2'}></i>  */}
                                        {item.icon()}
                                        <span className="ms-2">{item.label}</span>
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>
                    {/* <ul className='sidebar-bottom'>
                        <li
                            className={`nav-item px-3 ${currentNav === profileNavItem.label && 'bg-white rounded-3'}`}
                            // className={'nav-item px-3'}
                            onClick={() => {
                                handleClickMainItem(profileNavItem);
                            }}
                        >
                            <Link
                                className={`nav-link menu-link ${
                                    currentNav === profileNavItem.label ? 'text-black' : 'text-white'
                                }  fs-14 fw-light`}
                                to={profileNavItem.link ? profileNavItem.link : '/#'}
                            >
                                {/* <i className={item.icon + ' me-2'}></i>  */}
                    {/* {profileNavItem.icon()} */}
                    {/* <span className="ms-2">{profileNavItem.label}</span> */}
                    {/* </Link> */}
                    {/* </li> */}
                    {/* </ul> */}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Sidebar;
