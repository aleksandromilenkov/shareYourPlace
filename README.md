# ShareYourPlace

This is fullstack MERN application for publishing your own places (restaurants, parks, squares and other bussiness/historical and whatever places with coordinates).  
You can sign up, create new place and publish it and everyone can see it, but only you can edit and delete it.  
For creating the place you need to upload image from that place, enter the coordinates for the place to see it on a map, enter title, description and street address.  
In this app for the frontend I'm using React.js, custom Hooks, React built-in hooks and vanilla CSS. I'm storing the jsonwebtoken in the localStorage of the browser. The app is fully responsive.  
For the backend I'm using Node.js with Express.js to build the REST API.  
For the database I'm using MongoDB with Mongoose for easier communication with the Models. I have 2 models, one for the User and one for the Posts, they are linked with One to Many relationship.  
I'm protecting the routes with the jsonwebtoken, hashing the password with bcryptjs, allowing to upload the images with Multer package for Express.js.

## Home Page:  
![shareYourPlace_Home](https://github.com/aleksandromilenkov/socialpedia/assets/64156983/c11c8ec0-5f4d-4dd7-aa82-ab3bac7969ce)

## Login page:  
![shareYourPlace_Login](https://github.com/aleksandromilenkov/socialpedia/assets/64156983/9df288c1-8266-4ee6-8036-bf959308155a)


## Sign up page:  

![shareYourPlace_Signup](https://github.com/aleksandromilenkov/socialpedia/assets/64156983/12336632-a042-42ba-85bf-855685e0fcc4)

## My Places page:

![shareYourPlace_MyPlaces](https://github.com/aleksandromilenkov/socialpedia/assets/64156983/2b3c6a54-d4a5-4aea-b328-0edb6f30258f)

## New Place page: 

![shareYourPlace_AddPlace](https://github.com/aleksandromilenkov/socialpedia/assets/64156983/14d1b985-0ef2-4f3b-88b9-b311cefb7b21)

## Other User's profile: 

![shareYourPlace_OtherProfile](https://github.com/aleksandromilenkov/socialpedia/assets/64156983/48b714c3-6ba6-4a55-9b1f-c540ff1c636f)

## View On Map:

![shareYourPlace_Map](https://github.com/aleksandromilenkov/socialpedia/assets/64156983/293e76e2-91c7-42fe-afa7-879fb3d532c3)

## Edit your place:

![shareYourPlace_Edit](https://github.com/aleksandromilenkov/socialpedia/assets/64156983/f73ae9ca-2061-4024-95ac-1d020a216cd3)


## Installation
This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

## Prerequisites
Node package manager - npm.  

## Installation
1. Clone the repo
```
git clone https://github.com/aleksandromilenkov/socialpedia.git
```
2. Navigate to server folder and npm install there
```npm
npm install 
```
2. Navigate to client folder and npm install there too
```npm
npm install 
```
3. Once installed, navigate to server folder and run this command to start the server:
```
npm run start
```
3. After server started, navigate to client folder and run this command to start the client:
```
npm run start
```
Now go to localhost:3000 and you will see the app.
## Usage
Use this app for whatever you like.

## Built with
- React.js
- CSS
- Node.js
- Express.js  
- MongoDB  
- Mongoose  
- jsonwebtoken
- Multer
- Express validator  
- Bcrypt  
- And more...  

