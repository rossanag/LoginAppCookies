# React 18 LoginApp

### Work in progress

##### Worth to clarify

It began as project to understand OAuth2 protocol for authentication, but as things were caming I decided to go further to cover the different concepts involved in a webapp development.
Therefore the name of this repository (LoginApp) is misleading, since it will be a more complete fullstack app.
I decided to sent the token with httpOnly cookies instead of storing them in localstorage, for segurity reasons. It helps to mitigate XSS attacks, I recommend this readings:
- [OAuth. token storage](https://fusionauth.io/articles/oauth/oauth-token-storage)
- [A guide for SPA](https://authguidance.com/spa-back-end-for-front-end/) client-server app.

I will summarize the aspects that are involved, **to delve into them later**:

- [OAuth2](https://oauth.net/2/) protocol for authentication
- Global state with Redux
- Managing routes in UX
- Server app with [Node 18](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) for practicing non relational database
- Testing (Vitest)

### Libraries/plugins added to this project@Silvana llamé a Rosi, y está al tanto

(Some of them are about to be implemented or are incomplete)

## Introduction

This is a React 18 App created with Vite. It uses Typescript and Tailwindcss. The skeleton of this project is based on my [react-vite repository](https://github.com/rossanag/react-vite). There you'll find all the installations and configuration I needed to have a ready setup from scratch.

Operative System: Ubuntu 22.04 LTS

### Run example

- **backend**  : the backend code folder. To run the server, get into this carpet and type: `npm start`
- **frontend** : the frontend code folder. Get into this folder and type to launch the webapp: `npm run dev`

### Libraries/plugins added to this project

#### Frontend

- [Axios](https://axios-http.com)
- [React router](https://reactrouter.com/en/main)
- [Redux](https://react-redux.js.org/)
- [React OAuth2](https://www.npmjs.com/package/@react-oauth/google)

#### Backend

- [Axios](https://axios-http.com)
- [NodeJS](https://nodejs.org)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Express](https://expressjs.com)
- [Cors](https://expressjs.com/en/resources/middleware/cors.html)
- [Google Auth Library](https://www.npmjs.com/package/google-auth-library)

#### Some notes

**Browsers messages.**  When loging with Google OAuth and error appears:  
> Cross-Origin-Opener-Policy policy would block the window.closed call error while using google auth
It [happens on Chrome](https://github.com/vercel/next.js/discussions/51135) and Brave, but not if you use Firefox.

**Store tokens -** I wanted to handle the security issues linked to the tokens storage like XSS attacks, the closer as I could to a more proffesional solution. According some readings I store the *refresh token* in cookies, sending them with the `http only` and `secure` attributes. The *access token* was store on the memory application in the client side, since its span life is sort, it's barely a risk.
I read some articles regarding this topic:
- [oauth token storage](https://fusionauth.io/articles/oauth/oauth-token-storage)
- [authentication guidance for SPA](https://authguidance.com/spa-back-end-for-front-end/)
- [Best practices for refresing tokens](https://stateful.com/blog/oauth-refresh-token-best-practices)

There's a lot to improve about this topic, but what I wanted the most to get closer to a best practices, was not to use the localstorage.


#### Future Improvements
- Morgan, as a logger of the server activity, now it was handled with console.log()
