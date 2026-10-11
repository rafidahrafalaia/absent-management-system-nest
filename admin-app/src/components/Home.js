import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api/api.js';
import Alert from './ui/Alert.js';
import Avatar from './ui/Avatar.js';
import PageCard from './ui/PageCard.js';
import Pagination from './ui/Pagination.js';

const LIMIT = 10;

/** Employee list with search; each row links to the edit page. */
function Home() {
    const [result, setResult] = useState({ data: [], total: 0 });
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [query, setQuery] = useState('');
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        api.get('/employees', { params: { page, limit: LIMIT, search: query || undefined } })
            .then(res => setResult(res.data))
            .catch(err => setAlert({ type: 'danger', message: errorMessage(err) }));
    }, [page, query]);

    const submitSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setQuery(search.trim());
    };

    return (
        <PageCard title="Data Karyawan" wide>
            <Alert alert={alert} onClose={() => setAlert(null)} />
            <div className="d-flex flex-wrap gap-2 justify-content-between mb-3">
                <form className="d-flex gap-2 flex-grow-1 search-form" onSubmit={submitSearch}>
                    <input type="search" className="form-control" placeholder="Search name, email or position"
                        value={search} onChange={e => setSearch(e.target.value)} />
                    <button type="submit" className="btn btn-outline-primary">Cari</button>
                </form>
                <Link to="/create" className="btn btn-primary">+ Tambah Karyawan</Link>
            </div>

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Posisi</th>
                            <th>Email</th>
                            <th>No. Handphone</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.data.length === 0 && (
                            <tr><td colSpan={5} className="text-center text-muted">No employees found</td></tr>
                        )}
                        {result.data.map(user => (
                            <tr key={user.id}>
                                <td className="text-nowrap">
                                    <Avatar src={user.avatar} name={user.name} size={36} />
                                    <span className="ms-2">{user.name}</span>
                                </td>
                                <td>{user.position}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || '-'}</td>
                                <td className="text-end">
                                    <Link to={`/edit/${user.id}`} className="btn btn-sm btn-outline-secondary">Edit</Link>
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

export default Home;
