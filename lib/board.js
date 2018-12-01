class Board {

  constructor(pacman){
    this.map = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
      [1, 3, 1, 3, 1, 3, 1, 1, 1, 1, 3, 1, 3, 1],
      [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 1],
      [1, 3, 1, 3, 1, 3, 1, 3, 3, 1, 3, 1, 3, 1],
      [1, 3, 3, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 1],
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
        let tile = new Tile({
          'wall': el === 1,
          'pacman': el === 5,
          'empty': el === 3,
          'ghost1': el === 6,
          'ghost2': el === 7,
          'ghost3': el === 8,
          'ghost4': el === 9,
          'x_cord': x,
          'y_cord': y
        });
        if(el === 5){
          tile.pacman = pacman
        }
        row_els.push(tile);
      })
      this.tile_map.push(row_els);
    })
    this.pacman = pacman;
    this.draw_initial_board()
  }

  draw_initial_board() {
    this.tile_map.forEach((row, y) =>{
      row.forEach((el, x) => {
        document.getElementById('pacman-board').innerHTML += el.get_html();
      })
      document.getElementById('pacman-board').innerHTML += "</br></br>"
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