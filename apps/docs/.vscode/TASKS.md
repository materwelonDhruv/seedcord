[x] 1. overloads should be radio buttons as Overload 1 Overload 2 and so on for FUNCTIONS as well. Not just in classes.

[x] 2. For rendered examples please make sure that 1. Please correctly place examples in pages. If they are for a method, they should be in the method’s card at the end and collapsable. If they are at the class level, they should be in the main class card, at the end, and collapsable. And so on, so forth. 2. They are clearly labelled “Examples”
Because right now, for example for the interface Core, the example is right above the main signature at the bottom of the page. Not supposed to be like that.

[x] 3. In the sidebar, when I change package, it doesn’t refresh the items. I still see the items from the previous package. The selection doesn’t change either.

[x] 4. We need a custom 404 page

[x] 5. For functions pages, there are a few issues. 1. The the hero card at the top should have the selected signature's tsdoc summary in it. Right now it's nowhere. 2. The formatting for the parameter and typeparam cards are not the same as how classes do it. Please make them the same. Classes does it correctly by using the right highlighting and other styles.

[x] 6. Also for the functions page, the params are fine, but why are the tsdocs for the params missing?

[ ] 7. In the enum member page, you've overengineered the look. It doesn't need code blocks in the members. Simply show the Member name and then an equals sign and then the value. And ofc any documentation if it has. Also, same issue like the function pages. The jump to source should be the same as how it is for classes

[ ] 8. Type Alias pages don't need a second Type declaration section. The main signature code block already has it all. It only needs the Type parameters section. Which it already has.

[ ] 9. Member overview does not need to have a section for Constructors (reminds me, make sure constructors handle overloads if they have any as well). They only need props and methods. And make sure 2 columns. First is props and 2nd is methods.

[ ] 10. When rendering comments, please smartly decide when they need to be in different lines. Because look at this for example

```ts
HTTP health check service for monitoring bot status.

Provides a simple HTTP endpoint that responds with JSON status
information, useful for container orchestration and monitoring.
```

"status" and "information" don’t need a line break between them.

[ ] 11. In the sidebar, if the name of something is too long, it squishes the icon and isn’t centered anymore. Instead, let’s truncate and use `…` And then, use our tooltip component so people can hover to see the full name.

[ ] 12. Please check #packages.ts. You can see we have rawExternal links. I don’t understand why they aren’t being hyperlinked across the project. Like, literally nowhere. I see that we have key.toLowerCase. Is that doing something to the keys? Why? the Keys are case sensitive.

[ ] 13. For functions, this placeholder text “Review the generated signature below while we finish migrating full TypeDoc content into the reference UI.“ should be the function’s tsdoc. And make sure to not duplicate it below.

[ ] 14. For methods in classes and interfaces, can you suffix their names with a `()` so it’s clear that it’s a method pls

[ ] 15. For function parameters, if their types have a link, it doesn’t render. Look example. Pls fix.

[ ] 16. The “Inherited from:” should also correctly hyperlink

[ ] 17. Make sure to correctly parse and display the comments for @typeParam and @param. If you check the debugging/samples files, you’ll see this is easily there. And you can check the types in packages/docs-engine

[ ] 18. Interfaces do not need the “Showing members with” sentence in Member overview

[ ] 19. In the engine output, you’ll see smth called flags.

- If something is abstract, reflect that in the signature instead of as a tag
- If something’s accessor is “getter”, show get in the signature. Tag “Accessor”
- If something’s accessor is “setter”, show set in the signature. Tag “Accessor”
- If something’s accessor is “getter-setter”, show both in methods, with overloads. And each overload should have the correct get or set signature. Tag “Accessor”
- If a function is a Decorator, it should have a tag in the main signature section.
- If anything is deprecated, it should be clearly identifiable as deprecated (with whatever deprecation text it includes) So if it’s a method, it’ll be in the method’s card. If it’s the class itself, it’ll be in the class signature card at the top
- If something has isOverwriting true, it should have a tag saying “Overrides” and ofc, the “Inherited from:”. This is for both methods AND properties.

[ ] 20. Check why EffectsEmitter’s type param extends is expanded. It should use the actual type it’s extending correctly. Check out the seedcord.json. You can see that it has it correctly. It’s also correct in the .txt files in samples.

[ ] 21. Why are param’s not showing their tsdoc? like in Healthcheck. Check the actual Healthcheck file. This issue is with params everywhere.
