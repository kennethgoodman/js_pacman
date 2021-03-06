
function get_walls_next_to_obj(obj){
  walls_to_ghost = {};
  Object.keys(dx_dy_map).forEach((dir, idx) => {
    tile = get_next_tile_if_direction(obj, dir);
    if(tile.wall){
    	walls_to_ghost[dir] = true;
    }
    else if(board.ghosts_home[tile.y_cord] && board.ghosts_home[tile.y_cord][tile.x_cord]){
    	walls_to_ghost[dir] = true;
    }
  })
  return walls_to_ghost
}

class Ghost {
	constructor(x_cord, y_cord, constructive_percent){
		this.x_cord = x_cord;
		this.y_cord = y_cord;
		this.out_of_home = false;
		this.constructive_percent = .9 // default value
		if(constructive_percent){
			this.constructive_percent = constructive_percent
		}
		this.get_differences_and_update_position_from_tile_to_target = this.get_differences_and_update_position_from_tile_to_target.bind(this);
		this.current_position = this.current_position.bind(this);
		this.scared = false;
		this.eaten = false;
	}

	current_position(){
		return [this.x_cord, this.y_cord]
	}

  	get_differences_and_update_position_from_tile_to_target(target_x, target_y){
  		function add_to_array_after_wall_check(arr, direction_str, walls_to_ghost){
  			if(!walls_to_ghost[direction_str]){
				arr.push(direction_str);
			}
  		}

  		function add_to_constructive_non_constructive_moves(constructive_moves, non_constructive_moves, walls_to_ghost, direction_one, direction_two){
  			if(!walls_to_ghost[direction_one]){
				constructive_moves.push(direction_one)
			}
			if(!walls_to_ghost[direction_two]){
				non_constructive_moves.push(direction_two)
			} 
  		}

		let constructive_percent = this.constructive_percent
		let differences = [];
		let ghost_x_cord = this.x_cord;
		let ghost_y_cord = this.y_cord;
		let constructive_moves = [];
		let non_constructive_moves = [];
		let walls_to_ghost = get_walls_next_to_obj(this)
		if(target_x === ghost_x_cord && target_y === ghost_y_cord){
			return [] // don't move, you are already where you want to be
		}

		if(target_x < ghost_x_cord){ // target is to the left of ghost
			add_to_constructive_non_constructive_moves(constructive_moves, non_constructive_moves, walls_to_ghost, 'left', 'right')
		}
		else if(target_x > ghost_x_cord){ // target is to the right of ghost
			add_to_constructive_non_constructive_moves(constructive_moves, non_constructive_moves, walls_to_ghost, 'right', 'left')
		}
		else { // same x cord
			add_to_constructive_non_constructive_moves(non_constructive_moves, non_constructive_moves, walls_to_ghost, 'right', 'left')
		}

		if(target_y < ghost_y_cord){ // target is upwards of ghost
			add_to_constructive_non_constructive_moves(constructive_moves, non_constructive_moves, walls_to_ghost, 'up', 'down')
		}
		else if(target_y > ghost_y_cord){ // target is downwards of ghost
			add_to_constructive_non_constructive_moves(constructive_moves, non_constructive_moves, walls_to_ghost, 'down', 'up')
		}
		else {
			add_to_constructive_non_constructive_moves(non_constructive_moves, non_constructive_moves, walls_to_ghost, 'up', 'down')
		}

		if(constructive_moves.length === 0){
			constructive_percent = 0;
		}
		else if(non_constructive_moves.length === 0){
			constructive_percent = 1;
		}

		let random_value = Math.random()
		let ghost_direction = ''
		if(random_value < constructive_percent){
			ghost_direction = this.randomArrayElement(constructive_moves)
		}
		else {
			ghost_direction = this.randomArrayElement(non_constructive_moves)
		}

		if(ghost_direction === undefined){
			// This happens when 
			console.log(random_value);
			console.log(constructive_percent);
			console.log(constructive_moves);
			console.log(non_constructive_moves);
			console.log(walls_to_ghost);
			return []; // if it is, just don't move, hopefully things sort themselves out
		}


		let dx = dx_dy_map[ghost_direction][0];
		let dy = dx_dy_map[ghost_direction][1];
		let new_x_cord = ghost_x_cord + dx;
		let new_y_cord = ghost_y_cord + dy;
		differences.push([ghost_x_cord, ghost_y_cord]);
		differences.push([new_x_cord, new_y_cord]);
		return differences;
	}

	_update_position(){
		return [] // by default, don't move
	}

	update_position(){
		if(this.eaten){
			this.eaten = false;
			this.scared = false;
			this.out_of_home = false;
			return [this.current_position(),[16, 7]]
		}
		if(!this.out_of_home){
			this.out_of_home = true;
			return [this.current_position(), board.init_ghost_leaving_position]
		}
		return this._update_position()
	}

	randomProperty(obj) { 
	  // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
	    var keys = Object.keys(obj)
	    return obj[keys[ keys.length * Math.random() << 0]];
	};

	randomArrayElement(arr){
		return arr[Math.floor(Math.random()*arr.length)];
	}


	get_random_move(){
  		return this.randomProperty(dx_dy_map)
	}
}

class RedGhost extends Ghost{
	constructor(x_cord, y_cord, constructive_percent) {
    	super(x_cord, y_cord, constructive_percent);
	}

	_update_position(){
		let pacman_x_cord = pacman.x_cord;
		let pacman_y_cord = pacman.y_cord;
		return this.get_differences_and_update_position_from_tile_to_target(pacman_x_cord, pacman_y_cord)
	}
}

class PinkGhost extends Ghost{
	constructor(x_cord, y_cord, constructive_percent) {
    	super(x_cord, y_cord, constructive_percent);
    	this.get_tile_to_target = this.get_tile_to_target.bind(this);
	}

	get_tile_to_target(){
		let ghost = this
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

		let opening_not_found = true
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
				} 
				else if(!board.tile_map[hypothetical_pacman_y_cord + down_dy][hypothetical_pacman_x_cord + down_dx].wall){
					return [hypothetical_pacman_x_cord, hypothetical_pacman_y_cord]
				}
			}
		}
	}

	_update_position(){
	  /*
	    find pacmans position
	    keep that current direction until there is a way for him to turn
	      if pacman is going up or down:
	        check if pacman can go right or left
	      if pacman is going left or right:
	        check if pacman can go up or down
	    go towards that opening constructively with 90% prob
	  */
		let targeted_tile = this.get_tile_to_target()
		return this.get_differences_and_update_position_from_tile_to_target(targeted_tile[0], targeted_tile[1])
	}
}

class OrangeGhost extends Ghost{
	constructor(x_cord, y_cord, constructive_percent) {
    	super(x_cord, y_cord, constructive_percent);
    	this.get_random_legal_move = this.get_random_legal_move.bind(this);
	}

	get_random_legal_move(){
		let x_cord = this.x_cord;
		let y_cord = this.y_cord;
		while(true){
			let random_move = this.get_random_move();
			let dx = random_move[0];
			let dy = random_move[1];
			let new_x_cord = x_cord + dx;
			let new_y_cord = y_cord + dy;
			let next_would_be_back_home = !(board.ghosts_home[new_y_cord] && board.ghosts_home[new_y_cord][new_x_cord])
			if(!board.tile_map[new_y_cord][new_x_cord].wall && next_would_be_back_home){
				return [new_x_cord, new_y_cord]
			}
	  	}
	}

	_update_position(){
		let targeted_tile = this.get_random_legal_move()
		return this.get_differences_and_update_position_from_tile_to_target(targeted_tile[0], targeted_tile[1])
	}
}

class BlueGhost extends Ghost{
	constructor(x_cord, y_cord, constructive_percent) {
    	super(x_cord, y_cord, constructive_percent);
    	this.get_random_legal_move = this.get_random_legal_move.bind(this);
	}

	get_random_legal_move(){
		let x_cord = this.x_cord;
		let y_cord = this.y_cord;
		while(true){
			let random_move = this.get_random_move();
			let dx = random_move[0];
			let dy = random_move[1];
			let new_x_cord = x_cord + dx;
			let new_y_cord = y_cord + dy;
			let next_would_be_back_home = !(board.ghosts_home[new_y_cord] && board.ghosts_home[new_y_cord][new_x_cord])
			if(!board.tile_map[new_y_cord][new_x_cord].wall && next_would_be_back_home){
				return [new_x_cord, new_y_cord]
			}
	  	}
	}

	_update_position(){
		let targeted_tile = this.get_random_legal_move()
		return this.get_differences_and_update_position_from_tile_to_target(targeted_tile[0], targeted_tile[1])
	}
}

// 