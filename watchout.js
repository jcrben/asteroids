// start slingin' some d3 here.
var Game = function(){
  this.score = 0;
  this.highScore = 0;
  this.collision = 0;
  this.board = d3.select('.board');
  this.enemies = undefined;
  this.player = undefined;

  this.setBoard(this.createAsteroids(10));
  this.change();
}


Game.prototype.createAsteroids = function(amount) {
  var results = [];
  for(var i = 0; i < amount; i++){
    results.push([(Math.floor(Math.random() * (650)))+25, (Math.floor(Math.random() * (650)))+25]);
  }
  return results;
};

Game.prototype.setBoard = function(asteroids){
  this.enemies = this.board.selectAll()
                      .data(asteroids)
                      .enter()
                      .append('svg:circle')
                      .attr({
                              class: 'asteroid',
                              cx : function(d){ return d[1]; },
                              cy : function(d){ return d[0]; },
                              r : 25,
                              filter : 'url(#rock)'
                            });

  var context = this;

  var drag = d3.behavior.drag()
                .on('dragstart', function(){})
                .on('drag', function(){
                  var x = d3.event.x;
                  var y = d3.event.y;

                  if(x < 675 && x > 25){
                    context.player.attr('cx', x)
                  }
                  if(y < 675 && y > 25){
                    context.player.attr('cy', y)
                  }
                })
             .on('dragend', function() {});

  this.player = this.board.selectAll()
                     .data([[350, 350]])
                     .enter()
                     .append('svg:circle')
                     .attr('class', 'player')
                     .attr('cx', function(d){
                       return d[1];
                     })
                     .attr('cy', function(d){
                       return d[0];
                     })
                     .attr('r', '25')
                     .attr('filter', 'url(#player)')
                     .call(drag);


  d3.timer(function(){
    context.enemies.each(function () {
      var enemy = d3.select(this);
      var enemyX = enemy.attr('cx');
      var enemyY = enemy.attr('cy');
      var x = context.player[0][0].cx.animVal.value;
      var y = context.player[0][0].cy.animVal.value;
      if(context.score > context.highScore){
        context.highScore = context.score;
      }
      if(Math.abs(x - enemyX) < 50 && Math.abs(y - enemyY) < 50){
        console.log('hit');
        context.collision++;
        context.score = 0;
      }
    });

    d3.select('#current').text(context.score);
    d3.select('#collisions').text(context.collision);
    d3.select('#high').text(context.highScore);
    context.score++;
    return false;
  });

}

Game.prototype.transition = function(arr){
  this.board.selectAll('.asteroid')
    .data(arr)
    .transition()
    .duration(1000)
    .attr('cx', function(d){
      return d[1];
    })
    .attr('cy', function(d){
      return d[0];
    })
    .attr('r', '25')
    .attr('filter', 'url(#rock)');
}
Game.prototype.createPlayer = function() {
  return [[Math.floor((window.innerHeight-20)/2),
        Math.floor((window.innerWidth-20)/2)]];
};


Game.prototype.change = function(){
  var asteroids = this.createAsteroids(10);
  this.transition(asteroids);
  setTimeout(this.change.bind(this), 1000);
};

var game = new Game();
