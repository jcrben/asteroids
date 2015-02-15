// start slingin' some d3 here.
var Game = function(){
  this.score = 0;
  this.highScore = 0;
  this.collision = 0;
  this.board = d3.select('.board');
  this.enemy_num = 10;
  this.ammu = -1;
  this.setBoard(this.createAsteroids(this.enemy_num));
  this.changeHardness();

  var fireKey = function(e) {
    if(e.which === 32){
      if(this.ammu === -1){
        this.fireLazer();
      }else if(d3.selectAll('.lazer')[0].length < this.ammu){
        this.fireLazer();
      }
    }
  };
  window.onkeypress = fireKey.bind(this);
};

Game.prototype.createAsteroids = function(amount) {
  var results = [];
  for(var i = 0; i < amount; i++){
    results.push([(Math.floor(Math.random() * (650)))+25,
                  (Math.floor(Math.random() * (650)))+25]);
  }
  return results;
};

Game.prototype.fireLazer = function(){
  var y = d3.select('.player').attr('cy')-25;
  var x = d3.select('.player').attr('cx');

  this.board.selectAll().data([[x, y]]).enter()
                    .append('svg:rect')
                    .attr({
                      class: 'lazer',
                      x:function(d){ return d[0]; },
                      y:function(d){ return d[1]; },
                      width:"3",
                      height:"10",
                      style:"fill:white;"
                    })
                    .transition().duration(1000).attr({ y: -10 }).remove();
};

Game.prototype.setBoard = function(asteroids){
  this.board.selectAll().data(asteroids).enter()
                      .append('svg:circle')
                      .attr({
                        class: 'asteroid',
                        cx : function(d){ return d[1]; },
                        cy : function(d){ return d[0]; },
                        r : 25,
                        filter : 'url(#rock)'
                      });


  var drag = d3.behavior.drag()
                .on('dragstart', function(){})
                .on('drag', function(){
                  var x = d3.event.x;
                  var y = d3.event.y;

                  if(x < 675 && x > 25){
                    d3.select('.player').attr('cx', x)
                  }
                  if(y < 675 && y > 25){
                    d3.select('.player').attr('cy', y)
                  }
                })
                .on('dragend', function() {});

  this.board.selectAll().data([[350, 350]]).enter()
                     .append('svg:circle')
                     .attr({
                        class:'player',
                        cx: function(d){ return d[1]; },
                        cy: function(d){ return d[0]; },
                        r : '25',
                        filter: 'url(#player)'
                     })
                     .call(drag);


  d3.timer(function(){

    d3.selectAll('.asteroid').each(function () {
      var enemy = d3.select(this);
      var enemyX = enemy.attr('cx');
      var enemyY = enemy.attr('cy');

      var x = d3.select('.player').attr('cx');
      var y = d3.select('.player').attr('cy');


      d3.selectAll('.lazer').each(function(){
        var laz = d3.select(this);
        var lazX = laz.attr('x');
        var lazY = laz.attr('y');
        if(Math.abs(lazX - enemyX) < 25 && Math.abs(lazY - enemyY) < 25){
          laz.remove();
          enemy.transition().duration(100).attr('cy', '-50');
        }
      });

      if(game.score > game.highScore){
        game.highScore = game.score;
      }

      if(Math.abs(x - enemyX) < 50 && Math.abs(y - enemyY) < 50){
        game.collision++;
        game.score = 0;

        var boardElement = document.getElementsByClassName('board');
        boardElement[0].style.borderColor = "red";
        var turnBack = function(){
          boardElement[0].style.borderColor = "black";
        };
        setTimeout(turnBack, 100);
      }
    });

    d3.select('#current').text(game.score);
    d3.select('#collisions').text(game.collision);
    d3.select('#high').text(game.highScore);
    game.ammu = parseInt(d3.select('#ammu')[0][0].value);


    if(game.ammu === -1){
      d3.select('#ammuAmount').text('Unlimited');
    }else if (game.ammu === 0){
      d3.select('#ammuAmount').text('None');
    }else {
      d3.select('#ammuAmount').text(game.ammu);
    }
    d3.select('#hardnessAmount').text(game.enemy_num);

    game.score++;
  });

};

Game.prototype.transition = function(arr){
  this.board.selectAll('.asteroid').data(arr)
                  .transition().duration(1000)
                  .attr({
                    cx : function(d){ return d[1]; },
                    cy : function(d){ return d[0]; },
                    r : '25',
                    filter : 'url(#rock)'
                  });
};

Game.prototype.changeHardness = function(){

  this.enemy_num = d3.select('#enemies')[0][0].value;

  var asteroids = this.createAsteroids(this.enemy_num);
  var current_asteroids = d3.selectAll('.asteroid')[0].length;

  if(this.enemy_num > current_asteroids){
      this.board.selectAll().data(this.createAsteroids(this.enemy_num - current_asteroids))
                      .enter()
                      .append('svg:circle')
                      .attr({
                              class: 'asteroid',
                              cx : function(d){ return d[1]; },
                              cy : function(d){ return d[0]; },
                              r : 25,
                              filter : 'url(#rock)'
                            });
  }else if(this.enemy_num < current_asteroids){
    var dif = current_asteroids - this.enemy_num;
    this.board.selectAll('.asteroid').data(d3.range(this.enemy_num)).exit().remove();
  }
  this.transition(asteroids);
  setTimeout(this.changeHardness.bind(this), 1000);
};

var game = new Game();
