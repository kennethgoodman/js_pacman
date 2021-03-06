class Tile {
	constructor(args){
		this.wall = args['wall'];
		this.pacman = args['pacman'];
		this.ghost1 = args['ghost1'];
		this.ghost2 = args['ghost2'];
		this.ghost3 = args['ghost3'];
		this.ghost4 = args['ghost4'];
    this.has_pellet = args['pellet'];
		this.has_coin = !this.pacman && !this.ghost1 && !this.ghost2 && !this.ghost3 && !this.ghost4 && !this.wall && !this.has_pellet
		this.x_cord = args['x_cord'];
		this.y_cord = args['y_cord'];
	}

	get_html(){
		let x_cord = this.x_cord;
		let y_cord = this.y_cord;
		if(this.pacman){
          return "<div id='pacman' class='pacman " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    } 
    else if(this.wall){
      return "<div class='wall " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
    else if(this.ghost1){
      if(this.ghost1.scared){
        return "<div class='scaredghost ghost " + create_cord_class_string(x_cord, y_cord) + "'></div>";
      }
      return "<div class='blinky ghost " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
    else if(this.ghost2){
      if(this.ghost2.scared){
        return "<div class='scaredghost ghost " + create_cord_class_string(x_cord, y_cord) + "'></div>";
      }
      return "<div class='pinky ghost " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
    else if(this.ghost3){
      if(this.ghost3.scared){
        return "<div class='scaredghost ghost " + create_cord_class_string(x_cord, y_cord) + "'></div>";
      }
      return "<div class='inky ghost " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
    else if(this.ghost4){
      if(this.ghost4.scared){
        return "<div class='scaredghost ghost " + create_cord_class_string(x_cord, y_cord) + "'></div>";
      }
      return "<div class='clyde ghost " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
    else { // this is a floor tile
    	if(this.has_pellet){
        return "<div class='pellet " + create_cord_class_string(x_cord, y_cord) + "'></div>"
      }
      else if(this.has_coin){
    		return "<div class='coin " + create_cord_class_string(x_cord, y_cord) + "'></div>"
    	}
    	return "<div class='ground " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
	}
}

function create_cord_class_string(x_cord, y_cord){
	return "cord_" + x_cord + "_" + y_cord
}