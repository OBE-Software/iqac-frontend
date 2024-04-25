import React from 'react';
import paginator from 'paginator';

import cx from 'classnames';
import Page from './Page';

export default class Pagination extends React.Component {
    static defaultProps = {
        itemsCountPerPage: 10,
        pageRangeDisplayed: 5,
        activePage: 1,
        prevPageText: '←',
        firstPageText: 'First',
        nextPageText: '→',
        lastPageText: 'Last',
        innerClass: 'pagination pagination-separated pagination-sm mb-0',
        itemClass: 'page-item',
        linkClass: 'page-link',
        activeLinkClass: undefined,
        hideFirstLastPages: false,
        getPageUrl: (i) => '#'
    };

    isFirstPageVisible(hasPreviousPage) {
        const { hideDisabled, hideNavigation, hideFirstLastPages } = this.props;
        if (hideFirstLastPages || (hideDisabled && !hasPreviousPage)) return false;
        return true;
    }

    isPrevPageVisible(hasPreviousPage) {
        const { hideDisabled, hideNavigation } = this.props;
        if (hideNavigation || (hideDisabled && !hasPreviousPage)) return false;
        return true;
    }

    isNextPageVisible(hasNextPage) {
        const { hideDisabled, hideNavigation } = this.props;
        if (hideNavigation || (hideDisabled && !hasNextPage)) return false;
        return true;
    }

    isLastPageVisible(hasNextPage) {
        const { hideDisabled, hideNavigation, hideFirstLastPages } = this.props;
        if (hideFirstLastPages || (hideDisabled && !hasNextPage)) return false;
        return true;
    }

    buildPages() {
        const pages = [];
        const {
            itemsCountPerPage,
            pageRangeDisplayed,
            activePage,
            prevPageText,
            nextPageText,
            firstPageText,
            lastPageText,
            totalItemsCount,
            onChange,
            activeClass,
            itemClass,
            itemClassFirst,
            itemClassPrev,
            itemClassNext,
            itemClassLast,
            activeLinkClass,
            disabledClass,
            hideDisabled,
            hideNavigation,
            linkClass,
            linkClassFirst,
            linkClassPrev,
            linkClassNext,
            linkClassLast,
            hideFirstLastPages,
            getPageUrl
        } = this.props;

        const paginationInfo = new paginator(itemsCountPerPage, pageRangeDisplayed).build(totalItemsCount, activePage);

        for (let i = paginationInfo.first_page; i <= paginationInfo.last_page; i++) {
            pages.push(
                <Page
                    isActive={i === activePage}
                    key={i}
                    href={getPageUrl(i)}
                    pageNumber={i}
                    pageText={i + ''}
                    onClick={onChange}
                    itemClass={itemClass}
                    linkClass={linkClass}
                    activeClass={activeClass}
                    activeLinkClass={activeLinkClass}
                    ariaLabel={`Go to page number ${i}`}
                    id={'pageNumber' + i}
                />
            );
        }

        this.isPrevPageVisible(paginationInfo.has_previous_page) &&
            pages.unshift(
                <Page
                    key={'prev' + paginationInfo.previous_page}
                    href={getPageUrl(paginationInfo.previous_page)}
                    pageNumber={paginationInfo.previous_page}
                    onClick={onChange}
                    pageText={prevPageText}
                    isDisabled={!paginationInfo.has_previous_page}
                    itemClass={cx(itemClass, itemClassPrev)}
                    linkClass={cx(linkClass, linkClassPrev)}
                    disabledClass={disabledClass}
                    ariaLabel="Go to previous page"
                    id="previousPage"
                />
            );

        this.isFirstPageVisible(paginationInfo.has_previous_page) &&
            pages.unshift(
                <Page
                    key={'first'}
                    href={getPageUrl(1)}
                    pageNumber={1}
                    onClick={onChange}
                    pageText={firstPageText}
                    isDisabled={!paginationInfo.has_previous_page}
                    itemClass={cx(itemClass, itemClassFirst)}
                    linkClass={cx(linkClass, linkClassFirst)}
                    disabledClass={disabledClass}
                    ariaLabel="Go to first page"
                    id="firstPage"
                />
            );

        this.isNextPageVisible(paginationInfo.has_next_page) &&
            pages.push(
                <Page
                    key={'next' + paginationInfo.next_page}
                    href={getPageUrl(paginationInfo.next_page)}
                    pageNumber={paginationInfo.next_page}
                    onClick={onChange}
                    pageText={nextPageText}
                    isDisabled={!paginationInfo.has_next_page}
                    itemClass={cx(itemClass, itemClassNext)}
                    linkClass={cx(linkClass, linkClassNext)}
                    disabledClass={disabledClass}
                    ariaLabel="Go to next page"
                    id="nextPage"
                />
            );

        this.isLastPageVisible(paginationInfo.has_next_page) &&
            pages.push(
                <Page
                    key={'last'}
                    href={getPageUrl(paginationInfo.total_pages)}
                    pageNumber={paginationInfo.total_pages}
                    onClick={onChange}
                    pageText={lastPageText}
                    isDisabled={paginationInfo.current_page === paginationInfo.total_pages}
                    itemClass={cx(itemClass, itemClassLast)}
                    linkClass={cx(linkClass, linkClassLast)}
                    disabledClass={disabledClass}
                    ariaLabel="Go to last page"
                    id="lastPage"
                />
            );

        return pages;
    }

    render() {
        const pages = this.buildPages();
        const { itemsCountPerPage, pageRangeDisplayed, activePage, totalItemsCount } = this.props;
        const paginationInfo = new paginator(itemsCountPerPage, pageRangeDisplayed).build(totalItemsCount, activePage);
        return (
            <div className={`align-items-center ${this.props.marginTop ? this.props.marginTop : 'mt-7'}   d-flex`}>
                <div className="flex-shrink-0">
                    <div className="text-muted">
                        Showing <span className="fw-semibold">{paginationInfo.first_result + 1}</span> to
                        {paginationInfo.first_result + paginationInfo.results} of
                        <span className="fw-semibold"> {paginationInfo.total_results}</span> Results
                    </div>
                </div>
                {this.props.showRowsPerPage && this.props.recordsPerPageTemplate}
                <ul className={`${this.props.innerClass}  ${this.props.showRowsPerPage ? '' : 'ms-auto'}`}>{pages}</ul>
            </div>
        );
    }
}
