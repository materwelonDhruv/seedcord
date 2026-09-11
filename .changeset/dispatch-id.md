---
'@seedcord/core': minor
'@seedcord/gateway': minor
'@seedcord/http': minor
'@seedcord/types': minor
---

Added `dispatchId` to every bus key a dispatch publishes, and `dispatch.id` to the bag behind it. A fault used to carry no way back to the dispatch that raised it, so pairing one with its `interactionDispatched` meant guessing from the route and the clock. Key a store on it to line up a dispatch, its writes, and its faults.
