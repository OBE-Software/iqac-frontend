import React from 'react';
import { Input } from 'reactstrap';

const TextAreaComponent = (props) => {
    const restrictSpace = (e) => {
        if (e.which === 32 && e?.currentTarget?.selectionStart === 0) e.preventDefault();
    };

    return <Input type="textarea" autoComplete="off" onKeyDown={(ev) => restrictSpace(ev)} {...props} maxLength={4000} />;
};

export default TextAreaComponent;
