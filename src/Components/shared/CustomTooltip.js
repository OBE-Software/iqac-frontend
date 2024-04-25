import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

const CustomTooltip = ({ children, text, id }) => {
    return (
        <>
            {children}
            <UncontrolledTooltip placement="right" target={id}>
                {text}
            </UncontrolledTooltip>
        </>
    );
};

export default CustomTooltip;
