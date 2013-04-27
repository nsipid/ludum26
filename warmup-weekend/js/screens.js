var Screens = {};

Screens.debug = function(idx) {
    return 'for (var i=0;i<Screens.homeScreen.actions[' + idx + '].outcomes.length;i++) {Immortal.facts.push(Screens.homeScreen.actions[' + idx + '].outcomes[i]);} console.log( Screens.homeScreen.actions[' + idx + '].done_message );';
};

Screens.homeScreen = {
    coords : {
        x : 0,
        y : 0
    },

    actions : [
        {
            coords : { x : 40, y : 40 }, // at the knife
            radius : 80, // anywhere within 40 of coords
            action : 'Pick up the kitchen knife.', // display on screen
            effect : Screens.debug(0),
            outcomes : ['got_knife'], // what happens if action is taken (this fact becomes true)
            // somewhere in the game log, if 'got_knife', then stop drawing the knife
            done_message : 'You pick up the very sharp kitchen knife.', // display text if action is taken
            prereqs : [], // what must be true for this action to occur
            forbidden : ['got_knife'] // what must not be true for this action to occur
        },

        {
            coords : { x : 200, y : 200 }, // maybe center screen
            radius : 1000, // whole screen
            action : 'Slit your wrists.',
	    effect : Screens.debug(1),
            outcomes : ['respawn'],
            done_message : 'You slit your wrists and bleed out. You die. You awake in your bed.',
            prereqs : ['got_knife'],
            forbidden : []
        },

        {
            coords : { x : 50, y : 160 }, // coords of tub
            radius : 80,
            action : 'Get into the bath tub.',
	    effect : Screens.debug(2),
            outcomes : ['in_bath'],
            done_message : 'You get into the bathtub and fill up the water.',
            prereqs : [],
            forbidden : ['in_bath']
        },

        {
            coords : { x : 50, y : 160 }, // coords of tub
            radius : 0, // because we will move him into the tub on action
            action : 'Plug in toaster and put into the water.',
	    effect : Screens.debug(3),
            outcomes : ['respawn'],
            done_message : 'You drop the toaster in the bath. You are electrocuted. The pain is unbelievable. You die. You awake in your bed.',
            prereqs : ['in_bath', 'got_toaster'],
            forbidden : []
        }
    ],

    objects : [
        {
            name : 'bathtub', // image id not necessary? static object?
            screenCoords : {
                x : 50,
                y : 160
            }
        },

        {
            name : 'knife', // should be img id
            screenCoords : { // when this screen is active, place knife at these screen coords
                x : 40,
                y : 40
            }
        },

        {
            name : 'toaster',
            screenCoords : {
                x : 60,
                y : 40
            }
        }
    ]
}
