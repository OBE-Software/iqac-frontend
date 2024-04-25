import React, { Fragment, useEffect, useRef, useState, forwardRef } from 'react';
import { useTable, useGlobalFilter, useSortBy, useFilters, useExpanded, usePagination, useAsyncDebounce, useRowSelect } from 'react-table';
import { Table, Col, CardHeader, CardBody, Card } from 'reactstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import PropTypes from 'prop-types';

import Pagination from './Pagination/Pagination';
import { DefaultColumnFilter } from './filters';
import { CommonLoadingSkelton, TableSkelton } from './skelton';
import { selectCustomStyles } from '../constants/styles';
import { getPartOfTheStrUptoRequiredIndex } from '../../common/utils';
import { dateInRequireFormate } from './Util';
import { FormControlLabel } from '@mui/material';
import IOSSwitch from './IosSwitch';

const labelsForRowsperPage = [
    { value: 10, label: 10 },
    { value: 25, label: 25 },
    { value: 50, label: 50 },
    { value: 75, label: 75 },
    { value: 100, label: 100 },
    { value: 200, label: 200 },
    { value: 300, label: 300 },
    { value: 400, label: 400 },
    { value: 500, label: 500 }
];
// Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    type,
    globalSelectConfig,
    handleSearch,
    setSearchText,
    searchText,
    rowsPerPage,
    tabelID
}) {
    const count = preGlobalFilteredRows.length;

    const onChange = useAsyncDebounce((val) => {
        setGlobalFilter(val || undefined);
    }, 200);

    return (
        <div>
            {type === 'input' && (
                <div className="search-box mb-0 d-inline-block">
                    <div className="position-relative">
                        <div htmlFor="search-bar-0" className="search-label">
                            {/* <span id="search-bar-0-label" className="sr-only">
                                Search this table
                            </span> */}
                            <input
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    // onChange(e.target.value);
                                    handleSearch(e.target.value, rowsPerPage.value);
                                }}
                                id={'search-bar-0' + tabelID}
                                type="text"
                                className="form-control"
                                placeholder={'Search'}
                                value={searchText || ''}
                            />
                        </div>
                        <i className="ri-search-line search-widget-icon search-icon"></i>
                    </div>
                </div>
            )}
            {type === 'dropdown' && (
                <Select
                    value={globalSelectConfig?.value || ''}
                    onChange={(e) => {
                        onChange(e);
                        globalSelectConfig?.handleDropdownChange(e);
                    }}
                    options={globalSelectConfig?.options}
                    placeholder={globalSelectConfig?.placeholder}
                    components={{
                        IndicatorSeparator: () => null
                    }}
                    styles={selectCustomStyles}
                    id={'select' + tabelID}
                />
            )}
        </div>
    );
}

// To disable checkbox in a row based on value
const validateDisableRow = (selectDisableArr, row) => {
    let haveToDisable = true;
    if (!selectDisableArr || selectDisableArr?.length < 0) {
        return haveToDisable;
    }
    if (selectDisableArr?.length > 0) {
        let arr = [];
        arr = selectDisableArr.filter((a) => {
            return row?.original?.[a?.key] === a?.value;
        });
        if (arr?.length > 0) {
            haveToDisable = false;
        }
    }
    return haveToDisable;
};

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
        <>
            <input className="form-check-input Zindex-0" type="checkbox" ref={resolvedRef} {...rest} />
        </>
    );
});

const ActionsTable = ({
    tabelID,
    cardHeader,
    cardHeight,
    cardCSS,
    columns,
    data,
    customPageSize,
    showRowsPerPage = true,
    tableClass,
    theadClass,
    trClass,
    divClass,
    emptyMessage,
    loading,
    allDataObj,
    onPageChange,
    routeURLID,
    handleActionClick,
    handleShowCanvas,
    tableLoader,
    pageNo = 1,
    handleSearch,
    customActionsTemplate,
    showSelectAllOption,
    selectDisableArr,
    selectDisableObj,
    selectedRows = {},
    handleSelectedData,
    handleSwith,
    dropDownList,
    isActionEdit = true
}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        gotoPage,
        rows,
        setPageSize,
        state,
        state: { selectedRowIds }
    } = useTable(
        {
            columns,
            data,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: customPageSize, selectedRowIds: selectedRows } // , sortBy: [{ desc: true }]
        },
        useGlobalFilter,
        useFilters,
        useSortBy,
        useExpanded,
        usePagination,
        useRowSelect,
        (hooks) => {
            showSelectAllOption &&
                hooks.visibleColumns.push((cols) => [
                    // Let's make a column for selection
                    {
                        id: 'selection',
                        width: '1%',
                        Header: ({ toggleRowSelected, isAllPageRowsSelected, page }) => {
                            const modifiedOnChange = (event) => {
                                page.forEach((row) => {
                                    // check each row if it is not disabled
                                    let disableRow = validateDisableRow(selectDisableArr, row);
                                    disableRow && toggleRowSelected(row.id, event.currentTarget.checked);
                                });
                            };

                            /*
                             * Count number of selectable and selected rows in the current page
                             * to determine the state of select all checkbox
                             */
                            let selectableRowsInCurrentPage = 0;
                            let selectedRowsInCurrentPage = 0;
                            page.forEach((row) => {
                                row.isSelected && selectedRowsInCurrentPage++;

                                let disableRow = validateDisableRow(selectDisableArr, row);
                                disableRow && selectableRowsInCurrentPage++;
                            });

                            /*
                             * If there are no selectable rows in the current page
                             * select all checkbox will be disabled -> see page 2
                             */
                            const disabled = selectableRowsInCurrentPage === 0;
                            const checked =
                                (isAllPageRowsSelected || selectableRowsInCurrentPage === selectedRowsInCurrentPage) && !disabled;

                            return (
                                <div>
                                    <IndeterminateCheckbox
                                        onChange={modifiedOnChange}
                                        checked={checked}
                                        disabled={selectDisableObj?.disableAll || (selectDisableArr?.length > 0 && disabled)}
                                    />
                                </div>
                            );
                        },
                        /*
                         * The cell can use the individual row's getToggleRowSelectedProps method
                         * to the render a checkbox
                         */
                        Cell: ({ row }) => (
                            <div>
                                <IndeterminateCheckbox
                                    {...row.getToggleRowSelectedProps()}
                                    disabled={
                                        selectDisableObj?.disableAll ||
                                        (selectDisableArr?.length > 0 && !validateDisableRow(selectDisableArr, row))
                                    }
                                />
                            </div>
                        )
                    },
                    ...cols
                ]);
        }
    );

    const [activePage, setActivePage] = useState(pageNo);
    const [rowsPerPage, setRowsPerPage] = useState({ value: 10, label: 10 });
    const [searchText, setSearchText] = useState('');
    const [recPerPageOptions] = useState(labelsForRowsperPage);

    useEffect(() => {
        setActivePage(pageNo);
    }, [pageNo]);

    const handleRowsPerpage = (e) => {
        setRowsPerPage(e);
        setPageSize(e.value);
        setActivePage(1);
        const pg = 0;
        gotoPage(pg);
        // setRecordsPerPage && setRecordsPerPage(e.value);
        handleSearch && handleSearch(searchText, e.value, 'rowsPerPage');
        onPageChange && !handleSearch && onPageChange(1, e.value);
    };

    function recordsPerPageTemplate() {
        return (
            <div className="me-5 d-flex align-items-center ms-auto">
                <span className="me-2">Rows Per Page </span>
                <Select
                    value={rowsPerPage}
                    onChange={(e) => handleRowsPerpage(e)}
                    options={recPerPageOptions}
                    components={{
                        IndicatorSeparator: () => null
                    }}
                    menuPlacement="top"
                    id="rowsPerPage"
                />
            </div>
        );
    }

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
        const pg = pageNumber ? Number(pageNumber) - 1 : 0;
        gotoPage(pg);
        onPageChange && onPageChange(pageNumber, rowsPerPage.value);
    };
    const onActionClick = (cell, row, index, actionType) => {
        handleActionClick(cell, row, index, actionType);
    };

    useEffect(() => {
        if (handleSelectedData) handleSelectedData(selectedRowIds);
    }, [selectedRowIds]);

    const prepareCustomBody = (cell, row, index) => {
        let body = undefined;

        switch (cell?.column?.fieldType) {
            case 'navigateLink':
                let url = routeURLID
                    ? cell?.column?.link + '/' + routeURLID
                    : cell?.column?.linkID
                    ? cell?.column?.link + '/' + row?.original?.[cell?.column?.linkID]
                    : cell?.column?.link;
                body = (
                    <Link
                        to={{ pathname: url, state: { data: cell?.column?.state && cell.row.original } }}
                        className="fw-medium link-primary"
                        id={tabelID + 'navigateLink'}
                    >
                        {cell.render('Cell')}
                    </Link>
                );
                break;

            case 'canvas':
                if (!!row.values.counties) {
                    body = (
                        <div
                            className="d-flex align-items-center cursor-pointer"
                            onClick={() => {
                                handleShowCanvas(row);
                            }}
                        >
                            <div className="avatar-xxs">
                                <div className="avatar-title rounded-circle text-light">{row.values.counties}</div>
                            </div>
                            <span className="text-primary w-maxcontent ">View All</span>
                        </div>
                    );
                }
                break;
            case 'badge':
                body = (
                    <span
                        className={`lh-sm badge ${
                            row?.original?.[cell?.column?.id]?.indexOf('-') <= -1 ? 'badge-soft-success' : 'badge-soft-danger'
                        }`}
                    >
                        {cell.render('Cell')}
                    </span>
                );
                break;

            case 'status':
                body = (
                    <div className="label">
                        {/* {row?.original.status === 1 ? 'Active' : 'Inactive'} */}
                        {!!isActionEdit ? (
                            <FormControlLabel
                                control={
                                    <IOSSwitch
                                        sx={{ m: 1 }}
                                        defaultChecked={row?.original.status === 1}
                                        onChange={(e) => handleSwith(e, row)}
                                    />
                                }
                            />
                        ) : (
                            'N/A'
                        )}
                    </div>
                );
                break;
            case 'paymentStatus':
                body = (
                    <span className={`lh-sm badge ${row?.original.status === 1 ? 'badge-soft-success' : 'badge-soft-danger'}`}>
                        {row?.original.status === 1 ? 'Success' : 'pending'}
                    </span>
                );
                break;
            case 'logMethod':
                body = (
                    <span
                        className={`${
                            row?.original?.method === 'GET'
                                ? 'bg-get-method'
                                : row?.original?.method === 'PUT'
                                ? 'bg-put-method'
                                : row?.original?.method === 'POST'
                                ? 'bg-post-method '
                                : row?.original?.method === 'DELETE'
                                ? 'bg-delete-method'
                                : null
                        } py-1 px-2 rounded fs-12`}
                    >
                        {row?.original?.method}
                    </span>
                );
                break;
            case 'date':
                let dateFormat = dateInRequireFormate(row?.original?.[cell?.column?.id], 'd/m/y');
                body = <div className="label">{dateFormat}</div>;
                break;
            case 'image':
                body = (
                    <>
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                                <img src={row?.original?.[cell?.column?.id]} alt="" width={27} height={27} />
                            </div>
                            {/* <div className="flex-grow-1 ms-2 name">{cell.render('Cell')}</div> */}
                        </div>
                        {row?.original?.otherNameRole && row?.cells[1].column.Header === 'Mode' && (
                            <p className="mb-0 mt-1" title={row?.original?.otherName}>
                                ({row?.original?.otherNameRole})
                            </p>
                        )}
                        {row?.original?.isFive9 && row?.cells[1].column.Header === 'Mode' && (
                            <p className="mb-0 mt-1" title={row?.original?.otherName}>
                                ({row?.original?.isFive9 && 'Dialer'})
                            </p>
                        )}
                    </>
                );
                break;
            case 'actions':
                body = (
                    <div className="d-flex align-items-center">
                        {cell?.column?.isEdit && !!isActionEdit && (
                            <i
                                className="ri-pencil-line align-middle fs-18 cursor-pointer primary-color text-info"
                                onClick={() => onActionClick(cell, row, index, 'edit')}
                                id={tabelID + 'edit'}
                            ></i>
                        )}
                        {cell?.column?.isDelete && (
                            <i
                                className="ri-delete-bin-line align-middle ms-2 cursor-pointer text-danger"
                                id={tabelID + 'delete'}
                                onClick={() => onActionClick(cell, row, index, 'delete')}
                            ></i>
                        )}
                        {cell?.column?.isView && (
                            <i
                                className="ri-eye-line align-middle fs-18 cursor-pointer primary-color text-success ms-2"
                                onClick={() => onActionClick(cell, row, index, 'view')}
                                id={tabelID + 'view'}
                            ></i>
                        )}
                        {cell?.column?.isLink && (
                            <i
                                className="ri-arrow-right-up-line align-middle fs-18 cursor-pointer primary-color text-success ms-2"
                                onClick={() => onActionClick(cell, row, index, 'link')}
                                id={tabelID + 'link'}
                            ></i>
                        )}
                        {cell?.column?.isPermission && (
                            <i
                                className="ri-user-settings-line fs-18  primary-color text-success ms-2 cursor-pointer"
                                onClick={() => onActionClick(cell, row, index, 'permission')}
                                id={tabelID + 'permission'}
                            ></i>
                        )}
                    </div>
                );
                break;

            case 'customActions':
                body = <>{customActionsTemplate(cell, row, index)}</>;
                break;
            case 'amount':
                body = <div>${row?.original?.[cell?.column?.id]}</div>;
                break;
            case 'messageStatus':
                body = (
                    <div
                        className={`lh-sm badge ${
                            row?.original?.messageStatus.toLowerCase() !== 'failed'
                                ? row?.original?.messageStatus.toLowerCase() === 'new'
                                    ? 'badge-soft-warning'
                                    : 'badge-soft-success'
                                : 'badge-soft-danger'
                        }`}
                    >
                        {cell?.render('Cell')}
                    </div>
                );
                break;
            default:
                break;
        }
        return body;
    };
    return (
        <Fragment>
            <Card className={cardHeight + ' box-shadow-card'}>
                {cardHeader && (
                    <CardHeader className={'d-flex align-items-center border-top' + cardCSS?.header}>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="d-flex align-items-center">
                            {cardHeader()}
                        </Col>
                    </CardHeader>
                )}
                <CardBody>
                    {loading ? (
                        tableLoader ? (
                            <TableSkelton />
                        ) : (
                            <CommonLoadingSkelton />
                        )
                    ) : (
                        <div className={divClass + ' k-grid'}>
                            <Table hover={data?.length > 0} {...getTableProps()} className={tableClass} id={tabelID}>
                                <thead className={theadClass}>
                                    {headerGroups.map((headerGroup) => (
                                        <tr className={trClass} key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                <th
                                                    key={column.id}
                                                    className={column.thClass}
                                                    width={column.width}
                                                    {...(column.sortable ? column.getSortByToggleProps() : '')}
                                                    {...column.getHeaderProps({
                                                        // style: { width: column.width }
                                                    })}
                                                >
                                                    {column.render('Header')}
                                                    {/* {generateSortingIndicator(column)} */}
                                                    {/* <Filter column={column} /> */}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                <tbody {...getTableBodyProps()}>
                                    {page?.length > 0 ? (
                                        page.map((row, index) => {
                                            prepareRow(row);
                                            return (
                                                <Fragment key={row.getRowProps().key}>
                                                    <tr className="">
                                                        {row.cells.map((cell) => {
                                                            return (
                                                                <td key={cell.id} {...cell.getCellProps()}>
                                                                    {cell.column.customCell ? (
                                                                        prepareCustomBody(cell, row, index)
                                                                    ) : cell.value === '' ? (
                                                                        <span className="text-muted">NA</span>
                                                                    ) : cell.column.twoLines ? (
                                                                        <p className="m-0" title={cell.value}>
                                                                            {cell.value?.length > 90
                                                                                ? getPartOfTheStrUptoRequiredIndex(cell.value, 0, 90)
                                                                                : cell.render('Cell')}
                                                                        </p>
                                                                    ) : (
                                                                        // <p className="m-0" title={cell.value}>
                                                                        <p className={`m-0 ${cell?.column?.classess}`} title={cell.value}>
                                                                            {cell.column.checkActive &&
                                                                                (row.original.isActive === 'Yes' ||
                                                                                row.original.isActive === true ? (
                                                                                    <i
                                                                                        className="ri-user-follow-line align-middle fs-16 text-primary me-2"
                                                                                        title="Active"
                                                                                    ></i>
                                                                                ) : (
                                                                                    <i
                                                                                        className="ri-user-unfollow-line align-middle fs-16 text-danger me-2"
                                                                                        title="Inactvie"
                                                                                    ></i>
                                                                                ))}
                                                                            {cell.render('Cell')}
                                                                        </p>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                </Fragment>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td className="fs-14" colSpan={columns?.length}>
                                                {emptyMessage ? emptyMessage : 'No Records Found.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    {!loading && allDataObj?.totalRecords > 10 && (
                        <Pagination
                            activePage={activePage}
                            itemsCountPerPage={showRowsPerPage ? rowsPerPage.value || 10 : customPageSize}
                            totalItemsCount={state.globalFilter ? rows.length : allDataObj?.totalRecords || 0}
                            pageRangeDisplayed={3}
                            onChange={handlePageChange}
                            hideFirstLastPages={true}
                            recordsPerPageTemplate={recordsPerPageTemplate()}
                            showRowsPerPage={showRowsPerPage}
                        />
                    )}
                </CardBody>
            </Card>
        </Fragment>
    );
};

ActionsTable.propTypes = {
    preGlobalFilteredRows: PropTypes.any
};

export default ActionsTable;