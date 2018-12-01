## Sample JS Project Proposal: Conway's Game of Life with Variations

### Background

Pacman is an all-time classic arcade game. The player navigates Pacman through a maze collecting dots and avoiding multi-colored ghosts. Each corner of the maze has large pellets that when consumed by Pacman, turn the ghosts a deep blue and make them edible. Upon eating a ghost, they return to the center of the board with their normal color and status. The goal is to accumulate points by collecting all the dots and moving on to the next stage, without losing lives by touching the ghosts. 

There are several modes that can be incorporated into Pacman. These will be outlines in the **Functionality & MVP** and **Bonus Features** sections.  

### Functionality & MVP  

With this Pacman Game, users will be able to:

- [ ] Start, pause, and reset the game board
- [ ] Move around the board using the keyboard
- [ ] Eat dots by touching them to raise their score
- [ ] Lose lives when getting eaten by ghosts 
- [ ] Lose the game when running out of lives 
- [ ] Win the games when eating all the dots 
- [ ] Toggle the game mode to watch a computer nagivate Pacman 
- [ ] Toggle the computer Pacman playing style - from random to depth-first, breadth-first, uniform cost, and/or A* search    algorithms

In addition, this project will include:

- [ ] A modal with the option to read about and select an algorithm
- [ ] A production README

### Wireframes

This app will consist of a single screen with the game board, game controls, sidebar modal, and nav links to the Github, my LinkedIn, and my website.  Controls will include Start, Stop, Reset, and game mode (toggle human and computer Pacman) buttons.  Upon selecting the computer Pacman, a modal will open up on the left which will contain the algorithms the computer can use to navigate. 

![wireframes](https://github.com/avvazana/Pacman/blob/master/proposal.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- `JavaScript` for game logic,
- `Canvas` for effects rendering

In addition to the entry file, there will be several scripts involved in this project:

`board.js`: this script will handle the logic for creating and updating the necessary board elements and rendering them to the DOM.

`pacman.js`: this script will be responsible the creation and capabilities of the pacman character 

`ghosts.js`: this script will be responsible the creation and capabilities of the ghost characters 
 
 `items.js`: this script will handle the behaviors of the dots and pellets 

### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running. Write a basic entry file and the bare bones of all 4 scripts outlined above.  

Goals for the day:

- Get the fle structure set up
- Learn to use canvas
- Render a simple pacman board with the dots and pellets, created in the `items.js` file. 

**Day 2**: Dedicate this day to polishing off the basic rendering and starting to create the game logic.  Build out the `Board` object.  Then, use `board.js` to create and render a more elaborate grid. Create the `ghosts.js` file and add them to the board. Create the logic for pacman to move in each direction. 

Goals for the day:

- Render a grid with pacman, dots, pellets, and ghosts
- Give pacman the ability to move in various dirctions

**Day 3**: Create the rest of the logic required for the basic game. Allows pacman to eat dots and pellets and be eaten by ghosts. Prevent pacman from eating walls.  Goals for the day:

- Give pacman the ability to eat and be eaten
- Make sure pacman is moving around the board appropriately 

**Day 4**: Give ghosts the ability to move randomly. Give pacman the potential to be a computer player that plays randomly or with one of the stated algorithms (more to come later). Polish up the styling.  

Goals for the day:

- Create controls for stop, start, reset, and game mode
- Give ghosts the ability to move 
- Give pacman a computer navigator with random or controlled moves 


### Bonus features

There are many features that could be implemented:

- [ ] Adding in whatever remains of the afformentioned algorithms for the pacman bot
- [ ] Giving the user the option to toggle the approaches of both the ghosts and of pacman, including min-max, alpha-beta pruning, and A* search

