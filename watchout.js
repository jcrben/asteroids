// start slingin' some d3 here.

var createAsteroids = function(amount) {
  var results = [];
  for(var i = 0; i < amount; i++){
    results.push([(Math.floor(Math.random() * (650)))+25,
                  (Math.floor(Math.random() * (650)))+25]
                );
  }
  // [[top, left], [top, left]]
  return results;
};

var score = 0;
var collision = 0;
var highScore = 0;
var board = d3.select('.board');

var setBoard = function(asteroids){
var enemies = board.selectAll()
      .data(asteroids)
      .enter()
      .append('svg:circle')
      .attr('class', 'asteroid')
      .attr('cx', function(d){
        return d[1];
      })
      .attr('cy', function(d){
        return d[0];
      })
      .attr('r', '25')
      .attr('fill', 'red');


var drag = d3.behavior.drag()
             .on('dragstart', function(){

             })
             .on('drag', function(){
                var x = d3.event.x;
                var y = d3.event.y;

                if(x < 675 && x > 25){
                  circle.attr('cx', x)
                }
                if(y < 675 && y > 25){
                  circle.attr('cy', y)
                }
             })
             .on('dragend', function() {
             });

  var circle = board.selectAll()
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
       .attr('fill', 'blue')
       .call(drag);

  d3.timer(function(){
    // enemies.each(function(){console.log(this)});


    enemies.each(function () {
      var enemy = d3.select(this);
      var enemyX = enemy.attr('cx');
      var enemyY = enemy.attr('cy');
      var x = circle[0][0].cx.animVal.value;
      var y = circle[0][0].cy.animVal.value;
      if(score > highScore){
        highScore = score;
      }
      if(Math.abs(x - enemyX) < 50 && Math.abs(y - enemyY) < 50){
        console.log('hit');
        collision++;
        score = 0;
      }
    })

    d3.select('#current').text(score);
    d3.select('#collisions').text(collision);
    d3.select('#high').text(highScore);
    score++;
    return false;
  });
}

var transition = function(arr){
  board.selectAll('.asteroid')
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
    .attr('fill', 'red');
}
var createPlayer = function() {
  return [[Math.floor((window.innerHeight-20)/2),
        Math.floor((window.innerWidth-20)/2)]];
};


var change = function(){
  var asteroids = createAsteroids(10);
  transition(asteroids);
  setTimeout(change.bind(this), 1000);
};

var checkCollision = function() {

}
setTimeout()
setBoard(createAsteroids(10));
change();

// instiantiate nodes as svgs
// settimer -- may ways to this
// Create a player
