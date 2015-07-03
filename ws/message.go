package dashboard

type Message struct {
    Speed   int64 `json:"total"`
    In      int64 `json:"in"`
    Out     int64 `json:"out"`
}
