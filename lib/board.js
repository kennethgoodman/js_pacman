class Board {
  constructor(pacman, ghosts){
    this.map = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
      [1, 3, 1, 3, 1, 3, 1, 1, 1, 1, 3, 1, 3, 1],
      [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 1],
      [1, 3, 1, 3, 1, 3, 1, 6, 7, 1, 3, 1, 3, 1],
      [1, 3, 3, 3, 3, 3, 1, 8, 9, 1, 3, 3, 3, 1],
      [1, 3, 1, 3, 1, 3, 1, 1, 1, 1, 3, 1, 3, 1],
      [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 1],
      [1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 3, 1],
      [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];


    this.tile_map = [];
    this.pacman = pacman
    this.map.forEach((row, y) => {
      let row_els = []
      row.forEach((el, x) => {
        let tile_args = {
          'wall': el === 1,
          'pacman': null,
          'empty': el === 3,
          'ghost1': null,
          'ghost2': null,
          'ghost3': null,
          'ghost4': null,
          'x_cord': x,
          'y_cord': y
        };
        if(el === 5){
          pacman.x_cord = x
          pacman.y_cord = y
          tile_args['pacman'] = pacman
        }
        for(var i = 6; i <= 9; i++){
          if(el === i){
            ghosts[i-6].x_cord = x;
            ghosts[i-6].y_cord = y;
            tile_args['ghost' + (i-5)] = ghosts[i-6]
          }
        }
        row_els.push(new Tile(tile_args));
      })
      this.tile_map.push(row_els);
    })
    this.pacman = pacman;
    this.draw_initial_board()
  }

  draw_initial_board() {
    this.tile_map.forEach((row, y) =>{
      row.forEach((tile, x) => {
        document.getElementById('pacman-board').innerHTML += tile.get_html();
      });
    })
    document.getElementById('pacman').style.transform = `rotate(${this.pacman.rotation})`;
  }

  render_differences(pacman_differences, ghost_differences){
    pacman_differences.forEach((cord, i) => {
      let x_cord = cord[0];
      let y_cord = cord[1];
      let class_name = create_cord_class_string(x_cord, y_cord);
      document.getElementsByClassName(class_name)[0].outerHTML = this.tile_map[y_cord][x_cord].get_html();
    });
  }
}
// 