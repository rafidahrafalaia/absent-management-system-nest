import React, { useRef, useState } from 'react';
import Avatar from './ui/Avatar.js';

const EMPTY = { name: '', email: '', position: '', phone: '', password: '' };

/**
 * Employee fields shared by the add and edit pages.
 * `onSubmit(values, avatarFile)`; on edit an empty password means "keep the current one".
 */
function EmployeeForm({ initialValues = EMPTY, isEdit = false, submitLabel, onSubmit }) {
    const [values, setValues] = useState({ ...EMPTY, ...initialValues, password: '' });
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState(initialValues.avatar || null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));

    const handleAvatar = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSubmit(values, avatarFile);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={submit}>
            <div className="text-center mb-4">
                <button type="button" className="avatar-button" onClick={() => fileInputRef.current.click()}
                    title="Choose photo">
                    <Avatar src={preview} name={values.name} size={104} />
                    <span className="avatar-edit-hint">Choose photo</span>
                </button>
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" ref={fileInputRef}
                    onChange={handleAvatar} hidden />
            </div>

            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <label htmlFor="name" className="form-label">Nama</label>
                    <input id="name" name="name" className="form-control" value={values.name}
                        onChange={handleChange} maxLength={100} required />
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="email" className="form-label">Email Perusahaan</label>
                    <input type="email" id="email" name="email" className="form-control" value={values.email}
                        onChange={handleChange} maxLength={150} required />
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="position" className="form-label">Posisi</label>
                    <input id="position" name="position" className="form-control" value={values.position}
                        onChange={handleChange} maxLength={100} required />
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="phone" className="form-label">Nomor Handphone</label>
                    <input type="tel" id="phone" name="phone" className="form-control" value={values.phone}
                        onChange={handleChange} placeholder="08xxxxxxxxxx"
                        pattern="\+?[0-9]{8,15}" title="8-15 digits, optionally starting with +" />
                </div>
                <div className="col-12">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" id="password" name="password" className="form-control"
                        value={values.password} onChange={handleChange} minLength={6}
                        autoComplete="new-password" required={!isEdit}
                        placeholder={isEdit ? 'Leave empty to keep the current password' : 'At least 6 characters'} />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                        {saving ? 'Saving...' : submitLabel}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default EmployeeForm;
