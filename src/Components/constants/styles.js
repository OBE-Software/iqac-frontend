export const selectCustomStyles = {
    control: (base) => ({
        ...base,
        minHeight: 30
    }),
    dropdownIndicator: (base) => ({
        ...base,
        padding: 4
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0px 6px'
    })
};
export const formSelectDefault = {
    control: (base, { isDisabled }) => ({
        ...base,
        border: '1px solid #ced4da',
        background: isDisabled && '#eff2f7'
    }),
    placeholder: (base) => ({
        ...base,
        color: '#9599ad'
    })
};
export const formSelectForMulti = () => {
    return {
        control: (base) => ({
            ...base,
            border: '1px solid #ced4da'
        }),
        placeholder: (base) => ({
            ...base,
            color: '#9599ad'
        }),
        valueContainer: (base) => ({
            display: 'flex',
            width: '100%',
            maxWidth: '500px',
            overflowX: 'scroll',
            alignItems: 'center',
            paddingLeft: '6px'
        }),

        multiValue: (base) => ({
            ...base,
            minWidth: '100px'
        })
    };
};
export const getSelectErrorBorder = (value) => {
    const style = {
        control: (base, { isDisabled }) => ({
            ...base,
            border: value && '1px solid #f06548',
            background: isDisabled && '#eff2f7'
        })
    };
    return style;
};

export const multiSelectScroll = (value1, error) => {
    const style = {
        control: (base, { isDisabled }) => ({
            ...base,
            maxHeight: '60px',
            overflow: 'auto',
            border: error && '1px solid #f06548',
            background: isDisabled && '#eff2f7'
        }),
        indicatorsContainer: (base) => ({
            ...base,
            alignItems: 'start'
        })
    };
    return style;
};
