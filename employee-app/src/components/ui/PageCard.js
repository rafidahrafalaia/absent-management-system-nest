import React from 'react';

/** Page section with a title, used by every screen. */
function PageCard({ title, children }) {
    return (
        <div className="card page-card shadow-sm">
            <div className="card-body">
                <h1 className="page-title">{title}</h1>
                {children}
            </div>
        </div>
    );
}

export default PageCard;
