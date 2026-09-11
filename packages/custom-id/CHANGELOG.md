# @seedcord/custom-id

## 0.2.1-next.0

### Patch Changes

- Updated dependencies [359748d]
    - @seedcord/errors@0.8.0-next.0

## 0.2.0

### Minor Changes

- b3d1713: Added `someOf`. A field holding any subset of a fixed list, decoded as an array of the literal union. It spends one bit per choice, so a five-role picker for example would cost one character in your customId sent to Discord.

### Patch Changes

- b3d1713: Fixed a bounded `int` field whose range crosses 2^53. It lost precision, and two values could mint the same wire.

    Fixed the shape hash, which read only half of an emoji. A changed emoji `oneOf` passed as unchanged and decoded to the wrong choice.

    Fixed the type guards on `bool` and `str`, which now throw `CustomIdValueRejected`. A `bool` took any truthy value, and a `str` threw a raw `TypeError`.

    Fixed the rejection message, which named a range on fields that have none. It now names what the field takes, as in `expects a boolean, got "false"`.

- Updated dependencies [b3d1713]
- Updated dependencies [4013669]
    - @seedcord/errors@0.7.0

## 0.1.1

### Patch Changes

- Updated dependencies [af1b2f8]
- Updated dependencies [f89d8c9]
    - @seedcord/errors@0.6.0

## 0.1.0

### Minor Changes

- 71c1896: The typed customId codec ships here now, and it runs against plain discord.js as well as seedcord. Declare a shape with `new CustomId('prefix')`, mint a wire with `encode`, and read it back with `decode`. Check the guide page on CustomId.
- 71c1896: `setCustomIdErrors` replaces the two errors a failed decode throws. Return a `Notice` subclass from a seedcord bot to swap the card a stale or corrupt button shows.

### Patch Changes

- Updated dependencies [71c1896]
    - @seedcord/errors@0.5.1
