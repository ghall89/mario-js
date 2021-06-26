kaboom({
	global: true,
	fullscreen: true,
	scale: 1,
	debug: true,
	clearColor: [0, 0, 0, 1]
});

loadSprite('coin', './sprites/coin.png');
loadSprite('enemy', './sprites/enemy1.png');
loadSprite('brick', './sprites/block7.png');
loadSprite('block', './sprites/block2.png');
loadSprite('player', './sprites/player.png');
loadSprite('mushroom', './sprites/item.png');
loadSprite('surprise', './sprites/block1.png');
loadSprite('pipe-top-left', './sprites/pipe-top-left.png');
loadSprite('pipe-top-right', './sprites/pipe-top-right.png');
loadSprite('pipe-bottom-left', './sprites/pipe-bottom-left.png');
loadSprite('pipe-bottom-right', './sprites/pipe-bottom-right.png');

scene('game', () => {
	layers(['bg', 'obj', 'ui'], 'obj');

	const map = [
		'                                                ',
		'                                                ',
		'                                                ',
		'                                                ',
		'                                                ',
		'                                                ',
		'                                                ',
		'                                                ',
		'                                                ',
		'===============================  ==============='
	];

	const levelConfig = {
		width: 20,
		height: 20,
		'=': [sprite('brick', solid())]
	};

	const gameLevel = addLevel(map, levelConfig);
});

start('game');
