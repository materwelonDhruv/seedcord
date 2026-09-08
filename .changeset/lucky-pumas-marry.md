---
'@seedcord/custom-id': minor
---

- Fixed a bounded `int` field whose range crosses 2^53. It lost precision, and two values could mint the same wire.
- Fixed the shape hash, which read only half of an emoji. A changed emoji `oneOf` passed as unchanged and decoded to the wrong choice.
- Fixed the type guards on `bool` and `str`, which now throw `CustomIdValueRejected`. A `bool` took any truthy value, and a `str` threw a raw `TypeError`.
- Fixed the rejection message, which named a range on fields that have none. It now names what the field takes, as in `expects a boolean, got "false"`.
