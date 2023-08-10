// Memory Game
// © 2014 Nate Wiley
// License -- MIT
// best in full screen, works on phones/tablets (min height for game is 500px..) enjoy ;)
// Follow me on Codepen

(function () {
    var USER_SCORE = 0

    var token = "d8e4e8cccc9da2788e888d738516b460cc20007347041a4e948e6b131ff6ef87d3822432d8a963b7f955d84768aff79ad1d91dbeda3dbf8ef0e0165a40ddf6aef30a440070c08df677a04e1b517304a84169a98e5b1b2b52e2930b8090b6f16155b224e7d3138dca033cb434a35e062f4857f001b2e05a4dc1a2ae3c97faa4b7"

    function postGameScore(score) {
        fetch('http://localhost:1337/api/player-scores', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                headers: {Authentication: `Bearer ${token}`}
            },
            body: JSON.stringify({
                data: {
                    jid: "memgamefc5c7c6bb30BHIASBFJBADS59537d2d2df@dev.ayoba.me",
                    playerNickname: "Memory Game Player",
                    gameId: "fc862c07-3f24-4064-96b5-01290cd865af",
                    country: "south africa",
                    playerName: '003',
                    "timeInSeconds": 354.67,
                    score: score
                },
                head
            })

        })
    }

    var scoreInterval
    var Memory = {

        init: function (cards) {
            this.$game = $(".game");
            this.$modal = $(".modal");
            this.$overlay = $(".modal-overlay");
            this.$restartButton = $("button.restart");
            this.cardsArray = $.merge(cards, cards);
            this.shuffleCards(this.cardsArray);
            this.setup();
        },

        shuffleCards: function (cardsArray) {
            this.$cards = $(this.shuffle(this.cardsArray));
        },

        setup: function () {
            this.html = this.buildHTML();
            this.$game.html(this.html);
            this.$memoryCards = $(".card");
            this.paused = false;
            this.guess = null;
            this.binding();

            USER_SCORE = 2000
            scoreInterval = setInterval(() => {
                USER_SCORE = USER_SCORE - 1
                scoreEle.innerHTML = USER_SCORE
                if (USER_SCORE < 0) {
                    clearInterval(scoreInterval)
                }
            }, 30)
        },

        binding: function () {
            this.$memoryCards.on("click", this.cardClicked);
            this.$restartButton.on("click", $.proxy(this.reset, this));
        },
        // kinda messy but hey
        cardClicked: function () {
            var _ = Memory;
            var $card = $(this);
            if (!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")) {
                $card.find(".inside").addClass("picked");
                if (!_.guess) {
                    _.guess = $(this).attr("data-id");
                } else if (_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")) {
                    $(".picked").addClass("matched");
                    _.guess = null;
                } else {
                    _.guess = null;
                    _.paused = true;
                    setTimeout(function () {
                        $(".picked").removeClass("picked");
                        Memory.paused = false;
                    }, 600);
                }
                if ($(".matched").length == $(".card").length) {
                    _.win();
                }
            }
        },

        win: function () {
            this.paused = true;
            clearInterval(scoreInterval)
            postGameScore(USER_SCORE)
            setTimeout(function () {
                Memory.showModal();
                Memory.$game.fadeOut();
            }, 1000);
            // getSelfJid()
            // getMsisdn()

        },

        showModal: function () {
            this.$overlay.show();
            this.$modal.fadeIn("slow");
        },

        hideModal: function () {
            this.$overlay.hide();
            this.$modal.hide();
        },

        reset: function () {
            this.hideModal();
            this.shuffleCards(this.cardsArray);
            this.setup();
            this.$game.show("slow");
        },

        // Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
        shuffle: function (array) {
            var counter = array.length, temp, index;
            // While there are elements in the array
            while (counter > 0) {
                // Pick a random index
                index = Math.floor(Math.random() * counter);
                // Decrease counter by 1
                counter--;
                // And swap the last element with it
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        },

        buildHTML: function () {
            var frag = '';
            this.$cards.each(function (k, v) {
                frag += '<div class="card" data-id="' + v.id + '"><div class="inside">\
				<div class="front"><img src="'+ v.img + '"\
				alt="'+ v.name + `" /></div>\
				<div class="back">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-question-lg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14Z"/>
                    </svg>
                </div></div>\
				</div>`;
            });
            return frag;
        }
    };

    var cards = [
        {
            name: "php",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/php-logo_1.png",
            id: 1,
        },
        {
            name: "css3",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/css3-logo.png",
            id: 2
        },
        {
            name: "html5",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/html5-logo.png",
            id: 3
        },
        {
            name: "jquery",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/jquery-logo.png",
            id: 4
        },
        {
            name: "javascript",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/js-logo.png",
            id: 5
        },
        {
            name: "node",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/nodejs-logo.png",
            id: 6
        },
        // {
        // 	name: "photoshop",
        // 	img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/photoshop-logo.png",
        // 	id: 7
        // },
        // {
        // 	name: "python",
        // 	img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/python-logo.png",
        // 	id: 8
        // },
        // {
        // 	name: "rails",
        // 	img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/rails-logo.png",
        // 	id: 9
        // },
        // {
        // 	name: "sass",
        // 	img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/sass-logo.png",
        // 	id: 10
        // },
        // {
        // 	name: "sublime",
        // 	img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/sublime-logo.png",
        // 	id: 11
        // },
        // {
        // 	name: "wordpress",
        // 	img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/wordpress-logo.png",
        // 	id: 12
        // },
    ];

    Memory.init(cards);
    const scoreEle = document.querySelector('#scoreDisplay')


})();