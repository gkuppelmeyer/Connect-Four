"use strict";
console.log("Model loaded");
/**
	* Sets up the board for the game.
	* @constructor
	* @param {number} rows - The number of rows of the Model.
	* @param {number} columns - The number of columns of the Model.
*/
function Model(rows, columns) { // Constructor
	this.rows = rows;
	this.columns = columns;
	this.board = [];

	for (var i = 0; i < rows; i++) {
		var rowArray = [];
		for (var j = 0; j < columns; j++){
			rowArray.push("");
		}
		this.board.push(rowArray);
	}
	this.playerList = [];
	this.gameOver = false;
	this.changeListeners = [];
	this.currentPlayerIndex = 0;
	this.numOfMoves = 0;

}

/**
	* @prototype
*/
var modelPrototype = { 
	constructor: Model,

	/**
		* Checks the given row and column to see if it is occupied by a player.
		* @function
		* @param {number} row - The row of the cell.
		* @param {number} col - The column of the cell.
	*/
	isValidMove: function(row,col){
		if(this.getPlayer(row,col) == ""){
			if(row != this.rows-1 && this.getPlayer(row+1,col) == ""){
				return false;
			} 
			else{
				return true;
			}
		} else {
			return false;
		}
	},

	/**
		* Checks the model to see if the game has ended in a draw when there are no more possible moves left.
		* @function
	*/
	isDraw: function(){
		var draw;
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.columns; j++){
				if ((this.board[i][j] != "") && (!this.playerWin()) && (this.numOfMoves == this.columns*this.rows)){
					draw = true;
					this.gameOver = true;
				} else {
					draw = false;
				}
			}
		
		} 
		return draw;

	},

	/**
		* Adds a player to the playerList array.
		* @function
	*/
	addPlayer: function(str){
		this.playerList.push(str);
	},

	/**
		* Checks to see if a player has met the conditions of a win.
		* @function
	*/
	playerWin: function(){
		var winner;
		for (var row = 0; row < this.rows; row++){
			for (var col = 0; col < this.columns; col++){
				//needed?
				
				if(col >= (this.columns/2) - 1){
					//check left
					if(this.getPlayer(row,col) == this.getPlayer(row,col-1) && this.getPlayer(row,col) == this.getPlayer(row,col-2) && this.getPlayer(row,col) == this.getPlayer(row,col-3) && this.getPlayer(row,col) != ""){
						winner = this.getPlayer(row,col);
						this.gameOver = true;
						return winner;
					}
				}
				if(col <= this.columns/2){
					//check right
					if(this.getPlayer(row,col) == this.getPlayer(row,col+1) && this.getPlayer(row,col) == this.getPlayer(row,col+2) && this.getPlayer(row,col) == this.getPlayer(row,col+3) && this.getPlayer(row,col) != ""){
						winner = this.getPlayer(row,col);
						this.gameOver = true;
						return winner;
					}
				}
				//needed?
				if(row >= this.rows/2 && row < this.rows){
					//check up
					if(this.getPlayer(row,col) == this.getPlayer(row-1,col) && this.getPlayer(row,col) == this.getPlayer(row-2,col) && this.getPlayer(row,col) == this.getPlayer(row-3,col) && this.getPlayer(row,col) != ""){
						winner = this.getPlayer(row,col);
						this.gameOver = true;
						return winner;
					}
				}
				if(row <= (this.rows/2) - 1){
					//check down
					if(this.getPlayer(row,col) == this.getPlayer(row+1,col) && this.getPlayer(row,col) == this.getPlayer(row+2,col) && this.getPlayer(row,col) == this.getPlayer(row+3,col) && this.getPlayer(row,col) != ""){
						winner = this.getPlayer(row,col);
						this.gameOver = true;
						return winner;
					}
				}
				if(row <= (this.rows/2) - 1 && col <= this.columns/2){
					//check diag down right
					if(this.getPlayer(row,col) == this.getPlayer(row+1,col+1) && this.getPlayer(row,col) == this.getPlayer(row+2,col+2) && this.getPlayer(row,col) == this.getPlayer(row+3,col+3) && this.getPlayer(row,col) != ""){
						winner = this.getPlayer(row,col);
						this.gameOver = true;
						return winner;
					}
				}
				if(row <= (this.rows/2) - 1 && col >= this.columns/2){
					//check diag down left
					if(this.getPlayer(row,col) == this.getPlayer(row+1,col-1) && this.getPlayer(row,col) == this.getPlayer(row+2,col-2) && this.getPlayer(row,col) == this.getPlayer(row+3,col-3) && this.getPlayer(row,col) != ""){
						winner = this.getPlayer(row,col);
						this.gameOver = true;
						return winner;
					}
				}
/*
				//needed?
				if(){
					//check diag up right
					if(this.getPlayer(row,col) == this.getPlayer(row,col+1) && this.getPlayer(row,col) == this.getPlayer(row,col+2) && this.getPlayer(row,col) == this.getPlayer(row,col+3) && this.getPlayer(row,col) != ""){
						winner = this.getPlayer(row,col);
						this.gameOver = true;
						return winner;
					}
				}
				//needed?
				if(){
					//check diag up left
					if(this.getPlayer(row,col) == this.getPlayer(row,col+1) && this.getPlayer(row,col) == this.getPlayer(row,col+2) && this.getPlayer(row,col) == this.getPlayer(row,col+3) && this.getPlayer(row,col) != ""){
						winner = this.getPlayer(row,col);
						this.gameOver = true;
						return winner;
					}
				}
				*/
				else {
					return ""
				}
			}
		}
		
	},

	/**
		* Makes the move at the give row and column if there is an empty string at that cell.
		* @function
		* @param {number} row - The row of the cell.
		* @param {number} col - The column of the cell.
	*/
	makeMove: function(row,col){
		if (this.isValidMove(row,col)){
			this.board[row][col] = this.playerList[this.currentPlayerIndex];
			this.numOfMoves += 1;
			

			for(var s=0;s< this.changeListeners.length;s++){
				var thisView = this.changeListeners[s];
				thisView.updateView(row, col, this.playerList[this.currentPlayerIndex]);
			}

			/*
			if (this.currentPlayerIndex >= this.playerList.length){ 
				this.currentPlayerIndex = 0;
			}
			*/
			this.currentPlayerIndex = (this.currentPlayerIndex+1)%this.playerList.length;
		}
	},



	/**
		* Checks the cell and returns the string of the player.
		* @function
		* @param {number} row - The row of the cell.
		* @param {number} column - The column of the cell.
	*/
	getPlayer: function(row,col){
		return this.board[row][col];
	},

	/**
		* Resets the game model.
		* @function
		* @param {number} rows - The rows of the table.
		* @param {number} columns - The columns of the table.
	*/
	newGame: function(rows, columns) {
		var newGame = new Model(rows, columns);
	},

	/**
		* Makes a copy of the model and board.
		* @function
		* @param {constructor} board - the model.
	*/
	copyModel: function(model) {
		
		function copyBoard(model) {
			var copy = [];
			for (var i = 0; i < model.rows; i++) {
				var rowsCopy = [];
				copy.push(rowsCopy);
				for (var j = 0; j < model.columns; j++){
					copy[i][j] = model.board[i][j];
				}
			}
			return copy;

		}
		
		var newModel = new Model(model.rows, model.columns);
		newModel.board = copyBoard(model);
		newModel.playerList = model.playerList;
		newModel.gameOver = model.gameOver;
		newModel.changeListeners = model.changeListeners;
		newModel.currentPlayerIndex = model.currentPlayerIndex;
		newModel.numOfMoves = model.numOfMoves;
		return newModel;
	},

	addChangeListeners: function(f){
		this.changeListeners.push(f);
	},

	notify: function(type){
		for (var i = 0; i < this.myChangeListeners.length; i++){
			this.changeListeners[i]({change:type});
		}
	},

};

Model.prototype = modelPrototype;

var m = new Model(6,8);
m.addPlayer("X");
m.addPlayer("O");
//max move is (5,7);
m.board[0][1] = "X";
m.board[0][2] = "X";
m.board[0][3] = "X";
m.board[0][4] = "X";
console.log(m.board);
console.log(m.isDraw());
console.log(m.gameOver);
console.log(m.playerWin());
