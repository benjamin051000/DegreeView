# TwoDotUF
**Swamphacks 2021 project** by Austin Welch, John Shoemaker, Joshua Haddad, and Benjamin Wheeler

See the Wiki page for instructions on running the project.

# About TwoDotUF

## Inspiration
Our inspiration comes from the **amazing** website [Registr-UF](http://www.registr-uf.com/), which is a campus-renowned tool for planning your schedule each semester. It allows students to easily type in courses they plan to take, and instantly see weekly schedules, allowing them to plan out their weeks in the upcoming semester. We wanted to expand on this website and encompass a larger scope: Your entire degree audit. It can be really difficult understanding where you stand in your degree, which courses you still need to take, and with little help along the way, __seeing the light at the end of the tunnel can be tough!__

## What it does
**TwoDotUF is a single-page application prototype which displays a form of a degree audit in a flowchart representation.** The website is designed to help make planning your time in college easier: The flowchart **edges automatically route** to show course prerequisite/dependent relationships. Secondly, our behind-the-scenes algorithm **builds your schedule based off of classes you have taken and your major's requirements,** helping you understand what you need to take and when you can take it. Every single object on the page is rearrangeable, allowing you to make a **clean schedule that's dead simple to understand.**

## How we built it
TwoDotUF is a full-stack web-application, built with React, Express, NodeJS, and the Google Cloud Firestore database service. In rapid development, libraries became our best friends: We used React Flow for flowcharts and Google service libraries for interfacing with our database, significantly decreasing our development time.

## Challenges we ran into
We originally tried using JointJS for flowchart creation, but this tool proved to be less than ideal for our goals we had in mind. Due to this issue, we lost several man-hours and had to start over in researching libraries. Secondly, the UF course API gave us lots of trouble with CORS policy issues, forcing us to rewrite some of our API requests, routing them through our backend server rather than using a direct connection.

## Accomplishments that we're proud of
Seeing the courses pop up on-screen for the first time was awesome. We were so glad our work was finally beginning to pay off! And finally, at nearly 6am in the morning, when the colorful edges magically appeared running through each and nearly every course, we almost exploded with excitement. We had fully realized our vision in less than a day. It was an awesome experience we won't soon forget.

## What we learned
We learned a lot about full-stack development! Most of what we were comfortable with was some simple JavaScript, maybe a frontend webapp at most. Now, I generally feel much more comfortable with backend development, and understand what it means to be a full-stack application much more.

## What's next for TwoDotUF
TwoDotUF is in a semi-functional state. We plan on continuing development and publishing this tool to the Gator Nation in the future! Some upcoming features include (but are not limited to):

* Adding an input form to input your major and classes you've taken
* Adding pop-up course information (description, prerequisite info, instructor info, and more) when you select a node
* Adding a feature to automatically re-spec your future courses in case you didn't end up how you planned, giving you insight as to how your graduation and course plans may change
* Night mode, of course
* Ability to export your flowchart to send to academic advisors, or keep for your own records
* Save charts to allow for multiple configurations
* More algorithms to predict relevant course suggestions to students
* Polishing the look and feel of the site

#Challenges We'd Like to Be Judged For:
* Swamphacks main event
* Google Cloud DB Implementation

#Team Leader Slack Info
* Leader: Benjamin Wheeler (Display name Benjamin W)
* Backup:  Joshua Haddad  (in case ben fell asleep :p)
