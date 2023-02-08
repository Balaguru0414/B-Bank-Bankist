'use strict';

///////////////////////////////////////
// Modal window

const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const btnUp = document.querySelector('.btn_up');
const time = document.querySelector('.time');

// %%%%%%%%%%%%%%%%%%%%%%%%% | Open Modal | %%%%%%%%%%%%%%%%%%%%%%%%%

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => 
  btn.addEventListener('click', openModal))

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// %%%%%%%%%%%%%%%%%%%%%%%%% | Button up | %%%%%%%%%%%%%%%%%%%%%%%%%

 btnUp.addEventListener('click',function (e) {
  header.scrollIntoView({behavior : 'smooth'})
});

// %%%%%%%%%%%%%%%%%%%%%%%%% | learn more Button scrolling | %%%%%%%%%%%%%%%%%%%%%%%%%

btnScrollTo.addEventListener('click',function (e) {
    section1.scrollIntoView({behavior : 'smooth'})
});

// %%%%%%%%%%%%%%%%%%%%%%%%% | Page Navigation | %%%%%%%%%%%%%%%%%%%%%%%%%

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   // console.log(el);
//   el.addEventListener('click',function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     // console.log(id);
//     document.querySelector(id).scrollIntoView({behavior : 'smooth'})
//   })
// });

// -------------------------------||--------------------------------------

// 1. Add even listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click',function (e) {
  e.preventDefault();

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');                                   // section--1,2,3
    document.querySelector(id).scrollIntoView({behavior : 'smooth'})
  }
});

// %%%%%%%%%%%%%%%%%%%%%%%%% | Tabbed Content | %%%%%%%%%%%%%%%%%%%%%%%%%

// tabs.forEach(t => t.addEventListener('click',() => console.log('TAP')))

// Event Delegation
tabsContainer.addEventListener('click',function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // ----------|Guard Clause|-------------
  // | OLD WAY |

  // if (clicked) {
  //   clicked.classList.add('operations__tab--active');
  // }

  // | MODERN WAY |
  if (!clicked) return; 

  // Remove active Classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'))
  
  // Active tab
  clicked.classList.add('operations__tab--active');
  // console.log(clicked.dataset.tab); 1,2,3

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');    
});

// %%%%%%%%%%%%%%%%%%%%%%%%% | Menu fade animation | %%%%%%%%%%%%%%%%%%%%%%%%%

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  };
};

nav.addEventListener('mouseover',handleHover.bind(0.5));    // function(e,0.5)
nav.addEventListener('mouseout',handleHover.bind(1));       // function(e,1)

// %%%%%%%%%%%%%%%%%%%%%%%%% | Sticky Navigation | %%%%%%%%%%%%%%%%%%%%%%%%%

// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll',function () {
//   // console.log(window.scrollY)
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//     btnUp.classList.remove('hide');
//   } else {
//     nav.classList.remove('sticky');
//     btnUp.classList.add('hide');
//   };
// });

// ---------- Intersecting observer --------

const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry)

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
    btnUp.classList.remove('hide');
  } 
  else {
    nav.classList.remove('sticky');
    btnUp.classList.add('hide');
  }
}

const headerObserver = 
  new IntersectionObserver(stickyNav,{
    root : null,    // viewport
    threshold : 0,
    rootMargin : `-${navHeight}px`,
  });
headerObserver.observe(header);

// %%%%%%%%%%%%%%%%%%%%%%%%% | Reveal Section | %%%%%%%%%%%%%%%%%%%%%%%%%

const allSection = document.querySelectorAll('.section');

const revealSection = function (entries,observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target)
}

const sectionObserver = 
  new IntersectionObserver(revealSection,{
    root : null,
    threshold : 0.15,
})

allSection.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
})

// %%%%%%%%%%%%%%%%%%%%%%%%% | Lazy Photo images | %%%%%%%%%%%%%%%%%%%%%%%%%

const imgTargets = document.querySelectorAll(`img[data-src]`);
// console.log(imgTargets);

const loadImg = function (entries,observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load',function () {
    entry.target.classList.remove('lazy-img');
  })

  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImg,{
  root : null,
  threshold : 0,
  rootMargin : '200px'
})

imgTargets.forEach(img => imgObserver.observe(img));

// %%%%%%%%%%%%%%%%%%%%%%%%% | testimonials | %%%%%%%%%%%%%%%%%%%%%%%%%

// ----- | Slider | -----
const slider = function () {

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';

// ----- | Functions | -----

const createDots = function () {
  slides.forEach(function (_,i) {
    dotContainer.insertAdjacentHTML('beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`);
  });
}

const activeDot = function (slide) {
  document.querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
}

const goToSlide = function (slide) {
  slides.forEach((s,i) => (s.style.transform = 
      `translateX(${100 * (i-slide)}%)`));
}

const init = function () {
  createDots();
  activeDot(0);
  goToSlide(0);
};
init();

// ----- | Next Slide | -----
const nextSlide = function () {
  if (curSlide === maxSlide-1) {
    curSlide = 0;
  } else {
    curSlide++;    
  };
  goToSlide(curSlide);
  activeDot(curSlide);
};

// ----- | previous Slide | -----
const prevSlide = function () { 
  if (curSlide === 0) {
    curSlide = maxSlide -1;
  } else {
    curSlide--;    
  };
  goToSlide(curSlide);
  activeDot(curSlide);
};

// ----- | Event Handle | -----
btnRight.addEventListener('click',nextSlide);
btnLeft.addEventListener('click',prevSlide);

// button move left & Right
document.addEventListener('keydown',function (e) {
  // console.log(e.key);
  if(e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && prevSlide();     // AND operator
});

dotContainer.addEventListener('click',function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const {slide} = e.target.dataset;
    // console.log(slide);
    goToSlide(slide);
    activeDot(slide);
  }
})
  
};
slider();

// %%%%%%%%%%%%%%%%%%%%%%%%% | time | %%%%%%%%%%%%%%%%%%%%%%%%%

setInterval(function () {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2 , '0');
  const min = String(now.getMinutes()).padStart(2 , '0');
  const sec = String(now.getSeconds()).padStart(2 , '0');

  if (hour > 12) {
    time.textContent = `${String(hour - 12).padStart(2 , '0')} : ${min} : ${sec}`;
  } else{
    time.textContent = `${hour} : ${min} : ${sec}`;
  }  
},1000);

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%