[x] 32. NOTE: I've already done quite a bit of work on this, but it's not finished yet. you gotta check files to see what I've done so far and finish it up. Deprecation UI overhaul:
I currently have deprecated tags set up. But I want to do something different. IF an entity is deprecated, (entity can be anything btw. function, param, type param, class, interface, property, method, enum, enum member, etc) that entity's card's border should become red (save global css for this deprecated deep red (and its light mode version)). If the entity doesn't have a card border, like entity members in some pages, you can make it use a border because we need it to be obvious. Anyway, so, border. In the border, I want the top left of the border itself to have a gap. And inside that gap, we'll have the word "deprecated". Now, ofc, deprecations will have comments themselves. So, in the deprecated entity member's card that now has a red border, before any content inside it, you'll add the deprecated comment above and before the comment, use that alert icon from lucide.

[ ] 33. Ensure TypeDoc-style {@link ...} tags inside comments resolve to working hyperlinks using the existing comment formatting/resolver pipeline (the files under comments). Links should be inline and adopt the same underline treatment we already apply for code-rendered links (Shiki style). Make sure to use our existing linking functions as they handle external and internal linking. And this is a comment, so do your research to integrate.

[ ] 34. If any entity is marked as `@internal`, it should have a tag for that in the main signature card. (or if its a method or prop, in the member card). Same for `@decorator` in the main signature card. We need a good way to show tags in the main card because that's reserved for important tags only.

[ ] 35. Correctly parse markdown in tsdoc comments. Right now it shows the raw markdown.

[ ] 36. Get rid of all the placeholder texts like "Additional TypeDoc metadata will appear here once the symbol is sourced from generated documentation artifacts." for example. There are many others like that. If there is no content to show, just don’t show anything instead of showing a placeholder.

[ ] 37. In type param rendered comments on entity pages, the type param comment duplicates itself above and below the signature.

[ ] 38. The param and typeparam section in methods below signature and above example can be a dropdown like examples. closed by default.

[ ] 39. Keep chevron usage across the project consistent. Pointing right means closed, pointing down means opened. In some places it's down as closed and up as opened.

[ ] 40. CopyAnchorTag isn't good on mobile screens because it's too far left and basically hangs off the screen. Instead, only for mobile, show it on the right side of the screen next to the heading text.

[ ] 41. Custom scroll bar that matches the seedcord theme for dark and light. Is sleek. And has transition when it appears/disappears.

[ ] 42. Render @throws comment.
