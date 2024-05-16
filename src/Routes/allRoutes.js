import Cover404 from '../pages/Errors/Cover404';
import Dashboard from '../pages/Dashboard';
import Branch from '../pages/Branch';
import Center from '../pages/Center';
import EmployeeDepartment from '../pages/EmployeeDepartment';
import EmployeeRole from '../pages/EmployeeRoles';
import Employee from '../pages/Employee';
import Login from '../pages/Login';
import Tests from '../pages/Tests';
import ViewTestComponent from '../pages/Tests/ViewTestComponent';
import TestCategory from '../pages/TestCategory';
import TestDepartment from '../pages/TestDepartment';
import TestSample from '../pages/TestSample';
import TestType from '../pages/TestType';
import Payment from '../pages/Payment';
import Customers from '../pages/Customer';
import Bookings from '../pages/Bookings';
import ViewBookingComponent from '../pages/Bookings/ViewBookingComponent';
import TimeSlots from '../pages/TimeSlots';
import Permission from '../pages/Permission';
import ViewCustomerComponent from '../pages/Customer/ViewCustomerComponent';
import Notification from '../pages/Notification';
import TestDescription from '../pages/Tests/TestDescription';
import Logger from '../pages/Logs';
import ViewLogComponent from '../pages/Logs/ViewLogComponent';
import HelpVideosPage from '../pages/HelpVideos';
import { Component } from 'react';
import Universities from '../pages/University';
import ViewUniversityComponent from '../pages/University/ViewUniversityComponent';
import College from '../pages/College';
import ViewCollegeComponent from '../pages/College/ViewCollegeComponent';
import Department from '../pages/Department';

export const allRoutesOfApplication = (userData) => {
    let routes = [];
    if (userData) {
        routes = [
            { path: 'dashboard', Component: Dashboard },
            { path: 'branch', Component: Branch },
            { path: 'diagnostics-centers', Component: Center },
            { path: 'employee-department', Component: EmployeeDepartment },
            { path: 'employees-roles', Component: EmployeeRole },
            { path: 'employees', Component: Employee },
            { path: 'lab-test', Component: Tests },
            { path: 'test-description/:testId', Component: TestDescription },
            { path: 'lab-test/:testId', Component: ViewTestComponent },
            { path: 'test-categories', Component: TestCategory },
            { path: 'test-department', Component: TestDepartment },
            { path: 'test-samples', Component: TestSample },
            { path: 'test-type', Component: TestType },
            { path: 'payments', Component: Payment },
            { path: 'bookings', Component: Bookings },
            { path: 'bookings/:bookingId', Component: ViewBookingComponent },
            { path: 'leads', Component: Customers },
            { path: 'leads/:id', Component: ViewCustomerComponent },
            { path: 'patients', Component: Customers },
            { path: 'patients/:id', Component: ViewCustomerComponent },
            { path: 'permission', Component: Permission },
            { path: 'notification', Component: Notification },
            { path: 'login', Component: Login },
            { path: 'time-slots', Component: TimeSlots },
            { path: 'logs', Component: Logger },
            { path: 'logs/:id', Component: ViewLogComponent },
            { path: 'help-vids', Component: HelpVideosPage },
            { path: 'universities', Component: Universities },
            { path: 'universities/:id', Component: ViewUniversityComponent },
            { path: 'colleges', Component: College },
            { path: 'colleges/:id', Component: ViewCollegeComponent },
            { path: 'department', Component: Department },
            { path: 'departments/:id', Component: ViewCollegeComponent },
            { path: '*', Component: Cover404 }
        ];
    } else {
        routes = [
            { path: 'lab-test/:testId', Component: ViewTestComponent },
            { path: '*', Component: Login },
            { path: 'test-description/:testId', Component: TestDescription }
        ];
    }

    return routes;
};
