kaboom({
	global: true,
	fullscreen: true,
	scale: 3,
	debug: true,
	clearColor: [0, 0, 0, 1]
});

const MOVE_SPEED = 120;
const JUMP_FORCE = 400;
const ENEMY_SPEED = 20;

const FALL_DEATH = 400;

let isJumping = false;

loadSprite('coin', './sprites/coin.png');
loadSprite('enemy', './sprites/enemy1.png');
loadSprite('brick', './sprites/block7.png');
loadSprite('block', './sprites/block2.png');
loadSprite('player', './sprites/player.png');
loadSprite('mushroom', './sprites/item.png');
loadSprite('surprise', './sprites/block1.png');
loadSprite('unboxed', './sprites/block2.png');
loadSprite('pipe-top-left', './sprites/pipe-top-left.png');
loadSprite('pipe-top-right', './sprites/pipe-top-right.png');
loadSprite('pipe-bottom-left', './sprites/pipe-bottom-left.png');
loadSprite('pipe-bottom-right', './sprites/pipe-bottom-right.png');

scene('game', ({ score }) => {
	layers(['bg', 'obj', 'ui'], 'obj');

	const map = [
		'                                                ',
		'                                                ',
		'                                                ',
		'                                                ',
		'                                                ',
		'         ====%    *                             ',
		'                                                ',
		'                            -+                  ',
		'                       ^    ()       ^          ',
		'===============================  ==============='
	];

	const levelConfig = {
		width: 20,
		height: 20,
		'=': [sprite('brick'), solid()],
		$: [sprite('coin')],
		'%': [sprite('surprise'), solid(), 'coin-surprise'],
		'*': [sprite('surprise'), solid(), 'mushroom-surprise'],
		'}': [sprite('unboxed'), solid()],
		'-': [sprite('pipe-top-left'), solid(), scale(0.5)],
		'+': [sprite('pipe-top-right'), solid(), scale(0.5)],
		'(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
		')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
		'^': [sprite('enemy'), solid(), 'dangerous'],
		'#': [sprite('mushroom'), solid(), 'mushroom', body()]
	};

	const gameLevel = addLevel(map, levelConfig);

	const scoreLabel = add([
		text(score),
		pos(30, 6),
		layer('ui'),
		{
			value: score
		}
	]);

	add([text('level ' + 'test', pos(4, 6))]);

	function big() {
		let timer = 0;
		let isBig = false;
		return {
			update() {
				if (isBig) {
					timer -= dt();
					if (timer <= 0) {
						this.smallify();
					}
				}
			},
			isBig() {
				return isBig;
			},
			smallify() {
				this.scale = vec2(1, 1);
				timer = 0;
				isBig = false;
			},
			bigify() {
				this.scale = vec2(2);
				timer = time;
				isBig = true;
			}
		};
	}

	action('mushroom', m => {
		m.move(30, 0);
	});

	const player = add([
		sprite('player'),
		solid(),
		pos(30, 0),
		body(),
		big(),
		origin('bot')
	]);

	player.on('headbump', obj => {
		if (obj.is('coin-surprise')) {
			gameLevel.spawn('$', obj.gridPos.sub(0, 1));
			destroy(obj);
			gameLevel.spawn('}', obj.gridPos.sub(0, 0));
		}
		if (obj.is('mushroom-surprise')) {
			gameLevel.spawn('#', obj.gridPos.sub(0, 1));
			destroy(obj);
			gameLevel.spawn('}', obj.gridPos.sub(0, 0));
		}
	});

	player.collides('mushroom', m => {
		destroy(m);
		player.bigify(6);
	});

	player.collides('coin', c => {
		destroy(c);
		scoreLabel.value++;
		scoreLabel.text = scoreLabel.value;
	});

	action('dangerous', d => {
		d.move(-ENEMY_SPEED, 0);
	});

	player.collides('dangerous', d => {
		if (isJumping) {
			destroy(d);
		} else {
			go('lose', { score: scoreLabel.value });
		}
	});

	player.action(() => {
		camPos(player.pos);
		if (player.pos.y >= FALL_DEATH) {
			go('lose', { score: scoreLabel.value });
		}
	});

	keyDown('left', () => {
		player.move(-MOVE_SPEED, 0);
	});
	keyDown('right', () => {
		player.move(MOVE_SPEED, 0);
	});

	player.action(() => {
		if (player.grounded()) {
			isJumping = false;
		}
	});

	keyPress('space', () => {
		if (player.grounded()) {
			isJumping = true;
			player.jump(JUMP_FORCE);
		}
	});
});

scene('lose', ({ score }) => {
	add([text(score, 32), origin('center'), pos(width() / 2, height() / 2)]);
});

start('game', { score: 0 });
