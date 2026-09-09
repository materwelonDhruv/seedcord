---
'@seedcord/core': patch
---

- Fixed the wait that bounds a shutdown step. The shutdown now continues past a failing step.
- Fixed a lifecycle task or plugin hook that throws before returning a promise. The throw now rejects the returned promise.
