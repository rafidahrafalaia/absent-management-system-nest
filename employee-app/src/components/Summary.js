import React, { useEffect, useState } from 'react'
import api, { errorMessage } from '../api/api.js'
import Alert from './ui/Alert.js'
import DateRangeFilter from './ui/DateRangeFilter.js'
import PageCard from './ui/PageCard.js'

const cell = (date, time) => (time ? `${date} ${time.slice(0, 5)}` : '-');

/** "Summary Absen" menu: defaults to the first of this month through today. */
function Summary() {
    const [summary, setSummary] = useState({ from: '', to: '', data: [] });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);

    const search = (range = {}) => {
        setLoading(true);
        api.get('/attendances', { params: range })
            .then(res => {
                setSummary(res.data);
                setAlert(null);
            })
            .catch(err => setAlert({ type: 'danger', message: errorMessage(err) }))
            .finally(() => setLoading(false));
    };

    useEffect(() => { search(); }, []);

    return (
        <PageCard title="Summary Absen">
            <Alert alert={alert} onClose={() => setAlert(null)} />
            <h2 className="h6 text-muted">Filter Tanggal (From - To)</h2>
            <DateRangeFilter from={summary.from} to={summary.to} onSearch={search} />

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>Masuk</th>
                            <th>Pulang</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr><td colSpan={2} className="text-center text-muted">Loading...</td></tr>
                        )}
                        {!loading && summary.data.length === 0 && (
                            <tr><td colSpan={2} className="text-center text-muted">No attendance in this period</td></tr>
                        )}
                        {!loading && summary.data.map(day => (
                            <tr key={day.date}>
                                <td>{cell(day.date, day.clockIn)}</td>
                                <td>{cell(day.date, day.clockOut)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageCard>
    )
}

export default Summary
