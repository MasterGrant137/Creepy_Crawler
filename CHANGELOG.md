#### March 9, 2022
+ Site security updates.
---
#### Feb 25, 2022
+ Search engine optimization: deep crawling spiders outfitted to handle multi-word queries.
+ UI/UX changes: search page, search results page, history page, navigation bar, and edit theme form.
---
#### Feb 11, 2022
+ Major search engine update:
    + search time cut down by up to twenty seconds
    + accuracy dramatically increased
+ UI/UX changes:
    + counter reaches zero instead of stopping at one
    + text truncation added to search results page
---
#### Feb 9, 2022
+ Search engine optimizations: 
    + the crawler now traverses the deep web
    + search time increased
    + several broad crawler seed URLs altered to increase result relevancy.
+ UI improvement: additional alignments made to navigation bar.
---
#### Feb 7, 2022
+ UI improvements: navigation bar, history page, and search results page.
+ UX improvement to search results page, the results are now cached so that they persist after page refresh and when navigating back from other pages.
---
#### Jan 11, 2022
+ UI improvements to “No results.” message.
+ Fixed bug where search timer would continue to count into negative numbers.
---
#### Jan 10, 2022
+ Addressed short search time bug.
+ Users can now re-search their past queries by clicking any entry in their history.
---
#### Jan 8, 2022
+ Improved aesthetics of navigation bar and modal menu.
---
#### Jan 6, 2022
+ Search engine optimizations: relevance of search results, performance.
+ UX improvements: countdown timer, client protection against excessively long searches.
+ UI improvements: search page title, favicon.
---
#### Jan 4, 2022
+ Added more error handling for the search engine.
+ Addressed styling/accessibility issue in modal dropdown.
+ Fixed bug where site background image wouldn't appear.
---
#### Jan 1, 2022
+ A user can now pick one of the several new default themes from the profile modal menu.
+ When copying a theme’s settings, the JSON value for *background_rotate* is now correctly formatted as a boolean (instead of a string).
+ Theme settings extended to dropdown menus and text fields to give the client more control over customization and for UI consistency.
+ Various enhancements made to UI.
---
#### Dec 21, 2021
+ Search engine optimizations: crawl is now unbounded, crawl distribution extended to eight spiders.
---
#### Dec 10, 2021
+ Search engine optimizations: addressed incorrectly formatted seed urls, distributed crawling across two spiders.
---
#### Dec 1, 2021
+ On every page’s initial DOM load, favicon is present.
+ Big style enhancements to settings page. This includes changes in icon placement and element responsiveness alongside other optimizations to UX.
+ Rudimentary modal implemented, activated when profile media is clicked.
---
#### Nov 23, 2021
+ Quelled same-device login vulnerability in state.
+ Added message for user when no results are returned by crawler.
+ Added more icons and links to navigation bar.
+ Addressed the re-emergent JSON bug browser history bug.
---
#### Nov 22, 2021
+ Extensive styling to search results page.
+ Clicked search results are added to history.
+ Users who are either not logged in or not signed up have access to the site’s search functionality. Certain privileges have been withheld.
---
#### Nov 21, 2021
+ Redux route optimizations, including enhanced error handling.
+ Search engine implemented.
---
#### Nov 18, 2021
+ Eliminated bug where JSON object was returned instead of view when pressing `history back` button in one’s browser.
+ Bug affecting conditionally rendered elements in navigation bar eliminated.
+ Search page fetching error eliminated.
+ Style enhancements to settings and auth pages.
---
#### Nov 17, 2021
+ Eliminated authorization bug occurring upon refresh.
+ Copy-to-clipboard inputs made more responsive on history page.
+ History toggle time bug eliminated. Semantic, logical code substituted for previous fix.
+ Conditionally rendered icon indicates which theme has been selected.
+ Styled, added, and modified icons.
---
#### Nov 16, 2021
+ Extensive accessibility enhancements. Words exchanged for icons wherever possible to promote a language-agnostic application view. Alt tags placed on all images and icons for individuals with screen readers. Titles also placed on all images and icons for clients unable to load them and for the informational hover functionality. I tested the site on Apple’s VoiceOver screen reader to ensure I was truly making impactful decisions. That brought me to reconsider several stylistic choices including some of the `user-select: none` styling I had.
+ JS and CSS work together to gently inform user if theme count has been reached.
+ Theme limit implemented alongside thorough front to back validation for theme count.
+ 25 Google fonts personally curated and added locally to codebase.
+ Button added to copy a theme’s data to clipboard as a JSON object. The object copied is thoroughly formatted: line feed, tabulation, quotations, commas (none trailing).
+ A history entry’s date or time is able to be copied with one click on either. The cursor indicates this upon hover.
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
