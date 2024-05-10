import { branchAdminRoleName } from '../../Components/constants/Constants';

const branchSchema = [
    /*
     * {
     *     Header: 'Sl No.',
     *     accessor: 'slno',
     *     sortable: false,
     *     width: '5%',
     *     thClass: 'text-overflow'
     * },
     */
    {
        Header: 'Branch Name',
        accessor: 'branchName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'State',
        accessor: 'stateName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Email',
        accessor: 'email',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Phone Number',
        accessor: 'phoneNumber',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'status'
    },
    {
        Header: 'Created Date',
        accessor: 'createdAt',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isEdit: true
        // isDelete: true
        // isView: true
    }
];

const centerSchema = [
    {
        Header: 'Center Name',
        accessor: 'centerName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Phone Number',
        accessor: 'phoneNumber',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Address',
        accessor: 'area',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Zipcode',
        accessor: 'pinCode',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Created Date',
        accessor: 'createdAt',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'status'
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isEdit: true
        // isDelete: true
        // isView: true
    }
];

const employeeRoleSchema = [
    {
        Header: 'Role Name',
        accessor: 'roleName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Department Name',
        accessor: 'employeeDepartmentName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Created On',
        accessor: 'createdAt',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'status'
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isEdit: true
    }
];

const employeeDepartmentSchema = [
    {
        Header: 'Department Name',
        accessor: 'employeeDepartmentName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Created On',
        accessor: 'createdAt',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'status'
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isEdit: true
        // // isDelete: true
        // isView: true
    }
];

const employeeSchema = [
    {
        Header: 'Employee Id',
        accessor: 'employeeCode',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Employee Name',
        accessor: 'employeeName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Phone Number',
        accessor: 'phoneNumber',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Email',
        accessor: 'email',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Gender',
        accessor: 'gender',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Role',
        accessor: 'roleName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Department',
        accessor: 'employeeDepartmentName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Joined On',
        accessor: 'joiningDate',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'status'
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isEdit: true,
        isPermission: true
    }
];

const testSchema = [
    {
        Header: 'Test Id',
        accessor: 'testID',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Test Name',
        accessor: 'testName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Category',
        accessor: 'testCategory',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Department',
        accessor: 'departmentName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Samples Required',
        accessor: 'testSamples',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Price ₹',
        accessor: 'testAmount',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Created On',
        accessor: 'createdAt',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'status'
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isEdit: true,
        isLink: true
        /*
         * // isDelete: true
         * isView: true
         */
    }
];
const dashboardCustomerSchema = [
    {
        Header: 'Customer Name',
        accessor: 'fullName',
        sortable: false,
        width: '25%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Phone Number',
        accessor: 'mobile',
        sortable: false,
        width: '25%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Email Id',
        accessor: 'email',
        sortable: false,
        width: '25%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Registered On',
        accessor: 'createdAt',
        sortable: false,
        width: '25%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    }
];
const dashboardTransactionsSchema = [
    {
        Header: 'UPI',
        accessor: 'upi',
        sortable: false,
        width: '20%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Amout',
        accessor: 'amount',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Transaction ID',
        accessor: 'transactionId',
        sortable: false,
        width: '25%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Date',
        accessor: 'createdAt',
        sortable: false,
        width: '20%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '25%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'paymentStatus'
    }
];

const testDepartmentSchema = [
    /*
     * {
     *     Header: 'Sl No.',
     *     accessor: 'slno',
     *     sortable: false,
     *     width: '5%',
     *     thClass: 'text-overflow'
     * },
     */
    {
        Header: 'Department Name',
        accessor: 'departmentName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Created On',
        accessor: 'createdAt',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'status'
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isEdit: true
        // isDelete: true
        // isView: true
    }
];

const testCategorySchema = [
    /*
     * {
     *     Header: 'Sl No.',
     *     accessor: 'slno',
     *     sortable: false,
     *     width: '5%',
     *     thClass: 'text-overflow'
     * },
     */
    {
        Header: 'Category Name',
        accessor: 'testCategoryName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Created On',
        accessor: 'createdAt',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'status'
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isEdit: true
        // isDelete: true
        // isView: true
    }
];

const testSampleSchema = [
    /*
     * {
     *     Header: 'Sl No.',
     *     accessor: 'slno',
     *     sortable: false,
     *     width: '5%',
     *     thClass: 'text-overflow'
     * },
     */
    {
        Header: 'Sample Name',
        accessor: 'testSampleName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Created On',
        accessor: 'createdAt',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'status'
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isEdit: true
        // isDelete: true
        // isView: true
    }
];

const testTypeSchema = [
    /*
     * {
     *     Header: 'Sl No.',
     *     accessor: 'slno',
     *     sortable: false,
     *     width: '5%',
     *     thClass: 'text-overflow'
     * },
     */
    {
        Header: 'Test Type',
        accessor: 'testTypeName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Created On',
        accessor: 'createdAt',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'status'
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isEdit: true
    }
];

const paymentSchema = [
    {
        Header: 'Patient Name',
        accessor: 'customerName',
        sortable: false,
        width: '20%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Phone Number',
        accessor: 'phoneNumber',
        sortable: false,
        width: '20%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Amout',
        accessor: 'amount',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Transaction ID',
        accessor: 'transactionId',
        sortable: false,
        width: '15%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Date',
        accessor: 'transactionDate',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Status Reason',
        accessor: 'statusReason',
        sortable: false,
        width: '15%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '20%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'paymentStatus'
    }
];
const bookingSchema = (roleName, isCustomerView) => {
    const schema = [
        {
            Header: 'S.no',
            accessor: 'sno',
            sortable: true,
            width: '5%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Order Id',
            accessor: 'orderId',
            sortable: true,
            width: '5%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Customer Name',
            accessor: 'customer.fullName',
            sortable: false,
            width: '10%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Patient Name',
            accessor: 'patient.fullName',
            sortable: false,
            width: '10%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Phone Number',
            accessor: 'customer.mobile',
            sortable: false,
            width: '10%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Sample Collection Address',
            accessor: 'address',
            sortable: false,
            width: '5%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Booking Status',
            accessor: 'bookingStatusText',
            sortable: false,
            width: '10%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Booking Type',
            accessor: 'bookingTypeText',
            sortable: false,
            width: '10%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Payment Type',
            accessor: 'paymentType',
            sortable: false,
            width: '10%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Payment Status',
            accessor: 'paymentStatusText',
            sortable: false,
            width: '10%',
            thClass: 'text-overflow',
            customCell: true,
            fieldType: 'paymentStatus'
        },
        {
            Header: 'Branch',
            accessor: 'branchName',
            sortable: false,
            width: '10%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Phlebotomist',
            accessor: 'employee.employeeName',
            sortable: false,
            width: '10%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Booked on',
            accessor: 'bookedOn',
            sortable: false,
            width: '5%',
            thClass: 'text-overflow',
            customCell: true,
            fieldType: 'date'
        },
        {
            Header: 'Schedule For',
            accessor: 'homeCollectionDate',
            sortable: false,
            width: '5%',
            thClass: 'text-overflow',
            customCell: true,
            fieldType: 'date'
        },
        {
            Header: 'Actions',
            accessor: '',
            customCell: true,
            fieldType: 'actions',
            sortable: false,
            width: '5%',
            isLink: true
        }
    ];
    if (roleName === branchAdminRoleName) {
        schema.splice(9, 1);
    }
    if (isCustomerView) {
        schema.splice(9, 1);
        // schema.splice(1, 1);
        schema.splice(12, 1);
    }
    return schema;
};
const showBookingDetailsSchema = [
    {
        Header: 'S.No',
        accessor: 'slno',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Test Name',
        accessor: 'testName',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow'
    },
    /*
     * {
     *     Header: 'Contains',
     *     accessor: 'contains',
     *     sortable: false,
     *     width: '5%',
     *     thClass: 'text-overflow'
     * },
     */
    {
        Header: 'Amount',
        accessor: 'testAmount',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow'
    }
];

const CustomerSchema = (isLead) => {
    const list = [
        {
            Header: 'Customer Name',
            accessor: 'fullName',
            sortable: false,
            width: '25%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Phone Number',
            accessor: 'mobile',
            sortable: false,
            width: '25%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Patient Type',
            accessor: 'patientType',
            sortable: false,
            width: '25%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Email',
            accessor: 'email',
            sortable: false,
            width: '25%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Date of birth',
            accessor: 'dob',
            sortable: false,
            width: '25%',
            customCell: true,
            thClass: 'text-overflow',
            fieldType: 'date'
        },
        {
            Header: 'City',
            accessor: 'city',
            sortable: false,
            width: '25%',
            thClass: 'text-overflow'
        },
        {
            Header: 'Registered On',
            accessor: 'createdAt',
            sortable: false,
            width: '25%',
            thClass: 'text-overflow',
            customCell: true,
            fieldType: 'date'
        },
        {
            Header: 'Actions',
            accessor: '',
            customCell: true,
            fieldType: 'actions',
            sortable: false,
            width: '5%',
            isEdit: true,
            isLink: true
            // // isDelete: true
            // isView: true
        }
    ];
    if (!isLead)
        list.splice(1, 0, {
            Header: 'MRM number',
            accessor: 'mrmNumber',
            sortable: false,
            width: '25%',
            thClass: 'text-overflow'
        });
    return list;
};

const PermissionemployeeSchema = [
    {
        Header: 'Employee Id',
        accessor: 'employeeCode',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Employee Name',
        accessor: 'employeeName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Phone Number',
        accessor: 'phoneNumber',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Email',
        accessor: 'email',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Gender',
        accessor: 'gender',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Role',
        accessor: 'roleName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Department',
        accessor: 'employeeDepartmentName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Branch Name',
        accessor: 'branchName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Joined On',
        accessor: 'joiningDate',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },

    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isEdit: true
        // // isDelete: true
        // isView: true
    }
];

const PermissionRoleSchema = [
    {
        Header: 'Role Name',
        accessor: 'roleName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Department Name',
        accessor: 'employeeDepartmentName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Created On',
        accessor: 'createdAt',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'status'
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isEdit: true
        // isDelete: true
        // isView: true
    }
];
const permissionAddSchema = [
    {
        Header: 'Module',
        accessor: 'module',
        sortable: false,
        classess: 'w-40',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'select'
    },
    {
        Header: 'create',
        accessor: 'create',
        sortable: false,
        classess: 'w-15',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'permissioncheckbox'
    },
    {
        Header: 'Edit',
        accessor: 'edit',
        sortable: false,
        classess: 'w-15',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'permissioncheckbox'
    },
    {
        Header: 'View',
        accessor: 'view',
        sortable: false,
        classess: 'w-15',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'permissioncheckbox'
    },
    {
        Header: 'Delete',
        accessor: 'delete',
        sortable: false,
        classess: 'w-15',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'permissioncheckbox'
    }
    // {
    //     Header: 'Actions',
    //     accessor: 'action',
    //     sortable: false,
    //     classess: 'w-14',
    //     thClass: 'text-overflow',
    //     customCell: true,
    //     fieldType: 'permissioncheckbox'
    // }
];

const notificationAddSchema = [
    {
        Header: 'Notification Type',
        accessor: 'notificationType',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Notification Title',
        accessor: 'notificationTitle',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Notification Data label',
        accessor: 'notificationDataLabel',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Notification Body',
        accessor: 'notificationBody',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'User Type',
        accessor: 'userType',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Notification Link',
        accessor: 'notificationLink',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    }
];

const loggerSchema = [
    {
        Header: 'Method',
        accessor: 'method',
        sortable: false,
        customCell: true,
        width: '10%',
        thClass: 'text-overflow',
        fieldType: 'logMethod'
    },
    {
        Header: 'Route',
        accessor: 'route',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Response Time',
        accessor: 'responseTimeMs',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Time Stamp',
        accessor: 'timestamp',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow',
        customCell: true,
        fieldType: 'date'
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isLink: true
    }
];

const universitiesSchema = [
    {
        Header: 'Name',
        accessor: 'universityName',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Phone Number',
        accessor: 'phoneNumber',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Email',
        accessor: 'email',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Address',
        accessor: 'address',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'City',
        accessor: 'city',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'State',
        accessor: 'state',
        sortable: false,
        width: '10%',
        thClass: 'text-overflow'
    },
    {
        Header: 'Status',
        accessor: 'status',
        sortable: false,
        width: '5%',
        thClass: 'text-overflow',
        fieldType: 'status',
        customCell: true
    },
    {
        Header: 'Actions',
        accessor: '',
        customCell: true,
        fieldType: 'actions',
        sortable: false,
        width: '5%',
        isLink: true,
        isEdit: true
    }
];
export {
    branchSchema,
    centerSchema,
    employeeRoleSchema,
    employeeDepartmentSchema,
    employeeSchema,
    testSchema,
    testDepartmentSchema,
    testCategorySchema,
    dashboardCustomerSchema,
    dashboardTransactionsSchema,
    testSampleSchema,
    testTypeSchema,
    paymentSchema,
    bookingSchema,
    CustomerSchema,
    showBookingDetailsSchema,
    PermissionemployeeSchema,
    permissionAddSchema,
    notificationAddSchema,
    PermissionRoleSchema,
    loggerSchema,
    universitiesSchema
};
