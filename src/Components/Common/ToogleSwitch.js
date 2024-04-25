import React, { useState } from 'react';
import loader5 from '../../assets/images/gif/loader.gif';
const ToggleSwitch = (props) => {
    return (
        <div className={'toggle-switch ' + props.toogleOptions?.className}>
            <input
                type="checkbox"
                className="toggle-switch-checkbox"
                name={props.toogleOptions?.toogleText}
                id={props.toogleOptions?.toogleText}
                checked={props.toogleOptions?.toogleChecked}
                onChange={props.toogleOptions?.onToogleChange}
            />
            {props.toogleOptions?.loading ? (
                <div className="btn-md me-4 cursor-default">
                    <img src={loader5} alt="loader" className="small-loader" />
                </div>
            ) : (
                <label className="toggle-switch-label" htmlFor={props.toogleOptions?.toogleText}>
                    <span className="toggle-switch-inner" />
                </label>
            )}
        </div>
    );
};
export default ToggleSwitch;
