# Tic-Tac-Toe
## About the Project

This project was made as part of **The Odin Project** <a href="https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe">curriculum</a>.

This project is a **Tic Tac Toe** game enhanced with an interactive setup menu. Users can customize their players by uploading a profile photo, shoosing a username and selecting their preferred playing symbol (X or O).

## Tech used
**HTML5**, **CSS3**, **JavaScript**

## Features 
* **Player Customization:** Choose an image from your device, or get a randomly assigned avatar, pick your name and symbol.
* **Visualize Move:** Hovering on the game board over empty slots displays your current symbol, helping you visualize your next move.
* **Score Tracking:** Play multiple rounds continuously and kee track of the score, or return to the main menu (which resets the score).
* **Image Validation:** The image selector only accept valid image formats and restricts file sizes to a maximum 2MB, alerting user if the limit is exceeded.
* **Dark/ Light Mode:** The site automatically detect your system's default theme on the first visit. You can toggle the theme manually, and your preference is saved locally for future sessions.

## How It's Made
The project started as a simple game, but I decided to add elements that let users customize their characters to make the experience more engaging.

* **Layout Strategies:**
    * **CSS Grid:** Used for Home Screen. It centers the rules section using `fr` units while kepping the left and right player customization panels symmetrical
    * **FlexBox:** Used for the main `body` layout, the Game UI containers and more little containers from Home Screen to easily control elements distribution inside containers.
* **Data Handling:** Player choices (photo, name, symbol) are captured on the Home Screen. When the game starts, this data is copied into the Game UI scoreboard. If the player skips photo selection, a random avatar is generated automatically. The username has a maximum length of 20 characters, to not break the game layout.
* **JavaScript Design Patterns:** To keep the code clean and organized, I implemented **IIFE** and **Factory Functions**
    * **IIFE:** I used it for the main game controllers (like the image selection and game board logic) to encapsulate the variables, create a private scope and prevent global namespace pollution for logic that only needs to be initialized once.
    * **Factory Functions:** To create and manage the players, since the game required 2 player objects with similar properties (name, symbol, score).

## How to Run Locally
1. Clone the repository: `git clone https://github.com/AlinC10/Tic-Tac-Toe.git`
2. Open the project folder.
3. Open `index.html` in your favorite browser. No local server is required!

## Lessons Learned
* **File Handling in the Browser:** I learned how to process user-uploaded images entirely on the client side using `createObjectURL()`, how to validate file extensions and limiting file size.
* **Form Validation:** I discovered how to use browser's Constraint Validation API (`checkValidity()` and `reportValidity()`) to use native HTML validation rules.
* **State Synchronization:** Implementing the logic where Player 1's symbol choice (X or O) automaticaly updates Player 2's option and vice versa.

## Images Used
* **Player Avatars:** Designed by <a href="https://www.freepik.com/">Freepik</a>
    * <a href="https://www.freepik.com/free-vector/cute-girl-gaming-holding-joystick-cartoon-icon-illustration-people-technology-icon-concept-isolated-flat-cartoon-style_10909202.htm#fromView=keyword&page=1&position=1&uuid=50af5718-375b-4c0d-8156-c11e715d16d0&query=Game+avatar">1</a>
    * <a href="https://www.freepik.com/free-vector/cute-girl-gaming-holding-joystick-cartoon-icon-illustration-people-technology-icon-concept-isolated-flat-cartoon-style_10909202.htm#fromView=keyword&page=1&position=1&uuid=50af5718-375b-4c0d-8156-c11e715d16d0&query=Game+avatar">2</a>
    * <a href="https://www.freepik.com/free-vector/cute-astronaut-playing-vr-game-with-controller-cartoon-vector-icon-illustration-science-technology_400006264.htm#fromView=keyword&page=1&position=2&uuid=17d7340a-668f-4f8d-a1b7-54fc522613e6&query=Gaming+avatar">3</a>
    * <a href="https://www.freepik.com/free-vector/cute-cat-gaming-cartoon_13486463.htm#fromView=keyword&page=1&position=0&uuid=de5398fc-e1bc-4ae3-b5ab-020c79228be5&query=Gaming+avatar">4</a>
* **SVG:** https://www.svgrepo.com/