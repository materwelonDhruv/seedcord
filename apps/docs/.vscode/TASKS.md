[x] 31. In the search, the icon for methods should what we are using for methods. Right now it uses the icon for functions. Also need a separate icon for params. (for both the section in members list in entity pages and in search results)

[ ] 32. If something is marked as deprecated, the tag should have a red tint, styled similar to other tags though. And the deprecated content should be visible some how. In the clean way that follows the styling we already have.

[ ] 33. If any entity is marked as `@internal`, it should have a tag for that in the main signature card. (or if its a method or prop, in the member card). Same for `@decorator` in the main signature card. We need a good way to show tags in the main card because that's reserved for important tags only.

[ ] 34. Correctly parse markdown in tsdoc comments. Right now it shows the raw markdown.

[ ] 35. Get rid of all the placeholder texts like "Additional TypeDoc metadata will appear here once the symbol is sourced from generated documentation artifacts." for example. There are many others like that. If there is no content to show, just don’t show anything instead of showing a placeholder.

[ ] 36. In type param rendered comments on entity pages, the type param comment duplicates itself above and below the signature.

[ ] 37. The param and typeparam section in methods below signature and above example can be a dropdown like examples. closed by default.

[ ] 38. Keep chevron usage across the project consistent. Pointing right means closed, pointing down means opened. In some places it's down as closed and up as opened.

[ ] 39. CopyAnchorTag isn't good on mobile screens because it's too far left and basically hangs off the screen. Instead, only for mobile, show it on the right side of the screen next to the heading text.

[ ] 40. Custom scroll bar that matches the seedcord theme for dark and light. Is sleek. And has transition when it appears/disappears.
