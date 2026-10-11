import React, { useEffect, useState } from 'react'
import api, { errorMessage } from '../api/api.js'
import Alert from './ui/Alert.js'
import LiveClock from './ui/LiveClock.js'
import PageCard from './ui/PageCard.js'

const hhmm = (time) => (time ? time.slice(0, 5) : '--:--');

/** "Absen" menu: clock in / clock out for today. */
function Attendance() {
    const [today, setToday] = useState(null);
    const [alert, setAlert] = useState(null);
    const [busy, setBusy] = useState(false);

    const loadToday = () =>
        api.get('/attendances')
            .then(res => setToday(res.data.today))
            .catch(err => setAlert({ type: 'danger', message: errorMessage(err) }));

    useEffect(() => { loadToday(); }, []);

    const clock = async (action, label) => {
        setBusy(true);
        try {
            const res = await api.post(`/attendances/${action}`);
            setAlert({ type: 'success', message: `${label} recorded at ${hhmm(res.data.time)}` });
            await loadToday();
        } catch (err) {
            setAlert({ type: 'danger', message: errorMessage(err) });
        } finally {
            setBusy(false);
        }
    };

    return (
        <PageCard title="Absen">
            <Alert alert={alert} onClose={() => setAlert(null)} />
            <LiveClock />

            <div className="row g-3 mb-4 text-center">
                <div className="col-6">
                    <div className="stat-box">
                        <div className="text-muted small">Masuk</div>
                        <div className="stat-value">{hhmm(today?.clockIn)}</div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="stat-box">
                        <div className="text-muted small">Pulang</div>
                        <div className="stat-value">{hhmm(today?.clockOut)}</div>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-12 col-sm-6">
                    <button className="btn btn-success btn-lg w-100" disabled={busy || !today || !!today.clockIn}
                        onClick={() => clock('clock-in', 'Clock-in')}>
                        Absen Masuk
                    </button>
                </div>
                <div className="col-12 col-sm-6">
                    <button className="btn btn-danger btn-lg w-100" disabled={busy || !today?.clockIn}
                        onClick={() => clock('clock-out', 'Clock-out')}>
                        Absen Pulang
                    </button>
                </div>
            </div>
            {today?.clockOut && (
                <p className="text-muted small text-center mt-3 mb-0">
                    Clocking out again updates your Pulang time.
                </p>
            )}
        </PageCard>
    )
}

export default Attendance
