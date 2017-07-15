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
		theCouncil: new Audio('./assets/audio/10-the-council-of-elrond.mp3'),
		init: function(){
			audioManager.theCouncil.play();
		}
	}

	var videoManager = {
		videoPlayer: {},
		playClip: function(url){
			audioManager.theCouncil.pause();
			videoManager.videoPlayer.show();
			videoManager.videoPlayer.attr('src',url);
			videoManager.videoPlayer[0].load();
			videoManager.videoPlayer[0].play();
			videoManager.videoPlayer.on('ended', function(){
				$(this).hide();
				audioManager.theCouncil.play();
				$("#characterCardImg").show();
			})
		},
		update: function(){

		},
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
		characterByName: function(name){
			for(char in this.characterList){
				if(this.characterList[char].name === name){
					return this.characterList[char];
				}
			}
		},
		chooseRandomEnemy: function(){
			this.currentEnemy = this.enemiesList[getRandomIntInclusive(0,this.enemiesList.length)];
		},
		enemyByName: function(name){
			for(enemy in this.enemiesList){
				if(this.enemiesList[enemy].name === name){
					return this.enemiesList[enemy];
				}
			}
		},
		createCharacter: function(con, dex, str, int, na, imgURL, vidURL){
			this.characterList.push({
				constitution: con,
				dexterity: dex,
				strength: str,
				intelligence: int,
				name: na,
				image: imgURL,
				video: vidURL,
				health: (con * 2)

			});
		},
		createEnemy: function(hp, str, na, imgURL, vidURL){
			this.enemiesList.push({
				health: hp,
				strength: str,
				name: na,
				image: imgURL,
				video: vidURL

			});
		},

		populateCharacters: function(){
			//Aragorn
			this.createCharacter(8,8,8,8,"Aragorn",
				"http://www.councilofelrond.com/albums/album50/C_Aragorn_02.jpg",
				"./assets/video/Aragorn.mp4");
			//Gimli
			this.createCharacter(10,6,10,6,"Gimli",
				"http://www.councilofelrond.com/wp-content/uploads/modules/My_eGallery/gallery/characters/gimli/Figwit12523_18.jpg",
				"./assets/video/Gimli.mp4");
			//Gandalf
			this.createCharacter(4,10,10,10,"Gandalf",
				"http://images6.fanpop.com/image/photos/35100000/Gandalf-the-Grey-Fellowship-of-the-Ring-gandalf-35160265-500-211.jpg",
				"./assets/video/Gandalf.mp4");
			//Legolas
			this.createCharacter(6,10,6,10,"Legolas",
				"http://www.eryn-carantaur.com/legolas_grief2.jpg",
				"./assets/video/Legolas.mp4");
		},
		populateEnemies: function(){
			//Lurtz
			this.createEnemy(100, 10, "Lurtz",
				"https://vignette1.wikia.nocookie.net/villains/images/d/de/Lurtz_8.png/revision/latest?cb=20141104180627",
				"");
			//Salron
			this.createEnemy(500, 50, "Salron",
				"https://vignette1.wikia.nocookie.net/lotr/images/3/3a/Sauron.jpg/revision/latest?cb=20120620000759",
				"");
		},
		init: function(){
			this.populateCharacters();
			this.populateEnemies();
		}
	}

	//Manages all things in the game loop.
	var gameManager = {
		combatLog: [],
		populaterCombatLog: function(defaultLength){
			for(var i = 0; i < defaultLength; i++){
				gameManager.combatLog[i] = "<p>...</p><br>";
			}
		},
		init: function(){
			gameManager.populaterCombatLog(9);
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
			$("#characterCardName").html(characters.currentCharacter.name);
			$("#characterCardHP").html("HP: " + characters.currentCharacter.health);
			$("#characterCardCons").html("Constitution: " + characters.currentCharacter.constitution);
			$("#characterCardDex").html("Dexterity: " + characters.currentCharacter.dexterity);
			$("#characterCardStr").html("Strength: " + characters.currentCharacter.strength);
			$("#characterCardInt").html("Intelligence: " + characters.currentCharacter.intelligence);
			$("#characterCardImg").attr('src', characters.currentCharacter.image).hide();
			videoManager.playClip(characters.currentCharacter.video);
		},
		updateEnemyPanel: function(){
			$("#enemyCardName").html(characters.currentEnemy.name);
			$("#enemyCardImg").attr('src', characters.currentEnemy.image);
			$("#enemyCardHP").html("HP: " + characters.currentEnemy.health);
			$("#enemyCardStr").html("Strength: " + characters.currentEnemy.strength);
		},
		updateCombatLog: function(){
			$("#combatLog").empty();
			for(log in gameManager.combatLog){
				$("#combatLog").append(gameManager.combatLog[log]);
			}
		},
		init: function(){
			uiManager.updateCharacterSelect()
			uiManager.updateCombatLog();
		},
		update: function(){
			uiManager.updateCombatLog();
			uiManager.updateCharacterPanel();
			uiManager.updateEnemyPanel();
		}
	}

	//jQuery on ready.
	$(function(){
		// All game initilization done here.
		gameManager.init();

		//Catch character selection.
		$(".characterSelector").on('click', function(){
			characters.currentCharacter = characters.characterByName(this.id);
			characters.chooseRandomEnemy();
			uiManager.update();
		})
		//For smoke testing, remove once finished.
		$(document).on('click',()=>{
		})
	})

}())