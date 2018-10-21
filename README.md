# Demon Hacks - Social Awareness!

The world as it is right now, faces issues like water deprivation, famine, illiteracy, lack of sanitation, etc. People are deprived of even the basic rights. We wanted to make a system that focuses on the most important issues that the world is facing and we intend to direct donations there.

We first display a choropleth map to show the data about various issues faced by countries. The user has an option to select the causes he is most passionate about and the map would show the countries most affected by that.

If the user isn't particularly biased towards a cause, he can also use the Search feature that we have implemented using Algolia API. We have also used the auto-complete feature provided by Algolia API which returns the closest results for the user entered query. The search returns a donut chart below the map. The user can click on any cause and donate.

We also have a separate tab to see the world's most affected countries. Here, we have created a Venn diagram for all of the 4 causes that we have visualized about. The Venn diagram gives us insight into the countries which have overlap among the causes. Clicking on the intersections in this Venn diagram shows us the countries facing all of those issues. We made a discovery here that only a handful of countries are facing all or most of these issues.

'Make a change' shows us which countries need help the most . We aim to raise social awareness as well as donations for those affected.

We used data from data.gov, UNICEF, World Bank, CIA World Factbook, all of which is available online.
