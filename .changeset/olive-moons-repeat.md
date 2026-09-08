---
'@seedcord/core': patch
---

- Fixed the wait that bounds a shutdown step. It used to reject when that step failed.
- Fixed a lifecycle task or plugin hook that throws before returning a promise. The throw now rejects the returned promise.
