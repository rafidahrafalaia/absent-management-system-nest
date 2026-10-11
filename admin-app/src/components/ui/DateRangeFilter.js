import React, { useEffect, useState } from 'react';

/** "Filter Tanggal (From - To)" with a Cari button; calls onSearch({ from, to }). */
function DateRangeFilter({ from, to, onSearch }) {
    const [range, setRange] = useState({ from, to });

    // Follow the range the server actually used (e.g. the default first-of-month..today).
    useEffect(() => setRange({ from, to }), [from, to]);

    const submit = (e) => {
        e.preventDefault();
        onSearch(range);
    };

    return (
        <form className="row g-2 align-items-end mb-3" onSubmit={submit}>
            <div className="col-6 col-md-4">
                <label htmlFor="from" className="form-label small mb-1">From</label>
                <input type="date" id="from" className="form-control" value={range.from || ''}
                    max={range.to || undefined}
                    onChange={e => setRange(r => ({ ...r, from: e.target.value }))} />
            </div>
            <div className="col-6 col-md-4">
                <label htmlFor="to" className="form-label small mb-1">To</label>
                <input type="date" id="to" className="form-control" value={range.to || ''}
                    min={range.from || undefined}
                    onChange={e => setRange(r => ({ ...r, to: e.target.value }))} />
            </div>
            <div className="col-12 col-md-auto">
                <button type="submit" className="btn btn-primary w-100">Cari</button>
            </div>
        </form>
    );
}

export default DateRangeFilter;
