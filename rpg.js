//Self closing function. Will not allow people to console log variables. Eddie, I'm looking at you.
(function(){

	//This function is global because there is no reason making an object for one function.
	function getRandomIntInclusive(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
	}
		
	//Audio manager object for loading and playing audio.
	var audioManager = {
		allAudio: [],
		backgroundMusic: new Audio('./assets/audio/10-the-council-of-elrond.mp3'),
		winMusic: new Audio('./assets/audio/winmusic.mp3'),
		lossMusic: new Audio('./assets/audio/18-may-it-be.mp3'),
		battleMusic: new Audio('./assets/audio/03-the-riders-of-rohan.mp3'),
		isPlaying: false,
		init: function(){
			this.allAudio.push(this.backgroundMusic);
			this.allAudio.push(this.winMusic);
			this.allAudio.push(this.lossMusic);
			this.allAudio.push(this.battleMusic);
			this.backgroundMusic.play();
		},
		playWinMusic: function(){
			if(!this.isPlaying){
				this.pauseAll();
				this.winMusic.currentTime = 0;
				this.winMusic.play();
				this.isPlaying = true;
			}
		},
		playLossMusic: function(){
			if(!this.isPlaying){
				this.pauseAll();
				this.lossMusic.currentTime = 0;
				this.lossMusic.play();
				this.isPlaying = true;
			}
		},
		playBattleMusic: function(){
			if(!this.isPlaying){
				this.pauseAll();
				this.battleMusic.currentTime = 0;
				this.battleMusic.play();
				this.isPlaying = true;
			}
		},
		playBackgroundMusic: function(){
			if(!this.isPlaying){
				this.pauseAll();
				this.backgroundMusic.play();
				this.isPlaying = true;
			}
		},
		pauseAll: function(){
			for(audio in this.allAudio){
				this.allAudio[audio].pause();
			}
			this.isPlaying = false;
		}
	}

	//Used for loading and managing videos.
	var videoManager = {
		videoPlayer: {},
		//Used to pause background music, play video clip, and resume music.
		playVideoClip: function(url){
			audioManager.pauseAll();
			this.videoPlayer.show();
			this.videoPlayer.attr('src',url);
			this.videoPlayer[0].load();
			this.videoPlayer[0].play();
			this.videoPlayer.on('ended', function(){
				$(this).hide();
				audioManager.playBackgroundMusic();
				$("#characterCardImg").show();
			})
		},
		//Update video properties if needed.
		update: function(){

		},
		//Setup all variables for the videomanager.
		init: function(){
			videoManager.videoPlayer = $("#characterCardVid");
		}
	}

	//All possible characters to choose from and their stats.
	var characters = {
		characterList: [],
		enemiesList: [],
		currentEnemy: {},
		currentCharacter: {},
		//Return the character object by passing in the name.
		characterByName: function(name){
			for(char in this.characterList){
				if(this.characterList[char].name === name){
					return this.characterList[char];
				}
			}
		},
		//Chooses a random enemy from characters.enemiesList
		chooseRandomEnemy: function(){
			this.currentEnemy = this.enemiesList[getRandomIntInclusive(0,this.enemiesList.length-1)];
		},
		//Return the character object by passing in the name.
		enemyByName: function(name){
			for(enemy in this.enemiesList){
				if(this.enemiesList[enemy].name === name){
					return this.enemiesList[enemy];
				}
			}
		},
		//Used to create a character object.
		createCharacter: function(con, dex, str, int, na, imgURL, vidURL, attDex,attStr,attInt){
			this.characterList.push({
				constitution: con,
				dexterity: dex,
				strength: str,
				intelligence: int,
				name: na,
				image: imgURL,
				video: vidURL,
				health: (con * 5),
				attackDex: this.createAttack(attDex,dex),
				attackStr: this.createAttack(attStr,str),
				attackInt: this.createAttack(attInt,int)
			});
		},
		//Used for creating character attacks.
		createAttack: function(nm,pwr){
			return {
				name: nm,
				power: Math.floor(pwr * 1.5)
			}
		},
		// Used to create an enemy object.
		createEnemy: function(hp, str, na, imgURL, vidURL){
			this.enemiesList.push({
				health: hp,
				strength: str,
				name: na,
				image: imgURL,
				video: vidURL

			});
		},
		killCurrentEnemy: function(){
			for(enemy in this.enemiesList){
				if(this.enemiesList[enemy].name === this.currentEnemy.name){
					this.enemiesList.splice(enemy,1);
				}
			}
			if(this.enemiesList.length <= 0){
				gameManager.isGameOver = true;
				gameManager.hasWon = true;
			} else {
				this.chooseRandomEnemy();
			}
		},
		killCurrentCharacter: function(){
			gameManager.isGameOver = true;
			gameManager.hasWon = false;
		},
		//Creates all the character objects and adds them to characters.charactersList
		populateCharacters: function(){
			//Aragorn
			this.createCharacter(10,10,10,10,"Aragorn",
				"http://www.councilofelrond.com/albums/album50/C_Aragorn_02.jpg",
				"./assets/video/Aragorn.mp4",
				"Ranger's Finesse","Anduril's Might","Athelas");
			//Gimli
			this.createCharacter(12,6,12,6,"Gimli",
				"http://www.councilofelrond.com/wp-content/uploads/modules/My_eGallery/gallery/characters/gimli/Figwit12523_18.jpg",
				"./assets/video/Gimli.mp4",
				"Dwarf Toss","Arrrggghh!","Liquored up");
			//Gandalf
			this.createCharacter(6,10,10,14,"Gandalf",
				"http://images6.fanpop.com/image/photos/35100000/Gandalf-the-Grey-Fellowship-of-the-Ring-gandalf-35160265-500-211.jpg",
				"./assets/video/Gandalf.mp4",
				"Foe-Hammer","Staff Bludgen","Maiar Power");
			//Legolas
			this.createCharacter(6,12,6,10,"Legolas",
				"http://www.eryn-carantaur.com/legolas_grief2.jpg",
				"./assets/video/Legolas.mp4",
				"Rapid Fire","Full drawn","Lembas");
		},
		//Creates all the enemy objects and adds them to characters.enemiesList
		populateEnemies: function(){
			//Lurtz
			this.createEnemy(30, 5, "Lurtz",
				"https://vignette1.wikia.nocookie.net/villains/images/d/de/Lurtz_8.png/revision/latest?cb=20141104180627",
				"");
			//Salron
			this.createEnemy(100, 10, "Salron",
				"https://vignette1.wikia.nocookie.net/lotr/images/3/3a/Sauron.jpg/revision/latest?cb=20120620000759",
				"");
		},
		//Initialize the characters variables. 
		init: function(){
			this.populateCharacters();
			this.populateEnemies();
		}
	}

	//Manages all things in the game loop.
	var gameManager = {
		combatLog: [],
		isPlaying: false,
		isGameOver: false,
		hasWon: false,
		//Update the combat log html with the contents of combatLog
		populateCombatLog: function(defaultLength){
			for(var i = 0; i < defaultLength; i++){
				gameManager.combatLog[i] = "-->";
			}
		},
		//Adds a string to the combat log and udpates the html.
		addToLog: function(log){
			this.combatLog.push("-->" + log);
			this.combatLog.shift();
			uiManager.updateCombatLog();
		},
		//Updates basic game state.
		update: function(){
			if(this.isGameOver && this.hasWon){
				uiManager.displayWin();
			} else if(this.isGameOver && !this.hasWon){
				uiManager.displayLoss();
			}
		},
		//Initialize the gameManager variable.
		init: function(){
			gameManager.populateCombatLog(9);
			audioManager.init();
			videoManager.init();
			characters.init();
			uiManager.init();
		}
	}

	//For updating jQuery and HTML.
	var uiManager = {
		updateCharacterSelect: function(){
			$("#characterList").empty();
			for(char in characters.characterList){
				var currentChar = characters.characterList[char];
				var ele = $("<a>");
				ele.href = "#";
				ele.addClass("list-group-item list-group action list-group-item-warning text-center characterSelector");
				ele.html(currentChar.name);
				ele.attr("id", currentChar.name);
				$("#characterList").append(ele);
			}
		},
		updateCharacterPanel: function(){
			$("#attackDex").html(characters.currentCharacter.attackDex.name);
			$("#attackStr").html(characters.currentCharacter.attackStr.name);
			$("#attackInt").html(characters.currentCharacter.attackInt.name);
			$("#characterCardName").html(characters.currentCharacter.name);
			$("#characterCardHP").html("HP: " + characters.currentCharacter.health);
			$("#characterCardCons").html("Constitution: " + characters.currentCharacter.constitution);
			$("#characterCardDex").html("Dexterity: " + characters.currentCharacter.dexterity);
			$("#characterCardStr").html("Strength: " + characters.currentCharacter.strength);
			$("#characterCardInt").html("Intelligence: " + characters.currentCharacter.intelligence);
			if(!gameManager.isPlaying){
				$("#characterCardImg").attr('src', characters.currentCharacter.image).hide();
				videoManager.playVideoClip(characters.currentCharacter.video);
			}
		},
		updateEnemyPanel: function(){
			if(typeof characters.currentEnemy !== 'undefined'){
				$("#enemyCardName").html(characters.currentEnemy.name);
				$("#enemyCardImg").attr('src', characters.currentEnemy.image);
				$("#enemyCardHP").html("HP: " + characters.currentEnemy.health);
				$("#enemyCardStr").html("Strength: " + characters.currentEnemy.strength);
			}
		},
		updateCombatLog: function(){
			$("#combatLog").empty();
			for(var i = gameManager.combatLog.length-1; i > 0; i--){
				$("#combatLog").append(gameManager.combatLog[i] + "<br/>");
			}
		},
		displayWin: function(){
			$(".container").empty();
			$("canvas").hide();
			$(".container").css('color','white');
			$(".container").append("<div class='row text-center'>"+
				"<h1 class='col-12'>You Won!</h1></div>");
			$("body").css('background-image','url(./assets/images/win.gif)');
			audioManager.playWinMusic();
		},
		displayLoss: function(){
			$(".container").empty();
			$("canvas").hide();
			$(".container").css('color','white');
			$(".container").append("<div class='row text-center'>"+
				"<h1 class='col-12'>You Lost :(</h1></div>");
			$("body").css('background-image','url(./assets/images/mordor.gif)');
			audioManager.playLossMusic();
		},
		init: function(){
			uiManager.updateCharacterSelect()
			uiManager.updateCombatLog();
		},
		update: function(){
			uiManager.updateCombatLog();
			uiManager.updateCharacterPanel();
			uiManager.updateEnemyPanel();
			uiManager.updateCombatLog();
		}
	}

	//Generates background particle effects.
	var background = {
		canvas: {},
		ctx: {},
		leaves: [],
		particles: [],
		numOfParticles: 10,
		particleMaxLive: 6000,
		particleMinLive: 3000,

		init: function(){
			background.canvas = document.getElementById('backgroundCanvas');
			background.ctx = background.canvas.getContext('2d');
			background.leaves[0] = new Image();
			background.leaves[0].src = './assets/images/leaves_autum.png';
		},
		update: function(){
			background.particalUpdate();
			background.particalPopulate();
			background.particaleDraw();
		},
		startSimulated: function(amount){
			for(var i = 0; i < amount; i++){
				background.particalUpdate();
				background.particalPopulate();
			}
		},
		createParticle: function(x,y,life){
			return {
				posX: x,
				posY: y,
				lifeTime: life,
				animReset: life/10,
				anim: life/10,
				currentFrame: 0,
				frames: [background.leaves[0]]
			}
		},
		particalUpdate: function(){
			for(var i = 0; i < background.particles.length; i++){
				background.particles[i].lifeTime -= 1;
				background.particles[i].anim -= 1;
				background.particles[i].posY += 1;
				if(background.particles[i].anim <= 0){
					if(background.particles[i].currentFrame >= background.particles[i].frames.length-1){
						background.particles[i].currentFrame = 0;
					} else {
						background.particles[i].currentFrame += 1;
					}
					background.particles[i].anim = background.particles[i].animReset;
				}
				if(background.particles[i].lifeTime <= 0){
					background.particles.splice(i,1);
				}
			}
		},
		particalPopulate: function(){
			if(background.particles.length <= background.numOfParticles){
				for(i = 0; i < background.numOfParticles - background.particles.length; i++){
					var position = background.getRandomPosition();
					background.particles.push(background.createParticle(
						position[0],
						position[1],
						getRandomIntInclusive(background.particleMinLive,background.particleMaxLive)
						));
				}
			}

		},
		particaleDraw: function(){
			background.ctx.clearRect(0, 0, background.canvas.width, background.canvas.height);
			for(var i = 0; i < background.particles.length; i++){
				background.ctx.drawImage(
					background.particles[i].frames[background.particles[i].currentFrame],
					background.particles[i].posX,
					background.particles[i].posY,
					1024,
					1036)
			}
		},
		getRandomPosition: function(){
			return [getRandomIntInclusive(0,background.canvas.width)-500,-1036];
		}
	}

//jQuery on ready.
$(function(){

	//Init background.
	background.init();
	background.startSimulated(5000);
	setInterval(background.update,1000/60);
	// All game initilization done here.
	gameManager.init();

	//Catch character selection.
	$(".characterSelector").on('click', function(){
		if(!gameManager.isPlaying){
			characters.currentCharacter = characters.characterByName(this.id);
			uiManager.update();
		}
	});
	//Catch game start.
	$("#fight").on("click", function(){
		if(!gameManager.isPlaying && characters.currentCharacter.name != null){
			gameManager.isPlaying = true;
			characters.chooseRandomEnemy();
			uiManager.updateEnemyPanel();
			audioManager.playBattleMusic();
		}
	});
	//Dexterity based attack handler
	$("#attackDex").on("click", function(){
		var dexModifier = Math.floor(characters.currentCharacter.attackDex.power/2);
		if(gameManager.isPlaying && !gameManager.isGameOver){
			characters.currentEnemy.health -= characters.currentCharacter.attackDex.power;
			gameManager.addToLog(characters.currentEnemy.name + 
				" took " +
				characters.currentCharacter.attackStr.power +
				" damage!");
			if(characters.currentEnemy.health <= 0){
				gameManager.addToLog(characters.currentEnemy.name + " has been defeated!")
				characters.killCurrentEnemy();
			} else {
				characters.currentCharacter.health -= (characters.currentEnemy.strength - dexModifier);
				gameManager.addToLog(characters.currentCharacter.name +
				" took " +
				(characters.currentEnemy.strength - dexModifier) +
				" damage but avoided " +
				dexModifier + " damage.");
				if(characters.currentCharacter.health <= 0){
					gameManager.addToLog(characters.currentCharacter.name + " had died...");
					characters.killCurrentCharacter();
				}
			}
		}
		uiManager.update();
		gameManager.update();
	});
	//Intelligence based attack handler
	$("#attackInt").on("click", function(){
		var intModifier = Math.floor(characters.currentCharacter.intelligence/1.5);
		if(gameManager.isPlaying && !gameManager.isGameOver){
			characters.currentEnemy.strength += Math.floor(characters.currentEnemy.strength/3);
			gameManager.addToLog(characters.currentEnemy.name + 
				" powered up!");
			if(characters.currentEnemy.health <= 0){
				gameManager.addToLog(characters.currentEnemy.name + " has been defeated!")
				characters.killCurrentEnemy();
			} else {
				characters.currentCharacter.health += intModifier;
				gameManager.addToLog(characters.currentCharacter.name +
				" healed for " +
				intModifier);
				if(characters.currentCharacter.health <= 0){
					gameManager.addToLog(characters.currentCharacter.name + " had died...");
					characters.killCurrentCharacter();
				}
			}
		}
		uiManager.update();
		gameManager.update();
	});
	// //Strength based attack handler
	$("#attackStr").on("click", function(){
		var strModifier = Math.floor(characters.currentCharacter.strength);
		if(gameManager.isPlaying && !gameManager.isGameOver){
			characters.currentEnemy.health -= (characters.currentCharacter.attackStr.power + strModifier);
			gameManager.addToLog(characters.currentCharacter.name + 
				" attacked with all their might and " + 
				characters.currentEnemy.name + 
				" took " +
				(characters.currentCharacter.attackStr.power + strModifier) +
				" damage!");
			if(characters.currentEnemy.health <= 0){
				gameManager.addToLog(characters.currentEnemy.name + " has been defeated!");
				characters.killCurrentEnemy();
			} else {
				characters.currentCharacter.health -= characters.currentEnemy.strength;
				characters.currentCharacter.health -= Math.floor(strModifier/2);
				gameManager.addToLog(characters.currentCharacter.name +
				" took " + 
				characters.currentEnemy.strength +
				" damage and an extra " + 
				Math.floor(strModifier/2) +
				" because they were tired and couldn't defend well.");
				if(characters.currentCharacter.health <= 0){
					gameManager.addToLog(characters.currentCharacter.name + " had died...");
					characters.killCurrentCharacter();
				}
			}
		}
		uiManager.update();
		gameManager.update();
	});
	//For smoke testing, remove once finished.
	$(document).on('click',()=>{
	});
})

}())