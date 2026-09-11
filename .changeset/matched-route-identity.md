---
'@seedcord/gateway': minor
---

**BREAKING:** Fixed the cooldown on a handler registered on two buttons. Because its route id joined both into `button:confirm,cancel`, clicking either one put both on cooldown. Now it would just be `button:confirm`, for example.
