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
import DataArrayIcon from '@mui/icons-material/DataArray';

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
        id: 'bookings',
        label: 'Bookings',
        icon: () => <LibraryBooks fontSize="small" />,
        link: '/bookings'
    },
    {
        id: 'labtests',
        label: 'Lab Tests',
        icon: () => <Science fontSize="small" />,
        link: '/#',
        subItems: [
            {
                id: 'Tests',
                label: 'Tests',
                link: '/lab-test',
                parentId: 'labtests'
            }
        ]
    },
    {
        id: 'diagnosticsCenter',
        label: 'Diagnostics Center',
        icon: () => <DomainAdd fontSize="small" />,
        link: '/diagnostics-centers'
    },
    {
        id: 'branch',
        label: 'Branch',
        icon: () => <AcUnit fontSize="small" />,
        link: '/branch'
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
            },
            {
                id: 'EmployeeDepartment',
                label: 'Employee Department',
                link: '/employee-department',
                parentId: 'employees'
            }
        ]
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
        id: 'timeslots',
        label: 'Time Slots',
        icon: () => <AccessTimeFilled fontSize="small" />,
        link: '/time-slots'
    },
    {
        id: 'testmasterdata',
        label: 'Test Master Data',
        icon: () => <Person fontSize="small" />,
        link: '/#',
        subItems: [
            {
                id: 'department',
                label: 'Department',
                link: '/test-department',
                parentId: 'testmasterdata'
            },
            {
                id: 'categories',
                label: 'Categories',
                link: '/test-categories',
                parentId: 'testmasterdata'
            },
            {
                id: 'sampletypes',
                label: 'Sample Types',
                link: '/test-samples',
                parentId: 'testmasterdata'
            },
            {
                id: 'testtype',
                label: 'Test Type',
                link: '/test-type',
                parentId: 'testmasterdata'
            }
            // {
            //     id: 'notification',
            //     label: 'Notification',
            //     link: '/notification',
            //     parentId: 'testmasterdata'
            // }
        ]
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
    }
    /*
     * {
     *     id: 'package',
     *     label: 'Packages',
     *     icon: () => <LocalShipping fontSize="small" />,
     *     link: '/package'
     * }
     */
];
