/* eslint-disable no-console */
import React from 'react';
import { Input } from 'reactstrap';

const InputComponent = (props) => {
    const restrictSpace = (e) => {
        if (e.which === 32 && e?.currentTarget?.selectionStart === 0) e.preventDefault();
        if (props.type === 'number' && (e.which === 69 || e.which === 189 || e.which === 187 || e.which === 190)) e.preventDefault();
    };

    const handleOnInput = (e) => {
        if (props.maxLength && e?.target?.value && e.target.value.length > props.maxLength) {
            e.target.value = e.target.value.slice(0, props.maxLength);
        }
    };

    return <Input autoComplete="off" onKeyDown={(ev) => restrictSpace(ev)} {...props} onInput={handleOnInput} />;
};

export default InputComponent;
