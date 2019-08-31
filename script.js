(function () {
  let canvas = document.createElement ('canvas'), // создаем некое поле
  ctx = canvas.getContext ('2d'), // определим наш контекст как 2d
  w = canvas.width = innerWidth, // определим ширину в переменной w = текущей ширине окна просмотра
  h = canvas.height = innerHeight, // определим ширину в переменной h
  particles = [], // массив, тчобы хранить наши частицы
  properties = { // тут будут храниться все свойства частиц
    bgColor: 'rgba(17, 17, 19, 1)',
    particleColor: 'white',
    particleRadius: 1,
    particleCount: 60,
    particleMaxVelocity: 0.5,
    lineLength: 150, // длина соединения
    particleLife: 10 // 6 секунд максимальная продолжительность жизни частички
  };

  document.querySelector('body').appendChild(canvas);

  window.onresize = function () {
    w = canvas.width = innerWidth,
    h = canvas.htight = innerHeight;
  }

  class Particle { // тут задаем скорость частиц, их положение и радиус
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
      this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
      this.life = Math.random() * properties.particleLife * 60;
    }

    position () { // метод, обновляющий позицию
      this.x + this.velocityX > w && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0 ? this.velocityX *= -1 : this.velocityX;
      this.y + this.velocityY > h && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0 ? this.velocityY *= -1 : this.velocityY;
      this.x += this.velocityX;
      this.y += this.velocityY;
    }

    reDraw () { // метод будет отрисовывать наши частицы на canvas
      ctx.beginPath();
      ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI*2);
      ctx.closePath();
      ctx.fillStyle = properties.particleColor;
      ctx.fill();
    }

    reCalculateLife() { // метод, отнимающий жизнь у частички
      if (this.life < 1) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
        this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
        this.life = Math.random() * properties.particleLife * 100;
      }
      this.life--;
    }
  }

  function reDrawBackground () {
    ctx.fillStyle = properties.bgColor;
    ctx.fillRect(0, 0, w, h);
  }

  function drawLines () { // соединяем точки линиями
    let x1, y1, x2, y2, length, opacity;
    for (let i in particles) {
      for (let j in particles) {
        x1 = particles[i].x;
        y1 = particles[i].y;
        x2 = particles[j].x;
        y2 = particles[j].y;
        length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

        if (length < properties.lineLength) {
          opacity = 1 - length / properties.lineLength; // чем меньше расстояние между точками, тем меньше ширина линии

          ctx.lineWidth = '0.05'; // ширина
          ctx.strokeStyle = 'rgba(255, 40, 40, '+opacity+')'; // цвет
          ctx.beginPath();
          ctx.moveTo(x1, y1); // начинаем путь
          ctx.lineTo(x2, y2);
          ctx.closePath(); // закрываем путь
          ctx.stroke(); // отрисовываем это на canvas
        }
      }
    }
  }

  function reDrawParticles () {
    for (let i in particles) {
      particles[i].reCalculateLife();
      particles[i].position();
      particles[i].reDraw();
    }
  }

  function loop () {
    reDrawBackground();
    reDrawParticles();
    drawLines();
    requestAnimationFrame(loop);
  }

  function init () {
    for (let i = 0; i < properties.particleCount; i++) {
      particles.push (new Particle);
    }
    loop();
  }
  init();
})();
