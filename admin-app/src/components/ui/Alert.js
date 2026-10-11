import React from 'react';

/** Dismissible Bootstrap alert; renders nothing when there is no message. */
function Alert({ alert, onClose }) {
    if (!alert) return null;
    return (
        <div className={`alert alert-${alert.type} d-flex justify-content-between align-items-start py-2`} role="alert">
            <span>{alert.message}</span>
            <button type="button" className="btn-close ms-3" aria-label="Close" onClick={onClose} />
        </div>
    );
}

export default Alert;
