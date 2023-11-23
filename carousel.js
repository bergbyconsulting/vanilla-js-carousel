'use strict';

// Constructor arguments
// NAME                TYPE                   DESCRIPTION
// ====================================================================================================
// el                  element                Reference to div that will be transformed into the carousel
// options             array(String)          Array of strings describing carousel controls to be displayed. Pass empty array if using custom buttons. Valid strings: 'previous', 'play', 'next'
// slidesArray         array(Object)          Array of javascript objects to be included in the carousel. Each object should included 'id' with a unique integer starting at 1 and 'el' which points to our HTML element.
// slidesPerView       integer                Number of slides to display in view. Number must be ODD to center slide.
// btnPrev             element                Reference to element to use for custom "Prev" button
// btnNext             element                Reference to element to use for custom "Next" button
// btnPlay             element                Reference to element to use for custom "Play" button

class Carousel {
  constructor(el, options, slides, slidesPerView, btnPrev, btnNext, btnPlay) {
    this.el = el;
    this.options = options;
    this.slides = slides;
    this.slidesPerView = slidesPerView;
    this.btnPrev = btnPrev;
    this.btnNext = btnNext;
    this.btnPlay = btnPlay;
    this.inView = [...Array(slidesPerView).keys()]
    this.container;
    this.playState;
  }

  mount() {
    this.setupCarousel();
  }

  // Build carousel html
  setupCarousel() {
    const container = document.createElement('div');
    const controls = document.createElement('div');

    // Add container for carousel items and controls
    this.el.append(container, controls);
    container.className = 'carousel-container';
    controls.className = 'carousel-controls';

    // Take dataset array and append items to container
    this.slides.forEach((item, index) => {
      const carouselItem = item.el;

      container.append(carouselItem);
      
      // Add item attributes
      carouselItem.className = `carousel-item carousel-item-${index + 1}`;
      // Used to keep track of carousel items
      carouselItem.setAttribute('data-index', `${index + 1}`);
    });

    this.options.forEach((option) => {
      const btn = document.createElement('button');
      const axSpan = document.createElement('span');

      // Add accessibilty spans to button
      axSpan.innerText = option;
      axSpan.className = 'ax-hden';
      btn.append(axSpan);

      // Add button attributes
      btn.className = `carousel-control carousel-control-${option}`;
      btn.setAttribute('data-name', option);

      // Add carousel control options
      controls.append(btn);
    });

    // After rendering carousel to our DOM, setup carousel controls' event listeners
    this.setControls([...controls.children]);

    // Set container property
    this.container = container;
  }

  setControls(controls) {
    controls.forEach(control => {
      control.onclick = (event) => {
        event.preventDefault();

        // Manage control actions, update our carousel data first then with a callback update our DOM
        this.controlManager(control.dataset.name);
      };
    });
  }

  controlManager(control) {
    if (control === 'previous') return this.previous();
    if (control === 'next') return this.next();
    if (control === 'play') return this.play();

    return;
  }

  previous() {
    // Update order of items in data array to be shown in carousel
    this.slides.unshift(this.slides.pop());

    // Push the first item to the end of the array so that the previous item is front and center
    this.inView.push(this.inView.shift());

    // Update all items in view
    this.updateItemsInView();
  }

  next() {
    // Update order of items in data array to be shown in carousel
    this.slides.push(this.slides.shift());

    // Take the last item and add it to the beginning of the array so that the next item is front and center
    this.inView.unshift(this.inView.pop());

    // Update all items in view
    this.updateItemsInView();
  }

  play() {
    const playBtn = document.querySelector('.carousel-control-play');
    const startPlaying = () => this.next();

    if (playBtn.classList.contains('playing')) {
      // Remove class to return to play button state/appearance
      playBtn.classList.remove('playing');

      // Remove setInterval
      clearInterval(this.playState); 
      this.playState = null; 
    } else {
      // Add class to change to pause button state/appearance
      playBtn.classList.add('playing');

      // First run initial next method
      this.next();

      // Use play state prop to store interval ID and run next method on a 1.5 second interval
      this.playState = setInterval(startPlaying, 1500);
    };
  }

  updateItemsInView() {
    // Update the css class for each carousel item in view
    this.inView.forEach((item, index) => {
      this.container.children[index].className = `carousel-item carousel-item-${item}`;
    });

    // Using the total items in view in data array, update content of carousel items in view
    this.slides.slice(0, this.slidesPerView).forEach((data, index) => {
      document.querySelector(`.carousel-item-${index + 1}`).innerHTML = data.innerHTML;
    });
  }

}
