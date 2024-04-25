import * as yup from 'yup';
import { branchAdminRoleName } from '../../Components/constants/Constants';

export const AddBookingToBranchSchema = (roleName) =>
    yup.object().shape(
        {
            branchId: yup.object().when('employeeId', {
                is: (val) => roleName !== branchAdminRoleName,
                then: yup.object().required('required')
            }),
            employeeId: yup.object().when('branchId', {
                is: (val) => roleName === branchAdminRoleName,
                then: yup.object().required('required')
            })
        },
        ['branchId', 'employeeId']
    );
