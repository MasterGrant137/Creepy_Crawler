#### Nov 16, 2021
+ Extensive accessibility enhancements. Words exchanged for icons wherever possible to promote a language-agnostic application view. Alt tags placed on all images and icons for individuals with screen readers. Titles also placed on all images and icons for clients unable to load them and for the informational hover functionality. I tested the site on Apple’s VoiceOver screen reader to ensure I was truly making impactful decisions. That brought me to reconsider several stylistic choices including some of the `user-select: none` styling I had.
+ JS and CSS work together to gently inform user if theme count has been reached.
+ Theme limit implemented alongside thorough front to back validation for theme count.
+ 25 Google fonts personally curated and added locally to codebase.
+ Button added to copy a theme’s data to clipboard as a JSON object. The object copied is thoroughly formatted: line feed, tabulation, quotations, commas (none trailing).
+ Several placeholders made more explicit.
---
#### Nov 13, 2021
+ Modified history data structure to recognize the difference between two history entries falling on the same *day of the week* but with different *dates*. They will now be given separate headers, accordingly. Previously, this was not the case when the entries appeared consecutively in history.
+ Create and update entry operations made dynamic.
+ Implemented 24 to 12-hour clock conversion on History page.
+ Theme can now be set to default.
---
#### Nov 12, 2021
+ Inline style interpolation eliminated (used extensively for borders). That power was reallocated to CSS with only the necessary inline styling for dynamic styling present.
+ Cleaned all HTML attributes extensively, unneeded IDs as well as superfluous datasets, all purged or replaced with more semantic tags.
+ Advancements made in settings page style.
+ Eliminated the `404 (Not Found)` error appearing in the dev tools console when first rendering any page other than root.
+ Brought the entire code base in line with AirBnB style guidelines.
+ Front to back validations for every form. Extensive pre-validation and CSS to guide the user to the right actions and protect servers from unnecessary requests.
+ Every validation, pre-validation, and CSS style tested with falsy values to ensure security and good UX.
+ Routes outfitted with DOM reload for responses with `500 (Internal Server Error)` status code.
+ Research done into site accessibility and earnestly implemented for those with disabilities alongside other users.
---
#### Nov 8, 2021
+ Editor and background are synced, rotate is able to be checked and observed in real time (as soon as edit is submitted). Seamless switching between themes.
+ Improvements to settings page positioning and accessibility.
---
#### Nov 3, 2021
+  Amended the the object returned from the backend routes which lead to the following optimizations:
    + Profile media changes with no refresh.  
    + Site theme changes with no refresh.
    + Theme card changes with no refresh.
+ Optimized requests so that each form submission is only request. Media data is now included with the rest of the theme data as opposed to being appended with a patch immediately afterwards.
---
#### Nov 1, 2021
+ Settings page optimizations in style and functionality.
---
#### Oct 28, 2021
+ Settings are dynamic. Themes are functional and feature-rich.
---
#### Oct 26, 2021
+ Changes to directory structure. Modal and AWS integration alongside bug fixes.
---
#### Oct 25, 2021
+ Minimum viable product feature completed.
---
#### Oct 23, 2021
+ Various features added including data structure for history and db seeder functions.
---
#### Oct 22, 2021
+ Redux state changes and bug fixes
---
#### Oct 20, 2021
+ Database structure and planning.
