import React, { useEffect, useRef, useState } from 'react';
import api, { errorMessage } from '../api/api.js';
import Alert from './ui/Alert.js';
import Avatar from './ui/Avatar.js';
import PageCard from './ui/PageCard.js';

/**
 * "Profil" menu: shows name, company email, photo, position and phone.
 * The employee can change only their photo, phone number and password.
 */
function Profile() {
    const [profile, setProfile] = useState(null);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alert, setAlert] = useState(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    const showProfile = (data) => {
        setProfile(data);
        setPhone(data.phone || '');
    };

    useEffect(() => {
        api.get('/profile')
            .then(res => showProfile(res.data))
            .catch(err => setAlert({ type: 'danger', message: errorMessage(err) }));
    }, []);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        e.target.value = '';
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const res = await api.post('/profile/avatar', formData);
            showProfile(res.data);
            setAlert({ type: 'success', message: 'Photo updated' });
        } catch (err) {
            setAlert({ type: 'danger', message: errorMessage(err) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            setAlert({ type: 'danger', message: 'Password confirmation does not match' });
            return;
        }
        const changes = {};
        if (phone !== (profile.phone || '')) changes.phone = phone;
        if (password) changes.password = password;
        if (!Object.keys(changes).length) {
            setAlert({ type: 'info', message: 'Nothing changed' });
            return;
        }

        setSaving(true);
        try {
            const res = await api.patch('/profile', changes);
            showProfile(res.data);
            setPassword('');
            setConfirmPassword('');
            setAlert({ type: 'success', message: 'Profile updated' });
        } catch (err) {
            setAlert({ type: 'danger', message: errorMessage(err) });
        } finally {
            setSaving(false);
        }
    };

    if (!profile) {
        return <PageCard title="Profil"><Alert alert={alert} onClose={() => setAlert(null)} />Loading...</PageCard>;
    }

    return (
        <PageCard title="Profil">
            <Alert alert={alert} onClose={() => setAlert(null)} />

            <div className="text-center mb-4">
                <button type="button" className="avatar-button" onClick={() => fileInputRef.current.click()}
                    title="Change photo">
                    <Avatar src={profile.avatar} name={profile.name} size={112} />
                    <span className="avatar-edit-hint">Change photo</span>
                </button>
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" ref={fileInputRef}
                    onChange={handleAvatarChange} hidden />
                <h2 className="h5 mt-3 mb-0">{profile.name}</h2>
                <div className="text-muted">{profile.position}</div>
            </div>

            <dl className="row profile-details">
                <dt className="col-sm-4">Nama</dt>
                <dd className="col-sm-8">{profile.name}</dd>
                <dt className="col-sm-4">Email Perusahaan</dt>
                <dd className="col-sm-8">{profile.email}</dd>
                <dt className="col-sm-4">Posisi</dt>
                <dd className="col-sm-8">{profile.position}</dd>
                <dt className="col-sm-4">Nomor Handphone</dt>
                <dd className="col-sm-8">{profile.phone || '-'}</dd>
            </dl>

            <form onSubmit={handleSubmit} className="border-top pt-3">
                <h2 className="h6 mb-3">Edit profile</h2>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Nomor Handphone</label>
                    <input type="tel" id="phone" className="form-control" value={phone}
                        onChange={e => setPhone(e.target.value)} placeholder="08xxxxxxxxxx"
                        pattern="\+?[0-9]{8,15}" title="8-15 digits, optionally starting with +" />
                </div>
                <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                        <label htmlFor="password" className="form-label">New password</label>
                        <input type="password" id="password" className="form-control" value={password}
                            onChange={e => setPassword(e.target.value)} minLength={6}
                            autoComplete="new-password" placeholder="Leave empty to keep" />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="confirmPassword" className="form-label">Confirm new password</label>
                        <input type="password" id="confirmPassword" className="form-control" value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)} minLength={6}
                            autoComplete="new-password" required={!!password} />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                    {saving ? 'Saving...' : 'Save changes'}
                </button>
            </form>
        </PageCard>
    );
}

export default Profile;
