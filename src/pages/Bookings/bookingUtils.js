import { branchAdminRoleName, orderStatusesList } from '../../Components/constants/Constants';

export const ongoingStatusesList = (num, role) => {
    if (role === branchAdminRoleName) {
        return num === '1' || num === '4'
            ? num
            : orderStatusesList
                  .filter((i) => ![0, 1, 3, 4].includes(i.id))
                  .map((i) => i.id)
                  .join(',');
    }
    return num === '1' || num === '3'
        ? num
        : orderStatusesList
              .filter((i) => ![0, 1, 3].includes(i.id))
              .map((i) => i.id)
              .join(',');
};
export const stepsForBookinStepper = ['Assigned branch', 'Assigned Phlebotomist', 'Sample Collected', 'Reports Uploaded', 'Completed'];
export const getstepperStatusValue = (status) => {
    let value = -1;
    switch (status) {
        case 3:
            value = -1;
            break;
        case 4:
            value = 1;
            break;
        case 5:
        case 6:
        case 7:
            value = 2;
            break;
        case 8:
            value = 3;
            break;
        case 9:
            value = 4;
            break;
        case 1:
            value = 5;
            break;
        default:
            value = -1;
    }
    return value;
};
