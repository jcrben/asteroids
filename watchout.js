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

var board = d3.select('.board');

var setBoard = function(asteroids){
  board.selectAll()
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


  var drag = d3.behavior.drag().
               .on('dragstart', function(){

               })
               .on('drag' function(){

               })

  board.selectAll()
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
       .attr('fill', 'blue');

/*
var drag = d3.behavior.drag()
       .on('dragstart', function() { circle.style('fill', 'red'); })
       .on('drag', function() { circle.attr('cx', d3.event.x)
                                      .attr('cy', d3.event.y); })
       .on('dragend', function() { circle.style('fill', 'black'); });
  function dragmove(d) {
    var x = d3.event.x;
    var y = d3.event.y;
    d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
  }

  var circle = board.selectAll('.draggableCircle')
          .data([{ x: (innerWidth / 2), y: (innerHeight / 2), r: 25 }])
          .enter()
          .append('svg:circle')
          .attr('class', 'draggableCircle')
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; })
          .attr('r', function(d) { return d.r; })
          .call(drag)
                .style('fill', 'red');
*/
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

  var asteroids = createAsteroids(30);
  transition(asteroids);
  setTimeout(change.bind(this), 1000);
}
setBoard(createAsteroids(30));
change();

// instiantiate nodes as svgs
// settimer -- may ways to this
// Create a player
