import React, { useEffect, useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Form, Formik } from 'formik';
import logo from '../../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import { Button, InputAdornment, OutlinedInput } from '@mui/material';
import { validationSchemaLogin } from '../../common/validationSchema/loginSChema';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { LoginAPI } from '../../helpers/APIs/CommonAPIs';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import {
    addCurrentNavToStore,
    addCurrentSubNavToStore,
    addProfileDataToStore,
    addRoleDataToStore,
    addUserDataToStore
} from '../../Store/commonStore/actions';
import { navigateToFirstRouteAfterLogin } from './loginUtil';
import { toast } from 'react-toastify';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Login = () => {
    const [passwordShown, setPasswordShown] = useState(true);

    const navigate = useNavigate();
    const LoginAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, LoginAPI));

    useEffect(() => {
        if (LoginAPIData?.[DataKey]?.isSuccess) {
            const data = LoginAPIData?.[DataKey]?.data;
            if (data?.profileData?.roleData === 1) {
                addUserDataToStore(data);
                addRoleDataToStore(data?.profileData?.roleData);
                addProfileDataToStore(data?.profileData);
                navigate('/dashboard');
                addCurrentNavToStore('Dashboard');
                addCurrentSubNavToStore('');
                console.log(data?.profileData?.permissionData);
                return;
            }
            if (
                !navigateToFirstRouteAfterLogin(data?.profileData?.permissionData, addCurrentNavToStore, addCurrentSubNavToStore, navigate)
            ) {
                toast.error('No Permissions given to the this role.');
                return;
            }
            addUserDataToStore(data);
            addRoleDataToStore(data?.profileData?.roleData);
            addProfileDataToStore(data?.profileData);
        } else if (LoginAPIData?.[ErrorKey] && !LoginAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(LoginAPIData, 'LoginAPI');
            removeAPIDataAction('LoginAPI');
        }
    }, [LoginAPIData]);

    const handleLogin = (values) => {
        callAPIAction(LoginAPI, null, values);
    };
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <div className="login-container">
            <section className="img-box"></section>
            <section className="login-box">
                <div className="login_details">
                    {/* <div className="text-center">
                        <img src={logo} alt="logo" className="login-logo" loading="lazy" />
                    </div> */}
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={validationSchemaLogin}
                        onSubmit={handleLogin}
                        enableReinitialize={true}
                    >
                        {({ setFieldValue, values, errors, touched, submitForm }) => (
                            <Form>
                                <div className="mb-5">
                                    <label className="label">Email ID</label> <br />
                                    <OutlinedInput
                                        disabled={LoginAPIData?.[FetchingKey]}
                                        name="email"
                                        placeholder="Enter your email ID"
                                        sx={{ width: '100%' }}
                                        value={values.email}
                                        onChange={(e) => setFieldValue('email', e.target.value)}
                                    />
                                    {touched.email && errors.email && <small className="text-danger">{errors.email}</small>}
                                </div>
                                <div>
                                    <label className="label">Password</label> <br />
                                    <OutlinedInput
                                        disabled={LoginAPIData?.[FetchingKey]}
                                        name="password"
                                        value={values.password}
                                        sx={{ width: '100%' }}
                                        type={passwordShown ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        onChange={(e) => setFieldValue('password', e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                {passwordShown ? (
                                                    <RemoveRedEyeIcon className="close-icon" onClick={togglePassword} />
                                                ) : (
                                                    <VisibilityOffIcon className="close-icon" onClick={togglePassword} />
                                                )}
                                            </InputAdornment>
                                        }
                                    />
                                    {touched.password && errors.password && <small className="text-danger">{errors.password}</small>}
                                </div>
                                <div className="btn-container text-center mt-5">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        endIcon={<ChevronRightIcon />}
                                        data-bs-dismiss="modal"
                                        onClick={submitForm}
                                        id="LOGIN"
                                        disabled={LoginAPIData?.[FetchingKey]}
                                    >
                                        Login to account
                                    </Button>
                                    {/* <button
                                        type="submit"
                                        className="btn btn-md btn-primary submit-btn"
                                        data-bs-dismiss="modal"
                                        onClick={submitForm}
                                        id="LOGIN"
                                        disabled={LoginAPIData?.[FetchingKey]}
                                    >
                                        Submit
                                    </button> */}
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </div>
    );
};

export default Login;
