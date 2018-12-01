const no_coins_left = () => {
  for(let i = 0 ; i < board.map.length - 1 ; i++){
    for(let j = 0; j < board.map[0].length - 1 ; j++){
      if(board.map[i][j] === 3) {
        return false
      }
    }
  }
  return true
};

pacman = new Pacman(null, null)
ghosts = []
frame_number = 0;
ghosts.push(new Ghost(null, null))
ghosts.push(new Ghost(null, null))
ghosts.push(new Ghost(null, null))
ghosts.push(new Ghost(null, null))
board = new Board(pacman, ghosts)
direction = 'right'
next_direction = 'right'
next_rotation = '0deg'
dx_dy_map = {  // [dx, dy]
  'left': [-1, 0],
  'right': [1, 0],
  'up': [0, -1],
  'down': [0, 1],
}

function get_next_tile_if_direction(obj, direction_to_go_in){
  let x_cord = obj.x_cord;
  let y_cord = obj.y_cord;
  let dx = dx_dy_map[direction_to_go_in][0]
  let dy = dx_dy_map[direction_to_go_in][1]
  let new_x_cord = x_cord + dx;
  let new_y_cord = y_cord + dy;
  return board.tile_map[new_y_cord][new_x_cord]
}

document.onkeydown = function(e){
  let prev_direction = direction;
  let prev_rotation = pacman.rotation
  if(e.keyCode === 37) {
    pacman.rotation = '180deg';
    direction = 'left'
  }
  else if(e.keyCode === 38) {
    pacman.rotation = '270deg';
    direction = 'up'
  }
  else if(e.keyCode === 39) {
    pacman.rotation = '0deg';
    direction = 'right'
  }
  else if(e.keyCode === 40) {
    pacman.rotation = '90deg';
    direction = 'down'
  }
  
  possible_next_tile = get_next_tile_if_direction(pacman, direction)
  if(possible_next_tile.wall){
    // save the next direction so users can change before they hit the wall
    next_direction = direction;
    next_rotation = pacman.rotation;

    // set it back to previous direction because you can't walk into a wall
    pacman.rotation = prev_rotation;
    direction = prev_direction;
  }
  else {
    next_direction = direction;
    next_rotation = pacman.rotation;
  }
};

function check_collisions(){
  return []
}

function randomProperty(obj) { 
  // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
};

function randomArrayElement(arr){
  let r = arr[Math.floor(Math.random()*arr.length)];
  return r
}

function get_random_move(){
  return randomProperty(dx_dy_map)
}

function get_orange_move(){
  differences = [];
  while(true){
    idx = 0
    ghost = ghosts[idx]
    let x_cord = ghost.x_cord;
    let y_cord = ghost.y_cord;
    random_move = get_random_move();
    let dx = random_move[0];
    let dy = random_move[1];
    let new_x_cord = x_cord + dx;
    let new_y_cord = y_cord + dy;
    if(!board.tile_map[new_y_cord][new_x_cord].wall){
      old_tile = board.tile_map[y_cord][x_cord]
      old_tile['ghost' + (idx+1)] = null;
      new_tile = board.tile_map[new_y_cord][new_x_cord];
      new_tile['ghost' + (idx+1)] = ghosts[idx];
      ghosts[idx].x_cord = new_x_cord;
      ghosts[idx].y_cord = new_y_cord;
      differences.push([x_cord, y_cord]);
      differences.push([new_x_cord, new_y_cord]);
      break;
    } 
  }
}

function get_walls_next_to_obj(obj){
  walls_to_ghost = {};
  Object.keys(dx_dy_map).forEach((dir, idx) => {
    tile = get_next_tile_if_direction(obj, dir);
    if(tile.wall){
      walls_to_ghost[dir] = true;
    }
  })
  return walls_to_ghost
}

function get_differences_from_tile_to_target(ghost, idx, target_x, target_y){
  constructive_percent = .9
  differences = [];
  let ghost_x_cord = ghost.x_cord;
  let ghost_y_cord = ghost.y_cord;
  constructive_moves = [];
  non_constructive_moves = [];
  walls_to_ghost = get_walls_next_to_obj(ghost)
  if(target_x <= ghost_x_cord){ // target is to the left of ghost
    if(!walls_to_ghost['left']){
      constructive_moves.push('left')
    }
    if(!walls_to_ghost['right']){
      non_constructive_moves.push('right')
    } 
  }
  else { // target is to the right of ghost
    if(!walls_to_ghost['right']){
      constructive_moves.push('right')
    }
    if(!walls_to_ghost['left']){
      non_constructive_moves.push('left')
    } 
  }

  if(target_y < ghost_y_cord){ // target is upwards of ghost
    if(!walls_to_ghost['up']){
      constructive_moves.push('up')
    }
    if(!walls_to_ghost['down']){
      non_constructive_moves.push('down')
    } 
  }
  else { // target is downwards of ghost
    if(!walls_to_ghost['down']){
      constructive_moves.push('down')
    }
    if(!walls_to_ghost['up']){
      non_constructive_moves.push('up')
    }
  }

  if(constructive_moves.length === 0){
    non_constructive_percent = 1;
    constructive_percent = 0;
  }
  else if(non_constructive_moves.length === 0){
    constructive_percent = 1;
  }

  random_value = Math.random()
  if(random_value < constructive_percent){
    ghost_direction = randomArrayElement(constructive_moves)
  }
  else {
    ghost_direction = randomArrayElement(non_constructive_moves)
  }

  if(dx_dy_map[ghost_direction] === undefined){
    console.log(ghost_direction);
    console.log(constructive_moves);
    console.log(non_constructive_moves);
    console.log(ghost_x_cord);
    console.log(ghost_y_cord);
    console.log(target_x);
    console.log(target_y);
    console.log(random_value);
  }
  let dx = dx_dy_map[ghost_direction][0];
  let dy = dx_dy_map[ghost_direction][1];
  let new_x_cord = ghost_x_cord + dx;
  let new_y_cord = ghost_y_cord + dy;
    
  old_tile = board.tile_map[ghost_y_cord][ghost_x_cord]
  old_tile['ghost' + (idx+1)] = null;
  new_tile = board.tile_map[new_y_cord][new_x_cord];
  new_tile['ghost' + (idx+1)] = ghosts[idx];
  ghosts[idx].x_cord = new_x_cord;
  ghosts[idx].y_cord = new_y_cord;
  differences.push([ghost_x_cord, ghost_y_cord]);
  differences.push([new_x_cord, new_y_cord]);
  return differences;
}

function update_red_ghost(){
  let pacman_x_cord = pacman.x_cord;
  let pacman_y_cord = pacman.y_cord;
  return get_differences_from_tile_to_target(ghosts[0], 0, pacman_x_cord, pacman_y_cord)
}

function update_pink_ghost(){
  /*
    find pacmans position
    keep that current direction until there is a way for him to turn
      if pacman is going up or down:
        check if pacman can go right or left
      if pacman is going left or right:
        check if pacman can go up or down
    go towards that opening constructively with 90% prob
  */
  function get_tile_to_target(){
    idx = 0;
    ghost = ghosts[idx]
    let ghost_x_cord = ghost.x_cord;
    let ghost_y_cord = ghost.y_cord;
    let hypothetical_pacman_x_cord = pacman.x_cord;
    let hypothetical_pacman_y_cord = pacman.y_cord;
    let dx = dx_dy_map[direction][0];
    let dy = dx_dy_map[direction][1];

    let left_dx = dx_dy_map['left'][0];
    let left_dy = dx_dy_map['left'][1];
    let right_dx = dx_dy_map['right'][0];
    let right_dy = dx_dy_map['right'][1];
    let up_dx = dx_dy_map['up'][0];
    let up_dy = dx_dy_map['up'][1];
    let down_dx = dx_dy_map['down'][0];
    let down_dy = dx_dy_map['down'][1];

    constructive_moves = [];
    non_constructive_moves = [];
    walls_to_ghost = get_walls_next_to_obj(ghost);
    pacmans_direction = direction;

    opening_not_found = true
    while(opening_not_found){
      hypothetical_pacman_x_cord += dx;
      hypothetical_pacman_y_cord += dy;
      if(dy >= board.tile_map.length - 1 || dy < 1 || dx >= board.tile_map[0].length - 1 || dx < 1){
        return [pacman.x_cord, pacman.y_cord]
      } 

      if(direction === 'up' || direction === 'down'){
        // if can go left
        if(!board.tile_map[hypothetical_pacman_y_cord + left_dy][hypothetical_pacman_x_cord + left_dx].wall){
          return [hypothetical_pacman_x_cord, hypothetical_pacman_y_cord]
        } else if(!board.tile_map[hypothetical_pacman_y_cord + right_dy][hypothetical_pacman_x_cord + right_dx].wall){
          return [hypothetical_pacman_x_cord, hypothetical_pacman_y_cord]
        }
      }
      else { // going left/right
        if(!board.tile_map[hypothetical_pacman_y_cord + up_dy][hypothetical_pacman_x_cord + up_dx].wall){
          return [hypothetical_pacman_x_cord, hypothetical_pacman_y_cord]
        } else if(!board.tile_map[hypothetical_pacman_y_cord + down_dy][hypothetical_pacman_x_cord + down_dx].wall){
          return [hypothetical_pacman_x_cord, hypothetical_pacman_y_cord]
        }
      }
    }
  }
  tile_to_target = get_tile_to_target()
  return get_differences_from_tile_to_target(ghosts[1], 1, tile_to_target[0], tile_to_target[1])
}

function update_blue_ghost(){
  return [];
}

function update_orange_ghost(){
  return [];
}

function update_ghosts(){
  differences = []
  how_many_frames_until_run = {
    'red': 0,
    'pink': 7,
    'blue': 15,
    'orange': 40
  }

  let red_differences = [];
  let pink_differences = [];
  let blue_differences = [];
  let orange_differences = [];

  if(frame_number >= how_many_frames_until_run['red']){
    red_differences = update_red_ghost();
  }
  
  if(frame_number >= how_many_frames_until_run['pink']){
    pink_differences = update_pink_ghost();
  }

  if(frame_number >= how_many_frames_until_run['blue']){
    blue_differences = update_blue_ghost();
  }

  if(frame_number >= how_many_frames_until_run['orange']){
    orange_differences = update_orange_ghost();
  }

  return differences.concat(red_differences, pink_differences, blue_differences, orange_differences)
}


function update_pacman(){
  /*
  if next_direction leads to a non wall:
    go there
  else if direction leads to a wall:
    don't go anywhere
  else
    go towards direction
  */
  possible_tile_from_next_direction = get_next_tile_if_direction(pacman, next_direction)
  possible_tile_from_current_direction = get_next_tile_if_direction(pacman, direction)
  let x_cord = pacman.x_cord;
  let y_cord = pacman.y_cord;
  let dx = dx_dy_map[direction][0];
  let dy = dx_dy_map[direction][1];
  if(!possible_tile_from_next_direction.wall){
    dx = dx_dy_map[next_direction][0];
    dy = dx_dy_map[next_direction][1];
    pacman.rotation = next_rotation;
    direction = next_direction;
  }
  else if(possible_tile_from_current_direction.wall){
    return []
  }

  let new_x_cord = x_cord + dx;
  let new_y_cord = y_cord + dy;
  old_tile = board.tile_map[y_cord][x_cord]
  old_tile.pacman = null;
  new_tile = board.tile_map[new_y_cord][new_x_cord];
  new_tile.pacman = pacman;
  new_tile.has_coin = false;
  pacman.x_cord = new_x_cord;
  pacman.y_cord = new_y_cord;
  return [[x_cord, y_cord], [new_x_cord, new_y_cord]]
}

function frame(){
  frame_number += 1;
  pacman_differences = update_pacman();
  ghost_differences = update_ghosts();
  check_collisions();
  board.render_differences(pacman_differences, ghost_differences);
  document.getElementById('pacman').style.transform = `rotate(${this.pacman.rotation})`;
}

setInterval(frame, 220)