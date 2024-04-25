import { useEffect } from 'react';
import { useState, useRef } from 'react';
import Select, { components } from 'react-select';

const MultiSelect = (props) => {
    const isAllSelected = useRef(false);
    const allOption = { value: '*', label: 'ALL' };

    const Option = (msProps) => {
        const [isActive, setIsActive] = useState(false);
        const onMouseDown = () => setIsActive(true);
        const onMouseUp = () => setIsActive(false);
        const onMouseLeave = () => setIsActive(false);

        // styles
        let bg = 'transparent';
        if (msProps.isFocused) bg = '#Deebff';
        if (isActive) bg = '#B2D4FF';

        const style = {
            alignItems: 'center',
            backgroundColor: bg,
            color: 'inherit',
            display: 'flex '
        };

        // prop assignment
        const multiSelProps = {
            ...msProps.innerProps,
            onMouseDown,
            onMouseUp,
            onMouseLeave,
            style
        };

        return (
            <components.Option {...msProps} innerProps={multiSelProps}>
                <input
                    className="me-3"
                    key={multiSelProps.value}
                    type="checkbox"
                    checked={msProps.isSelected || (props.value?.length && isAllSelected.current)}
                    onChange={() => {}}
                />
                {msProps.label}
            </components.Option>
        );
    };

    const handleChange = (selected) => {
        if (selected?.length <= 0) {
            isAllSelected.current = false;
            return props.onChange([]);
        } else if (selected?.some((a) => a.value === '*')) {
            let curr = isAllSelected.current;
            isAllSelected.current = !isAllSelected.current;
            return props.onChange(curr ? [] : props.options);
        } else if (!selected?.some((a) => a.value === '*')) {
            isAllSelected.current = selected?.length === props.options.length;
            return props.onChange(selected);
        }
    };

    useEffect(() => {
        if (props.options?.length === props.value?.length) isAllSelected.current = true;
        else isAllSelected.current = false;
    }, [props.options, props.value]);

    return (
        <Select
            {...props}
            options={props.options?.length ? (props.hideAll ? [...props.options] : [allOption, ...props.options]) : []}
            onChange={handleChange}
            components={{
                Option,
                IndicatorSeparator: () => null
            }}
            onBlur={props.onBlur || (() => {})}
        />
    );
};

export default MultiSelect;
