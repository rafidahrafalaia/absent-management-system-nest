import React from 'react';

/** Previous / page numbers / Next, plus a "x-y of total" label. */
function Pagination({ page, limit, total, onChange }) {
    const pages = Math.max(1, Math.ceil(total / limit));
    if (total === 0) return null;

    const first = (page - 1) * limit + 1;
    const last = Math.min(page * limit, total);

    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <span className="text-muted small">{first}-{last} of {total}</span>
            <nav aria-label="Pagination">
                <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => onChange(page - 1)}>Previous</button>
                    </li>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                        <li key={n} className={`page-item ${n === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => onChange(n)}>{n}</button>
                        </li>
                    ))}
                    <li className={`page-item ${page === pages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => onChange(page + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Pagination;
