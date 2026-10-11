import React from 'react';
import { assetUrl } from '../../api/api.js';

/** Round profile photo; falls back to the person's initials when there is no photo. */
function Avatar({ src, name = '', size = 96 }) {
    const style = { width: size, height: size, fontSize: size / 2.6 };
    if (src) {
        return <img src={assetUrl(src)} alt={name} className="avatar" style={style} />;
    }
    const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
    return <div className="avatar avatar-initials" style={style}>{initials || '?'}</div>;
}

export default Avatar;
