import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api/api.js';
import { employeePayload, uploadAvatar } from './AddEmployee.js';
import EmployeeForm from './EmployeeForm.js';
import Alert from './ui/Alert.js';
import PageCard from './ui/PageCard.js';

function EditEmployee() {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        api.get(`/employees/${id}`)
            .then(res => setEmployee(res.data))
            .catch(err => setAlert({ type: 'danger', message: errorMessage(err) }));
    }, [id]);

    const update = async (values, avatarFile) => {
        try {
            let { data } = await api.patch(`/employees/${id}`, employeePayload(values));
            if (avatarFile) ({ data } = await uploadAvatar(id, avatarFile));
            setEmployee(data);
            setAlert({ type: 'success', message: 'Employee updated' });
        } catch (err) {
            setAlert({ type: 'danger', message: errorMessage(err) });
        }
    };

    return (
        <PageCard title="Edit Karyawan">
            <Link to="/" className="d-inline-block mb-3">&larr; Back to list</Link>
            <Alert alert={alert} onClose={() => setAlert(null)} />
            {employee && (
                <EmployeeForm
                    key={employee.updatedAt}
                    initialValues={{ ...employee, phone: employee.phone || '' }}
                    isEdit
                    submitLabel="Update"
                    onSubmit={update}
                />
            )}
        </PageCard>
    );
}

export default EditEmployee;
