import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api/api.js';
import EmployeeForm from './EmployeeForm.js';
import Alert from './ui/Alert.js';
import PageCard from './ui/PageCard.js';

/** Builds the request body, leaving out optional fields that were left empty. */
export const employeePayload = ({ name, email, position, phone, password }) => ({
    name,
    email,
    position,
    ...(phone ? { phone } : {}),
    ...(password ? { password } : {}),
});

export const uploadAvatar = (id, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post(`/employees/${id}/avatar`, formData);
};

function AddEmployee() {
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const create = async (values, avatarFile) => {
        try {
            const { data } = await api.post('/employees', employeePayload(values));
            if (avatarFile) await uploadAvatar(data.id, avatarFile);
            navigate('/', { replace: true });
        } catch (err) {
            setAlert({ type: 'danger', message: errorMessage(err) });
        }
    };

    return (
        <PageCard title="Tambah Karyawan">
            <Alert alert={alert} onClose={() => setAlert(null)} />
            <EmployeeForm submitLabel="Create" onSubmit={create} />
        </PageCard>
    );
}

export default AddEmployee;
