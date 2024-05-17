import {
    AcUnit,
    AccessTimeFilled,
    AppRegistration,
    DomainAdd,
    Groups,
    Home,
    LibraryBooks,
    Payment,
    Person,
    Science,
    NotificationsActive
} from '@mui/icons-material';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import DataArrayIcon from '@mui/icons-material/DataArray';
import DomainOutlinedIcon from '@mui/icons-material/DomainOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ScienceIcon from '@mui/icons-material/Science';

export const navData = (roleName, profileData) => {
    let navItems = [];
    if (profileData.roleData === 1) {
        return superAdminSidePanelData;
    }

    // eslint-disable-next-line array-callback-return
    profileData?.permissionData?.map((permission) => {
        if (permission.module.toLowerCase() === 'dashboard' && permission.actions.view === 1) {
            navItems.push({
                id: 'dashboard',
                label: 'Dashboard',
                icon: () => <Home fontSize="small" />,
                link: '/dashboard'
            });
        }
        if (permission.module.toLowerCase() === 'bookings' && permission.actions.view === 1) {
            navItems.push({
                id: 'bookings',
                label: 'Bookings',
                icon: () => <LibraryBooks fontSize="small" />,
                link: '/bookings'
            });
        }
        if (permission.module.toLowerCase() === 'employees' && permission.actions.view === 1) {
            const empIndex = navItems.findIndex((item) => item.id === 'employees');
            if (empIndex !== -1) {
                navItems[empIndex].subItems.unshift({
                    id: 'Employeessub',
                    label: 'Employees',
                    link: '/employees',
                    parentId: 'employees'
                });
            } else {
                navItems.push({
                    id: 'employees',
                    label: 'Employees',
                    icon: () => <Person fontSize="small" />,
                    link: '/#',
                    subItems: [
                        {
                            id: 'Employeessub',
                            label: 'Employees',
                            link: '/employees',
                            parentId: 'employees'
                        }
                    ]
                });
            }
        }
        if (permission.module.toLowerCase() === 'roles' && permission.actions.view === 1) {
            const empIndex = navItems.findIndex((item) => item.id === 'employees');

            if (empIndex !== -1) {
                navItems[empIndex].subItems.push({
                    id: 'roles',
                    label: 'Roles',
                    link: '/employees-roles',
                    parentId: 'employees'
                });
            } else {
                navItems.push({
                    id: 'employees',
                    label: 'Employees',
                    icon: () => <Person fontSize="small" />,
                    link: '/#',
                    subItems: [
                        {
                            id: 'roles',
                            label: 'Roles',
                            link: '/employees-roles',
                            parentId: 'employees'
                        }
                    ]
                });
            }
        }
        if (permission.module.toLowerCase() === 'employee department' && permission.actions.view === 1) {
            const empIndex = navItems.findIndex((item) => item.id === 'employees');

            if (empIndex !== -1) {
                navItems[empIndex].subItems.push({
                    id: 'EmployeeDepartment',
                    label: 'Employee Department',
                    link: '/employee-department',
                    parentId: 'employees'
                });
            } else {
                navItems.push({
                    id: 'employees',
                    label: 'Employees',
                    icon: () => <Person fontSize="small" />,
                    link: '/#',
                    subItems: [
                        {
                            id: 'EmployeeDepartment',
                            label: 'Employee Department',
                            link: '/employee-department',
                            parentId: 'employees'
                        }
                    ]
                });
            }
        }
        if (permission.module.toLowerCase() === 'leads' && permission.actions.view === 1) {
            const empIndex = navItems.findIndex((item) => item.id === 'customers');
            if (empIndex !== -1) {
                navItems[empIndex].subItems.push({
                    id: 'LeadId',
                    label: 'Leads',
                    link: '/leads',
                    parentId: 'customers'
                });
            } else {
                navItems.push({
                    id: 'customers',
                    label: 'Customers',
                    icon: () => <Groups fontSize="small" />,
                    link: '/#',
                    subItems: [
                        {
                            id: 'LeadId',
                            label: 'Leads',
                            link: '/leads',
                            parentId: 'customers'
                        }
                    ]
                });
            }
        }
        if (permission.module.toLowerCase() === 'patients' && permission.actions.view === 1) {
            const empIndex = navItems.findIndex((item) => item.id === 'customers');

            if (empIndex !== -1) {
                navItems[empIndex].subItems.push({
                    id: 'PatientsId',
                    label: 'Patients',
                    link: '/patients',
                    parentId: 'customers'
                });
            } else {
                navItems.push({
                    id: 'customers',
                    label: 'Customers',
                    icon: () => <Groups fontSize="small" />,
                    link: '/#',
                    subItems: [
                        {
                            id: 'PatientsId',
                            label: 'Patients',
                            link: '/patients',
                            parentId: 'customers'
                        }
                    ]
                });
            }
        }
        if (permission.module.toLowerCase() === 'payments' && permission.actions.view === 1) {
            navItems.push({
                id: 'payments',
                label: 'Payments',
                icon: () => <Payment fontSize="small" />,
                link: '/payments'
            });
        }
        if (permission.module.toLowerCase() === 'time slots' && permission.actions.view === 1) {
            navItems.push({
                id: 'timeslots',
                label: 'Time Slots',
                icon: () => <AccessTimeFilled fontSize="small" />,
                link: '/time-slots'
            });
        }
        if (permission.module.toLowerCase() === 'permissions' && permission.actions.view === 1) {
            navItems.push({
                id: 'permission',
                label: 'Permissions',
                icon: () => <AppRegistration fontSize="small" />,
                link: '/permission'
            });
        }
    });

    return navItems;
};
export const superAdminSidePanelData = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: () => <Home fontSize="small" />,
        link: '/dashboard'
    },
    {
        id: 'datcollection',
        label: 'Data Collection',
        icon: () => <Science fontSize="small" />,
        link: '/#',
        subItems: [
            {
                id: 'qifqualitative',
                label: 'QIF Qualitative',
                link: '/qif-qualitative',
                parentId: 'datcollection'
            },
            {
                id: 'qifquantitative',
                label: 'QIF Quantitative',
                link: '/qif-quantitative',
                parentId: 'datcollection'
            }
        ]
    },
    {
        id: 'qifview',
        label: 'QIF View',
        icon: () => <TableViewOutlinedIcon fontSize="small" />,
        link: '/qif-view'
    },
    {
        id: 'universities',
        label: 'Universities',
        icon: () => <DomainOutlinedIcon fontSize="small" />,
        link: '/universities'
    },
    {
        id: 'colleges',
        label: 'Colleges',
        icon: () => <SchoolOutlinedIcon fontSize="small" />,
        link: '/colleges'
    },
    {
        id: 'employees',
        label: 'Employees',
        icon: () => <Person fontSize="small" />,
        link: '/#',
        subItems: [
            {
                id: 'Employeessub',
                label: 'Employees',
                link: '/employees',
                parentId: 'employees'
            },
            {
                id: 'roles',
                label: 'Roles',
                link: '/employees-roles',
                parentId: 'employees'
            }
        ]
    },
    {
        id: 'departments',
        label: 'departments',
        icon: () => <ScienceIcon fontSize="small" />,
        link: '/departments'
    },
    {
        id: 'customers',
        label: 'Customers',
        icon: () => <Groups fontSize="small" />,
        link: '/#',
        subItems: [
            {
                id: 'LeadId',
                label: 'Leads',
                link: '/leads',
                parentId: 'customers'
            },
            {
                id: 'PatientsId',
                label: 'Patients',
                link: '/patients',
                parentId: 'customers'
            }
        ]
    },
    {
        id: 'payments',
        label: 'Payments',
        icon: () => <Payment fontSize="small" />,
        link: '/payments'
    },
    {
        id: 'permission',
        label: 'Permissions',
        icon: () => <AppRegistration fontSize="small" />,
        link: '/permission'
    },
    {
        id: 'notification',
        label: 'Notification',
        icon: () => <NotificationsActive fontSize="small" />,
        link: '/notification'
    },
    {
        id: 'logs',
        label: 'Logs',
        icon: () => <DataArrayIcon fontSize="small" />,
        link: '/logs'
    },
    {
        id: 'helpvideos',
        label: 'Help Videos',
        icon: () => <VideoLibraryIcon fontSize="small" />,
        link: '/help-vids'
    },
    {
        id: 'tour',
        label: 'Tour',
        icon: () => <InfoOutlinedIcon fontSize="small" />,
        link: '/tour'
    }
];
