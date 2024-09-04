## the application is a tracking companion for items contained in the data folder.


There are 2 kinds of trackables
- books
- craftable items

Books Info:
Data source: src/data/books.csv
Fields: 
Book,Aspect,Level,Memory,Memory Aspects,Lesson,Lessons,Lesson Aspects,Price,Language,Type,Period,Contaminated,Description
Sample:
The Sun's Lament,Edge,4,Memory: Fear,Edge 1 / Scale 2,Lesson: Ragged Crossroads,1,Edge / Winter,4,,,Solar,10%,The first volume of the meditations of Abbot Thomas of the Abbey of the Black Dove.

Items Info:
Data source: src/data/crafting.csv
Fields: Action,Aspect,Level,Required Skill,Extra Requirement,Result,Result Aspects
Sample:
Craft: Winning Move,Edge,10,Sharps,Memory,Winning Move (Memory),Edge 3


FRONTEND:
- it has a tab for each trackable
- each tab contains a table with all the data for the trackable
- each row has a checkbox to flag/unflag the item

- the table has a checkbox "show only known items" that filters showing only items that have the checkbox set
- the tab has a text field to filter the table rows

LOGIC:
- when the checkbox is set/unset, a local storage variable containing the current status for the specific trackable list is updated