const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7

const background = new Sprite ({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite ({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './img/shop.png' ,
  scale: 2.75,
  framesMax: 6
  
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc:'./img/samuraiMack/Idle.png' , 
  framesMax : 8,
  scale: 2.5,
  offset: {
    x: 215 ,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png' ,
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png' ,
      framesMax: 8 
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png' ,
      framesMax: 2 
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png' ,
      framesMax: 2 
    }
  }
  
})
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue' ,
  
  offset: {
    x: -50,
    y: 0
  }


})

console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  player.update()
  // enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

// player movement

  if (keys.a.pressed && player.lastkey === 'a') {
      player.velocity.x = -5
      player.switchSprite('run')
  } else if (keys.d.pressed && player.lastkey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

// Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
    enemy.velocity.x = -5
} 
    else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
    enemy.velocity.x = 5
}

//detect for collision
  if (
    rectangularCollision ({
        rectangle1: player,
        rectangle2: enemy


    }) &&
    player.isAttacking
    ) {
      player.isAttacking = false
      enemy.health -= 20
      document.querySelector('#EnemyHealth').style.width = enemy.health + "%"
  }
  
  if (
    rectangularCollision ({
        rectangle1: player,
        rectangle2: enemy


    }) &&
    enemy.isAttacking
    ) {
      enemy.isAttacking = false
      player.health -= 20
      document.querySelector('#PlayerHealth').style.width = player.health + "%"
  }
 
 
  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determinerWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener ('keydown', (event) => {
 
  
  
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastkey = 'd'
      break
    case 'a':
      keys.a.pressed = true
      player.lastkey = 'a'
      break
    case 'w':
      player.velocity.y = -20
      break
    case ' ':
      player.attack()  
      break

      //enemy keys
      case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastkey = 'ArrowRight'
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastkey = 'ArrowLeft'
      break
    case 'ArrowUp':
      enemy.velocity.y = -20
      break
      case 'ArrowDown':
      enemy.attack('ArrowDown')
      
      break
  }
  
  
})

window.addEventListener ('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
      

      //enemy keys
      case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
      case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
      
  }
  
  
})