//Self closing function. Will not allow people to console log variables. Eddie, I'm looking at you.
(function(){

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
			console.log(videoManager.videoPlayer);
			videoManager.videoPlayer.attr('src',url);
			videoManager.videoPlayer[0].load();
			videoManager.videoPlayer[0].play();
			videoManager.videoPlayer.on('ended', function(){
				$(this).hide();
				audioManager.theCouncil.play();
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
		characterByName: function(name){
			for(char in characters.characterList){
				if(characters.characterList[char].name === name){
					return characters.characterList[char];
				}
			}
		},
		createCharacter: function(con, dex, str, int, na, imgURL, vidURL){
			return {
				constitution: con,
				dexterity: dex,
				strength: str,
				intelligence: int,
				name: na,
				image: imgURL,
				video: vidURL

			}
		},
		init: function(){
			//Aragorn
			this.characterList.push(this.createCharacter(8,8,8,8,"Aragorn",
				"http://www.councilofelrond.com/albums/album50/C_Aragorn_02.jpg",
				"./assets/video/Aragorn.mp4"));
			//Gimli
			this.characterList.push(this.createCharacter(10,6,10,6,"Gimli",
				"http://www.councilofelrond.com/wp-content/uploads/modules/My_eGallery/gallery/characters/gimli/Figwit12523_18.jpg",
				"./assets/video/Gimli.mp4"));
			//Gandalf
			this.characterList.push(this.createCharacter(4,10,10,10,"Gandalf",
				"http://images6.fanpop.com/image/photos/35100000/Gandalf-the-Grey-Fellowship-of-the-Ring-gandalf-35160265-500-211.jpg",
				"./assets/video/Gandalf.mp4"));
			//Legolas
			this.characterList.push(this.createCharacter(6,10,6,10,"Legolas",
				"http://www.eryn-carantaur.com/legolas_grief2.jpg",
				"./assets/video/Legolas.mp4"));
		}
	}

	//Manages all things in the game loop.
	var gameManager = {
		init: function(){
			audioManager.init();
			videoManager.init();
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
			$("#characterCardCons").html("Constitution: " + currentChar.constitution);
			$("#characterCardDex").html("Dexterity: " + currentChar.dexterity);
			$("#characterCardStr").html("Strength: " + currentChar.strength);
			$("#characterCardInt").html("Intelligence: " + currentChar.intelligence);
			$("#characterCardImg").attr('src', currentChar.image);
			videoManager.playClip(currentChar.video);
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
			uiManager.updateCharacterPanel(this.id);
		})
		//For smoke testing, remove once finished.
		$(document).on('click',()=>{
		})
	})

}())