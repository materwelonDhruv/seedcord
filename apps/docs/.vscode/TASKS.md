[ ] 42. Render @throws comment similar to Inherits from and See also sections. This is mostly done because we have a bunch of code and the types etc to handle it, but I don't see it rendered on the website. Also, please check kind-function-haspermstoassign.txt. You can see that it has an array for throws. Use the type from docs-engine package that's exported and access this array instead of looking for `@throws` tags.

[ ] 37. In type param rendered comments on entity pages, the type param comment duplicates itself above and below the signature.

[ ] 38. The param and typeparam section in methods below signature and above example can be a dropdown like examples. closed by default.

[ ] 39. Keep chevron usage across the project consistent. Pointing right means closed, pointing down means opened. In some places it's down as closed and up as opened.

[ ] 40. CopyAnchorTag isn't good on mobile screens because it's too far left and basically hangs off the screen. Instead, ONLY on mobile, show it on the right side of the screen in the same row as the heading text.

[ ] 41. Custom scroll bar that matches the seedcord theme for dark and light. Is sleek. And has transition when it appears/disappears. This should also be used in code blocks when overflowing for horizontal scroll.

[ ] 43. local storage is saving the selectedPackage. But it's not being used on reload. On reload, it goes back to default package.

[ ] 44. In tsdoc comments, if there are bullet points or numbered lists, (-, •, 1., 2., etc.), render them as actual lists in the rendered comments. Not just plain text with those characters.

[ ] 45. If a text is specifically a string (inside "" or '') in the signature of any entity, don't attempt to hyperlink it. Because right now for example, `type LifecycleAction = "start" | "complete" | "error"`, the "error" is hyperlinked to the mdn Error page.

[ ] 46. Something about tooltips in the sidebar feels off. Also, tooltips in general across the app. Lets use the tooltip component from that ui library we're using, but make our own custom component using it so we have consistent styling. I don't like how the tooltips are transparent background. So first thing is fixing that.

[ ] 47. Browser navigation popup on mobile doesn't close when I click an option in it. Also, when scrolling in this popup on mobile, the scroll doesn't keep scrolling when I lift my finger. It stops immediately. It should have some momentum.

[ ] 48. Rendering for virtual and remarks.

[ ] 49. Render markdown in comments.

[ ] 50. Sidebar dropdowns don't update on package change. And neither does their content. Please fix.

[ ] 52. Sidebar dropdowns styling. The selection item's border radius is too round.

[ ] 53. Command palette: when I'm focused on the input box, there's a harsh outline around the entire box. What happened to the previous styling that matched the rest of the project?
