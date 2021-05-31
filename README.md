# ma-club-event-manager-frontend

![Custom badge](https://img.shields.io/static/v1.svg?label=ReactJS&message=17.0.1&color=58DBF9)
![Custom badge](https://img.shields.io/static/v1.svg?label=React+Bootstrap&message=1.4.0&color=58DBF9)
![Custom badge](https://img.shields.io/static/v1.svg?label=Bootstrap&message=4.5.3&color=A075D6)
![Custom badge](https://img.shields.io/static/v1.svg?label=Express.js&message=4.17.1&color=DEDEDE)
![Custom badge](https://img.shields.io/static/v1.svg?label=Node.js&message=10.15.2&color=70AB68)


A front-end part of MAClubEventManager project.

## Table of contents
1. [Overview](#overview)
2. [Detailed description](#detailed-description)
    - [Registration for events](#registration-for-events)
      - [Exams and Camps](#exams-and-camps)
      - [Tournaments](#tournaments)
    - [User's profile](#users-profile)
    - [Administrative options](#administrative-options)
      - [People](#people)
      - [Exams](#exams)
      - [Camps](#camps)
      - [Tournaments](#tournaments)
      - [Documents](#documents)
      - [Settings](#settings)
    - [Translation](#translation)
3. [Compilation & Launch](#compilation--launch)

## Overview
The purpose of the app is to help with register people on events which may be organized by martial arts clubs. A member of the club creates an account and after logging in, is redirected to the "event wall", where recent events are displayed. The user can scroll the wall in search of desired event and sign into it. There are three types of events supported by the system: exams, camps and tournaments.


## Detailed description
### Registration for events
The picture below shows the Event Wall. It contains all events from the most recent on the top. 
![image](https://user-images.githubusercontent.com/59183133/116257521-6788de00-a774-11eb-84fd-f3b130060f93.png)

#### Exams and camps
Click a **Sign in** button to register for a given event. While the registration (in the case below - for a camp) you may be asked to choose some additional preferences.
> Sayonara is a kind of a farewell meeting organised for a camp or tournament participants which usually takes place at the end of event.

![image](https://user-images.githubusercontent.com/59183133/116258794-8dfb4900-a775-11eb-8b75-411f78502e5b.png)

#### Tournaments
For tournaments it is only possible to be registered by a trainer, not individually. It means that trainers register their entire teams for a particular tournament. To become a trainer, check an **I want to be able to register teams for tournaments** option while creating an account. Then, after logging in, click a **Sign up a team** button. An empty team is created for you and you'll be redirected to the page where participants are added to the team.  
![image](https://user-images.githubusercontent.com/59183133/116261598-167ae900-a778-11eb-9816-a3cbd39af094.png)

Now, please click **Add participant** button. In the window appeared enter a participant's full name and email as well as choose a couple of registration options, like weight category or accomodation details. If an accomodation is organised by a club, you can choose a type of hotel room for a particular participant. 
![image](https://user-images.githubusercontent.com/59183133/116267830-0a455a80-a77d-11eb-8e79-71559f7a8eb2.png)

You can also click a table row to open a dialog window where you may change registration options for a selected person. In order to remove a participant, check a checkbox on the left side of the row and then click **Remove participant** button. In most cases, you as a trainer will go to the tournament together with your team, so you also need an accommodation. Therefore, you can add yourself to the team by clicking **Sign up me** button and choose desired registration options. 
![image](https://user-images.githubusercontent.com/59183133/116267496-bfc3de00-a77c-11eb-826f-a74e8b0b85ae.png)

You can go back later to this page and add/remove participants or modify their preferences. Click **Trainer's tools -> Teams** on the left pane and in the table appeared choose a tournament for which you have a team created. 

### User's profile
By clicking **Profile** on a left pane, you can view your profile. You may edit the information and save it as well as remove your account. If you'd like to reset your password, please use **I forgot my password** option on the login form. 
![image](https://user-images.githubusercontent.com/59183133/116271758-91480200-a780-11eb-99df-280746b00396.png)

### Administrative options
#### People
Click **Administrative options -> People** to view all persons registered in the system. You can add a new person by clicking **Add person** button or remove one with **Remove person** button. To view a particular person's account, click the row of the table. 
You can see a tab with profile information as well as some more tabs with events for which the person is registered in.
![image](https://user-images.githubusercontent.com/59183133/116407950-936a9900-a832-11eb-85b2-8599afd9d0f6.png)

#### Exams
**Administrative options -> Exam** option shows a table with all exams created in the system. You may add a new exam by clicking **Add exam** button or remove it with **Remove exam** button. 

Click the desired exam in the table to edit details. There is also a **Participants** tab where you can find all the people registered for this exam. If you have received the payment from someone, click the person and check the checkbox in the window appeared.

In most cases, the trainer's consent to participate in exam is required. You, as an administrator (and trainer), must consent to the participation of the person in the exam by clicking the person and checking the right checkbox. If the person has signed up for the exam, but their participation has not yet been accepted by the trainer, an information **Waits for acceptance** should appear on their Event Wall, but it will be implemented in the future. 
![image](https://user-images.githubusercontent.com/59183133/116409625-51daed80-a834-11eb-8cff-d9a7d42fcafd.png)

Usually a fee must be paid for taking the exam. The fee depends on the rank that the participant wants to pass. Therefore, there is a possibility to enter a few fees. Fees should be visible on Event Wall under the exam's description, but it's not implemented yet. 

#### Camps
Camps are under the **Administrative options -> Camps** option. As above, you can add a new camp, remove it or view/edit details by clicking the desired camp on the table.

Usually participants reveive camp clothing such as t-shirts, sweatshirts, etc. You can specify the type of clothing as well as available sizes. A participant will be able to choose the right size while registration. The price may depend on whether the participant uses camp accommodation or whether he intends to attend the Sayonara meeting. There is a possibility to enter a few different prices, which should appear under the event description on the Event Wall. 
![image](https://user-images.githubusercontent.com/59183133/116416780-ecd6c600-a83a-11eb-92c1-279049bc8eb5.png)

In **Participants** tab you may see all the people registered for the camp. By cliking the desired person you can edit all their registration preferences.
![image](https://user-images.githubusercontent.com/59183133/116416833-fe1fd280-a83a-11eb-898a-98de91adc5a9.png)

#### Tournaments
Click **Administrative options -> Tournaments** option to view tournaments. 

On the tournament's table, click a desired tournament. For tournaments, a hotel is usually booked, which may offer a different types of rooms. You may also specify a several periods of room reservation. 
![image](https://user-images.githubusercontent.com/59183133/116424700-062f4080-a842-11eb-9dbe-d6e493be3977.png)

While editing the torunament, there is a possibility to set an event picture that will appear on Event Wall under the tournament's description. Adding event picture will also be possible while creating a new tournament (to implement in the future). You can also set a picture for each room type. The picture will appear when a trainer will hoover the mouse over the room name while choosing it. For now it's available only while editing the tournament. I plan to implement a similar pictures handling also for Exams and Camps. 

As it was mentioned earlier, a participant cannot register for the tournament by itself. All participants are assigned to their in teams and are registered by their trainers. Except of **Details** tab there is also a **Participants** and **Teams** tab. The first one contains all participants registered for the tournament extracted from their teams and gathered in the single table. The second one contains all teams. 

You may create a new team for the desired person as a trainer by clicking **Add team** button, but first make sure that the person has a **Trainer** status on their profile (**Administrative options -> Profile -> [Person]**). If so, the person will appear in the table. Choose it and click **Save**. A team will be created. You'll be redirected to the team's page. Now you can add some participants. Click **Sign up participant** button. In the window appeared you can enter a new person (the person must not be registered in the system earlier) and specify registration options. 
![image](https://user-images.githubusercontent.com/59183133/116420412-3d9bee00-a83e-11eb-9699-14164d1e6fc7.png)

#### Documents
There is a possibility to upload documents which will be available to download for every user. Click **Administrative options -> Documents**. You can add/remove a document by clicking an appropriate button on the toolbar above the table. 
![image](https://user-images.githubusercontent.com/59183133/116426772-b0f42e80-a843-11eb-965f-b50c87adecaa.png)

The user can download a document by clicking **Downloads** option on the left pane and then **Download** button next to the desired document. 
![image](https://user-images.githubusercontent.com/59183133/116427454-54ddda00-a844-11eb-8fe8-1f9d2e449f72.png)

#### Settings
**Settings** panel is available by Click **Administrative options -> Settings** option. 

On a **General** tab you may set options like club logo (displayed in the upper left corner of the website), name of your club and contact email. Club name and email are not utilized anywhere yet, but will be used in the course of further development of the application. 
You can also set some links to social media websites of your club. These links are attached to icons on the toolbar in the upper right corner of the website. 
![image](https://user-images.githubusercontent.com/59183133/116592967-e28ef780-a920-11eb-9fb3-82f93623f1e2.png)

**Administrators**
This tab shows the list of all users with administrator's priviledges granted. Using toolbar buttons you can grant/remove admin priviledges to any user registered in the system. 
![image](https://user-images.githubusercontent.com/59183133/116593550-7e206800-a921-11eb-9721-0f30bbf96ff0.png)

**Branch Chiefs, Clubs, Ranks**  
These options are chosen by a user while registration. You can manage them here - remember to enter ranks which are used in your organization. Clubs are entered by users during the registration process.

### Translation
You can switch between languages (Polish/English) with **PL/EN**button in the upper right corner of the website.
![image](https://user-images.githubusercontent.com/59183133/116595439-9abd9f80-a923-11eb-85d0-d83912bc5af6.png)

## Compilation & Launch
The following deployment procedure was tested on **Ubuntu 19.10**.
1. Deploy the <a href="https://github.com/tomek-w-k/ma-club-event-manager-webservice">**ma-club-event-manager-webservice**</a> app and run it. It's a back-end part of the project.
2. In console, go to the main project directory and run `npm install` command to install all dependencies used by the project.
3. Run `node ./express-server.js` command. It will start an ExpressJS server which manages the storage of pictures in the application.
4. Run a new terminal instance and go to the main project directory. Copy all the content of `servers-urls-template.js` file. In `src` directory create a file `servers-urls.js` and paste the copied data. Enter the address of the back-end part (`WEBSERVICE_URL`) and for the ExpressJS server (`EXPRESS_JS_URL`). If you deploy the app on a `localhost`, it may look like this:
   ```
   export const WEBSERVICE_URL = "http://localhost:8081";
   export const EXPRESS_JS_URL = "http://localhost:4000";
   ```
   You may also use IP addresses, as it is originally in a template file.
4. From main project directory go to `node_modules/react-scripts/config/webpackDevServer.config.js` file. Find the `watchOptions` object. Originally it looks like this:
   ```
   module.exports = function (proxy, allowedHost) {
   return {
   // ................
       watchOptions: {
         ignored: ignoredFiles(paths.appSrc),
       },
   // ................        
   }
   ```
   Add a `paths.appPublic` value to the `ignored` field to make it look like this:
   ```
   watchOptions: {
      ignored: [ ignoredFiles(paths.appSrc), paths.appPublic ]
   },
   ```
   It is necessary to exclude the `/public` directory from tracking changes within it. Page is automatically reloaded when a code change is detected. It would cause a page reloading when we would try to set a picture on a form. 
4. In the main project directory run `npm start` to start the application in development mode. 
5. If you're working on Linux, you may also prepend the above commands with `nohup` which will cause that they will be run in the background, without blocking the console.
6. When you have deployed a back-end part of the project (check it <a href="">here</a>) and run it, go to the registration page (`http://localhost:3001/signup` if deployed on `localhost`) and create an account. Skip all information in **Details** section (except of **Country**). Admin priviledges will be granted automatically to the first created account.
