import React from 'react';

/** Page section with a title, used by every screen; `wide` for tables. */
function PageCard({ title, wide = false, children }) {
    return (
        <div className={`card page-card shadow-sm ${wide ? 'page-card-wide' : ''}`}>
            <div className="card-body">
                <h1 className="page-title">{title}</h1>
                {children}
            </div>
        </div>
    );
}

export default PageCard;
