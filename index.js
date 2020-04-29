

class Game {
    constructor(color, audio, specialAudio, clickRecord, autoRunRecord, level, count=0) {
        this.color = color;
        this.audio = audio;
        this.clickRecord = clickRecord;
        this.autoRunRecord = autoRunRecord;
        this.specialAudio = specialAudio;
        this.level = level;
        this.count = count;

    }

    startEffect() {
        $('#showLevel').hide();
        $(this.color).animate({
            opacity: 0.3
        });
        $(this.color).animate({
            opacity: 1
        });
      
        $('#level-title').hide();
        $(this.color).hide();
        $(this.color).fadeIn(1000, () => {
            $('#level-title').slideDown(1000);

        });
        this.keyDownEffect();
    }

    changeTitile(n) {
        $('#showLevel').slideUp();
        $('#showLevel').slideDown(500, () => {
            document.querySelector('#showLevel').innerHTML = `Level ${n}`;
        });
        //$('#level-title').fadeOut();
    }

    soundPressEffect() {
        let n = this.randomNum();
        this.audio[n].play();
        this.color[n].classList.add('pressed');
        setTimeout(() => {
            this.color[n].classList.remove('pressed');
        }, 200);
        
        this.autoRunRecord.push(n);
    }


    randomNum() {
        return Math.floor(Math.random() * 4);
    }

    autoRun() {
        this.autoRunRecord.push(this.randomNum());
        const playAgain = (position) => {
            if(position < this.autoRunRecord.length) {
                setTimeout(() => {
                    this.audio[this.autoRunRecord[position]].play();
                    this.color[this.autoRunRecord[position]].classList.add('pressed');
                    setTimeout(() => {
                        this.color[this.autoRunRecord[position]].classList.remove('pressed');
                        position++;
                        playAgain(position);
                    }, 300);
                }, 400);                
            }
        }
        playAgain(0);
        
        this.clickRecord = [];
        this.count = 0;
    }


    clickEffect() {
        for(let i = 0; i < this.color.length; i++) {
            this.color[i].addEventListener('click', () => {
                this.audio[i].play();
                this.color[i].classList.add('pressed');
                setTimeout(() => {
                    this.color[i].classList.remove('pressed');
                }, 30);
                this.clickRecord.push(i);
                console.log(`click: ${this.clickRecord}, auto: ${this.autoRunRecord}`);
                this.matchEffect();
            })
        }
    }

    wrongEffect() {
        
        $('#level-title').removeClass('btn-info');
        $('#level-title').addClass('btn-danger');
        $(this.color).animate({
            opacity: 0.5
        });
        $('#level-title').slideDown();
        document.querySelector('#level-title').innerHTML = `Game Over`;
        this.specialAudio.play();
        document.querySelector('body').classList.add('game-over');
        setTimeout(() => {
            document.querySelector('body').classList.remove('game-over');
        }, 100)
        document.addEventListener('keydown', () => {
            location.reload();
        })
        document.querySelector('#level-title').addEventListener('click', ()  => {
            location.reload();
        })  
    }

    rightEffect() {
        // $('#level-title').slideUp('slow');
        // $('#level-title').slideDown('slow', () => {
        //     this.level++;
        //     this.changeTitile(this.level);
        // });
        this.level++;
        this.changeTitile(this.level);
        
        setTimeout(() => {
            this.autoRun();
        }, 500);
    }

    keyDownEffect() { 

        const titleSoundPress = () =>  {
          
            $('#level-title').fadeOut(500, () => {
                this.changeTitile(this.level);
            });
            // $('#level-title').slideDown('slow', () => {
               
                
            // });
            //this.changeTitile(this.level);
            this.soundPressEffect();
            document.removeEventListener('keydown', titleSoundPress);
            document.querySelector('#level-title').removeEventListener('click', titleSoundPress);
            this.clickEffect();
        };
        
        document.addEventListener('keydown', titleSoundPress);
       
        document.querySelector('#level-title').addEventListener('click', titleSoundPress)  
       
    } 

    matchEffect() {
        if(this.clickRecord.length === this.autoRunRecord.length) {
            let clickRecordNum = Number(this.clickRecord.join(''));
            let autoRecordNum = Number(this.autoRunRecord.join(''));
            if(clickRecordNum !== autoRecordNum) {
                this.wrongEffect();
            } else {
                this.rightEffect();
            }
        } else {
            if(this.clickRecord[this.count] !== this.autoRunRecord[this.count]) {
                this.wrongEffect();
            } else {
                this.count++;
            }
        }
    }
}



const greenAudio = new Audio('green.mp3');
const blueAudio = new Audio('blue.mp3');
const redAudio = new Audio('red.mp3');
const yellowAudio = new Audio('yellow.mp3');
const wrongAudio = new Audio('wrong.mp3');

const clickRecordSimon = [];
const autoRecordSimon = [];
let nextLevel = 1;


const colorSimon = document.querySelectorAll('.btnG');//green red yellow blue
const audioSimon = [greenAudio, redAudio, yellowAudio, blueAudio];

const simonGame = new Game(colorSimon, audioSimon, wrongAudio, clickRecordSimon, autoRecordSimon, nextLevel);

simonGame.startEffect();


