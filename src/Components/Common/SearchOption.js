import React from 'react';
import { Input } from 'reactstrap';

const SearchOption = ({ value, small, handleSearch, onChangeData, disabled }) => {
    return (
        <React.Fragment>
            <form onSubmit={handleSearch}>
                <div className="app-search">
                    <div className="position-relative">
                        <Input
                            type="text"
                            className={`form-control ${small ? 'w-98' : 'w-105'}`}
                            title={'Search'}
                            placeholder="Search"
                            id="search-options"
                            value={value}
                            onChange={(e) => {
                                onChangeData(e.target.value);
                            }}
                            disabled={disabled}
                        />
                        <button type="submit" className="search-widget-icon d-flex">
                            <span className="ri-search-line  cursor-pointer" />
                        </button>
                        <span
                            className="ri-close-circle-line search-widget-icon search-widget-icon-close d-none"
                            id="search-close-options"
                        ></span>
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
};

export default SearchOption;
