import React, { useEffect, useState } from 'react';
import api, { errorMessage } from '../api/api.js';
import Alert from './ui/Alert.js';
import DateRangeFilter from './ui/DateRangeFilter.js';
import PageCard from './ui/PageCard.js';
import Pagination from './ui/Pagination.js';

const LIMIT = 20;
const STATUS = { IN: 'Masuk', OUT: 'Pulang' };

/** Read-only list of attendance submitted by all employees. */
function AbsentEmployee() {
    const [result, setResult] = useState({ data: [], total: 0 });
    const [page, setPage] = useState(1);
    const [range, setRange] = useState({ from: '', to: '' });
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        api.get('/attendances', {
            params: { page, limit: LIMIT, from: range.from || undefined, to: range.to || undefined },
        })
            .then(res => setResult(res.data))
            .catch(err => setAlert({ type: 'danger', message: errorMessage(err) }));
    }, [page, range]);

    const search = (newRange) => {
        setPage(1);
        setRange(newRange);
    };

    return (
        <PageCard title="Absensi Karyawan" wide>
            <Alert alert={alert} onClose={() => setAlert(null)} />
            <DateRangeFilter from={range.from} to={range.to} onSearch={search} />

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Tanggal</th>
                            <th>Waktu</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.data.length === 0 && (
                            <tr><td colSpan={5} className="text-center text-muted">No attendance found</td></tr>
                        )}
                        {result.data.map(row => (
                            <tr key={row.id}>
                                <td>{row.user.name}</td>
                                <td>{row.user.email}</td>
                                <td className="text-nowrap">{row.date}</td>
                                <td>{row.time.slice(0, 5)}</td>
                                <td>
                                    <span className={`badge ${row.status === 'IN' ? 'bg-success' : 'bg-danger'}`}>
                                        {STATUS[row.status]}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination page={page} limit={LIMIT} total={result.total} onChange={setPage} />
        </PageCard>
    );
}

export default AbsentEmployee;
