'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScroll.addEventListener('click', function () { // можно как добавлять события, так и убирать их через removeEventListener по таймеру или после первого всплытия
  section1.scrollIntoView({behavior: 'smooth'}); // то же самое можно сделать по координатам элемента, которые можно получить через метод getBoundingClientRext() и параметры left, top, right и т.д.
});


// работает хорошо на пугктаз меню, но для больших конструкций лучше использовать делегирование событий
// document.querySelectorAll('.nav__link').forEach(function(elem) {
//   elem.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   })
// });

// плавная прокрутка с помощью делегирования событий
// можно настроить один обработчик события только для контейнера 
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

// Работа табов
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Лучше вешать оьработчик события на родительский элемент, так как табов может быть много и их перебор перегрузит систему
tabContainer.addEventListener('click', function(e){
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return; // блокирует дальнейшие действия, если нажать контейнер, а не кнопки
  tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  tabsContent.forEach((content) => content.classList.remove('operations__content--active'))
  document
   .querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active');
});

// Добавление полупрозрачности при наведении
// код с повторениями
// nav.addEventListener('mouseover', function(e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     siblings.forEach(el => {
//       if (el !== link) {
//         el.style.opacity = 0.5;
//       }
//     })
//   }
// });

// nav.addEventListener('mouseout', function(e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     siblings.forEach(el => {
//       if (el !== link) {
//         el.style.opacity = 1;
//       }
//     })
//   }
// })


// Добавление полупрозрачности при наведении
const nav = document.querySelector('nav');
function hover(e, opacity) {
    if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    })
  }

}
nav.addEventListener('mouseover', hover.bind(0.5));
nav.addEventListener('mouseout', hover.bind(1));


// Появление меню после прокрутки
function callBack(entries) {
  if (!entries[0].isIntersecting) {
    nav.classList.add('sticky');
  }
  else {
    nav.classList.remove('sticky')
  }
};

const options = {
  // root: null по-умолчанию
  threshold: 0, // 0.1 == 10%, сюда можно передавать массив значений, тогда callback будет срабатывать каждый раз, когда секция входить в данный диапазон
  // 0 сработает только тогда, когда мы полностью покинем первую секцию
  rootMargin: '-90px', // значит, что событие будет срабатывать на 90 пикселей внутри нашего отслеживаемого элемента
};

const observer = new IntersectionObserver(callBack, options);
observer.observe(document.querySelector('header'));

// Всплытие секций
// const allSections = document.querySelectorAll('.section');

// function revealSection(entries, observer) {
//   console.log(entries[0]);
//   if (entries[0].isIntersecting) {
//     entries[0].target.classList.remove('section--hidden');
//     observer.unobserve(entries[0].target);
  
// }}
// const sectionObserver = new IntersectionObserver(revealSection, {treshold: 0.15});
// allSections.forEach(function(section) {
//   sectionObserver.observe(section);
//   section.classList.add('section--hidden')
// });

// Ленивая подгрузка изображений
const images = document.querySelectorAll('img[data-src]');
function loadImg (entries, observer) {
  if (!entries[0].isIntersecting) return;
  entries[0].target.src = entries[0].target.dataset.src;
  entries[0].target.addEventListener('load', function () {
    entries[0].target.classList.remove('lazy-img'); // делаем так,чтобы блюр убираелся только, когда изображение полностью загрузится
  });
  observer.unobserve(entries[0].target)

}
const imgObserver = new IntersectionObserver(loadImg, {threshold:0.15});

images.forEach((img) => {
imgObserver.observe(img);}
)

// Слайдер

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnRight =  document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotsContainer = document.querySelector('.dots');
const maxSlides = slides.length;
let currSlide = 0;


function createDots () {
  slides.forEach(function(_, i) { // _ означает, что нам не нужен первый параметр
    dotsContainer.insertAdjacentHTML('beforeend',
    `
      <button class='dots__dot' data-slide='${i}'></button>
    `
    )
  })
};

function activateDots(slide) {
  document.querySelectorAll('.dots__dot').forEach( function (dot) {
    dot.classList.remove('dots__dot--active')
  });
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};

function goToSlide(slide) {
  slides.forEach( function(s, i) {
    s.style.transform = `translateX(${100 * (i - slide)}%)` // Первый слайд смещается на -100%
  });
}

// Делает изначальное разделение слайдов, чтобы они не лужали друг на друге и создаем точки под каждый слайд
goToSlide(0);
createDots();
activateDots(0);

function nextSlide() {
  if (currSlide === maxSlides -1) {
    currSlide = 0 // сбрасывает на 0 currSlide, когда доходит до конца послед-ти
  }
  else {
    currSlide++; // при нажатии на кнопку currSlide становится сначала 1, потом 2 и т.д.
  };
  goToSlide(currSlide);
  activateDots(currSlide);
}

function prevSlide() {
  if (currSlide === 0) {
    currSlide = maxSlides - 1 // сбрасывает на последний возможный currSlide, когда доходит до начала
  }
  else {
    currSlide--; // при нажатии на кнопку currSlide становится сначала 1, потом 2 и т.д.
  };
  goToSlide(currSlide);
  activateDots(currSlide);
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e){
  if (e.key === 'ArrowRight') {
    nextSlide()
  }
  else if (e.key === 'ArrowLeft') {
    prevSlide()
  }
  
});

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDots(slide);
  }
})