import React, { useEffect, useState } from 'react';

/** Current date and time, updated every second. */
function LiveClock() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-center my-4">
            <div className="live-clock-time">
                {now.toLocaleTimeString('en-GB', { hour12: false })}
            </div>
            <div className="text-muted">
                {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
        </div>
    );
}

export default LiveClock;
