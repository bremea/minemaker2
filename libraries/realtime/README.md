# realtime
NATS client & utilities

## op codes
`0`: event
`1`: heartbeat
`2`: heartbeat ack
`3`: hello
`4`: identify
`5`: ready
`6`: resume

## disconnect codes
`4000`: unknown error
`4001`: unknown opcode
`4002`: parse error
`4003`: not authenticated (or session timeout)
`4004`: auth failed (do not reconnect)
`4005`: already authenticated (only one identify event per connection)
`4006`: invalid seq when resuming connection
`4007`: rate limited
`4008`: missed heartbeat
`4010`: invalid subscription
`4011`: disallowed subscription
