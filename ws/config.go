package dashboard

import (
    "time"
)

type Config struct {
    Http struct {
        Listen string
        Port string
    }

    Snmp struct {
        Server string
        Community string
        InByte string
        OutByte string
    }

    Misc struct {
        IntSpeed int64
        Interval time.Duration
    }
}
