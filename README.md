## BBAir

A phpBB style

### About this project

---

This project is a GPLv3 Affero Licensed Open Source phpBB Style.
Its essentailly my first phpBB style but I'll see what I can do.

### Requirements for building

---

The goal is to leverage many kinds of open source software yet
keep development requirements and required software installs
down to a minimal.

Right now you need to install these software beforehand

    Ruby
        compass
        sass
    NodeJS
        npm

If your on linux you maybe missing a required library file and/or
missing a required symlink

This command may need to be executed if your running into
bower install issues

    ln -s /usr/bin/nodejs /usr/bin/node

__.sass-cache Notice__:

For platforms where the .sass-cache folder shows up, if you suddenly get
a slew of sass errors, delete the .sass-cache folder, clean with "gulp clean",
then try again

From there you have the option of installing the npm package 
"gulp" and "bower" globally to make things easier, this is not required
because npm will install it locally for you, the difference
is beng installed locally means you must type in the path to it
to use it

Example:

*gulp* __vs__ *node_modules/.bin/gulp*

*bower* __vs__ *node_modules/.bin/bower*

### How to build

---

Perform the initial one-time install:

    npm install
    bower install

This will install all needed NPM and Bower Modules, Then run

    gulp
 
This will compile sass, typescript, and copy stuff over.
It will then arrange everything for you, place things nicely into
the templates folder and then automatcally zip and tar it for you
to distribute directly to your site

To clean run

    gulp clean

### Navigating

---

 * [app](app) - Where the programming is kept
 * [screenshots](screenshots) - Where application screenshots are kept

### Technology

---

This project leverages several open-source technology, they are as 
follows

#### Software and Templates
    Initial Template and Layout by HTML5 Boilerplate
	Git
    Bower
    NodeJS
    Gulp

#### Languages
	Ruby
	WebStack
	    HTML5
        CSS3
        Javascript/Ecmascript 5

#### Langauge Sub-Set
    SASS
    Typescript

#### Frameworks
    jQuery
	Bootstrap

#### Testing
    Modernizr

#### Other
	FontAwesome
