/* global variables */
pacman = new Pacman(null, null)
ghosts = []
frame_number = 0;
ghosts.push(new RedGhost(null, null))
ghosts.push(new PinkGhost(null, null))
ghosts.push(new BlueGhost(null, null))
ghosts.push(new OrangeGhost(null, null))
board = new Board(pacman, ghosts)
direction = 'right'
next_direction = 'right'
next_rotation = '0deg'
score = 0 
frames_per_second = 12
seconds_scared = 6
frame_amount_scared = seconds_scared * frames_per_second
frames_scared_countdown = -1
dx_dy_map = {  // [dx, dy]
  'left': [-1, 0],
  'right': [1, 0],
  'up': [0, -1],
  'down': [0, 1],
}
/* global variables */

function no_coins_left(){
  for(let i = 0 ; i < board.tile_map.length - 1 ; i++){
    for(let j = 0; j < board.tile_map[0].length - 1 ; j++){
      if(board.tile_map[i][j].has_coin || board.tile_map[i][j].has_pellet) {
        return false
      }
    }
  }
  return true
};

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

function check_collisions(pacman_differences, ghost_differences){
  /*
    check if pacman.position === ghost.position
    check if pacman crossed past any ghosts
  */
  let pacman_x_cord = pacman.x_cord;
  let pacman_y_cord = pacman.y_cord;
  for(var ghost_diff_idx in ghosts){
    let ghost = ghosts[ghost_diff_idx];
    ghost_x_cord = ghost.x_cord;
    ghost_y_cord = ghost.y_cord;
    if(ghost_x_cord === pacman_x_cord && ghost_y_cord === pacman_y_cord){
      return ghost;
    } 
  }
  return null
}

function update_differences(ghost, idx, differences){
  if(!differences.length){
    return
  }
  let new_x_cord = differences[1][0];
  let new_y_cord = differences[1][1];
  let ghost_x_cord = ghost.x_cord;
  let ghost_y_cord = ghost.y_cord;
  let old_tile = board.tile_map[ghost_y_cord][ghost_x_cord]
  old_tile['ghost' + (idx+1)] = null;
  let new_tile = board.tile_map[new_y_cord][new_x_cord];
  new_tile['ghost' + (idx+1)] = ghosts[idx];
  ghost.x_cord = new_x_cord;
  ghost.y_cord = new_y_cord;
}

function update_ghosts(){
  let differences = []
  how_many_frames_until_run = {
    'red': 0 * 4,
    'pink': 5 * 4,
    'blue': 15 * 4,
    'orange': 40 * 4
  }

  let red_differences = [];
  let pink_differences = [];
  let blue_differences = [];
  let orange_differences = [];

  if(frame_number >= how_many_frames_until_run['red']){
    let red_differences = ghosts[0].update_position();
    differences = differences.concat(red_differences);
    update_differences(ghosts[0], 0, red_differences)
  }
  
  if(frame_number >= how_many_frames_until_run['pink']){
    let pink_differences = ghosts[1].update_position();
    differences = differences.concat(pink_differences);
    update_differences(ghosts[1], 1, pink_differences);
  }

  if(frame_number >= how_many_frames_until_run['blue']){
    let blue_differences = ghosts[2].update_position();
    differences = differences.concat(blue_differences);
    update_differences(ghosts[2], 2, blue_differences);
  }

  if(frame_number >= how_many_frames_until_run['orange']){
    let orange_differences = ghosts[3].update_position();
    differences = differences.concat(orange_differences);
    update_differences(ghosts[3], 3, orange_differences);
  }

  return differences;
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
  if(new_tile.has_coin){
    score += 10;
  } 
  else if(new_tile.has_pellet){
    score += 50;
    ghosts.forEach((ghost, idx) => {
      ghost.scared = true;
    })
    frames_scared_countdown = frame_amount_scared
  }

  new_tile.has_coin = false;
  new_tile.has_pellet = false;
  pacman.x_cord = new_x_cord;
  pacman.y_cord = new_y_cord;
  return [[x_cord, y_cord], [new_x_cord, new_y_cord]]
}

function change_pacman_graphic(){

}

function change_score_graphic(){
  document.getElementById("score").innerHTML = score;
}

function frame(){
  frame_number += 1
  frames_scared_countdown -= 1
  if(frames_scared_countdown === -1){
    ghosts.forEach((ghost, idx) => {
      ghost.scared = false;
    })
  }
  if(frame_number % 3){ // only move every 3 frames, so 4 moving frames per second
    let pacman_differences = update_pacman();
    let ghost_differences = update_ghosts();
    if(no_coins_left()){
      document.getElementById("status").innerHTML = "🎉 You Won! 🎉 😊 🎉";
      clearInterval(interval);
    }
    ghost_collision = check_collisions(pacman_differences, ghost_differences)
    if(ghost_collision){
      if(ghost_collision.scared){
        ghost_collision.eaten = true;
      }
      else {
        document.getElementById("status").innerHTML = "🙁 Game Over 🙁";
        pacman_differences = pacman_differences.slice(0, 1); // don't render pacman's new position -- TODO: need to add animation
        clearInterval(interval);
      }
    }
    board.render_differences(pacman_differences, ghost_differences);
    document.getElementById('pacman').style.transform = `rotate(${this.pacman.rotation})`;
  }
  change_pacman_graphic();
  change_score_graphic();
}
interval = setInterval(frame, 1000/frames_per_second) // 12 frames in a second


