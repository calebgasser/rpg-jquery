//Self closing function. Will not allow people to console log variables. Eddie, I'm looking at you.
(function(){

	//Audio manager object for loading and playing audio.
	var audioManager = {
		theCouncil: new Audio('./assets/audio/10-the-council-of-elrond.mp3'),
		init: function(){
			audioManager.theCouncil.play();
		}
	}

	//All possible characters to choose from and their stats.
	var characters = {
		characterList: [],
		characterByName: function(name){
			for(char in characters.characterList){
				if(characters.characterList[char].name === name){
					return characters.characterList[char];
				}
			}
		},
		createCharacter: function(con, dex, str, int, na, imgURL){
			return {
				constitution: con,
				dexterity: dex,
				strength: str,
				intelligence: int,
				name: na,
				image: imgURL,

			}
		},
		init: function(){
			this.characterList.push(this.createCharacter(10,10,10,10,"Aragorn"));
			this.characterList.push(this.createCharacter(10,10,10,10,"Gimly"));
			this.characterList.push(this.createCharacter(10,10,10,10,"Gandalf"));
			this.characterList.push(this.createCharacter(10,10,10,10,"Legolas"));
		}
	}

	//Manages all things in the game loop.
	var gameManager = {
		init: function(){
			audioManager.init();
			characters.init();
			uiManager.init();
		}
	}

	//For updating jQuery and HTML.
	var uiManager = {
		updateCharacterSelect: function(){
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
		updateCharacterPanel: function(charId){
			var currentChar = characters.characterByName(charId);
			$("#characterCardName").html(currentChar.name);
		},
		init: function(){
			uiManager.update();
		},
		update: function(){
			uiManager.updateCharacterSelect();
		}
	}

	//jQuery on ready.
	$(function(){
		// All game initilization done here.
		gameManager.init();

		//Catch character selection.
		$(".characterSelector").on('click', function(){
			console.log(this.id);
			uiManager.updateCharacterPanel(this.id);
		})
		//For smoke testing, remove once finished.
		$(document).on('click',()=>{
		})
	})

}())