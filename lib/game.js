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

function get_next_tile_if_direction(direction_to_go_in){
  let x_cord = pacman.x_cord;
  let y_cord = pacman.y_cord;
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
  
  possible_next_tile = get_next_tile_if_direction(direction)
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

function update_ghosts(){
  return []
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
  possible_tile_from_next_direction = get_next_tile_if_direction(next_direction)
  possible_tile_from_current_direction = get_next_tile_if_direction(direction)
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
  old_tile.floor = true;
  new_tile = board.tile_map[new_y_cord][new_x_cord];
  new_tile.pacman = pacman;
  new_tile.has_coin = false;
  pacman.x_cord = new_x_cord;
  pacman.y_cord = new_y_cord;
  return [[x_cord, y_cord], [new_x_cord, new_y_cord]]
}

function frame(){
  pacman_differences = update_pacman();
  ghost_differences = update_ghosts();
  check_collisions();
  board.render_differences(pacman_differences, ghost_differences);
  document.getElementById('pacman').style.transform = `rotate(${this.pacman.rotation})`;
}

setInterval(frame, 220)