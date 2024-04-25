import React from 'react';
import { Input } from 'reactstrap';

export const Filter = ({ column }) => {
    const style = (key, pos, val) => {
        return { [key + pos]: `${val}px` };
    };
    return <div style={style('margin', 'Top', '5')}>{column.canFilter && column.render('Filter')}</div>;
};

export const DefaultColumnFilter = ({
    column: {
        filterValue,
        setFilter,
        preFilteredRows: { length }
    }
}) => {
    return <Input value={filterValue || ''} onChange={(e) => setFilter(e.target.value || undefined)} placeholder={'Search'} />;
};

export const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
    const options = React.useMemo(() => {
        const ops = new Set();
        preFilteredRows.forEach((row) => {
            ops.add(row.values[id]);
        });
        return [...ops.values()];
    }, [id, preFilteredRows]);

    return (
        <select id="custom-select" className="form-select" value={filterValue} onChange={(e) => setFilter(e.target.value || undefined)}>
            <option value="">All</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};
