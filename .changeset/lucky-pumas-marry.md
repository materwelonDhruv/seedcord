---
'@seedcord/custom-id': minor
---

- Fixed a bounded `int` field losing precision when its range crosses 2^53, where two values could mint the same wire.
- Fixed the shape hash reading only half of an emoji, which let a changed emoji `oneOf` pass as unchanged and decode to the wrong choice.
- Fixed a `bool` field accepting any truthy value and a `str` field throwing a raw `TypeError`. Both now throw `CustomIdValueRejected`.
- Fixed a rejection claiming a range on fields that have none. Every rejection now names what the field takes, as in `expects a boolean, got "false"`.
