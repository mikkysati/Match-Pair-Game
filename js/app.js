angular.module('notesApp', ['ngAnimate'])
  .controller('MainCtrl', ['$timeout', '$interval', '$scope', function($timeout, $interval, $scope) {
    var self = this;
    self.tiles = getRandomTiles();
    self.tilesOpened = [];
    self.tilesChecked = [];
    self.pointsScored = 0;
    self.timer = 59;
    self.boxesChecked = 0;
    var firstTileOpen = true;
    var tileOpenedIndex = -1;
    var restrictOpening = false;

    function getRandomTiles() {
        var tilesIcons = ['fa-hand-peace-o', 'fa-binoculars', 'fa-birthday-cake', 'fa-bed', 'fa-beer', 'fa-bomb', 'fa-eye', 'fa-female'];
        
        if (Math.round((Math.random()))) {
            var tiles = [...tilesIcons.slice(0,4), ...tilesIcons.slice(0,4), ...tilesIcons.slice(0,4), ...tilesIcons.slice(0,4)];
        } else {
            var tiles = [...tilesIcons.slice(4,8), ...tilesIcons.slice(4,8), ...tilesIcons.slice(4,8), ...tilesIcons.slice(4,8)];
        }
        for(let i=0; i<tiles.length; i++) {
            let temp = Math.floor(i + Math.random()*(tiles.length-i-1));
            let swap = tiles[i];
            tiles[i] = tiles[temp];
            tiles[temp] = swap;
        }

        return tiles;
    };

    self.resetGame = function() {
        $timeout(()=> {
            $('#playAgainModal').modal('hide');
            self.boxesChecked = 0;
            self.pointsScored = 0;
            self.timer = 59;
        } ,1500);
        self.tiles = getRandomTiles();
        self.tilesOpened = [];
        self.tilesChecked = [];
        firstTileOpen = true;
        tileOpenedIndex = -1;
        restrictOpening = false;
        for(let i=0; i<16; i++) {
            self.tilesOpened[i] = false;
            self.tilesChecked[i] = false;
        }
    };

    self.openTile = function(index) {
        if(self.tilesOpened[index] || restrictOpening || self.tilesChecked[index]) return;
        self.tilesOpened[index] = true;
        if(firstTileOpen) {
            tileOpenedIndex = index;
        } else {
            restrictOpening = true;
            if(self.tiles[index] !== self.tiles[tileOpenedIndex]) {
                $timeout(()=>{
                    self.tilesOpened[index] = false;
                    self.tilesOpened[tileOpenedIndex] = false;
                    restrictOpening = false;
                }, 1500);
                if(self.pointsScored >=10) self.pointsScored -= 2;
            } else {
                self.pointsScored += 20;
                self.tilesOpened[index] = false;
                self.tilesOpened[tileOpenedIndex] = false;
                self.tilesChecked[index] = true;
                self.tilesChecked[tileOpenedIndex] = true;
                self.boxesChecked++;
                restrictOpening = false;
                if(self.boxesChecked===8) self.openModal();
            }
        }
        firstTileOpen = !firstTileOpen;
    };

    $interval(()=> {
        if(self.timer > 0){
            self.timer--;
            if (self.timer<10) self.timer = '0' + self.timer;
             if(self.timer==0)
                self.openModal();
        }
    }, 1000);

    self.openModal = function() {
        $('#playAgainModal').modal({backdrop: 'static', keyboard: false});
    };

  }]);
