import React, { Fragment, useState, useEffect, useRef, forwardRef } from 'react';
import { useTable, useGlobalFilter, useAsyncDebounce, useSortBy, useFilters, useExpanded, usePagination, useRowSelect } from 'react-table';
import { Table, Col, CardHeader, CardBody, Card, Progress, Input, Row } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Select from 'react-select';

import Pagination from '../../Components/Common/Pagination/Pagination';
import { DefaultColumnFilter } from './filters';
import { formSelectDefault, multiSelectScroll, selectCustomStyles } from '../constants/styles';
import { CommonLoadingSkelton, TableSkelton } from './skelton';

import sortdesc from '../../assets/images/sortdesc.png';
import sortasc from '../../assets/images/sortasc.png';
import InputComponent from './InputComponent';
import { convertDateIntoDays, dateInRequireFormate } from './Util';
import ToggleSwitch from './ToogleSwitch';
import { StatusAbonded } from '../constants/CommonConstants';
import MultiSelect from './MultiSelect';
import { useTrans } from '../Hooks/UserHooks';
import AddnewQuestionIntheTableAssessment from './DynamicForms/AddnewQuestionIntheTableAssessment';
import PdfIcon from '../../assets/images/pdf.png';

// Define a default UI for filtering
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter, type, globalSelectConfig, tabelID }) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);

    const onChange = useAsyncDebounce((val) => {
        setGlobalFilter(val || undefined);
    }, 200);

    return (
        <div>
            {type === 'input' && (
                <div className="search-box me-2 mb-2 d-inline-block">
                    <div className="position-relative">
                        <div htmlFor="search-bar-0" className="search-label">
                            <input
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    onChange(e.target.value);
                                }}
                                id={'search-bar-0' + tabelID}
                                type="text"
                                className="form-control"
                                placeholder={'Search'}
                                value={value || ''}
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

const PrimaryTable = ({
    tabelID,
    cardTitle,
    columns,
    data,
    isGlobalFilter,
    hasToogle,
    customPageSize,
    // setRecordsPerPage,
    showRowsPerPage = true,
    handleSortHeaderHandler,
    tableClass,
    theadClass,
    trClass,
    thClass,
    isSortByAsc,
    setIsSortByAsc,
    sortColName,
    setSortColName,
    divClass,
    emptyMessage,
    isFullScreenMode,
    toggleFullscreen,
    loading,
    LoadingComponent,
    manualFilter,
    allDataObj,
    pageNo = 1,
    onPageChange,
    globalSelectConfig,
    buttonLabel,
    onGlobalBtnClick,
    routeURLID,
    showSelectAllOption,
    selectedRows = {},
    selectDisableObj,
    selectDisableArr,
    handleSelectedData,
    marginTopForPagination,
    hideCardTitle,
    changed,
    handleOnBlur,
    fromPage = 'default',
    toogleOptions,
    filterColums,
    sortList,
    setSortList,
    isMultiSort,
    handleBlurOnFilterSelect,
    filteredColumnsData,
    customActionsTemplate,
    onRadioBoxChangedForDiffQuestionOnPhq,
    handlePdfDownload
}) => {
    const t = useTrans('translation');

    const [, setTcolums] = useState(filteredColumnsData ? filteredColumnsData : columns);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        rows,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state,
        preGlobalFilteredRows,
        setGlobalFilter,

        state: { pageIndex, pageSize, selectedRowIds }
    } = useTable(
        {
            columns: filteredColumnsData ? filteredColumnsData : columns,
            data,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: customPageSize ? customPageSize : 10, selectedRowIds: selectedRows } // , sortBy: [{ desc: true }]
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

    const history = useHistory();
    const [activePage, setActivePage] = useState(pageNo);
    const [sortingList, setSortingList] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(
        customPageSize ? { value: customPageSize, label: customPageSize } : { value: 10, label: 10 }
    );
    const [recPerPageOptions] = useState([
        { value: 10, label: 10 },
        { value: 25, label: 25 },
        { value: 50, label: 50 },
        { value: 75, label: 75 },
        { value: 100, label: 100 },
        { value: 200, label: 200 },
        { value: 300, label: 300 },
        { value: 400, label: 400 },
        { value: 500, label: 500 }
    ]);

    useEffect(() => {
        setActivePage(pageNo);
    }, [pageNo]);

    useEffect(() => {
        sortList && setSortingList(sortList.map((col) => col.sortColumn));
    }, [sortList]);

    const handleRowsPerpage = (e) => {
        setRowsPerPage(e);
        setPageSize(e.value);
        /*
         * setRecordsPerPage && setRecordsPerPage(e.value);
         * onPageChange(e.value >= allDataObj?.totalRecords ? 1 : pageNo, e.value);
         */
        onPageChange(1, e.value);
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

    const generateSortingIndicator = (isAsc) => {
        /*
         * return column.isSorted ? (
         *     column.isSortedDesc ? (
         *         <img className="sortsymbol" src={sortdesc} alt="desc" />
         *     ) : (
         *         <img className="sortsymbol" src={sortasc} alt="asc" />
         *     )
         * ) : (
         *     <img className="sortsymbol" src={sortdesc} alt="desc" />
         * );
         */
        return isAsc ? <img className="sortsymbol" src={sortdesc} alt="asc" /> : <img className="sortsymbol" src={sortasc} alt="desc" />;
    };

    const onChangeInSelect = (event) => {
        setPageSize(Number(event.target.value));
    };

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
        const pg = pageNumber ? Number(pageNumber) - 1 : 0;
        gotoPage(pg);

        onPageChange(pageNumber, rowsPerPage.value, true);
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
                        // to={url}
                        to={{ pathname: url, state: { data: cell?.column?.state && cell.row.original } }}
                        className="fw-medium link-primary"
                    >
                        {cell.render('Cell')}
                    </Link>
                );
                break;
            case 'navigateRoute':
                // let url1 = cell?.column?.linkID ? cell?.column?.link + row?.original?.[cell?.column?.linkID] : cell?.column?.link;

                body = (
                    <div className="d-flex align-items-center">
                        <div
                            onClick={() => {
                                history.push({
                                    pathname: cell?.column?.link,
                                    search: cell?.column?.queryParams + row?.original?.[cell?.column?.linkID],
                                    state: { rowData: row.original }
                                });
                                // history.push(url1);
                            }}
                            className={`fw-medium ${
                                row.original?.status === StatusAbonded && cell?.column?.Header === 'Name'
                                    ? 'text-secondary'
                                    : 'link-primary'
                            } cursor-pointer ${cell.column?.class} ${cell?.column?.extraPadding && 'py-2'}`}
                        >
                            {cell.render('Cell')}
                        </div>
                        {cell?.column?.showDownloadPdfIcon && (
                            <img
                                height={20}
                                width={20}
                                className="mx-4 cursor-pointer"
                                src={PdfIcon}
                                alt={t('translation:download')}
                                title={t('translation:download')}
                                id="pdfdownload-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePdfDownload && handlePdfDownload(cell, row, index);
                                }}
                            />
                        )}
                    </div>
                );
                break;
            case 'imageLabel':
                let fullNameSplit = row?.original?.[cell?.column?.id].split(' ');
                body = (
                    <>
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                                {row.original.img ? (
                                    <img src={row.original.img} alt="" className="avatar-xxs rounded-circle" />
                                ) : (
                                    <div className="flex-shrink-0 avatar-xs">
                                        <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                                            {row?.original?.[cell?.column?.id].charAt(0)}
                                            {fullNameSplit?.length > 1 ? fullNameSplit[fullNameSplit.length - 1].charAt(0) : ''}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow-1 ms-2 name">{cell.render('Cell')}</div>
                        </div>
                    </>
                );
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
            case 'EligibilityColorCode':
                if (row?.original?.[cell?.column?.id]) {
                    let daysDifference = convertDateIntoDays(row?.original?.[cell?.column?.id]);
                    body = (
                        <div
                            className={`lh-sm badge ${
                                daysDifference > 0
                                    ? daysDifference < 10
                                        ? 'badge-soft-warning'
                                        : 'badge-soft-success'
                                    : 'badge-soft-danger'
                            }`}
                        >
                            {row?.original?.[cell?.column?.id]}
                        </div>
                    );
                    break;
                } else {
                    body = <div className="text text-warning">TBD</div>;
                    break;
                }

            case 'status':
                body = (
                    <span className={`lh-sm badge ${row?.original?.status === 'Assigned' ? 'badge-soft-danger' : 'badge-soft-warning'}`}>
                        {cell.render('Cell')}
                    </span>
                );
                break;
            case 'showDiffrentValueOnHover':
                body = <span title={row?.original?.[cell?.column?.fieldValue]}>{cell.render('Cell')}</span>;
                break;
            case 'ProgressBar':
                body = (
                    <Progress
                        value={row?.original?.[cell?.column?.id]}
                        color="danger"
                        className="animated-progess custom-progress progress-label mt-1"
                    >
                        <div className="label">{row?.original?.[cell?.column?.id]}%</div>
                    </Progress>
                );
                break;
            case 'radio':
                body = (
                    <InputComponent
                        className={`form-check-input ${
                            row?.original?.[cell?.column?.id] === cell?.column?.[cell?.column?.customTypeValue] &&
                            'form-check-input-radio-checked'
                        }`}
                        type="radio"
                        name={row?.original?.[cell?.column?.customTypeKey] + '_' + cell?.column?.[cell?.column?.customTypeValue]}
                        id={row?.original?.[cell?.column?.customTypeKey] + '_' + cell?.column?.[cell?.column?.customTypeValue]}
                        value={cell?.column?.[cell?.column?.customTypeValue]}
                        checked={row?.original?.[cell?.column?.id] === cell?.column?.[cell?.column?.customTypeValue]}
                        onChange={(ev) => changed(ev, row, cell, index)}
                        onBlur={handleOnBlur}
                    />
                );
                break;
            case 'date':
                let dateFormat = dateInRequireFormate(row?.original?.[cell?.column?.id], 'm/d/y');
                body = <div className="label">{dateFormat}</div>;
                break;

            case 'showIcon':
                body = (
                    <>
                        <div className="d-flex align-items-center">
                            {row.original?.[cell?.column?.iconName] && (
                                <div className="flex-shrink-0">
                                    <img src={cell?.column?.iconURL} alt={cell?.column?.iconName} className="width-20 me-1" />
                                </div>
                            )}
                            <div className="flex-grow-1 name">{cell.render('Cell')}</div>
                        </div>
                    </>
                );
                break;
            case 'customActions':
                body = <>{customActionsTemplate(cell, row, index)}</>;
                break;
            default:
                break;
        }
        return body;
    };
    let titleOfTheHead = '';
    if (cardTitle) {
        if (cardTitle === 'Assessments') {
            let filteredData = data?.filter((item) => item?.status !== StatusAbonded);
            titleOfTheHead = `${cardTitle} ${filteredData?.length > 0 ? '(' + filteredData?.length + ')' : ''}`;
        }
    }

    return (
        <Fragment>
            <Card>
                {/* className={customPageSize <= 5 ? 'cardfixed-ht' : ''} */}
                {hideCardTitle ? (
                    ''
                ) : (
                    <CardHeader className="d-flex align-items-center border-top">
                        <Col sm={3} className="d-flex align-items-center">
                            <h4 className="card-title flex-shrink-1 mb-0">
                                {cardTitle === 'Assessments' && titleOfTheHead}
                                {cardTitle !== 'Assessments' && cardTitle}
                                {cardTitle !== 'Assessments' && allDataObj?.totalRecords ? '(' + allDataObj?.totalRecords + ')' : ''}
                            </h4>
                            {buttonLabel && (
                                <button
                                    type="button"
                                    className="btn btn-soft-primary btn-sm me-2 ms-2 rounded-pill sm-btn"
                                    onClick={onGlobalBtnClick}
                                    title={buttonLabel}
                                    id={'add' + tabelID}
                                >
                                    <i className="ri-add-fill fs-18 fw-bold"></i>
                                    {/* {buttonLabel} */}
                                </button>
                            )}
                        </Col>
                        <Col sm={9} className="flex-shrink-0 d-flex align-items-center justify-content-end gap-1">
                            {toogleOptions?.toogleText && <ToggleSwitch toogleOptions={toogleOptions} />}
                            {isGlobalFilter && (
                                <>
                                    <GlobalFilter
                                        preGlobalFilteredRows={preGlobalFilteredRows}
                                        globalFilter={state.globalFilter}
                                        setGlobalFilter={setGlobalFilter}
                                        type={globalSelectConfig?.type || 'input'}
                                        globalSelectConfig={globalSelectConfig}
                                        tabelID={tabelID}
                                    />
                                    {manualFilter && (
                                        <Select
                                            id="race"
                                            value={''}
                                            onChange={(e) => {}}
                                            isLoading={false}
                                            className="w-30 mb-2"
                                            name="race"
                                            options={[
                                                {
                                                    label: 'Filter1',
                                                    value: 'Filter1'
                                                }
                                            ]}
                                            placeholder="Select Filter"
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                        />
                                    )}
                                </>
                            )}

                            {hasToogle && (
                                <div className="ms-1 header-item height-30 d-none d-sm-flex">
                                    <button
                                        onClick={toggleFullscreen}
                                        type="button"
                                        className="btn btn-icon btn-topbar btn-ghost-primary rounded-circle"
                                    >
                                        <i className={isFullScreenMode ? 'ri-fullscreen-line fs-22' : 'ri-fullscreen-exit-line fs-22'}></i>
                                    </button>
                                </div>
                            )}
                            {filterColums && (
                                <div className="w-20">
                                    <MultiSelect
                                        value={filteredColumnsData ? filteredColumnsData : columns}
                                        onChange={(e) => {
                                            let orderCols =
                                                e?.length > 0
                                                    ? e.sort(function (a, b) {
                                                          return a.order - b.order;
                                                      })
                                                    : e;
                                            let payload = {
                                                data: orderCols,
                                                key: 'refColumns'
                                            };
                                        }}
                                        onBlur={() => handleBlurOnFilterSelect && handleBlurOnFilterSelect(filteredColumnsData)}
                                        options={columns}
                                        getOptionLabel={(e) => e.Header}
                                        getOptionValue={(e) => e.accessor}
                                        placeholder={t('filterColums')}
                                        styles={{
                                            ...formSelectDefault,
                                            menu: (provided) => ({ ...provided, zIndex: 2 }),
                                            ...multiSelectScroll(true, false)
                                        }}
                                        isClearable={false}
                                        className="w-100  ht-fitcontent"
                                        id="lob"
                                        name="lob"
                                        closeMenuOnSelect={false}
                                        hideSelectedOptions={false}
                                        isMulti
                                        controlShouldRenderValue={false}
                                    />
                                </div>
                            )}
                        </Col>
                    </CardHeader>
                )}

                <CardBody>
                    {loading ? (
                        // tableLoader ? (
                        true ? (
                            LoadingComponent ? (
                                <LoadingComponent />
                            ) : (
                                <TableSkelton />
                            )
                        ) : LoadingComponent ? (
                            <LoadingComponent />
                        ) : (
                            <CommonLoadingSkelton />
                        )
                    ) : (
                        <div className={divClass}>
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
                                                    onClick={() => {
                                                        if (column.sortable) {
                                                            if (!isMultiSort) {
                                                                setSortColName(column?.sortingName);
                                                                setIsSortByAsc((p) => !p);
                                                                handleSortHeaderHandler(
                                                                    column?.sortingName,
                                                                    activePage,
                                                                    rowsPerPage,
                                                                    !isSortByAsc
                                                                );
                                                                return;
                                                            }
                                                            setSortList((sortList) => {
                                                                const sortIndex = sortList.findIndex(
                                                                    (col) => col.sortColumn === column?.sortingName
                                                                );
                                                                if (sortIndex > -1) {
                                                                    return [
                                                                        ...sortList.slice(0, sortIndex),
                                                                        {
                                                                            sortColumn: column?.sortingName,
                                                                            sortByAscending: !sortList[sortIndex].sortByAscending
                                                                        },
                                                                        ...sortList.slice(sortIndex + 1)
                                                                    ];
                                                                }
                                                                return [
                                                                    ...sortList,
                                                                    { sortColumn: column?.sortingName, sortByAscending: true }
                                                                ];
                                                            });
                                                        }
                                                    }}
                                                >
                                                    {column.render('Header')}
                                                    {column.sortable &&
                                                    ((!isMultiSort && sortColName === column?.sortingName) ||
                                                        (isMultiSort && sortingList.indexOf(column?.sortingName) > -1))
                                                        ? generateSortingIndicator(
                                                              !isMultiSort
                                                                  ? isSortByAsc
                                                                  : sortList[sortingList.indexOf(column?.sortingName)].sortByAscending
                                                          )
                                                        : ''}
                                                    {isMultiSort && sortingList.indexOf(column?.sortingName) > -1 && (
                                                        <span className="text-muted small">
                                                            {sortingList.indexOf(column?.sortingName) + 1}
                                                        </span>
                                                    )}
                                                    {/* <Filter column={column} /> */}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                <tbody {...getTableBodyProps()} className="h-60">
                                    {page?.length > 0 ? (
                                        page.map((row, index) => {
                                            prepareRow(row);
                                            return (
                                                <Fragment key={row.getRowProps().key}>
                                                    <tr>
                                                        {fromPage === 'dynamicForms' && row?.original?.answerControlType === 111 ? (
                                                            <th className="text-primary" colSpan={row.allCells?.length || 2}>
                                                                {row.original?.questionText}
                                                            </th>
                                                        ) : (
                                                            <Fragment>
                                                                {row.original?.answerControlType === 114 ? (
                                                                    <AddnewQuestionIntheTableAssessment
                                                                        onRadioBoxChangedForDiffQuestionOnPhq={
                                                                            onRadioBoxChangedForDiffQuestionOnPhq
                                                                        }
                                                                        index={index}
                                                                        handleOnBlur={handleOnBlur}
                                                                        row={row}
                                                                    />
                                                                ) : (
                                                                    row.cells.map((cell) => {
                                                                        return (
                                                                            <td
                                                                                key={cell.id}
                                                                                {...cell.getCellProps()}
                                                                                title={row?.original?.[cell?.column?.id]}
                                                                                width={cell.column.width}
                                                                            >
                                                                                {cell.column.customCell
                                                                                    ? prepareCustomBody(cell, row, index)
                                                                                    : cell.render('Cell')}
                                                                            </td>
                                                                        );
                                                                    })
                                                                )}
                                                            </Fragment>
                                                        )}
                                                    </tr>
                                                </Fragment>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td className="fs-14" colSpan={filteredColumnsData ? filteredColumnsData?.length : columns}>
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
                            itemsCountPerPage={rowsPerPage.value || 10}
                            // totalItemsCount={allDataObj?.totalRecords || 0}
                            totalItemsCount={state.globalFilter ? rows.length : allDataObj?.totalRecords || 0}
                            pageRangeDisplayed={3}
                            onChange={handlePageChange}
                            hideFirstLastPages={true}
                            marginTop={marginTopForPagination}
                            recordsPerPageTemplate={recordsPerPageTemplate()}
                            showRowsPerPage={showRowsPerPage}
                        />
                    )}
                </CardBody>
            </Card>
        </Fragment>
    );
};

PrimaryTable.propTypes = {
    preGlobalFilteredRows: PropTypes.any
};

export default PrimaryTable;
