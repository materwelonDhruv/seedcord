---
'@seedcord/custom-id': minor
---

Added `someOf`. A field holding any subset of a fixed list, decoded as an array of the literal union. It spends one bit per choice, so a five-role picker for example would cost one character in your customId sent to Discord.
