import { Container } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { getAllLogsAPI } from '../../helpers/APIs/CommonAPIs';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { useSelector } from 'react-redux';
import { callAPIAction } from '../../Store/callAPI/actions';
import { DataKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import ActionsTable from '../../Components/Common/ActionsTable';
import { loggerSchema } from '../../common/data/TableSchema';
import LoggerHeader from './LoggerHeader';
import { useNavigate } from 'react-router-dom';

const Logger = () => {
    const [getALlLogs, setAllLogs] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setrowsPerPage] = useState(10);
    const GetAllLogsAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, getAllLogsAPI));
    const [selectedData, setSelectedData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = {
            page: pageNumber,
            pageSize: rowsPerPage
        };
        callAPIAction(getAllLogsAPI, null, null, queryParams);
    }, []);
    useEffect(() => {
        if (GetAllLogsAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllLogsAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    responseTimeMs: item['responseTime'] ? item['responseTime'] + ' ms' : ''
                };
            });
            setAllLogs(data);
            console.log(getALlLogs);
        } else {
            setAllLogs([]);
        }
    }, [GetAllLogsAPIData]);

    const handlePageChange = (p, rows) => {
        const queryParams = {
            page: p,
            pageSize: rows
        };
        callAPIAction(getAllLogsAPI, null, null, queryParams);
    };

    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'link') {
            // if (isLead && !checkIsCustomerDataCanView(row.original)) {
            //     toast.warning('Please fill all the required fields.');
            //     return;
            // }
            navigate('/logs/' + row.original._id);
        }
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(getALlLogs[item]);
        });
        setSelectedData(rowData);
    };

    return (
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-0">
                    Logs ({GetAllLogsAPIData?.[DataKey]?.totalRecords ? GetAllLogsAPIData?.[DataKey]?.totalRecords : '0'})
                </h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Logs',
                            isLink: false
                        }
                    ]}
                />

                <ActionsTable
                    tabelID="orgUsersTable"
                    cardHeader={() => <LoggerHeader selectedData={selectedData} getALlLogsData={getALlLogs} />}
                    // cardTitle="Service States and LOB"
                    columns={loggerSchema}
                    data={getALlLogs?.length ? getALlLogs : []}
                    allDataObj={GetAllLogsAPIData?.[DataKey]}
                    loading={GetAllLogsAPIData?.[FetchingKey]}
                    customPageSize={10}
                    // handleSearch={handleSearch}
                    divClass="table-responsive table-card ref-mgmt-table-ht"
                    tableClass="table table-borderless table-centered align-middle fixed-header"
                    theadClass="default-table-header text-muted"
                    onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                    emptyMessage={'no records found'}
                    tableLoader
                    showSelectAllOption={true}
                    handleActionClick={handleActionClick}
                    // handleSwith={handleSwith}
                    // isActionEdit={profileData.roleData === 1 ? true : permissionData.actions.edit}
                />
            </Container>
        </div>
    );
};

export default Logger;
