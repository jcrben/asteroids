// start slingin' some d3 here.
var Game = function(){
  this.score = 0;
  this.highScore = 0;
  this.collision = 0;
  this.board = d3.select('.board');
  this.enemies = undefined;
  this.player = undefined;
  this.lazer = undefined;
  this.num = 10;
  this.setBoard(this.createAsteroids(this.num));
  this.change();

  var fn = function(e) {
    if(e.which === 32){
      if(this.lazer !== undefined){
        if(d3.selectAll('.lazer')[0].length > -1){
          this.fireLazer();
        }
      }else{
        this.fireLazer();
      }
    }
  };
  window.onkeypress = fn.bind(this);

};


Game.prototype.createAsteroids = function(amount) {
  var results = [];
  for(var i = 0; i < amount; i++){
    results.push([(Math.floor(Math.random() * (650)))+25, (Math.floor(Math.random() * (650)))+25]);
  }
  return results;
};

Game.prototype.fireLazer = function(){
  var x = this.player[0][0].cx.animVal.value;
  var y = this.player[0][0].cy.animVal.value-25;


  this.lazer = this.board.selectAll()
                    .data([[x, y]])
                    .enter()
                    .append('svg:rect')
                    .attr({
                      class: 'lazer',
                      x:function(d){ return d[0]; },
                      y:function(d){ return d[1]; },
                      width:"3",
                      height:"10",
                      style:"fill:white;"
                    })
                    .transition()
                    .duration(1000)
                    .attr({
                      y: -10
                    }).remove();
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
                    context.player.attr('cx', x);
                  }
                  if(y < 675 && y > 25){
                    context.player.attr('cy', y);
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
    enemies = d3.selectAll('.asteroid');
    enemies.each(function () {
      var enemy = d3.select(this);
      var enemyX = enemy.attr('cx');
      var enemyY = enemy.attr('cy');
      var x = context.player[0][0].cx.animVal.value;
      var y = context.player[0][0].cy.animVal.value;
      if(context.lazer !== undefined){
        var laz = d3.selectAll('.lazer')[0];
        for(var i = 0; i < laz.length; i++){
          // console.log(laz[i]);

          // var lazerX = d3.lazer[0][i].x.animVal.value;
          var lazerY = laz[i].y.animVal.value;
          var lazerX = laz[i].x.animVal.value;
          if(Math.abs(lazerX - enemyX) < 25 && Math.abs(lazerY - enemyY) < 25){
            laz[i].remove();
            context.num++;
            d3.select(this).transition().duration(100).attr('cy', '-50');
          }
        }
      }
      if(context.score > context.highScore){
        context.highScore = context.score;
      }
      if(Math.abs(x - enemyX) < 50 && Math.abs(y - enemyY) < 50){
        console.log('hit');
        context.collision++;
        context.score = 0;

        var obj = document.getElementsByClassName('board');
        obj[0].style.backgroundColor = "red";
        var turnBack = function(){
          obj[0].style.backgroundColor = "black";
        };
        setTimeout( turnBack, 100 );

      }

    });
    d3.select('#current').text(context.score);
    d3.select('#collisions').text(context.collision);
    d3.select('#high').text(context.highScore);
    context.score++;
    return false;
  });

};

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
};

Game.prototype.createPlayer = function() {
  return [[Math.floor((window.innerHeight-20)/2),
        Math.floor((window.innerWidth-20)/2)]];
};


Game.prototype.change = function(){
  this.num = d3.select('#enemies')[0][0].value;
  var asteroids = this.createAsteroids(this.num);
  var current_asteroids = d3.selectAll('.asteroid')[0].length;
  if(this.num > current_asteroids){
    this.board.selectAll().data(this.createAsteroids(this.num - current_asteroids))
                      .enter()
                      .append('svg:circle')
                      .attr({
                              class: 'asteroid',
                              cx : function(d){ return d[1]; },
                              cy : function(d){ return d[0]; },
                              r : 25,
                              filter : 'url(#rock)'
                            });
  }else if(this.num < current_asteroids){
    var dif = current_asteroids - this.num;
    console.log(dif);
    this.board.selectAll('.asteroid').data(d3.range(this.num)).exit().remove();
  }
  this.transition(asteroids);
  setTimeout(this.change.bind(this), 1000);
};

var game = new Game();
