import { Container } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { getAllUniversitiesAPI } from '../../helpers/APIs/CommonAPIs';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { callAPIAction } from '../../Store/callAPI/actions';
import { DataKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import ActionsTable from '../../Components/Common/ActionsTable';
import { universitiesSchema } from '../../common/data/TableSchema';
import UniversitiesHeader from './UniversitiesHeader';

const Universities = () => {
    const [getAllUniversities, setAllUniversities] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setrowsPerPage] = useState(10);
    const GetAllUniversitiesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, getAllUniversitiesAPI));
    const [selectedData, setSelectedData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = {
            page: pageNumber,
            pageSize: rowsPerPage
        };
        callAPIAction(getAllUniversitiesAPI, null, null, queryParams);
    }, []);

    useEffect(() => {
        if (GetAllUniversitiesAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllUniversitiesAPIData?.[DataKey]?.data;
            setAllUniversities(data);
            console.log(data);
        } else {
            setAllUniversities([]);
        }
    }, [GetAllUniversitiesAPIData]);

    const handlePageChange = (p, rows) => {
        const queryParams = {
            page: p,
            pageSize: rows
        };
        callAPIAction(getAllUniversitiesAPI, null, null, queryParams);
    };

    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'link') {
            // if (isLead && !checkIsCustomerDataCanView(row.original)) {
            //     toast.warning('Please fill all the required fields.');
            //     return;
            // }
            navigate('/universities/' + row.original._id);
        }
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(getAllUniversities[item]);
        });
        setSelectedData(rowData);
    };

    return (
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-0">
                    Universities (
                    {GetAllUniversitiesAPIData?.[DataKey]?.totalRecords ? GetAllUniversitiesAPIData?.[DataKey]?.totalRecords : '0'})
                </h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Universities',
                            isLink: false
                        }
                    ]}
                />

                <ActionsTable
                    tabelID="orgUsersTable"
                    cardHeader={() => <UniversitiesHeader selectedData={selectedData} getAllUniversitiesData={getAllUniversities} />}
                    // cardTitle="Service States and LOB"
                    columns={universitiesSchema}
                    data={getAllUniversities?.length ? getAllUniversities : []}
                    allDataObj={GetAllUniversitiesAPIData?.[DataKey]}
                    loading={GetAllUniversitiesAPIData?.[FetchingKey]}
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

export default Universities;
