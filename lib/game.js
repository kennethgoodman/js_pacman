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

pacman = new Pacman(1, 1)
board = new Board(pacman)
direction = 'right'
dx_dy_map = {  // [dx, dy]
  'left': [-1, 0],
  'right': [1, 0],
  'up': [0, -1],
  'down': [0, 1],
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
  let x_cord = pacman.x_cord;
  let y_cord = pacman.y_cord;
  let dx = dx_dy_map[direction][0]
  let dy = dx_dy_map[direction][1]
  let new_x_cord = x_cord + dx;
  let new_y_cord = y_cord + dy;
  if(board.tile_map[new_y_cord][new_x_cord].wall){
    pacman.rotation = prev_rotation;
    direction = prev_direction
  }
};

function check_collisions(){
  return []
}

function update_ghosts(){
  return []
}

function update_pacman(){
  let x_cord = pacman.x_cord;
  let y_cord = pacman.y_cord;
  let dx = dx_dy_map[direction][0]
  let dy = dx_dy_map[direction][1]
  let new_x_cord = x_cord + dx;
  let new_y_cord = y_cord + dy;
  if(board.tile_map[new_y_cord][new_x_cord].wall){
    return []
  }
  else {
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
}

function frame(){
  pacman_differences = update_pacman();
  ghost_differences = update_ghosts();
  check_collisions();
  board.render_differences(pacman_differences, ghost_differences);
  document.getElementById('pacman').style.transform = `rotate(${this.pacman.rotation})`;
}

setInterval(frame, 220)