
/*
* @license
* Pipeline Theme (c) Groupthought Themes
*
* This file is included for advanced development by
* Shopify Agencies.  Modified versions of the theme 
* code are not supported by Shopify or Groupthought.
*
* In order to use this file you will need to change 
* theme.js to theme.dev.js in /layout/theme.liquid
*
*/

(function (FlickityFade, bodyScrollLock, AOS, Flickity, Sqrl, MicroModal, Rellax, themeCurrency, axios, themeAddresses, FlickitySync) {
  'use strict';

  function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var Sqrl__namespace = /*#__PURE__*/_interopNamespaceDefault(Sqrl);

  window.theme = window.theme || {};

  window.theme.sizes = {
    small: 480,
    medium: 768,
    large: 1100,
    widescreen: 1400,
  };

  window.theme.keyboardKeys = {
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    LEFTARROW: 37,
    RIGHTARROW: 39,
  };

  function moveModals(container) {
    const modals = container.querySelectorAll('[data-modal]');
    const modalBin = document.querySelector('[data-modal-container]');
    modals.forEach((element) => {
      const alreadyAdded = modalBin.querySelector(`[id="${element.id}"]`);
      if (!alreadyAdded) {
        modalBin.appendChild(element);
      }
    });
  }

  function floatLabels(container) {
    const floats = container.querySelectorAll('.float__wrapper');
    floats.forEach((element) => {
      const label = element.querySelector('label');
      const input = element.querySelector('input, textarea');
      if (label) {
        input.addEventListener('keyup', (event) => {
          if (event.target.value !== '') {
            label.classList.add('label--float');
          } else {
            label.classList.remove('label--float');
          }
        });
      }
      if (input && input.value && input.value.length) {
        label.classList.add('label--float');
      }
    });
  }

  function errorTabIndex(container) {
    const errata = container.querySelectorAll('.errors');
    errata.forEach((element) => {
      element.setAttribute('tabindex', '0');
      element.setAttribute('aria-live', 'assertive');
      element.setAttribute('role', 'alert');
    });
  }

  function lazyPostLoad(container) {
    document.addEventListener('theme:resize', loadDesktop.bind(null, container));
    loadDesktop(container);
  }

  function loadDesktop(container) {
    if (window.innerWidth > window.theme.sizes.small) {
      setTimeout(() => {
        const elements = container.querySelectorAll('.lazypostload-desktop');
        elements.forEach((element) => {
          element.style.visibility = 'visible';
        });
      }, 2000);
    }
  }

  function readHeights() {
    const h = {};
    h.windowHeight = window.innerHeight;
    h.announcementHeight = getHeight('#shopify-section-announcement');
    h.footerHeight = getHeight('[data-section-type*="footer"]');
    h.menuHeight = getHeight('[data-header-height]');
    h.headerHeight = h.menuHeight + h.announcementHeight;
    h.logoHeight = getFooterLogoWithPadding();
    h.stickyHeader = document.querySelector('[data-header-sticky="sticky"]') ? h.menuHeight : 0;
    h.backfillHeight = getHeight('[data-header-backfill]');

    return h;
  }

  function setVarsOnResize() {
    document.addEventListener('theme:resize', resizeVars);
    setVars();
  }

  function setVars() {
    const {windowHeight, announcementHeight, headerHeight, logoHeight, menuHeight, footerHeight, stickyHeader, backfillHeight} = readHeights();

    document.documentElement.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`);

    document.documentElement.style.setProperty('--footer-logo', `${logoHeight}px`);
    document.documentElement.style.setProperty('--full-screen', `${windowHeight}px`);
    document.documentElement.style.setProperty('--three-quarters', `${windowHeight * 0.75}px`);
    document.documentElement.style.setProperty('--two-thirds', `${windowHeight * 0.66}px`);
    document.documentElement.style.setProperty('--one-half', `${windowHeight * 0.5}px`);
    document.documentElement.style.setProperty('--one-third', `${windowHeight * 0.33}px`);
    document.documentElement.style.setProperty('--one-fifth', `${windowHeight * 0.2}px`);
    document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`);
    document.documentElement.style.setProperty('--announcement-height', `${announcementHeight}px`);
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    document.documentElement.style.setProperty('--content-full', `${windowHeight - headerHeight - logoHeight / 2}px`);

    document.documentElement.style.setProperty('--menu-height-sticky', `${stickyHeader}px`);

    // if backfill estimation is within 1px rounded, don't force a layout shift
    let newBackfill = Math.abs(backfillHeight - menuHeight) > 1 ? `${menuHeight}px` : 'auto';
    document.documentElement.style.setProperty('--menu-backfill-height', newBackfill);
  }

  function resizeVars() {
    // restrict the heights that are changed on resize to avoid iOS jump when URL bar is shown and hidden
    const {windowHeight, announcementHeight, headerHeight, logoHeight, menuHeight, footerHeight, stickyHeader, backfillHeight} = readHeights();

    document.documentElement.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`);

    document.documentElement.style.setProperty('--full-screen', `${windowHeight}px`);
    document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`);
    document.documentElement.style.setProperty('--announcement-height', `${announcementHeight}px`);
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    document.documentElement.style.setProperty('--content-full', `${windowHeight - headerHeight - logoHeight / 2}px`);

    document.documentElement.style.setProperty('--menu-height-sticky', `${stickyHeader}px`);

    // if backfill estimation is within 1px rounded, don't force a layout shift
    let newBackfill = Math.abs(backfillHeight - menuHeight) > 1 ? `${menuHeight}px` : 'auto';
    document.documentElement.style.setProperty('--menu-backfill-height', newBackfill);
  }

  function getHeight(selector) {
    const el = document.querySelector(selector);
    if (el) {
      return el.clientHeight;
    } else {
      return 0;
    }
  }

  function getFooterLogoWithPadding() {
    const height = getHeight('[data-footer-logo]');
    if (height > 0) {
      return height + 20;
    } else {
      return 0;
    }
  }

  function getScrollbarWidth() {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  }

  function singles(frame, wrappers) {
    // sets the height of any frame passed in with the
    // tallest js-overflow-content as well as any image in that frame
    let padding = 64;
    let tallest = 0;

    wrappers.forEach((wrap) => {
      if (wrap.offsetHeight > tallest) {
        const getMarginTop = parseInt(window.getComputedStyle(wrap).marginTop);
        const getMarginBottom = parseInt(window.getComputedStyle(wrap).marginBottom);
        const getMargin = getMarginTop + getMarginBottom;
        if (getMargin > padding) {
          padding = getMargin;
        }

        tallest = wrap.offsetHeight;
      }
    });
    const images = frame.querySelectorAll('[data-overflow-background]');
    const frames = [frame, ...images];
    frames.forEach((el) => {
      el.style.setProperty('min-height', `calc(${tallest + padding}px + var(--menu-height))`);
    });
  }

  function doubles(section) {
    let footerLogoH = document.querySelector('[data-footer-logo]') ? document.querySelector('[data-footer-logo]').clientHeight + 20 : 0;
    const lastSection = document.querySelector('#MainContent .shopify-section:last-child [data-section-id]');
    const lastSectionAttrID = lastSection ? lastSection.getAttribute('data-section-id') : null;

    if ((lastSectionAttrID !== null && section.getAttribute('data-section-id') !== lastSectionAttrID) || !lastSection) {
      footerLogoH = 0;
    }

    if (window.innerWidth < window.theme.sizes.medium) {
      // if we are below the small breakpoint, the double section acts like two independent
      // single frames
      let singleFrames = section.querySelectorAll('[data-overflow-frame]');
      singleFrames.forEach((singleframe) => {
        const wrappers = singleframe.querySelectorAll('[data-overflow-content]');
        singles(singleframe, wrappers);
      });
      return;
    }

    // Javascript can't execute calc() (from `--outer` variable) - create a new div with width property instead `getPropertyValue('--outer')`
    const htmlObject = document.createElement('div');
    section.prepend(htmlObject);
    htmlObject.style.display = 'none';
    htmlObject.style.width = getComputedStyle(section).getPropertyValue('--outer');
    const padding = parseInt(getComputedStyle(htmlObject).getPropertyValue('width')) * 2;
    section.firstChild.remove();
    let tallest = 0;

    const frames = section.querySelectorAll('[data-overflow-frame]');
    const contentWrappers = section.querySelectorAll('[data-overflow-content]');
    contentWrappers.forEach((content) => {
      if (content.offsetHeight > tallest) {
        tallest = content.offsetHeight;
      }
    });
    const images = section.querySelectorAll('[data-overflow-background]');
    let applySizes = [...frames, ...images];
    applySizes.forEach((el) => {
      el.style.setProperty('min-height', `${tallest + padding}px`);
    });
    section.style.setProperty('min-height', `${tallest + padding + 2 + footerLogoH}px`);
  }

  function preventOverflow(container) {
    const singleFrames = container.querySelectorAll('.js-overflow-container');
    if (singleFrames) {
      singleFrames.forEach((frame) => {
        const wrappers = frame.querySelectorAll('.js-overflow-content');
        singles(frame, wrappers);
        document.addEventListener('theme:resize', () => {
          singles(frame, wrappers);
        });
      });

      // Reload slides if container has slideshow
      const slideshows = container.querySelectorAll('[data-slideshow-wrapper]');

      if (slideshows.length) {
        slideshows.forEach((slideshow) => {
          const slideshowInstance = FlickityFade.data(slideshow);
          if (typeof slideshowInstance !== 'undefined') {
            slideshowInstance.reloadCells();
          }
        });
      }
    }

    const doubleSections = container.querySelectorAll('[data-overflow-wrapper]');
    if (doubleSections) {
      doubleSections.forEach((section) => {
        doubles(section);
        document.addEventListener('theme:resize', () => {
          doubles(section);
        });
      });
    }
  }

  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  let lastWindowWidth = window.innerWidth;
  let lastWindowHeight = window.innerHeight;

  function dispatch$1() {
    document.dispatchEvent(
      new CustomEvent('theme:resize', {
        bubbles: true,
      })
    );

    if (lastWindowWidth !== window.innerWidth) {
      document.dispatchEvent(
        new CustomEvent('theme:resize:width', {
          bubbles: true,
        })
      );

      lastWindowWidth = window.innerWidth;
    }

    if (lastWindowHeight !== window.innerHeight) {
      document.dispatchEvent(
        new CustomEvent('theme:resize:height', {
          bubbles: true,
        })
      );

      lastWindowHeight = window.innerHeight;
    }
  }

  function resizeListener() {
    window.addEventListener(
      'resize',
      debounce(function () {
        dispatch$1();
      }, 50)
    );
  }

  let prev = window.pageYOffset;
  let up = null;
  let down = null;
  let wasUp = null;
  let wasDown = null;
  let scrollLockTimeout = 0;

  function dispatch() {
    const position = window.pageYOffset;
    if (position > prev) {
      down = true;
      up = false;
    } else if (position < prev) {
      down = false;
      up = true;
    } else {
      up = null;
      down = null;
    }
    prev = position;
    document.dispatchEvent(
      new CustomEvent('theme:scroll', {
        detail: {
          up,
          down,
          position,
        },
        bubbles: false,
      })
    );
    if (up && !wasUp) {
      document.dispatchEvent(
        new CustomEvent('theme:scroll:up', {
          detail: {position},
          bubbles: false,
        })
      );
    }
    if (down && !wasDown) {
      document.dispatchEvent(
        new CustomEvent('theme:scroll:down', {
          detail: {position},
          bubbles: false,
        })
      );
    }
    wasDown = down;
    wasUp = up;
  }

  function lock(e) {
    let element = e.target;
    if (e.detail && e.detail instanceof Element) {
      element = e.detail;
    }
    bodyScrollLock.disableBodyScroll(element);
    document.documentElement.setAttribute('data-scroll-locked', '');
  }

  function unlock() {
    // Prevent body scroll lock race conditions
    scrollLockTimeout = setTimeout(() => {
      document.body.removeAttribute('data-drawer-closing');
    }, 20);

    if (document.body.hasAttribute('data-drawer-closing')) {
      document.body.removeAttribute('data-drawer-closing');

      if (scrollLockTimeout) {
        clearTimeout(scrollLockTimeout);
      }

      return;
    } else {
      document.body.setAttribute('data-drawer-closing', '');
    }

    document.documentElement.removeAttribute('data-scroll-locked');
    bodyScrollLock.clearAllBodyScrollLocks();
  }

  function scrollListener() {
    let timeout;
    window.addEventListener(
      'scroll',
      function () {
        if (timeout) {
          window.cancelAnimationFrame(timeout);
        }
        timeout = window.requestAnimationFrame(function () {
          dispatch();
        });
      },
      {passive: true}
    );

    window.addEventListener('theme:scroll:lock', lock);
    window.addEventListener('theme:scroll:unlock', unlock);
  }

  resizeListener();
  scrollListener();

  window.addEventListener('load', () => {
    setVarsOnResize();
    floatLabels(document);
    errorTabIndex(document);
    moveModals(document);
    preventOverflow(document);
    lazyPostLoad(document);
    if (window.theme.settings.animate_scroll) {
      AOS.refresh();
    }
  });

  document.addEventListener('shopify:section:load', (e) => {
    const container = e.target;
    floatLabels(container);
    errorTabIndex(container);
    moveModals(container);
    preventOverflow(container);
    lazyPostLoad(container);
    if (window.theme.settings.animate_scroll) {
      AOS.refresh();
    }
  });

  document.addEventListener('shopify:section:reorder', () => {
    document.dispatchEvent(new CustomEvent('theme:header:check', {bubbles: false}));
  });

  const showElement = (elem, removeProp = false, prop = 'block') => {
    if (elem) {
      if (removeProp) {
        elem.style.removeProperty('display');
      } else {
        elem.style.display = prop;
      }
    }
  };

  function FetchError(object) {
    this.status = object.status || null;
    this.headers = object.headers || null;
    this.json = object.json || null;
    this.body = object.body || null;
  }
  FetchError.prototype = Error.prototype;

  const selectors$13 = {
    scrollbar: 'data-scrollbar-slider',
    scrollbarArrowPrev: '[data-scrollbar-arrow-prev]',
    scrollbarArrowNext: '[data-scrollbar-arrow-next]',
  };

  const classes$G = {
    hidden: 'is-hidden',
  };

  const times$3 = {
    delay: 200,
  };

  class NativeScrollbar {
    constructor(scrollbar) {
      this.scrollbar = scrollbar;

      this.arrowNext = this.scrollbar.parentNode.querySelector(selectors$13.scrollbarArrowNext);
      this.arrowPrev = this.scrollbar.parentNode.querySelector(selectors$13.scrollbarArrowPrev);

      this.init();
      this.resize();

      if (this.scrollbar.hasAttribute(selectors$13.scrollbar)) {
        this.scrollToVisibleElement();
      }
    }

    init() {
      if (this.arrowNext && this.arrowPrev) {
        if (window.isRTL) {
          this.togglePrevArrow();
        } else {
          this.toggleNextArrow();
        }

        this.events();
      }
    }

    resize() {
      document.addEventListener('theme:resize', () => {
        if (window.isRTL) {
          this.togglePrevArrow();
        } else {
          this.toggleNextArrow();
        }
      });
    }

    events() {
      this.arrowNext.addEventListener('click', (event) => {
        event.preventDefault();

        this.goToNext();
      });

      this.arrowPrev.addEventListener('click', (event) => {
        event.preventDefault();

        this.goToPrev();
      });

      this.scrollbar.addEventListener('scroll', () => {
        this.togglePrevArrow();
        this.toggleNextArrow();
      });
    }

    goToNext() {
      const position = this.scrollbar.getBoundingClientRect().width / 2 + this.scrollbar.scrollLeft;

      this.move(position);

      this.arrowPrev.classList.remove(classes$G.hidden);

      this.toggleNextArrow();
    }

    goToPrev() {
      const position = this.scrollbar.scrollLeft - this.scrollbar.getBoundingClientRect().width / 2;

      this.move(position);

      this.arrowNext.classList.remove(classes$G.hidden);

      this.togglePrevArrow();
    }

    toggleNextArrow() {
      setTimeout(() => {
        if (window.isRTL) {
          this.arrowNext.classList.toggle(classes$G.hidden, this.scrollbar.scrollLeft === 0);
        } else {
          this.arrowNext.classList.toggle(classes$G.hidden, Math.round(this.scrollbar.scrollLeft + this.scrollbar.getBoundingClientRect().width + 1) >= this.scrollbar.scrollWidth);
        }
      }, times$3.delay);
    }

    togglePrevArrow() {
      setTimeout(() => {
        if (window.isRTL) {
          this.arrowPrev.classList.toggle(classes$G.hidden, Math.abs(this.scrollbar.scrollLeft) + this.scrollbar.getBoundingClientRect().width + 1 >= this.scrollbar.scrollWidth);
        } else {
          this.arrowPrev.classList.toggle(classes$G.hidden, this.scrollbar.scrollLeft <= 0);
        }
      }, times$3.delay);
    }

    scrollToVisibleElement() {
      [].forEach.call(this.scrollbar.children, (element) => {
        element.addEventListener('click', (event) => {
          if (
            event.target.tagName.toLowerCase() === 'a' ||
            (event.currentTarget && event.currentTarget.tagName.toLowerCase() === 'a') ||
            (event.currentTarget && event.currentTarget.querySelector('a'))
          ) {
            event.preventDefault();
          }

          this.move(element.offsetLeft - element.clientWidth);
        });
      });
    }

    move(offsetLeft) {
      this.scrollbar.scrollTo({
        top: 0,
        left: offsetLeft,
        behavior: 'smooth',
      });
    }
  }

  const selectors$12 = {
    siblingsInnerHolder: '[data-sibling-inner]',
  };

  class Siblings {
    constructor(holder) {
      this.siblings = holder.querySelectorAll(selectors$12.siblingsInnerHolder);

      this.init();
    }

    init() {
      this.siblings.forEach((sibling) => {
        new NativeScrollbar(sibling);
      });
    }
  }

  const siblings = {
    onLoad() {
      new Siblings(this.container);
    },
  };

  const cookieDefaultValues = {
    expires: 7,
    path: '/',
    domain: window.location.hostname,
  };

  class Cookies {
    constructor(options = {}) {
      this.options = {
        ...cookieDefaultValues,
        ...options,
      };
    }

    /**
     * Write cookie
     * @param value - String
     */
    write(value) {
      document.cookie = `${this.options.name}=${value}; expires=${this.options.expires}; path=${this.options.path}; domain=${this.options.domain}`;
    }

    /**
     * Read cookies and returns an array of values
     * @returns Array
     */
    read() {
      let cookieValuesArr = [];
      const hasCookieWithThisName = document.cookie.split('; ').find((row) => row.startsWith(this.options.name));

      if (document.cookie.indexOf('; ') !== -1 && hasCookieWithThisName) {
        const cookieValue = document.cookie
          .split('; ')
          .find((row) => row.startsWith(this.options.name))
          .split('=')[1];

        if (cookieValue !== null) {
          cookieValuesArr = cookieValue.split(',');
        }
      }

      return cookieValuesArr;
    }

    destroy() {
      document.cookie = `${this.options.name}=null; expires=${this.options.expires}; path=${this.options.path}; domain=${this.options.domain}`;
    }

    remove(removedValue) {
      const cookieValue = this.read();
      const position = cookieValue.indexOf(removedValue);

      if (position !== -1) {
        cookieValue.splice(position, 1);
        this.write(cookieValue);
      }
    }
  }

  const config = {
    howManyToShow: 4,
    howManyToStoreInMemory: 10,
    wrapper: '[data-recently-viewed-products]',
    limit: 'data-limit',
    recentTabLink: '[data-recent-link-tab]',
    recentWrapper: '[data-recent-wrapper]',
    recentViewedTab: '[data-recently-viewed-tab]',
    tabsHolderScroll: '[data-tabs-holder-scroll]',
    apiContent: '[data-api-content]',
    dataMinimum: 'data-minimum',
  };

  const classes$F = {
    hide: 'hide',
    containerWithoutTabsNav: 'section-without-title--skip',
  };

  const cookieConfig = {
    expires: 90,
    name: 'shopify_recently_viewed',
  };

  const sections$r = [];
  const excludedHandles = [];

  class RecentProducts {
    constructor(section) {
      this.container = section.container;
      this.cookie = new Cookies(cookieConfig);
      this.wrapper = this.container.querySelector(config.wrapper);

      if (this.wrapper === null) {
        return;
      }

      this.howManyToShow = parseInt(this.container.querySelector(config.recentWrapper).getAttribute(config.limit)) || config.howManyToShow;
      this.minimum = parseInt(this.container.querySelector(config.recentWrapper).getAttribute(config.dataMinimum));

      this.recentViewedTab = this.container.querySelector(config.recentViewedTab);
      this.recentViewedLink = this.container.querySelector(config.recentTabLink);
      this.tabsHolderScroll = this.container.querySelector(config.tabsHolderScroll);

      this.renderProducts();
    }

    renderProducts() {
      const recentlyViewedHandlesArray = this.cookie.read();
      const arrayURLs = [];
      let counter = 0;

      if (recentlyViewedHandlesArray.length > 0) {
        for (let index = 0; index < recentlyViewedHandlesArray.length; index++) {
          const handle = recentlyViewedHandlesArray[index];

          if (excludedHandles.includes(handle)) {
            continue;
          }

          const url = `${window.theme.routes.root_url}products/${handle}?section_id=api-product-grid-item`;

          arrayURLs.push(url);

          counter++;

          if (counter === this.howManyToShow || counter === recentlyViewedHandlesArray.length - 1) {
            break;
          }
        }

        if (arrayURLs.length > 0 && arrayURLs.length >= this.minimum) {
          this.container.classList.remove(classes$F.hide);

          if (this.recentViewedLink && this.recentViewedLink.previousElementSibling) {
            this.tabsHolderScroll.classList.remove(classes$F.hide);
            this.container.classList.add(classes$F.containerWithoutTabsNav);
          }

          const fecthRequests = arrayURLs.map((url) => fetch(url, {mode: 'no-cors'}).then(this.handleErrors));
          const productMarkups = [];

          Promise.allSettled(fecthRequests)
            .then((responses) => {
              return Promise.all(
                responses.map(async (response) => {
                  if (response.status === 'fulfilled') {
                    productMarkups.push(await response.value.text());
                  }
                })
              );
            })
            .then(() => {
              productMarkups.forEach((markup) => {
                const buffer = document.createElement('div');
                const slide = document.createElement('div');
                buffer.innerHTML = markup;

                slide.classList.add('product-grid-slide');
                slide.setAttribute('data-carousel-slide', null);
                slide.setAttribute('data-item', null);
                slide.innerHTML = buffer.querySelector(config.apiContent).innerHTML;

                this.wrapper.appendChild(slide);
              });

              new Siblings(this.container);
            })
            .then(() => {
              showElement(this.wrapper, true);

              this.container.dispatchEvent(new CustomEvent('theme:recent-products:added', {bubbles: true}));
            });
        } else if (this.recentViewedTab) {
          const hasSiblingTabs =
            Array.prototype.filter.call(this.recentViewedTab.parentNode.children, (child) => {
              return child !== this.recentViewedTab;
            }).length > 1;

          if (this.recentViewedLink && this.recentViewedLink.previousElementSibling) {
            this.tabsHolderScroll.classList.add(classes$F.hide);
            this.container.classList.remove(classes$F.containerWithoutTabsNav);
          }

          if (!hasSiblingTabs) {
            this.container.classList.add(classes$F.hide);
          }
        } else {
          this.container.classList.add(classes$F.hide);
        }
      }
    }

    handleErrors(response) {
      if (!response.ok) {
        return response.text().then(function (text) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            text: text,
          });
          throw e;
        });
      }
      return response;
    }
  }

  class RecordRecentlyViewed {
    constructor(handle) {
      this.handle = handle;
      this.cookie = new Cookies(cookieConfig);

      if (typeof this.handle === 'undefined') {
        return;
      }

      excludedHandles.push(this.handle);

      this.updateCookie();
    }

    updateCookie() {
      let recentlyViewed = this.cookie.read();

      // In what position is that product in memory.
      const position = recentlyViewed.indexOf(this.handle);

      // If not in memory.
      if (position === -1) {
        // Add product at the start of the list.
        recentlyViewed.unshift(this.handle);
        // Only keep what we need.
        recentlyViewed = recentlyViewed.splice(0, config.howManyToStoreInMemory);
      } else {
        // Remove the product and place it at start of list.
        recentlyViewed.splice(position, 1);
        recentlyViewed.unshift(this.handle);
      }

      // Update cookie.
      this.cookie.write(recentlyViewed);
    }
  }

  const recentProducts = {
    onLoad() {
      sections$r[this.id] = new RecentProducts(this);
    },
  };

  /**
   * Image Helper Functions
   * -----------------------------------------------------------------------------
   * https://github.com/Shopify/slate.git.
   *
   */

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (typeof src === 'undefined' || src === null) {
      src = window.theme.assets.noImage;
    }

    if (size === 'master') {
      return removeProtocol(src);
    }

    const match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif|webp)(\?v=\d+)?$/i);

    if (match) {
      const prefix = src.split(match[0]);
      const suffix = match[0];

      return removeProtocol(`${prefix[0]}_${size}${suffix}`);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  function Listeners() {
    this.entries = [];
  }

  Listeners.prototype.add = function (element, event, fn) {
    this.entries.push({element: element, event: event, fn: fn});
    element.addEventListener(event, fn);
  };

  Listeners.prototype.removeAll = function () {
    this.entries = this.entries.filter(function (listener) {
      listener.element.removeEventListener(listener.event, listener.fn);
      return false;
    });
  };

  /**
   * Find a match in the project JSON (using a ID number) and return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Number} value Accepts Number (e.g. 6908023078973)
   * @returns {Object} The variant object once a match has been successful. Otherwise null will be return
   */

  /**
   * Convert the Object (with 'name' and 'value' keys) into an Array of values, then find a match & return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Object} collection Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
   * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
   */
  function getVariantFromSerializedArray(product, collection) {
    _validateProductStructure(product);

    // If value is an array of options
    var optionArray = _createOptionArrayFromOptionCollection(product, collection);
    return getVariantFromOptionArray(product, optionArray);
  }

  /**
   * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Array} options List of submitted values (e.g. ['36', 'Black'])
   * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
   */
  function getVariantFromOptionArray(product, options) {
    _validateProductStructure(product);
    _validateOptionsArray(options);

    var result = product.variants.filter(function (variant) {
      return options.every(function (option, index) {
        return variant.options[index] === option;
      });
    });

    return result[0] || null;
  }

  /**
   * Creates an array of selected options from the object
   * Loops through the project.options and check if the "option name" exist (product.options.name) and matches the target
   * @param {Object} product Product JSON object
   * @param {Array} collection Array of object (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
   * @returns {Array} The result of the matched values. (e.g. ['36', 'Black'])
   */
  function _createOptionArrayFromOptionCollection(product, collection) {
    _validateProductStructure(product);
    _validateSerializedArray(collection);

    var optionArray = [];

    collection.forEach(function (option) {
      for (var i = 0; i < product.options.length; i++) {
        var name = product.options[i].name || product.options[i];
        if (name.toLowerCase() === option.name.toLowerCase()) {
          optionArray[i] = option.value;
          break;
        }
      }
    });

    return optionArray;
  }

  /**
   * Check if the product data is a valid JS object
   * Error will be thrown if type is invalid
   * @param {object} product Product JSON object
   */
  function _validateProductStructure(product) {
    if (typeof product !== 'object') {
      throw new TypeError(product + ' is not an object.');
    }

    if (Object.keys(product).length === 0 && product.constructor === Object) {
      throw new Error(product + ' is empty.');
    }
  }

  /**
   * Validate the structure of the array
   * It must be formatted like jQuery's serializeArray()
   * @param {Array} collection Array of object [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }]
   */
  function _validateSerializedArray(collection) {
    if (!Array.isArray(collection)) {
      throw new TypeError(collection + ' is not an array.');
    }

    if (collection.length === 0) {
      throw new Error(collection + ' is empty.');
    }

    if (collection[0].hasOwnProperty('name')) {
      if (typeof collection[0].name !== 'string') {
        throw new TypeError('Invalid value type passed for name of option ' + collection[0].name + '. Value should be string.');
      }
    } else {
      throw new Error(collection[0] + 'does not contain name key.');
    }
  }

  /**
   * Validate the structure of the array
   * It must be formatted as list of values
   * @param {Array} collection Array of object (e.g. ['36', 'Black'])
   */
  function _validateOptionsArray(options) {
    if (Array.isArray(options) && typeof options[0] === 'object') {
      throw new Error(options + 'is not a valid array of options.');
    }
  }

  var selectors$11 = {
    idInput: '[name="id"]',
    planInput: '[name="selling_plan"]',
    optionInput: '[name^="options"]',
    quantityInput: '[name="quantity"]',
    propertyInput: '[name^="properties"]',
  };

  // Public Methods
  // -----------------------------------------------------------------------------

  /**
   * Returns a URL with a variant ID query parameter. Useful for updating window.history
   * with a new URL based on the currently select product variant.
   * @param {string} url - The URL you wish to append the variant ID to
   * @param {number} id  - The variant ID you wish to append to the URL
   * @returns {string} - The new url which includes the variant ID query parameter
   */

  function getUrlWithVariant(url, id) {
    if (/variant=/.test(url)) {
      return url.replace(/(variant=)[^&]+/, '$1' + id);
    } else if (/\?/.test(url)) {
      return url.concat('&variant=').concat(id);
    }

    return url.concat('?variant=').concat(id);
  }

  /**
   * Constructor class that creates a new instance of a product form controller.
   *
   * @param {Element} element - DOM element which is equal to the <form> node wrapping product form inputs
   * @param {Object} product - A product object
   * @param {Object} options - Optional options object
   * @param {Function} options.onOptionChange - Callback for whenever an option input changes
   * @param {Function} options.onPlanChange - Callback for changes to name=selling_plan
   * @param {Function} options.onQuantityChange - Callback for whenever an quantity input changes
   * @param {Function} options.onPropertyChange - Callback for whenever a property input changes
   * @param {Function} options.onFormSubmit - Callback for whenever the product form is submitted
   */
  class ProductFormReader {
    constructor(element, product, options) {
      this.element = element;
      this.form = this.element.tagName == 'FORM' ? this.element : this.element.querySelector('form');
      this.product = this._validateProductObject(product);
      this.variantElement = this.element.querySelector(selectors$11.idInput);

      options = options || {};
      this.clickedElement = null;

      this._listeners = new Listeners();
      this._listeners.add(this.element, 'submit', this._onSubmit.bind(this, options));

      this.optionInputs = this._initInputs(selectors$11.optionInput, options.onOptionChange);

      this.planInputs = this._initInputs(selectors$11.planInput, options.onPlanChange);

      this.quantityInputs = this._initInputs(selectors$11.quantityInput, options.onQuantityChange);

      this.propertyInputs = this._initInputs(selectors$11.propertyInput, options.onPropertyChange);
    }

    /**
     * Cleans up all event handlers that were assigned when the Product Form was constructed.
     * Useful for use when a section needs to be reloaded in the theme editor.
     */
    destroy() {
      this._listeners.removeAll();
    }

    /**
     * Getter method which returns the array of currently selected option values
     *
     * @returns {Array} An array of option values
     */
    options() {
      return this._serializeInputValues(this.optionInputs, function (item) {
        var regex = /(?:^(options\[))(.*?)(?:\])/;
        item.name = regex.exec(item.name)[2]; // Use just the value between 'options[' and ']'
        return item;
      });
    }

    /**
     * Getter method which returns the currently selected variant, or `null` if variant
     * doesn't exist.
     *
     * @returns {Object|null} Variant object
     */
    variant() {
      const opts = this.options();
      if (opts.length) {
        return getVariantFromSerializedArray(this.product, opts);
      } else {
        return this.product.variants[0];
      }
    }

    /**
     * Getter method which returns the current selling plan, or `null` if plan
     * doesn't exist.
     *
     * @returns {Object|null} Variant object
     */
    plan(variant) {
      let plan = {
        allocation: null,
        group: null,
        detail: null,
      };
      const formData = new FormData(this.form);
      const id = formData.get('selling_plan');

      if (variant && variant.selling_plan_allocations && variant.selling_plan_allocations.length > 0) {
        const uniqueVariantSellingPlanGroupIDs = [...new Set(variant.selling_plan_allocations.map(sellingPlan => sellingPlan.selling_plan_group_id))];
        const productSubsGroup = this.element.querySelectorAll('[data-subscription-group]');

        if (!productSubsGroup.length) {
          return;
        }

        productSubsGroup.forEach(group => group.style.display = "none");
        uniqueVariantSellingPlanGroupIDs.forEach(groupId => {
          this.element.querySelector(`[data-selling-plan-group="${groupId}"]`).style.display = "block";
        });
      }

      if (id && variant) {
        plan.allocation = variant.selling_plan_allocations.find(function (item) {
          return item.selling_plan_id.toString() === id.toString();
        });
      }
      if (plan.allocation) {
        plan.group = this.product.selling_plan_groups.find(function (item) {
          return item.id.toString() === plan.allocation.selling_plan_group_id.toString();
        });
      }
      if (plan.group) {
        plan.detail = plan.group.selling_plans.find(function (item) {
          return item.id.toString() === id.toString();
        });
      }

      if (plan && plan.allocation && plan.detail && plan.allocation) {
        return plan;
      } else return null;
    }

    /**
     * Getter method which returns a collection of objects containing name and values
     * of property inputs
     *
     * @returns {Array} Collection of objects with name and value keys
     */
    properties() {
      return this._serializeInputValues(this.propertyInputs, function (item) {
        var regex = /(?:^(properties\[))(.*?)(?:\])/;
        item.name = regex.exec(item.name)[2]; // Use just the value between 'properties[' and ']'
        return item;
      });
    }

    /**
     * Getter method which returns the current quantity or 1 if no quantity input is
     * included in the form
     *
     * @returns {Array} Collection of objects with name and value keys
     */
    quantity() {
      return this.quantityInputs[0] ? Number.parseInt(this.quantityInputs[0].value, 10) : 1;
    }

    getFormState() {
      const variant = this.variant();
      return {
        options: this.options(),
        variant: variant,
        properties: this.properties(),
        quantity: this.quantity(),
        plan: this.plan(variant),
      };
    }

    // Private Methods
    // -----------------------------------------------------------------------------
    _setIdInputValue(variant) {
      if (variant && variant.id) {
        this.variantElement.value = variant.id.toString();
      } else {
        this.variantElement.value = '';
      }
      this.variantElement.dispatchEvent(new Event('change'));
    }

    _onSubmit(options, event) {
      event.dataset = this.getFormState();
      if (options.onFormSubmit) {
        options.onFormSubmit(event);
      }
    }

    _onOptionChange(event) {
      this._setIdInputValue(event.dataset.variant);
    }

    _onFormEvent(cb) {
      if (typeof cb === 'undefined') {
        return Function.prototype;
      }

      return function (event) {
        event.dataset = this.getFormState();
        this._setIdInputValue(event.dataset.variant);
        cb(event);
      }.bind(this);
    }

    _initInputs(selector, cb) {
      var elements = Array.prototype.slice.call(this.element.querySelectorAll(selector));

      return elements.map(
        function (element) {
          this._listeners.add(element, 'change', this._onFormEvent(cb));
          return element;
        }.bind(this)
      );
    }

    _serializeInputValues(inputs, transform) {
      return inputs.reduce(function (options, input) {
        if (
          input.checked || // If input is a checked (means type radio or checkbox)
          (input.type !== 'radio' && input.type !== 'checkbox') // Or if its any other type of input
        ) {
          options.push(transform({name: input.name, value: input.value}));
        }

        return options;
      }, []);
    }

    _validateProductObject(product) {
      if (typeof product !== 'object') {
        throw new TypeError(product + ' is not an object.');
      }

      if (typeof product.variants[0].options === 'undefined') {
        throw new TypeError('Product object is invalid. Make sure you use the product object that is output from {{ product | json }} or from the http://[your-product-url].js route');
      }
      return product;
    }
  }

  function getProductJson(handle) {
    const requestRoute = `${window.theme.routes.root_url}products/${handle}.js`;
    return window
      .fetch(requestRoute)
      .then((response) => {
        return response.json();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function getScript(url, callback, callbackError) {
    let head = document.getElementsByTagName('head')[0];
    let done = false;
    let script = document.createElement('script');
    script.src = url;

    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
        done = true;
        callback();
      } else {
        callbackError();
      }
    };

    head.appendChild(script);
  }

  const loaders = {};

  function loadScript(options = {}) {
    if (!options.type) {
      options.type = 'json';
    }

    if (options.url) {
      if (loaders[options.url]) {
        return loaders[options.url];
      } else {
        return getScriptWithPromise(options.url, options.type);
      }
    } else if (options.json) {
      if (loaders[options.json]) {
        return Promise.resolve(loaders[options.json]);
      } else {
        return window
          .fetch(options.json)
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            loaders[options.json] = response;
            return response;
          });
      }
    } else if (options.name) {
      const key = ''.concat(options.name, options.version);
      if (loaders[key]) {
        return loaders[key];
      } else {
        return loadShopifyWithPromise(options);
      }
    } else {
      return Promise.reject();
    }
  }

  function getScriptWithPromise(url, type) {
    const loader = new Promise((resolve, reject) => {
      if (type === 'text') {
        fetch(url)
          .then((response) => response.text())
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        getScript(
          url,
          function () {
            resolve();
          },
          function () {
            reject();
          }
        );
      }
    });

    loaders[url] = loader;
    return loader;
  }

  function loadShopifyWithPromise(options) {
    const key = ''.concat(options.name, options.version);
    const loader = new Promise((resolve, reject) => {
      try {
        window.Shopify.loadFeatures([
          {
            name: options.name,
            version: options.version,
            onLoad: (err) => {
              onLoadFromShopify(resolve, reject, err);
            },
          },
        ]);
      } catch (err) {
        reject(err);
      }
    });
    loaders[key] = loader;
    return loader;
  }

  function onLoadFromShopify(resolve, reject, err) {
    if (err) {
      return reject(err);
    } else {
      return resolve();
    }
  }

  const selectors$10 = {
    wrapper: '[data-swapper-wrapper]',
    target: '[data-swapper-target]',
    hover: 'data-swapper-hover',
  };

  let sections$q = {};

  class Swapper {
    constructor(el) {
      this.container = el;
      this.target = this.container.querySelector(selectors$10.target);
      this.hovers = this.container.querySelectorAll(`[${selectors$10.hover}]`);

      if (this.target && this.hovers.length) {
        this.deafaultContent = this.target.innerHTML;
        this.init();
      }
    }

    init() {
      this.hovers.forEach((hover) => {
        hover.addEventListener(
          'mouseenter',
          function () {
            const newContent = hover.getAttribute(selectors$10.hover);
            this.target.innerHTML = `${newContent}`;
          }.bind(this)
        );
      });
      this.hovers.forEach((hover) => {
        hover.addEventListener(
          'mouseleave',
          function () {
            this.target.innerHTML = this.deafaultContent;
          }.bind(this)
        );
      });
      this.hovers.forEach((hover) => {
        hover.addEventListener(
          'click',
          function () {
            const clickedContent = hover.getAttribute(selectors$10.hover);
            this.deafaultContent = `${clickedContent}`;
          }.bind(this)
        );
      });
    }
  }

  function makeSwappers(container) {
    sections$q[container.id] = [];
    const els = container.querySelectorAll(selectors$10.wrapper);
    els.forEach((el) => {
      sections$q[container.id].push(new Swapper(el));
    });
  }

  const swapperSection = {
    onLoad() {
      makeSwappers(this.container);
    },
  };

  const defaults = {
    color: 'ash',
  };

  const selectors$$ = {
    swatch: 'data-swatch',
    outerGrid: '[data-grid-item]',
    imageSlide: '[data-grid-image]',
    dataGridImageDefault: 'data-grid-image-default',
    dataGridImageTarget: 'data-grid-image-target',
    dataGridImageTargetDefault: 'data-grid-image-target-default',
    image: 'data-swatch-image',
    imageId: 'data-swatch-image-id',
    variant: 'data-swatch-variant',
    link: '[data-grid-link]',
    wrapper: '[data-grid-swatches]',
    template: '[data-swatch-template]',
    handle: 'data-swatch-handle',
    label: 'data-swatch-label',
    index: 'data-swatch-index',
    dataMediaId: 'data-media-id',
    dataMediaSrcPlaceholder: 'data-media-src-placeholder',
    dataFetchedImage: 'data-fetched-image',
    dataFetchedImageIndex: 'data-fetched-image-index',
  };

  const classes$E = {
    fade: 'is-fade',
  };

  class ColorMatch {
    constructor(options = {}) {
      this.settings = {
        ...defaults,
        ...options,
      };

      this.match = this.init();
    }

    getColor() {
      return this.match;
    }

    init() {
      const getColors = loadScript({json: window.theme.assets.swatches});
      return getColors
        .then((colors) => {
          return this.matchColors(colors, this.settings.color);
        })
        .catch((e) => {
          console.log('failed to load swatch colors script');
          console.log(e);
        });
    }

    matchColors(colors, name) {
      let bg = '#E5E5E5';
      let img = null;
      const path = window.theme.assets.base || '/';
      const comparisonName = name.toLowerCase().replace(/\s/g, '');
      const array = colors.colors;
      if (array) {
        const variantNameMatch = (nameObject) => {
          const indexName = Object.keys(nameObject).toString();
          const neatName = indexName.toLowerCase().replace(/\s/g, '');
          return neatName === comparisonName;
        };
        const position = array.findIndex(variantNameMatch);
        if (position > -1) {
          const value = Object.values(array[position])[0];
          const valueLowerCase = value.toLowerCase();
          if (valueLowerCase.includes('.jpg') || valueLowerCase.includes('.jpeg') || valueLowerCase.includes('.png') || valueLowerCase.includes('.svg')) {
            img = `${path}${encodeURIComponent(value)}`;
            bg = '#888888';
          } else {
            bg = value;
          }
        }
      }
      return {
        color: this.settings.color,
        path: img,
        hex: bg,
      };
    }
  }

  class RadioSwatch extends HTMLElement {
    constructor() {
      super();

      this.element = this.querySelector(`[${selectors$$.swatch}]`);
      this.colorString = this.element.getAttribute(selectors$$.swatch);
      this.image = this.element.getAttribute(selectors$$.image);
      this.imageId = this.element.getAttribute(selectors$$.imageId);
      this.variant = this.element.getAttribute(selectors$$.variant);
      this.outer = this.element.closest(selectors$$.outerGrid);
      this.media = null;
      this.imageSlide = null;
      this.imageDefault = null;
      this.stopSlideAnimation = false;
      const matcher = new ColorMatch({color: this.colorString});

      matcher.getColor().then((result) => {
        this.colorMatch = result;
        this.init();
      });
    }

    init() {
      this.setStyles();

      // Change PGI slider image
      if (this.variant && this.outer) {
        // Get images on upsell/quickview load
        this.outer.addEventListener('theme:upsell:media', (e) => {
          if (e && e.detail && e.detail.media) {
            this.media = e.detail.media;
          }
        });

        this.handleHovers();
        this.handleClicks();
      }
    }

    setStyles() {
      if (this.colorMatch.hex) {
        this.element.style.setProperty('--swatch', `${this.colorMatch.hex}`);
      }
      if (this.colorMatch.path) {
        this.element.style.setProperty('background-image', `url(${this.colorMatch.path})`);
        this.element.style.setProperty('background-size', 'cover');
      }
    }

    handleHovers() {
      // Load the image on hover for PGI slider
      this.element.addEventListener('mouseenter', () => {
        this.imageReplace = null;
        if (this.imageId) {
          const target = this.outer.querySelector(`[${selectors$$.dataGridImageTarget}="${this.imageId}"]`);
          if (!target) {
            this.imageSlide = this.outer.querySelector(selectors$$.imageSlide);
            if (this.image && this.imageSlide) {
              // container width rounded to the nearest 180 pixels
              // increses likelihood that the image will be cached
              const ratio = window.devicePixelRatio || 1;
              const pixels = this.imageSlide.offsetWidth * ratio;
              const widthRounded = Math.ceil(pixels / 180) * 180;
              const defaultImageId = this.imageSlide.hasAttribute(selectors$$.dataGridImageTargetDefault) ? this.imageSlide.getAttribute(selectors$$.dataGridImageTargetDefault) : '';
              if (defaultImageId === this.imageId && this.imageSlide.hasAttribute(selectors$$.dataGridImageDefault)) {
                // Get default loaded image
                this.imageReplace = this.imageSlide.getAttribute(selectors$$.dataGridImageDefault);
                return;
              }

              if (this.element.hasAttribute(selectors$$.dataFetchedImage)) {
                // Get already loaded images
                this.imageReplace = this.element.getAttribute(selectors$$.dataFetchedImage);
              } else if (this.media) {
                // Get loaded images from upsell/quickview product
                const mediaTarget = this.media.querySelector(`[${selectors$$.dataMediaId}="${this.imageId}"]`);
                if (mediaTarget && mediaTarget.hasAttribute(selectors$$.dataMediaSrcPlaceholder)) {
                  const sizedImage = getSizedImageUrl(mediaTarget.getAttribute(selectors$$.dataMediaSrcPlaceholder).replace('_1x1', ''), `${widthRounded}x`);
                  this.imageReplace = `url("${sizedImage}")`;
                  this.element.setAttribute(selectors$$.dataFetchedImage, this.imageReplace);
                }
              } else {
                // Fetch new image
                const sizedImage = getSizedImageUrl(this.image, `${widthRounded}x`);

                window
                  .fetch(sizedImage)
                  .then((response) => {
                    return response.blob();
                  })
                  .then((blob) => {
                    const objectURL = URL.createObjectURL(blob);
                    this.imageReplace = `url("${objectURL}")`;
                    this.element.setAttribute(selectors$$.dataFetchedImage, this.imageReplace);

                    if (
                      this.element.hasAttribute(selectors$$.index) &&
                      this.outer.hasAttribute(selectors$$.dataFetchedImageIndex) &&
                      parseInt(this.element.getAttribute(selectors$$.index)) === parseInt(this.outer.getAttribute(selectors$$.dataFetchedImageIndex))
                    ) {
                      this.replaceImage();

                      this.swatchImageChange();

                      this.outer.removeAttribute(selectors$$.dataFetchedImageIndex);
                    }
                  })
                  .catch((error) => {
                    console.log(`Error: ${error}`);
                  });
              }
            }
          }
        }
      });
    }

    handleClicks() {
      // Change PGI slider image on click
      this.element.addEventListener('click', () => {
        this.changeImageOnEvent();
      });

      this.element.addEventListener('keyup', (e) => {
        if (e.which !== window.theme.keyboardKeys.ENTER) {
          return;
        }

        this.stopSlideAnimation = true;
        this.changeImageOnEvent();
      });
    }

    changeImageOnEvent() {
      this.outer.removeAttribute(selectors$$.dataFetchedImageIndex);
      this.linkElements = this.outer.querySelectorAll(selectors$$.link);
      if (this.linkElements.length) {
        this.linkElements.forEach((element) => {
          const destination = getUrlWithVariant(element.getAttribute('href'), this.variant);
          element.setAttribute('href', destination);
        });
      }

      if (!this.imageReplace && this.element.hasAttribute(selectors$$.index)) {
        this.outer.setAttribute(selectors$$.dataFetchedImageIndex, parseInt(this.element.getAttribute(selectors$$.index)));
      }

      this.replaceImage();
      this.swatchImageChange();
    }

    swatchImageChange() {
      // Connect swatch with PGI slider
      if (this.imageId) {
        this.outer.dispatchEvent(
          new CustomEvent('theme:swatch:change', {
            bubbles: true,
            detail: {
              id: this.imageId,
              stopSlideAnimation: this.stopSlideAnimation,
            },
          })
        );
      }
    }

    replaceImage() {
      // Add new loaded image in PGI slider
      if (this.imageReplace && this.imageSlide && this.imageId) {
        if (this.imageSlide.hasAttribute(selectors$$.dataGridImageTarget) && this.imageSlide.getAttribute(selectors$$.dataGridImageTarget) !== this.imageId) {
          this.imageSlide.classList.add(classes$E.fade);
          const timeoutDelay = parseFloat(window.getComputedStyle(this.imageSlide).getPropertyValue('animation-duration')) * 1000;

          setTimeout(() => {
            this.imageSlide.classList.remove(classes$E.fade);
          }, timeoutDelay);
        }

        this.imageSlide.setAttribute(selectors$$.dataGridImageTarget, this.imageId);
        this.imageSlide.style.setProperty('background-color', '#fff');

        if (!this.imageSlide.hasAttribute(selectors$$.dataGridImageDefault)) {
          this.imageSlide.setAttribute(selectors$$.dataGridImageDefault, window.getComputedStyle(this.imageSlide).backgroundImage);
        }

        this.imageSlide.style.setProperty('background-image', this.imageReplace);
      }
    }
  }

  class GridSwatch {
    constructor(wrap) {
      this.template = document.querySelector(selectors$$.template).innerHTML;
      this.wrap = wrap;
      this.handle = wrap.getAttribute(selectors$$.handle);
      const label = wrap.getAttribute(selectors$$.label).trim().toLowerCase();
      getProductJson(this.handle).then((product) => {
        this.product = product;
        this.colorOption = product.options.find(function (element) {
          return element.name.toLowerCase() === label || null;
        });
        if (this.colorOption) {
          this.swatches = this.colorOption.values;
          this.init();
        }
      });
    }

    init() {
      this.wrap.innerHTML = '';
      this.swatches.forEach((swatch, index) => {
        let variant = this.product.variants.find((variant) => {
          return variant.options.includes(swatch);
        });
        const image = variant.featured_media ? variant.featured_media.preview_image.src : '';
        const imageId = variant.featured_media ? variant.featured_media.id : '';

        const rand = Math.floor(Math.random() * 9999);

        this.wrap.innerHTML += Sqrl__namespace.render(this.template, {
          color: swatch,
          uniq: `${this.product.id}-${variant.id}-${rand}`,
          variant: variant.id,
          product_id: this.product.id,
          image_id: imageId,
          image,
          index,
        });
      });

      new NativeScrollbar(this.wrap);
    }
  }

  function makeGridSwatches(container) {
    const gridSwatchWrappers = container.querySelectorAll(selectors$$.wrapper);
    gridSwatchWrappers.forEach((wrap) => {
      new GridSwatch(wrap);
    });
  }

  const swatchGridSection = {
    onLoad() {
      makeGridSwatches(this.container);
      makeSwappers(this.container);
    },
  };

  const selectors$_ = {
    holderItems: '[data-custom-scrollbar-items]',
    scrollbar: '[data-custom-scrollbar]',
    scrollbarTrack: '[data-custom-scrollbar-track]',
  };

  const classes$D = {
    hide: 'hide',
  };

  const sections$p = {};

  class CustomScrollbar {
    constructor(holder, children = null) {
      this.holderItems = holder.querySelector(selectors$_.holderItems);
      this.scrollbar = holder.querySelector(selectors$_.scrollbar);
      this.scrollbarTrack = holder.querySelector(selectors$_.scrollbarTrack);
      this.trackWidth = 0;
      this.scrollWidth = 0;

      if (this.scrollbar && this.holderItems) {
        this.children = children || this.holderItems.children;
        this.events();
        this.calculateTrackWidth();
      }
    }

    events() {
      this.holderItems.addEventListener('scroll', this.calculatePosition.bind(this));
      this.holderItems.addEventListener('theme:carousel:scroll', this.calculatePosition.bind(this));

      document.addEventListener('theme:resize:width', this.calculateTrackWidth.bind(this));
      document.addEventListener('theme:resize:width', this.calculatePosition.bind(this));
    }

    calculateTrackWidth() {
      //Javascript can't execute calc() (from `--outer` variable) - create a new div with width property instead `getPropertyValue('--outer')` to can get the width of `after` on the holder
      const htmlObject = document.createElement('div');
      this.holderItems.prepend(htmlObject);
      htmlObject.style.display = 'none';
      htmlObject.style.width = getComputedStyle(this.holderItems).getPropertyValue('--outer');
      const widthAfter = parseInt(getComputedStyle(htmlObject).getPropertyValue('width'));
      this.holderItems.firstChild.remove();

      this.scrollbarWidth = this.scrollbar.clientWidth === 0 ? this.scrollbar.parentNode.getBoundingClientRect().width : this.scrollbar.clientWidth;
      setTimeout(() => {
        const childWidth = this.children[0].clientWidth;
        const childMarginRight = Number(getComputedStyle(this.children[0]).marginRight.replace('px', ''));
        const childMarginLeft = Number(getComputedStyle(this.children[0]).marginLeft.replace('px', ''));

        // Minus `childMarginRight` is added to the end with minus because the last child doesn't have margin-right
        this.scrollWidth = this.children.length * (childWidth + childMarginRight + childMarginLeft) + widthAfter - childMarginRight;

        this.trackWidth = ((this.scrollbarWidth + widthAfter) / this.scrollWidth) * 100;
        this.trackWidth = this.trackWidth < 5 ? 5 : this.trackWidth;
        this.scrollbar.style.setProperty('--track-width', `${this.trackWidth}%`);
        const hideScrollbar = Math.ceil(this.trackWidth) >= 100;

        this.scrollbar.classList.toggle(classes$D.hide, hideScrollbar);
      }, 100);
    }

    calculatePosition() {
      let position = this.holderItems.scrollLeft / (this.holderItems.scrollWidth - this.holderItems.clientWidth);
      position *= this.scrollbar.clientWidth - this.scrollbarTrack.clientWidth;
      position = position < 0 ? 0 : position;
      position = isNaN(position) ? 0 : position;

      this.scrollbar.style.setProperty('--position', `${Math.round(position)}px`);

      document.dispatchEvent(
        new CustomEvent('theme:scrollbar:scroll', {
          bubbles: true,
          detail: {
            holder: this.holderItems,
          },
        })
      );
    }
  }

  const customScrollbar = {
    onLoad() {
      sections$p[this.id] = new CustomScrollbar(this.container);
    },
  };

  const selectors$Z = {
    carousel: '[data-carousel]',
    carouselWithProgress: 'data-carousel-progress',
    carouselSlide: '[data-carousel-slide]',
    carouselFirstSlidePhoto: '[data-grid-slide]',
    wrapper: '[data-wrapper]',
    carouselTrack: '[data-carousel-track]',
    slider: '.flickity-slider',
    carouselOptions: 'data-options',
    carouselCustomScrollbar: 'data-custom-scrollbar-items',
    carouselPrev: '.flickity-button.previous',
    carouselNext: '.flickity-button.next',
    recentlyViewHolder: 'data-recently-viewed-products',
    relatedHolder: 'data-related-products',
    sectionHolder: '[data-section-id]',
  };

  const classes$C = {
    wrapper: 'wrapper',
    wrapperModifier: 'wrapper--full',
    notMovedArrows: 'not-moved-arrows',
    hide: 'hide',
    flickityEnabled: 'flickity-enabled',
    hiddenArrows: 'hidden-arrows',
    flickityStatic: 'flickity-static',
  };

  const offsets$1 = {
    additionalOffsetWrapper: 112,
  };

  class Carousel extends HTMLElement {
    constructor() {
      super();

      this.container = this;
    }

    connectedCallback() {
      this.carousel = this.container.querySelector(selectors$Z.carousel);
      this.carouselTrack = this.container.querySelector(selectors$Z.carouselTrack);
      this.wrapper = this.container.closest(selectors$Z.wrapper);
      this.section = this.container.closest(selectors$Z.sectionHolder);
      this.slidesVisible = null;

      this.carouselInstance = null;
      this.carouselPrev = null;
      this.carouselNext = null;
      this.customOptions = {};

      this.toggleWrapperModifierEvent = () => this.toggleWrapperModifier();

      if (this.carousel && this.carousel.hasAttribute(selectors$Z.recentlyViewHolder)) {
        // Check carousel in recently viewed products
        this.section.addEventListener('theme:recent-products:added', () => {
          this.init();
        });
      } else if (this.carousel && this.carousel.hasAttribute(selectors$Z.relatedHolder)) {
        // Check carousel in recommendation products but without overwrite option
        this.section.addEventListener('theme:related-products:added', () => {
          this.init();
        });
      } else {
        this.init();
      }
    }

    init() {
      if (!this.carousel) {
        return;
      }

      this.slidesTotal = this.carousel.querySelectorAll(selectors$Z.carouselSlide).length;

      this.getGridLayout();
      this.trackVisibleSlides();

      if (this.carousel.hasAttribute(selectors$Z.carouselOptions)) {
        this.customOptions = JSON.parse(decodeURIComponent(this.carousel.getAttribute(selectors$Z.carouselOptions)));
      }

      this.initCarousel();
      this.calculatedArrowsTopPosition();

      this.toggleWrapperModifier();
      document.addEventListener('theme:resize:width', this.toggleWrapperModifierEvent);

      if (this.carousel.hasAttribute(selectors$Z.carouselWithProgress)) {
        this.progressBarCalculate();
      }

      if (this.carousel.hasAttribute(selectors$Z.carouselCustomScrollbar)) {
        new CustomScrollbar(this.container);
      }
    }

    initCarousel() {
      this.options = {
        accessibility: true,
        contain: true,
        freeScroll: true,
        prevNextButtons: true,
        wrapArround: false,
        groupCells: false,
        autoPlay: false,
        pageDots: false,
        cellAlign: window.isRTL ? 'right' : 'left',
        rightToLeft: window.isRTL,
        dragThreshold: 10,
        arrowShape: {
          x0: 10,
          x1: 60,
          y1: 50,
          x2: 65,
          y2: 45,
          x3: 20,
        },
        on: {
          resize: () => {
            this.toggleArrows();
            this.calculatedArrowsTopPosition();

            setTimeout(() => {
              this.visibleSlides();
            }, 100);
          },
        },
        ...this.customOptions,
      };
      this.carouselInstance = new Flickity(this.carousel, this.options);
      this.carouselPrev = this.carousel.querySelector(selectors$Z.carouselPrev);
      this.carouselNext = this.carousel.querySelector(selectors$Z.carouselNext);

      this.container.addEventListener('theme:tab:change', () => {
        this.carouselInstance.resize();
        this.carouselPrev = this.carousel.querySelector(selectors$Z.carouselPrev);
        this.carouselNext = this.carousel.querySelector(selectors$Z.carouselNext);
      });

      this.carouselInstance.on('dragStart', () => {
        this.carouselInstance.slider.style.pointerEvents = 'none';
        this.containDrag();
      });
      this.carouselInstance.on('dragEnd', () => {
        this.carouselInstance.slider.style.pointerEvents = 'auto';
        this.containDrag();
      });
      this.carouselInstance.on('change', (index) => this.lockArrows(index));

      setTimeout(() => {
        this.visibleSlides();
      }, 100);

      if (Shopify.designMode) {
        setTimeout(() => {
          if (this.carouselInstance.options.watchCSS && !this.carousel.classList.contains(classes$C.flickityEnabled)) {
            this.carouselInstance.destroy();
            this.carouselInstance = new Flickity(this.carousel, this.options);
            this.carouselInstance.resize();
            this.carouselPrev = this.carousel.querySelector(selectors$Z.carouselPrev);
            this.carouselNext = this.carousel.querySelector(selectors$Z.carouselNext);
          } else {
            this.carouselInstance.resize();
          }
        }, 10);
      }

      this.carousel.classList.toggle(classes$C.flickityStatic, this.smallItems === this.carousel.querySelectorAll(selectors$Z.carouselSlide).length);

      makeGridSwatches(this.container);
      new Siblings(this.container);
    }

    calculatedArrowsTopPosition() {
      const carouselFirstSlidePhoto = this.container.querySelector(selectors$Z.carouselFirstSlidePhoto);

      if (carouselFirstSlidePhoto) {
        const buttonOffset = carouselFirstSlidePhoto.offsetHeight / 2;
        this.carousel.style.setProperty('--buttons-top', `${buttonOffset}px`);
      }
    }

    toggleWrapperModifier() {
      if (!this.wrapper) {
        return;
      }
      const scrollbarWidth = Number(getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-width').replace('px', ''));
      const wrapperWidth = this.wrapper.clientWidth;
      this.wrapperWidthWithGutter = wrapperWidth + offsets$1.additionalOffsetWrapper + scrollbarWidth;
      this.wrapper.classList.toggle(classes$C.wrapperModifier, this.wrapperWidthWithGutter >= window.innerWidth);
      this.section.classList.toggle(classes$C.notMovedArrows, !(this.wrapperWidthWithGutter >= window.innerWidth));
    }

    progressBarCalculate() {
      if (this.carouselInstance !== null && this.carouselTrack) {
        this.carouselInstance.on('scroll', (progress) => {
          progress = Math.max(0, Math.min(1, progress)) * 100 + '%';
          this.carouselTrack.style.width = progress;
        });
      }
    }

    getGridLayout() {
      this.largeItems = Number(getComputedStyle(this.carousel).getPropertyValue('--grid-large-items')) || 3;
      this.mediumItems = Number(getComputedStyle(this.carousel).getPropertyValue('--grid-medium-items')) || this.largeItems;
      this.smallItems = Number(getComputedStyle(this.carousel).getPropertyValue('--grid-small-items')) || this.mediumItems || this.largeItems;
    }

    visibleSlides() {
      if (!this.carousel) {
        return;
      }

      this.getGridLayout();

      const carouselWidth = this.carousel.clientWidth || this.carouselInstance.size.width;
      const slideWidth =
        this.carouselInstance !== null && this.carouselInstance.selectedElement ? this.carouselInstance.selectedElement.clientWidth : this.carousel.querySelector(selectors$Z.carouselSlide).clientWidth;
      const countSlides = this.carouselInstance !== null && this.carouselInstance.slides ? this.carouselInstance.slides.length : this.carousel.querySelectorAll(selectors$Z.carouselSlide).length;
      const numberOfVisibleSlides = Math.floor(carouselWidth / slideWidth);

      this.section.classList.remove(classes$C.hiddenArrows);

      if (this.carouselPrev && this.carouselNext) {
        this.carouselPrev.classList.remove(classes$C.hide);
        this.carouselNext.classList.remove(classes$C.hide);
      }

      // Desktop
      if (window.innerWidth > window.theme.sizes.large && !this.options.groupCells) {
        if (numberOfVisibleSlides <= this.largeItems && countSlides <= this.largeItems && this.carouselPrev && this.carouselNext) {
          this.hideArrows();
        }
      }

      // Tablet
      if (window.innerWidth >= window.theme.sizes.medium && window.innerWidth <= window.theme.sizes.large && !this.options.groupCells) {
        if (numberOfVisibleSlides <= this.mediumItems && countSlides <= this.mediumItems && this.carouselPrev && this.carouselNext) {
          this.hideArrows();
        }
      }

      // Mobile
      if (window.innerWidth < window.theme.sizes.medium && !this.options.groupCells) {
        if (numberOfVisibleSlides <= this.smallItems && countSlides <= this.smallItems && this.carouselPrev && this.carouselNext) {
          this.hideArrows();
        }
      }
    }

    trackVisibleSlides() {
      const isSmallDown = window.matchMedia(`(max-width: ${window.theme.sizes.medium - 1}px)`);
      const isTablet = window.matchMedia(`(min-width: ${window.theme.sizes.medium}px) and (max-width: ${window.theme.sizes.large - 1}px)`);
      const isDesktop = window.matchMedia(`(min-width: ${window.theme.sizes.large}px)`);
      isSmallDown.addEventListener('change', (event) => {
        event.matches ? (this.slidesVisible = this.smallItems) : true;
      });
      isSmallDown.matches ? (this.slidesVisible = this.smallItems) : true;

      isTablet.addEventListener('change', (event) => {
        event.matches ? (this.slidesVisible = this.mediumItems) : true;
      });
      isTablet.matches ? (this.slidesVisible = this.mediumItems) : true;

      isDesktop.addEventListener('change', (event) => {
        event.matches ? (this.slidesVisible = this.largeItems) : true;
      });
      isDesktop.matches ? (this.slidesVisible = this.largeItems) : true;
    }

    containDrag() {
      // Dragging agressively in flickity will select the last cell in the list
      // instead of the first cell of the last slide (slide is a set of cells).
      // We detect drag events, and move the selection back to the first cell
      // of the last slide -- the lastSelectableCell.
      const lastSelectableCell = this.slidesTotal - this.slidesVisible;
      if (this.carouselInstance.selectedIndex >= lastSelectableCell) {
        this.carouselInstance.select(lastSelectableCell);
        this.lockArrows(this.carouselInstance.selectedIndex);
      }
    }

    lockArrows(index) {
      if (this.options.wrapAround || this.options.groupCells) {
        return;
      }
      const nextIndex = parseInt(index);

      const lastSelectableCell = this.slidesTotal - this.slidesVisible;
      this.carouselNext.disabled = nextIndex >= lastSelectableCell;
    }

    showArrows() {
      this.carouselPrev.classList.remove(classes$C.hide);
      this.carouselNext.classList.remove(classes$C.hide);
      this.section.classList.remove(classes$C.hiddenArrows);
    }

    hideArrows() {
      this.carouselPrev.classList.add(classes$C.hide);
      this.carouselNext.classList.add(classes$C.hide);
      this.section.classList.add(classes$C.hiddenArrows);
    }

    toggleArrows() {
      if (this.carouselPrev && this.carouselNext) {
        if (this.carouselPrev.disabled && this.carouselNext.disabled) {
          this.hideArrows();
        } else {
          this.showArrows();
        }
      }
    }
  }

  if (!customElements.get('flickity-carousel')) {
    customElements.define('flickity-carousel', Carousel);
  }

  const selectors$Y = {
    templateAddresses: '[data-address-wrapper]',
    addressNewForm: '[data-new-address-form]',
    addressNewFormInner: '[new-address-form-inner]',
    btnNew: '.address-new-toggle',
    btnEdit: '.address-edit-toggle',
    btnDelete: '.address-delete',
    classHide: 'hide',
    dataFormId: 'data-form-id',
    dataConfirmMessage: 'data-confirm-message',
    defaultConfirmMessage: 'Are you sure you wish to delete this address?',
    editAddress: '#EditAddress',
    addressCountryNew: 'AddressCountryNew',
    addressProvinceNew: 'AddressProvinceNew',
    addressProvinceContainerNew: 'AddressProvinceContainerNew',
    addressCountryOption: '.address-country-option',
    addressCountry: 'AddressCountry',
    addressProvince: 'AddressProvince',
    addressProvinceContainer: 'AddressProvinceContainer',
  };

  class Addresses {
    constructor(section) {
      this.section = section;
      this.addressNewForm = this.section.querySelector(selectors$Y.addressNewForm);
      this.init();
    }

    init() {
      if (this.addressNewForm) {
        const section = this.section;
        const newAddressFormInner = this.addressNewForm.querySelector(selectors$Y.addressNewFormInner);
        this.customerAddresses();

        const newButtons = section.querySelectorAll(selectors$Y.btnNew);
        if (newButtons.length) {
          newButtons.forEach((element) => {
            element.addEventListener('click', function () {
              newAddressFormInner.classList.toggle(selectors$Y.classHide);
            });
          });
        }

        const editButtons = section.querySelectorAll(selectors$Y.btnEdit);
        if (editButtons.length) {
          editButtons.forEach((element) => {
            element.addEventListener('click', function () {
              const formId = this.getAttribute(selectors$Y.dataFormId);
              section.querySelector(`${selectors$Y.editAddress}_${formId}`).classList.toggle(selectors$Y.classHide);
            });
          });
        }

        const deleteButtons = section.querySelectorAll(selectors$Y.btnDelete);
        if (deleteButtons.length) {
          deleteButtons.forEach((element) => {
            element.addEventListener('click', function () {
              const formId = this.getAttribute(selectors$Y.dataFormId);
              const confirmMessage = this.getAttribute(selectors$Y.dataConfirmMessage);
              if (confirm(confirmMessage || selectors$Y.defaultConfirmMessage)) {
                Shopify.postLink(window.theme.routes.account_addresses_url + '/' + formId, {parameters: {_method: 'delete'}});
              }
            });
          });
        }
      }
    }

    customerAddresses() {
      // Initialize observers on address selectors, defined in shopify_common.js
      if (Shopify.CountryProvinceSelector) {
        new Shopify.CountryProvinceSelector(selectors$Y.addressCountryNew, selectors$Y.addressProvinceNew, {
          hideElement: selectors$Y.addressProvinceContainerNew,
        });
      }

      // Initialize each edit form's country/province selector
      const countryOptions = this.section.querySelectorAll(selectors$Y.addressCountryOption);
      countryOptions.forEach((element) => {
        const formId = element.getAttribute(selectors$Y.dataFormId);
        const countrySelector = `${selectors$Y.addressCountry}_${formId}`;
        const provinceSelector = `${selectors$Y.addressProvince}_${formId}`;
        const containerSelector = `${selectors$Y.addressProvinceContainer}_${formId}`;

        new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
          hideElement: containerSelector,
        });
      });
    }
  }

  const template = document.querySelector(selectors$Y.templateAddresses);
  if (template) {
    new Addresses(template);
  }

  /**
   * Password Template Script
   * ------------------------------------------------------------------------------
   * A file that contains code for the Password template.
   *
   * @namespace password
   */

  (function () {
    var recoverPasswordForm = document.querySelector('#RecoverPassword');
    if (recoverPasswordForm) {
      customerLogin();
    }

    function customerLogin() {
      var config = {
        recoverPasswordForm: '#RecoverPassword',
        hideRecoverPasswordLink: '#HideRecoverPasswordLink',
      };

      checkUrlHash();
      resetPasswordSuccess();

      document.querySelector(config.recoverPasswordForm).addEventListener('click', onShowHidePasswordForm);
      document.querySelector(config.hideRecoverPasswordLink).addEventListener('click', onShowHidePasswordForm);

      function onShowHidePasswordForm(evt) {
        evt.preventDefault();
        toggleRecoverPasswordForm();
      }

      function checkUrlHash() {
        var hash = window.location.hash;

        // Allow deep linking to recover password form
        if (hash === '#recover') {
          toggleRecoverPasswordForm();
        }
      }

      /**
       *  Show/Hide recover password form
       */
      function toggleRecoverPasswordForm() {
        var emailValue = document.querySelector('#CustomerEmail').value;
        document.querySelector('#RecoverEmail').value = emailValue;
        document.querySelector('#RecoverPasswordForm').classList.toggle('display-none');
        document.querySelector('#CustomerLoginForm').classList.toggle('display-none');
      }

      /**
       *  Show reset password success message
       */
      function resetPasswordSuccess() {
        var formSuccess = document.querySelector('.reset-password-success');
        // check if reset password form was successfully submited.
        if (formSuccess) {
          document.querySelector('#ResetSuccess').classList.remove('display-none');
        }
      }
    }
  })();

  window.Shopify = window.Shopify || {};
  window.Shopify.theme = window.Shopify.theme || {};
  window.Shopify.theme.sections = window.Shopify.theme.sections || {};

  window.Shopify.theme.sections.registered = window.Shopify.theme.sections.registered || {};
  window.Shopify.theme.sections.instances = window.Shopify.theme.sections.instances || [];
  const registered = window.Shopify.theme.sections.registered;
  const instances = window.Shopify.theme.sections.instances;

  const selectors$X = {
    id: 'data-section-id',
    type: 'data-section-type',
  };

  class Registration {
    constructor(type = null, components = []) {
      this.type = type;
      this.components = validateComponentsArray(components);
      this.callStack = {
        onLoad: [],
        onUnload: [],
        onSelect: [],
        onDeselect: [],
        onBlockSelect: [],
        onBlockDeselect: [],
        onReorder: [],
      };
      components.forEach((comp) => {
        for (const [key, value] of Object.entries(comp)) {
          const arr = this.callStack[key];
          if (Array.isArray(arr) && typeof value === 'function') {
            arr.push(value);
          } else {
            console.warn(`Unregisted function: '${key}' in component: '${this.type}'`);
            console.warn(value);
          }
        }
      });
    }

    getStack() {
      return this.callStack;
    }
  }

  class Section {
    constructor(container, registration) {
      this.container = validateContainerElement(container);
      this.id = container.getAttribute(selectors$X.id);
      this.type = registration.type;
      this.callStack = registration.getStack();

      try {
        this.onLoad();
      } catch (e) {
        console.warn(`Error in section: ${this.id}`);
        console.warn(this);
        console.warn(e);
      }
    }

    callFunctions(key, e = null) {
      this.callStack[key].forEach((func) => {
        const props = {
          id: this.id,
          type: this.type,
          container: this.container,
        };
        if (e) {
          func.call(props, e);
        } else {
          func.call(props);
        }
      });
    }

    onLoad() {
      this.callFunctions('onLoad');
    }

    onUnload() {
      this.callFunctions('onUnload');
    }

    onSelect(e) {
      this.callFunctions('onSelect', e);
    }

    onDeselect(e) {
      this.callFunctions('onDeselect', e);
    }

    onBlockSelect(e) {
      this.callFunctions('onBlockSelect', e);
    }

    onBlockDeselect(e) {
      this.callFunctions('onBlockDeselect', e);
    }

    onReorder(e) {
      this.callFunctions('onReorder', e);
    }
  }

  function validateContainerElement(container) {
    if (!(container instanceof Element)) {
      throw new TypeError('Theme Sections: Attempted to load section. The section container provided is not a DOM element.');
    }
    if (container.getAttribute(selectors$X.id) === null) {
      throw new Error('Theme Sections: The section container provided does not have an id assigned to the ' + selectors$X.id + ' attribute.');
    }

    return container;
  }

  function validateComponentsArray(value) {
    if ((typeof value !== 'undefined' && typeof value !== 'object') || value === null) {
      throw new TypeError('Theme Sections: The components object provided is not a valid');
    }

    return value;
  }

  /*
   * @shopify/theme-sections
   * -----------------------------------------------------------------------------
   *
   * A framework to provide structure to your Shopify sections and a load and unload
   * lifecycle. The lifecycle is automatically connected to theme editor events so
   * that your sections load and unload as the editor changes the content and
   * settings of your sections.
   */

  function register(type, components) {
    if (typeof type !== 'string') {
      throw new TypeError('Theme Sections: The first argument for .register must be a string that specifies the type of the section being registered');
    }

    if (typeof registered[type] !== 'undefined') {
      throw new Error('Theme Sections: A section of type "' + type + '" has already been registered. You cannot register the same section type twice');
    }

    if (!Array.isArray(components)) {
      components = [components];
    }

    const section = new Registration(type, components);
    registered[type] = section;

    return registered;
  }

  function load(types, containers) {
    types = normalizeType(types);

    if (typeof containers === 'undefined') {
      containers = document.querySelectorAll('[' + selectors$X.type + ']');
    }

    containers = normalizeContainers(containers);

    types.forEach(function (type) {
      const registration = registered[type];

      if (typeof registration === 'undefined') {
        return;
      }

      containers = containers.filter(function (container) {
        // Filter from list of containers because container already has an instance loaded
        if (isInstance(container)) {
          return false;
        }

        // Filter from list of containers because container doesn't have data-section-type attribute
        if (container.getAttribute(selectors$X.type) === null) {
          return false;
        }

        // Keep in list of containers because current type doesn't match
        if (container.getAttribute(selectors$X.type) !== type) {
          return true;
        }

        instances.push(new Section(container, registration));

        // Filter from list of containers because container now has an instance loaded
        return false;
      });
    });
  }

  function unload(selector) {
    var instancesToUnload = getInstances(selector);

    instancesToUnload.forEach(function (instance) {
      var index = instances
        .map(function (e) {
          return e.id;
        })
        .indexOf(instance.id);
      instances.splice(index, 1);
      instance.onUnload();
    });
  }

  function reorder(selector) {
    var instancesToReorder = getInstances(selector);

    instancesToReorder.forEach(function (instance) {
      instance.onReorder();
    });
  }

  function getInstances(selector) {
    var filteredInstances = [];

    // Fetch first element if its an array
    if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) {
      var firstElement = selector[0];
    }

    // If selector element is DOM element
    if (selector instanceof Element || firstElement instanceof Element) {
      var containers = normalizeContainers(selector);

      containers.forEach(function (container) {
        filteredInstances = filteredInstances.concat(
          instances.filter(function (instance) {
            return instance.container === container;
          })
        );
      });

      // If select is type string
    } else if (typeof selector === 'string' || typeof firstElement === 'string') {
      var types = normalizeType(selector);

      types.forEach(function (type) {
        filteredInstances = filteredInstances.concat(
          instances.filter(function (instance) {
            return instance.type === type;
          })
        );
      });
    }

    return filteredInstances;
  }

  function getInstanceById(id) {
    var instance;

    for (var i = 0; i < instances.length; i++) {
      if (instances[i].id === id) {
        instance = instances[i];
        break;
      }
    }
    return instance;
  }

  function isInstance(selector) {
    return getInstances(selector).length > 0;
  }

  function normalizeType(types) {
    // If '*' then fetch all registered section types
    if (types === '*') {
      types = Object.keys(registered);

      // If a single section type string is passed, put it in an array
    } else if (typeof types === 'string') {
      types = [types];

      // If single section constructor is passed, transform to array with section
      // type string
    } else if (types.constructor === Section) {
      types = [types.prototype.type];

      // If array of typed section constructors is passed, transform the array to
      // type strings
    } else if (Array.isArray(types) && types[0].constructor === Section) {
      types = types.map(function (Section) {
        return Section.type;
      });
    }

    types = types.map(function (type) {
      return type.toLowerCase();
    });

    return types;
  }

  function normalizeContainers(containers) {
    // Nodelist with entries
    if (NodeList.prototype.isPrototypeOf(containers) && containers.length > 0) {
      containers = Array.prototype.slice.call(containers);

      // Empty Nodelist
    } else if (NodeList.prototype.isPrototypeOf(containers) && containers.length === 0) {
      containers = [];

      // Handle null (document.querySelector() returns null with no match)
    } else if (containers === null) {
      containers = [];

      // Single DOM element
    } else if (!Array.isArray(containers) && containers instanceof Element) {
      containers = [containers];
    }

    return containers;
  }

  if (window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector('[' + selectors$X.id + '="' + id + '"]');

      if (container !== null) {
        load(container.getAttribute(selectors$X.type), container);
      }
    });

    document.addEventListener('shopify:section:reorder', function (event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector('[' + selectors$X.id + '="' + id + '"]');
      var instance = getInstances(container)[0];

      if (typeof instance === 'object') {
        reorder(container);
      }
    });

    document.addEventListener('shopify:section:unload', function (event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector('[' + selectors$X.id + '="' + id + '"]');
      var instance = getInstances(container)[0];

      if (typeof instance === 'object') {
        unload(container);
      }
    });

    document.addEventListener('shopify:section:select', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onSelect(event);
      }
    });

    document.addEventListener('shopify:section:deselect', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onDeselect(event);
      }
    });

    document.addEventListener('shopify:block:select', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onBlockSelect(event);
      }
    });

    document.addEventListener('shopify:block:deselect', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onBlockDeselect(event);
      }
    });
  }

  /**
   * A11y Helpers
   * -----------------------------------------------------------------------------
   * A collection of useful functions that help make your theme more accessible
   */

  /**
   * Moves focus to an HTML element
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects. Used in bindInPageLinks()
   * eg move focus to a modal that is opened. Used in trapFocus()
   *
   * @param {Element} container - Container DOM element to trap focus inside of
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   */
  function forceFocus(element, options) {
    options = options || {};

    element.focus();
    if (typeof options.className !== 'undefined') {
      element.classList.add(options.className);
    }
    element.addEventListener('blur', callback);

    function callback(event) {
      event.target.removeEventListener(event.type, callback);

      if (typeof options.className !== 'undefined') {
        element.classList.remove(options.className);
      }
    }
  }

  /**
   * If there's a hash in the url, focus the appropriate element
   * This compensates for older browsers that do not move keyboard focus to anchor links.
   * Recommendation: To be called once the page in loaded.
   *
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   * @param {string} options.ignore - Selector for elements to not include.
   */

  function focusHash(options) {
    options = options || {};
    var hash = window.location.hash;
    var element = document.getElementById(hash.slice(1));

    // if we are to ignore this element, early return
    if (element && options.ignore && element.matches(options.ignore)) {
      return false;
    }

    if (hash && element) {
      forceFocus(element, options);
    }
  }

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   * This compensates for older browsers that do not move keyboard focus to anchor links.
   * Recommendation: To be called once the page in loaded.
   *
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   * @param {string} options.ignore - CSS selector for elements to not include.
   */

  function bindInPageLinks(options) {
    options = options || {};
    var links = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'));

    function queryCheck(selector) {
      return document.getElementById(selector) !== null;
    }

    return links.filter(function (link) {
      if (link.hash === '#' || link.hash === '') {
        return false;
      }

      if (options.ignore && link.matches(options.ignore)) {
        return false;
      }

      if (!queryCheck(link.hash.substr(1))) {
        return false;
      }

      var element = document.querySelector(link.hash);

      if (!element) {
        return false;
      }

      link.addEventListener('click', function () {
        forceFocus(element, options);
      });

      return true;
    });
  }

  function focusable(container) {
    var elements = Array.prototype.slice.call(
      container.querySelectorAll('[tabindex],' + '[draggable],' + 'a[href],' + 'area,' + 'button:enabled,' + 'input:not([type=hidden]):enabled,' + 'object,' + 'select:enabled,' + 'textarea:enabled' + '[data-focus-element]')
    );

    // Filter out elements that are not visible.
    // Copied from jQuery https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/src/css/hiddenVisibleSelectors.js
    return elements.filter(function (element) {
      return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    });
  }

  /**
   * Traps the focus in a particular container
   *
   * @param {Element} container - Container DOM element to trap focus inside of
   * @param {Element} elementToFocus - Element to be focused on first
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   */

  var trapFocusHandlers = {};

  function trapFocus(container, options) {
    options = options || {};
    var elements = focusable(container);
    var elementToFocus = options.elementToFocus || container;
    var first = elements[0];
    var last = elements[elements.length - 1];

    removeTrapFocus();

    trapFocusHandlers.focusin = function (event) {
      if (container !== event.target && !container.contains(event.target) && first && first === event.target) {
        first.focus();
      }

      if (event.target !== container && event.target !== last && event.target !== first) return;
      document.addEventListener('keydown', trapFocusHandlers.keydown);
    };

    trapFocusHandlers.focusout = function () {
      document.removeEventListener('keydown', trapFocusHandlers.keydown);
    };

    trapFocusHandlers.keydown = function (event) {
      if (event.keyCode !== 9) return; // If not TAB key

      // On the last focusable element and tab forward, focus the first element.
      if (event.target === last && !event.shiftKey) {
        event.preventDefault();
        first.focus();
      }

      //  On the first focusable element and tab backward, focus the last element.
      if ((event.target === container || event.target === first) && event.shiftKey) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('focusout', trapFocusHandlers.focusout);
    document.addEventListener('focusin', trapFocusHandlers.focusin);

    forceFocus(elementToFocus, options);
  }

  /**
   * Removes the trap of focus from the page
   */
  function removeTrapFocus() {
    document.removeEventListener('focusin', trapFocusHandlers.focusin);
    document.removeEventListener('focusout', trapFocusHandlers.focusout);
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  }

  const selectors$W = {
    focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  function modal(unique) {
    const uniqueID = `data-popup-${unique}`;
    MicroModal.init({
      openTrigger: uniqueID,
      disableScroll: true,
      onShow: (modal, el, event) => {
        event.preventDefault();
        const firstFocus = modal.querySelector(selectors$W.focusable);
        trapFocus(modal, {elementToFocus: firstFocus});
      },
      onClose: (modal, el, event) => {
        event.preventDefault();
        removeTrapFocus();
        el.focus();
      },
    });
  }

  const selectors$V = {
    trigger: '[data-toggle-password-modal]',
    errors: '.storefront-password-form .errors',
  };

  const sections$o = {};

  class PasswordPage {
    constructor(section) {
      this.container = section.container;

      this.trigger = this.container.querySelector(selectors$V.trigger);
      this.errors = this.container.querySelector(selectors$V.errors);

      this.init();
    }

    init() {
      modal('password');
      if (this.errors) {
        this.trigger.click();
      }
    }
  }

  const passwordSection = {
    onLoad() {
      sections$o[this.id] = new PasswordPage(this);
    },
  };

  register('password', passwordSection);

  /**
   * Gift Card Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Gift Card template.
   */

  (function () {
    var config = {
      qrCode: '#QrCode',
      giftCardCode: '.giftcard__code',
    };

    // init QR code
    const qrCode = document.querySelector(config.qrCode);
    if (qrCode) {
      function loadGiftCard() {
        const qrCodeText = qrCode.getAttribute('data-identifier');
        new QRCode(qrCode, {
          text: qrCodeText,
          width: 120,
          height: 120,
        });
      }
      window.addEventListener('load', loadGiftCard);
    }

    const giftCardCode = document.querySelector(config.giftCardCode);
    if (giftCardCode) {
      // Auto-select gift card code on click, based on ID passed to the function
      function selectText() {
        var text = document.querySelector('#GiftCardDigits');
        var range = '';

        if (document.body.createTextRange) {
          range = document.body.createTextRange();
          range.moveToElementText(text);
          range.select();
        } else if (window.getSelection) {
          var selection = window.getSelection();
          range = document.createRange();
          range.selectNodeContents(text);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      giftCardCode.addEventListener('click', selectText());
    }
  })();

  const selectors$U = {
    parallaxWrapper: '[data-parallax-wrapper]',
    parallaxImg: '[data-parallax-img]',
  };

  let sections$n = {};

  const parallaxImage = {
    onLoad() {
      sections$n[this.id] = [];
      const frames = this.container.querySelectorAll(selectors$U.parallaxWrapper);
      frames.forEach((frame) => {
        const inner = frame.querySelector(selectors$U.parallaxImg);
        sections$n[this.id].push(
          new Rellax(inner, {
            center: true,
            round: true,
            frame: frame,
          })
        );
      });
    },
    onUnload: function () {
      sections$n[this.id].forEach((image) => {
        if (typeof image.destroy === 'function') {
          image.destroy();
        }
      });
    },
  };

  register('article', parallaxImage);

  const selectors$T = {
    frame: '[data-ticker-frame]',
    scale: '[data-ticker-scale]',
    text: '[data-ticker-text]',
    clone: 'data-clone',
    animationClass: 'ticker--animated',
    unloadedClass: 'ticker--unloaded',
    comparitorClass: 'ticker__comparitor',
    moveTime: 1.63, // 100px going to move for 1.63s
    space: 100, // 100px
  };

  const sections$m = {};

  class Ticker {
    constructor(el, stopClone = false) {
      this.frame = el;
      this.stopClone = stopClone;
      this.scale = this.frame.querySelector(selectors$T.scale);
      this.text = this.frame.querySelector(selectors$T.text);

      this.comparitor = this.text.cloneNode(true);
      this.comparitor.classList.add(selectors$T.comparitorClass);
      this.frame.appendChild(this.comparitor);
      this.scale.classList.remove(selectors$T.unloadedClass);
      this.resizeEvent = debounce(() => this.checkWidth(), 300);
      this.listen();
    }

    unload() {
      document.removeEventListener('theme:resize', this.resizeEvent);
    }

    listen() {
      document.addEventListener('theme:resize', this.resizeEvent);
      this.checkWidth();
    }

    checkWidth() {
      const padding = window.getComputedStyle(this.frame).paddingLeft.replace('px', '') * 2;

      if (this.frame.clientWidth - padding < this.comparitor.clientWidth || this.stopClone) {
        this.text.classList.add(selectors$T.animationClass);
        if (this.scale.childElementCount === 1) {
          this.clone = this.text.cloneNode(true);
          this.clone.setAttribute('aria-hidden', true);
          this.clone.setAttribute(selectors$T.clone, '');
          this.scale.appendChild(this.clone);

          if (this.stopClone) {
            for (let index = 0; index < 10; index++) {
              const cloneSecond = this.text.cloneNode(true);
              cloneSecond.setAttribute('aria-hidden', true);
              cloneSecond.setAttribute(selectors$T.clone, '');
              this.scale.appendChild(cloneSecond);
            }
          }
        }

        const animationTimeFrame = (this.text.clientWidth / selectors$T.space) * selectors$T.moveTime;

        this.scale.style.setProperty('--animation-time', `${animationTimeFrame}s`);
      } else {
        this.text.classList.add(selectors$T.animationClass);
        let clone = this.scale.querySelector(`[${selectors$T.clone}]`);
        if (clone) {
          this.scale.removeChild(clone);
        }
        this.text.classList.remove(selectors$T.animationClass);
      }
    }
  }

  const ticker = {
    onLoad() {
      sections$m[this.id] = [];
      const el = this.container.querySelectorAll(selectors$T.frame);
      el.forEach((el) => {
        sections$m[this.id].push(new Ticker(el));
      });
    },
    onUnload() {
      sections$m[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const selectors$S = {
    speed: 'data-slider-speed',
    slideAttribute: 'data-slide',
    dataSlideIndex: 'data-slide-index',
  };

  class AnnouncementSlider {
    constructor(container, el) {
      this.container = container;
      this.slideshow = el;
      const speedElement = this.slideshow.getAttribute(selectors$S.speed);
      this.speed = speedElement ? parseInt(speedElement) : false;
      this.scrollEvent = () => this.scrollEvents();
      this.resizeEvent = () => this.resizeEvents();

      if (!this.slideshow) return;

      this.flkty = null;

      this.init();
    }

    init() {
      const sliderOptions = {
        initialIndex: 0,
        autoPlay: this.speed,
        contain: true,
        pageDots: false,
        adaptiveHeight: true,
        wrapAround: true,
        groupCells: false,
        cellAlign: 'left',
        freeScroll: false,
        prevNextButtons: true,
        draggable: true,
        rightToLeft: window.isRTL,
        on: {
          ready: () => {
            setTimeout(() => {
              this.slideshow.dispatchEvent(
                new CustomEvent('theme:announcement:loaded', {
                  bubbles: true,
                  detail: {
                    slider: this,
                  },
                })
              );
            }, 50);
          },
        },
      };

      this.flkty = new Flickity(this.slideshow, sliderOptions);

      if (this.flkty) {
        document.addEventListener('theme:resize', this.resizeEvent);
        document.addEventListener('theme:scroll', this.scrollEvent);
      }
    }

    resizeEvents() {
      this.flkty.resize();
    }

    scrollEvents() {
      if (this.flkty && this.speed) {
        const slideshow = this.flkty.element;
        const slideshowBottomPosition = slideshow.getBoundingClientRect().top + window.scrollY + slideshow.offsetHeight;
        if (window.pageYOffset > slideshowBottomPosition) {
          if (this.flkty.player.state === 'playing') {
            this.flkty.pausePlayer();
          }
        } else if (this.flkty.player.state === 'paused') {
          this.flkty.playPlayer();
        }
      }
    }

    onUnload() {
      if (this.slideshow && this.flkty) {
        document.removeEventListener('theme:resize', this.resizeEvent);
        document.removeEventListener('theme:scroll', this.scrollEvent);
        this.flkty.options.watchCSS = false;
        this.flkty.destroy();
      }
    }

    onBlockSelect(evt) {
      if (!this.slideshow) return;
      // Ignore the cloned version
      const slide = this.slideshow.querySelector(`[${selectors$S.slideAttribute}="${evt.detail.blockId}"]`);

      if (!slide) return;
      const slideIndex = parseInt(slide.getAttribute(selectors$S.dataSlideIndex));

      // Go to selected slide, pause autoplay
      this.flkty.selectCell(slideIndex);
      this.flkty.stopPlayer();
    }

    onBlockDeselect() {
      this.flkty.playPlayer();
    }
  }

  const selectors$R = {
    cartMessage: '[data-cart-message]',
    cartMessageValue: 'data-cart-message',
    leftToSpend: '[data-left-to-spend]',
    cartProgress: '[data-cart-progress]',
    limit: 'data-limit',
    percent: 'data-percent',
  };

  const classes$B = {
    isHidden: 'is-hidden',
    isSuccess: 'is-success',
  };

  class CartShippingMessage {
    constructor(section) {
      this.container = section;
      this.cartMessage = this.container.querySelectorAll(selectors$R.cartMessage);
      this.rate = window.Shopify.currency.rate;

      if (this.cartMessage.length > 0) {
        this.init();
      }
    }

    init() {
      this.cartFreeLimitShipping = Number(this.cartMessage[0].getAttribute(selectors$R.limit)) * 100 * this.rate;
      this.shippingAmount = 0;
      this.circumference = 28 * Math.PI; // radius - stroke * 4 * PI

      this.exchangeRateConversions(this.cartFreeLimitShipping, this.shippingAmount);
      this.cartBarProgress();
      this.listen();
    }

    listen() {
      document.addEventListener(
        'theme:cart:change',
        function (event) {
          this.cart = event.detail.cart;
          this.render();
        }.bind(this)
      );
    }

    render() {
      const totalPrice = this.cart.total_price;
      this.freeShippingMessageHandle(totalPrice);

      if (this.cart && this.cart.total_price) {
        // Build cart again if the quantity of the changed product is 0 or cart discounts are changed
        if (this.cartMessage.length > 0) {
          this.shippingAmount = totalPrice;
          this.updateProgress();
        }
      }
    }

    freeShippingMessageHandle(total) {
      if (this.cartMessage.length > 0) {
        this.container.querySelectorAll(selectors$R.cartMessage).forEach((message) => {
          const hasFreeShipping = message.hasAttribute(selectors$R.cartMessageValue) && message.getAttribute(selectors$R.cartMessageValue) === 'true' && total >= this.cartFreeLimitShipping && total !== 0;

          message.classList.toggle(classes$B.isSuccess, hasFreeShipping);
        });
      }
    }

    cartBarProgress(progress = null) {
      this.container.querySelectorAll(selectors$R.cartProgress).forEach((element) => {
        this.setProgress(element, progress === null ? element.getAttribute(selectors$R.percent) : progress);
      });
    }

    setProgress(holder, percent) {
      const offset = this.circumference - ((percent / 100) * this.circumference) / 2;

      holder.style.strokeDashoffset = offset;
    }

    updateProgress() {
      const newPercentValue = (this.shippingAmount / this.cartFreeLimitShipping) * 100;

      this.exchangeRateConversions(this.cartFreeLimitShipping, this.shippingAmount);
      this.cartBarProgress(newPercentValue > 100 ? 100 : newPercentValue);
    }

    exchangeRateConversions(cartFreeLimitShipping, shippingAmount) {
      const leftToSpend = theme.settings.currency_code_enable
        ? themeCurrency.formatMoney(cartFreeLimitShipping - shippingAmount, theme.moneyFormat) + ` ${theme.currencyCode}`
        : themeCurrency.formatMoney(cartFreeLimitShipping - shippingAmount, theme.moneyFormat);

      this.container.querySelectorAll(selectors$R.leftToSpend).forEach((element) => {
        element.innerHTML = leftToSpend.replace('.00', '');
      });
    }
  }

  const selectors$Q = {
    bar: '[data-bar]',
    barSlide: '[data-slide]',
    frame: '[data-ticker-frame]',
    header: '[data-header-wrapper]',
    slider: '[data-announcement-slider]',
    slideValue: 'data-slide',
    tickerScale: '[data-ticker-scale]',
    tickerText: '[data-ticker-text]',
    dataTargetReferrer: 'data-target-referrer',
    slideAttribute: 'data-slide',
  };

  const classes$A = {
    mobileClass: 'mobile',
    desktopClass: 'desktop',
    trickerAnimated: 'ticker--animated',
  };

  const sections$l = {};

  class Bar$1 {
    constructor(section) {
      this.container = section.container;
      this.barHolder = this.container.querySelector(selectors$Q.bar);
      this.locationPath = location.href;

      this.slides = this.barHolder.querySelectorAll(selectors$Q.barSlide);
      this.slider = this.barHolder.querySelector(selectors$Q.slider);
      this.hasDeviceClass = '';

      new CartShippingMessage(this.container);

      this.init();
    }

    init() {
      this.removeAnnouncement();

      if (!this.slider) {
        this.initTickers(true);
      } else if (this.slider && this.slides && this.slides.length > 1) {
        this.initSliders();
      } else {
        this.initTickers();
      }
    }

    /**
     * Delete announcement which has a target referrer attribute and it is not contained in page URL
     */
    removeAnnouncement() {
      for (let index = 0; index < this.slides.length; index++) {
        const element = this.slides[index];

        if (!element.hasAttribute(selectors$Q.dataTargetReferrer)) {
          continue;
        }

        if (this.locationPath.indexOf(element.getAttribute(selectors$Q.dataTargetReferrer)) === -1 && !window.Shopify.designMode) {
          element.parentNode.removeChild(element);
        }
      }
    }

    /**
     * Init slider
     */
    initSliders() {
      this.slider = new AnnouncementSlider(this.container, this.slider);
      this.slider.flkty.reposition();

      this.barHolder.addEventListener('theme:announcement:loaded', () => {
        this.initTickers();
      });
    }

    /**
     * Init tickers in sliders
     */
    initTickers(stopClone = false) {
      const frame = this.barHolder.querySelector(selectors$Q.frame);

      if (frame) {
        new Ticker(frame, stopClone);
      }
    }

    toggleTicker(e, isStoped) {
      const tickerScale = document.querySelector(selectors$Q.tickerScale);
      const element = document.querySelector(`[${selectors$Q.slideValue}="${e.detail.blockId}"]`);

      if (isStoped && element) {
        tickerScale.setAttribute('data-stop', '');
        tickerScale.querySelectorAll(selectors$Q.tickerText).forEach((textHolder) => {
          textHolder.classList.remove(classes$A.trickerAnimated);
          textHolder.style.transform = `translate3d(${-(element.offsetLeft - element.clientWidth)}px, 0, 0)`;
        });
      }

      if (!isStoped && element) {
        tickerScale.querySelectorAll(selectors$Q.tickerText).forEach((textHolder) => {
          textHolder.classList.add(classes$A.trickerAnimated);
          textHolder.removeAttribute('style');
        });
        tickerScale.removeAttribute('data-stop');
      }
    }

    onBlockSelect(e) {
      if (this.slider && typeof this.slider.onBlockSelect === 'function') {
        this.slider.onBlockSelect(e);
      } else {
        const slides = document.querySelectorAll(`[${selectors$Q.slideAttribute}="${e.detail.blockId}"]`);

        slides.forEach((slide) => {
          if (slide.classList.contains(classes$A.mobileClass)) {
            this.hasDeviceClass = classes$A.mobileClass;
          }

          if (slide.classList.contains(classes$A.desktopClass)) {
            this.hasDeviceClass = classes$A.desktopClass;
          }

          if (this.hasDeviceClass !== '') {
            slide.classList.remove(this.hasDeviceClass);
          }
        });

        this.toggleTicker(e, true);
      }
    }

    onBlockDeselect(e) {
      if (this.slider && typeof this.slider.onBlockDeselect === 'function') {
        this.slider.onBlockDeselect(e);
      } else {
        if (this.hasDeviceClass !== '') {
          const slides = document.querySelectorAll(`[${selectors$Q.slideAttribute}="${e.detail.blockId}"]`);

          slides.forEach((slide) => {
            slide.classList.add(this.hasDeviceClass);
          });
        }

        this.toggleTicker(e, false);
      }
    }

    onUnload() {
      if (this.slider && typeof this.slider.onUnload === 'function') {
        this.slider.onUnload();
      }
    }
  }

  const bar = {
    onLoad() {
      sections$l[this.id] = [];
      sections$l[this.id].push(new Bar$1(this));
    },
    onUnload() {
      sections$l[this.id].forEach((el) => {
        if (typeof el.onUnload === 'function') {
          el.onUnload();
        }
      });
    },
    onBlockSelect(e) {
      sections$l[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(e);
        }
      });
    },
    onBlockDeselect(e) {
      sections$l[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockDeselect(e);
        }
      });
    },
  };

  register('announcement', bar);

  const selectors$P = {
    frame: '[data-ticker-frame]',
    slideValue: 'data-slide',
    tickerScale: '[data-ticker-scale]',
    tickerText: '[data-ticker-text]',
  };

  const classes$z = {
    trickerAnimated: 'ticker--animated',
  };

  const sections$k = {};

  class Bar {
    constructor(section) {
      this.container = section.container;

      this.init();
    }

    init() {
      this.initTickers(true);
    }

    /**
     * Init tickers in sliders
     */
    initTickers(stopClone = false) {
      const frame = this.container.querySelector(selectors$P.frame);

      if (frame) {
        new Ticker(frame, stopClone);
      }
    }

    toggleTicker(e, isStoped) {
      const tickerScale = this.container.querySelector(selectors$P.tickerScale);
      const element = this.container.querySelector(`[${selectors$P.slideValue}="${e.detail.blockId}"]`);

      if (isStoped && element && tickerScale) {
        tickerScale.setAttribute('data-stop', '');
        tickerScale.querySelectorAll(selectors$P.tickerText).forEach((textHolder) => {
          textHolder.classList.remove(classes$z.trickerAnimated);
          textHolder.style.transform = `translate3d(${-(element.offsetLeft - element.clientWidth)}px, 0, 0)`;
        });
      }

      if (!isStoped && element && tickerScale) {
        tickerScale.querySelectorAll(selectors$P.tickerText).forEach((textHolder) => {
          textHolder.classList.add(classes$z.trickerAnimated);
          textHolder.removeAttribute('style');
        });
        tickerScale.removeAttribute('data-stop');
      }
    }

    onBlockSelect(e) {
      this.toggleTicker(e, true);
    }

    onBlockDeselect(e) {
      this.toggleTicker(e, false);
    }
  }

  const logos = {
    onLoad() {
      sections$k[this.id] = [];
      sections$k[this.id].push(new Bar(this));
    },
    onBlockSelect(e) {
      sections$k[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(e);
        }
      });
    },
    onBlockDeselect(e) {
      sections$k[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockDeselect(e);
        }
      });
    },
  };

  register('logos', logos);

  register('blog', parallaxImage);

  var selectors$O = {
    drawerWrappper: '[data-drawer]',
    drawerScrolls: '[data-drawer-scrolls]',
    underlay: '[data-drawer-underlay]',
    stagger: '[data-stagger-animation]',
    drawerToggle: 'data-drawer-toggle',
    children: ':scope > * > [data-animates]',
    focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  var classes$y = {
    isVisible: 'drawer--visible',
    displayNone: 'display-none',
  };

  var sections$j = {};

  class Drawer {
    constructor(el) {
      this.drawer = el;
      this.drawerScrolls = this.drawer.querySelector(selectors$O.drawerScrolls);
      this.underlay = this.drawer.querySelector(selectors$O.underlay);
      this.key = this.drawer.dataset.drawer;
      const btnSelector = `[${selectors$O.drawerToggle}='${this.key}']`;
      this.buttons = document.querySelectorAll(btnSelector);
      this.staggers = this.drawer.querySelectorAll(selectors$O.stagger);

      this.connectToggle();
      this.connectDrawer();
      this.closers();
      this.staggerChildAnimations();
    }

    unload() {
      // wipe listeners
    }

    connectToggle() {
      this.buttons.forEach((btn) => {
        btn.addEventListener(
          'click',
          function (e) {
            e.preventDefault();
            this.drawer.dispatchEvent(
              new CustomEvent('theme:drawer:toggle', {
                bubbles: false,
              })
            );
          }.bind(this)
        );
      });
    }

    connectDrawer() {
      this.drawer.addEventListener(
        'theme:drawer:toggle',
        function () {
          if (this.drawer.classList.contains(classes$y.isVisible)) {
            this.drawer.dispatchEvent(
              new CustomEvent('theme:drawer:close', {
                bubbles: false,
              })
            );
          } else {
            this.drawer.dispatchEvent(
              new CustomEvent('theme:drawer:open', {
                bubbles: false,
              })
            );
          }
        }.bind(this)
      );
      this.drawer.addEventListener('theme:drawer:close', this.hideDrawer.bind(this));
      this.drawer.addEventListener('theme:drawer:open', this.showDrawer.bind(this));
    }

    staggerChildAnimations() {
      this.staggers.forEach((el) => {
        const children = el.querySelectorAll(selectors$O.children);
        children.forEach((child, index) => {
          child.style.transitionDelay = `${index * 50 + 10}ms`;
        });
      });
    }

    closers() {
      this.drawer.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideDrawer();
          this.buttons[0].focus();
        }.bind(this)
      );

      this.underlay.addEventListener(
        'click',
        function () {
          this.hideDrawer();
        }.bind(this)
      );
    }

    showDrawer() {
      this.drawer.classList.remove(classes$y.displayNone);
      // animates after display none is removed
      setTimeout(() => {
        this.buttons.forEach((el) => el.setAttribute('aria-expanded', true));
        this.drawer.classList.add(classes$y.isVisible);
        document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true, detail: this.drawerScrolls}));
        const firstFocus = this.drawer.querySelector(selectors$O.focusable);
        trapFocus(this.drawer, {elementToFocus: firstFocus});
      }, 1);
    }

    hideDrawer() {
      this.buttons.forEach((el) => el.setAttribute('aria-expanded', true));
      this.drawer.classList.remove(classes$y.isVisible);
      this.drawerScrolls.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));

      document.dispatchEvent(new CustomEvent('theme:sliderule:close', {bubbles: false}));
      removeTrapFocus();

      // adds display none after animations
      setTimeout(() => {
        if (!this.drawer.classList.contains(classes$y.isVisible)) {
          this.drawer.classList.add(classes$y.displayNone);
        }
      }, 800);
    }
  }

  const drawer = {
    onLoad() {
      sections$j[this.id] = [];
      const els = this.container.querySelectorAll(selectors$O.drawerWrappper);
      els.forEach((el) => {
        sections$j[this.id].push(new Drawer(el));
      });
    },
    onUnload: function () {
      sections$j[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const selectors$N = {
    announcement: '#shopify-section-announcement',
    transparent: 'data-header-transparent',
    header: '[data-header-wrapper] header',
  };

  const classes$x = {
    stuck: 'js__header__stuck',
    stuckAnimated: 'js__header__stuck--animated',
    triggerAnimation: 'js__header__stuck--trigger-animation',
    stuckBackdrop: 'js__header__stuck__backdrop',
  };

  let sections$i = {};

  class Sticky {
    constructor(el) {
      this.wrapper = el;
      this.type = this.wrapper.dataset.headerSticky;
      this.transparent = this.wrapper.dataset.headerTransparent;
      this.sticks = this.type === 'sticky';
      this.animated = this.type === 'directional';
      this.currentlyStuck = false;
      this.cls = this.wrapper.classList;
      const announcementEl = document.querySelector(selectors$N.announcement);
      const announcementHeight = announcementEl ? announcementEl.clientHeight : 0;
      const headerHeight = document.querySelector(selectors$N.header).clientHeight;
      this.blur = headerHeight + announcementHeight;
      this.stickDown = headerHeight + announcementHeight;
      this.stickUp = announcementHeight;
      if (this.wrapper.getAttribute(selectors$N.transparent) !== 'false') {
        this.blur = announcementHeight;
      }
      if (this.sticks) {
        this.stickDown = announcementHeight;
        this.scrollDownInit();
      }
      this.listen();
    }

    unload() {
      document.removeEventListener('theme:scroll', this.listen);
      document.removeEventListener('theme:scroll:up', this.scrollUpDirectional);
      document.removeEventListener('theme:scroll:down', this.scrollDownDirectional);
    }

    listen() {
      if (this.sticks || this.animated) {
        document.addEventListener('theme:scroll', (e) => {
          if (e.detail.down) {
            if (!this.currentlyStuck && e.detail.position > this.stickDown) {
              this.stickSimple();
            }
            if (!this.currentlyBlurred && e.detail.position > this.blur) {
              this.addBlur();
            }
          } else {
            if (e.detail.position <= this.stickUp) {
              this.unstickSimple();
            }
            if (e.detail.position <= this.blur) {
              this.removeBlur();
            }
          }
        });
      }
      if (this.animated) {
        document.addEventListener('theme:scroll:up', this.scrollUpDirectional.bind(this));
        document.addEventListener('theme:scroll:down', this.scrollDownDirectional.bind(this));
      }
    }

    stickSimple() {
      if (this.animated) {
        this.cls.add(classes$x.stuckAnimated);
      }
      this.cls.add(classes$x.stuck);
      this.wrapper.setAttribute(selectors$N.transparent, false);
      this.currentlyStuck = true;
    }

    unstickSimple() {
      this.cls.remove(classes$x.stuck);
      this.wrapper.setAttribute(selectors$N.transparent, this.transparent);
      if (this.animated) {
        this.cls.remove(classes$x.stuckAnimated);
      }
      this.currentlyStuck = false;
    }

    scrollDownInit() {
      if (window.scrollY > this.stickDown) {
        this.stickSimple();
      }
      if (window.scrollY > this.blur) {
        this.addBlur();
      }
    }

    stickDirectional() {
      this.cls.add(classes$x.triggerAnimation);
    }

    unstickDirectional() {
      this.cls.remove(classes$x.triggerAnimation);
    }

    scrollDownDirectional() {
      this.unstickDirectional();
    }

    scrollUpDirectional() {
      if (window.scrollY <= this.stickDown) {
        this.unstickDirectional();
      } else {
        this.stickDirectional();
      }
    }

    addBlur() {
      this.cls.add(classes$x.stuckBackdrop);
      this.currentlyBlurred = true;
    }

    removeBlur() {
      this.cls.remove(classes$x.stuckBackdrop);
      this.currentlyBlurred = false;
    }
  }

  const stickyHeader = {
    onLoad() {
      sections$i = new Sticky(this.container);
    },
    onUnload: function () {
      if (typeof sections$i.unload === 'function') {
        sections$i.unload();
      }
    },
  };

  const selectors$M = {
    disclosureToggle: 'data-hover-disclosure-toggle',
    disclosureWrappper: '[data-hover-disclosure]',
    link: '[data-top-link]',
    wrapper: '[data-header-wrapper]',
    stagger: '[data-stagger]',
    staggerPair: '[data-stagger-first]',
    staggerAfter: '[data-stagger-second]',
    staggerImage: '[data-grid-item], [data-header-image]',
  };

  const classes$w = {
    isVisible: 'is-visible',
    meganavVisible: 'meganav--visible',
    grandparent: 'grandparent',
  };

  let sections$h = {};
  let disclosures = {};

  class HoverDisclosure {
    constructor(el) {
      this.disclosure = el;
      this.wrapper = el.closest(selectors$M.wrapper);
      this.key = this.disclosure.id;
      const btnSelector = `[${selectors$M.disclosureToggle}='${this.key}']`;
      this.trigger = document.querySelector(btnSelector);
      this.link = this.trigger.querySelector(selectors$M.link);
      this.grandparent = this.trigger.classList.contains(classes$w.grandparent);

      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.connectHoverToggle();
      this.handleTablets();
      this.staggerChildAnimations();
    }

    onBlockSelect(evt) {
      if (this.disclosure.contains(evt.target)) {
        this.showDisclosure();
      }
    }

    onBlockDeselect(evt) {
      if (this.disclosure.contains(evt.target)) {
        this.hideDisclosure();
      }
    }

    showDisclosure() {
      if (this.grandparent) {
        this.wrapper.classList.add(classes$w.meganavVisible);
      } else {
        this.wrapper.classList.remove(classes$w.meganavVisible);
      }
      this.trigger.setAttribute('aria-expanded', true);
      this.trigger.classList.add(classes$w.isVisible);
      this.disclosure.classList.add(classes$w.isVisible);
    }

    hideDisclosure() {
      this.disclosure.classList.remove(classes$w.isVisible);
      this.trigger.classList.remove(classes$w.isVisible);
      this.trigger.setAttribute('aria-expanded', false);
      this.wrapper.classList.remove(classes$w.meganavVisible);
    }

    staggerChildAnimations() {
      const simple = this.disclosure.querySelectorAll(selectors$M.stagger);
      simple.forEach((el, index) => {
        el.style.transitionDelay = `${index * 50 + 10}ms`;
      });

      const pairs = this.disclosure.querySelectorAll(selectors$M.staggerPair);
      pairs.forEach((child, i) => {
        const d1 = i * 150;
        child.style.transitionDelay = `${d1}ms`;
        child.parentElement.querySelectorAll(selectors$M.staggerAfter).forEach((grandchild, i2) => {
          const di1 = i2 + 1;
          const d2 = di1 * 20;
          grandchild.style.transitionDelay = `${d1 + d2}ms`;
        });
      });

      const images = this.disclosure.querySelectorAll(selectors$M.staggerImage);
      images.forEach((el, index) => {
        el.style.transitionDelay = `${(index + 1) * 80}ms`;
      });
    }

    handleTablets() {
      // first click opens the popup, second click opens the link
      this.trigger.addEventListener(
        'touchstart',
        function (e) {
          const isOpen = this.disclosure.classList.contains(classes$w.isVisible);
          if (!isOpen) {
            e.preventDefault();
            this.showDisclosure();
          }
        }.bind(this),
        {passive: true}
      );
    }

    connectHoverToggle() {
      this.trigger.addEventListener('mouseenter', this.showDisclosure.bind(this));
      this.link.addEventListener('focus', this.showDisclosure.bind(this));

      this.trigger.addEventListener('mouseleave', this.hideDisclosure.bind(this));
      this.trigger.addEventListener(
        'focusout',
        function (e) {
          const inMenu = this.trigger.contains(e.relatedTarget);
          if (!inMenu) {
            this.hideDisclosure();
          }
        }.bind(this)
      );
      this.disclosure.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideDisclosure();
        }.bind(this)
      );
    }
  }

  const hoverDisclosure = {
    onLoad() {
      sections$h[this.id] = [];
      disclosures = this.container.querySelectorAll(selectors$M.disclosureWrappper);
      disclosures.forEach((el) => {
        sections$h[this.id].push(new HoverDisclosure(el));
      });
    },
    onBlockSelect(evt) {
      sections$h[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(evt);
        }
      });
    },
    onBlockDeselect(evt) {
      sections$h[this.id].forEach((el) => {
        if (typeof el.onBlockDeselect === 'function') {
          el.onBlockDeselect(evt);
        }
      });
    },
    onUnload: function () {
      sections$h[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const selectors$L = {
    item: '[data-main-menu-text-item]',
    wrapper: '[data-text-items-wrapper]',
    text: '.navtext',
    isActive: 'data-menu-active',
    sectionOuter: '[data-header-wrapper]',
    underlineCurrent: 'data-underline-current',
    defaultItem: '.menu__item.main-menu--active .navtext, .header__desktop__button.main-menu--active .navtext',
  };

  let sections$g = {};
  let defaultPositions = null;

  class HoverLine {
    constructor(el) {
      this.wrapper = el;
      this.itemList = this.wrapper.querySelectorAll(selectors$L.item);
      this.sectionOuter = document.querySelector(selectors$L.sectionOuter);
      this.underlineCurrent = this.sectionOuter.getAttribute(selectors$L.underlineCurrent) === 'true';
      this.defaultItem = null;
      if (this.underlineCurrent) {
        this.defaultItem = this.wrapper.querySelector(selectors$L.defaultItem);
      }
      this.setDefault();
      document.fonts.ready.then(() => {
        this.init();
      });
    }

    init() {
      if (this.itemList.length) {
        this.listen();
        this.listenResize();

        this.textBottom = null;
        this.setHeight();

        if (defaultPositions) {
          if (this.defaultItem) {
            const startingLeft = this.defaultItem.offsetLeft || 0;
            this.sectionOuter.style.setProperty('--bar-left', `${startingLeft}px`);
          }

          this.reset();
        } else {
          // initialize at left edge of first item im menu
          const startingLeft = this.sectionOuter.querySelector(selectors$L.item).offsetLeft;
          this.sectionOuter.style.setProperty('--bar-left', `${startingLeft}px`);
          this.sectionOuter.style.setProperty('--bar-width', '0px');
        }
        this.sectionOuter.style.setProperty('--bar-opacity', '1');
      }
    }

    unload() {
      document.removeEventListener('theme:resize', this.reset);
      defaultPositions = null;
    }

    listenResize() {
      document.addEventListener('theme:resize', this.reset.bind(this));
    }

    setDefault() {
      if (this.defaultItem) {
        defaultPositions = {
          left: this.defaultItem.offsetLeft || null,
          width: this.defaultItem.clientWidth || null,
        };
      }
    }

    setHeight() {
      const height = this.wrapper.clientHeight;
      const text = this.itemList[0].querySelector(selectors$L.text);
      const textHeight = text.clientHeight;
      const textBottom = Math.floor(height / 2 - textHeight / 2) - 4;
      if (this.textBottom !== textBottom) {
        this.sectionOuter.style.setProperty('--bar-text', `${textHeight}px`);
        this.sectionOuter.style.setProperty('--bar-bottom', `${textBottom}px`);
        this.textBottom = textBottom;
      }
    }

    listen() {
      this.itemList.forEach((element) => {
        element.addEventListener('mouseenter', (evt) => {
          const item = evt.target.querySelector(selectors$L.text);
          this.startBar(item);
        });
      });
      this.wrapper.addEventListener('mouseleave', this.clearBar.bind(this));
    }

    startBar(item) {
      this.setHeight();
      let active = this.sectionOuter.getAttribute(selectors$L.isActive) !== 'false';
      let left = item.offsetLeft;
      let width = item.clientWidth;
      if (active) {
        this.render(width, left);
      } else {
        this.sectionOuter.setAttribute(selectors$L.isActive, true);
        this.render(0, left);
        setTimeout(() => {
          this.render(width, left);
        }, 10);
      }
    }

    render(width, left) {
      this.sectionOuter.style.setProperty('--bar-left', `${left}px`);
      this.sectionOuter.style.setProperty('--bar-width', `${width}px`);
    }

    reset() {
      this.setDefault();
      if (defaultPositions && defaultPositions.left && defaultPositions.width) {
        this.sectionOuter.style.setProperty('--bar-left', `${defaultPositions.left}px`);
        this.sectionOuter.style.setProperty('--bar-width', `${defaultPositions.width}px`);
      } else {
        this.sectionOuter.style.setProperty('--bar-width', '0px');
      }
    }

    clearBar() {
      // allow the bar to jump between text sections for cart and main menu
      this.sectionOuter.setAttribute(selectors$L.isActive, false);
      setTimeout(() => {
        let active = this.sectionOuter.getAttribute(selectors$L.isActive) !== 'false';
        if (!active) {
          this.reset();
        }
      }, 150);
    }
  }

  const hoverUnderline = {
    onLoad() {
      sections$g[this.id] = [];
      const els = this.container.querySelectorAll(selectors$L.wrapper);
      els.forEach((el) => {
        sections$g[this.id].push(new HoverLine(el));
      });
    },
    onUnload: function () {
      sections$g[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
      delete sections$g[this.id];
    },
  };

  const selectors$K = {
    price: 'data-header-cart-price',
    count: 'data-header-cart-count',
    dot: 'data-header-cart-full',
  };

  class Totals {
    constructor(el) {
      this.section = el;
      this.counts = this.section.querySelectorAll(`[${selectors$K.count}]`);
      this.prices = this.section.querySelectorAll(`[${selectors$K.price}]`);
      this.dots = this.section.querySelectorAll(`[${selectors$K.dot}]`);
      this.cart = null;
      this.listen();
    }

    listen() {
      document.addEventListener(
        'theme:cart:change',
        function (event) {
          this.cart = event.detail.cart;
          this.update();
        }.bind(this)
      );
    }

    update() {
      if (this.cart) {
        this.prices.forEach((price) => {
          price.setAttribute(selectors$K.price, this.cart.total_price);
          const newTotal = themeCurrency.formatMoney(this.cart.total_price, theme.moneyFormat);
          price.innerHTML = newTotal;
        });
        this.counts.forEach((count) => {
          count.setAttribute(selectors$K.count, this.cart.item_count);
          count.innerHTML = `(${this.cart.item_count})`;
        });
        this.dots.forEach((dot) => {
          const full = this.cart.item_count > 0;
          dot.setAttribute(selectors$K.dot, full);
        });
      }
    }
  }
  const headerTotals = {
    onLoad() {
      new Totals(this.container);
    },
  };

  const selectors$J = {
    wrapper: '[data-search-popdown-wrap]',
    popdownTrigger: 'data-popdown-toggle',
    close: '[data-close-popdown]',
    input: '[data-predictive-search-input]',
    underlay: '[data-search-underlay]',
  };

  const classes$v = {
    underlayVisible: 'underlay--visible',
    isVisible: 'is-visible',
  };

  let sections$f = {};

  class SearchPopdownTriggers {
    constructor(trigger) {
      this.trigger = trigger;
      this.key = this.trigger.getAttribute(selectors$J.popdownTrigger);
      this.popdown = document.querySelector(`[id='${this.key}']`);
      this.input = this.popdown.querySelector(selectors$J.input);
      this.close = this.popdown.querySelector(selectors$J.close);
      this.wrapper = this.popdown.closest(selectors$J.wrapper);
      this.underlay = this.wrapper.querySelector(selectors$J.underlay);

      this.initTriggerEvents();
      this.initPopdownEvents();
    }

    initTriggerEvents() {
      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);
      this.trigger.addEventListener(
        'click',
        function (evt) {
          evt.preventDefault();
          this.showPopdown();
        }.bind(this)
      );
      this.trigger.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.SPACE) {
            return;
          }
          this.showPopdown();
        }.bind(this)
      );
    }

    initPopdownEvents() {
      this.popdown.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hidePopdown();
        }.bind(this)
      );
      this.close.addEventListener(
        'click',
        function () {
          this.hidePopdown();
        }.bind(this)
      );
      this.underlay.addEventListener(
        'click',
        function () {
          this.hidePopdown();
        }.bind(this)
      );
    }

    hidePopdown() {
      this.popdown.classList.remove(classes$v.isVisible);
      this.underlay.classList.remove(classes$v.underlayVisible);
      this.trigger.focus();
      this.input.value = '';
      removeTrapFocus();
      this.input.dispatchEvent(new CustomEvent('theme:search:clear', {bubbles: false}));
      this.popdown.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
    }

    showPopdown() {
      this.input.value = '';
      this.popdown.classList.add(classes$v.isVisible);
      this.underlay.classList.add(classes$v.underlayVisible);
      trapFocus(this.popdown, {elementToFocus: this.input});
      this.popdown.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
    }
  }

  const searchPopdown = {
    onLoad() {
      sections$f[this.id] = {};
      const trigger = this.container.querySelector(`[${selectors$J.popdownTrigger}]`);
      if (trigger) {
        sections$f[this.id] = new SearchPopdownTriggers(trigger);
      }
    },
    onUnload: function () {
      if (typeof sections$f[this.id].unload === 'function') {
        sections$f[this.id].unload();
      }
    },
  };

  const selectors$I = {
    productGridItemLink: '[data-grid-link]',
    dataGridImages: 'data-grid-images',
    dataGridImage: 'data-grid-image',
    dataGridImageTarget: 'data-grid-image-target',
    dataGridImageTargetDefault: 'data-grid-image-target-default',
    dataGridPagination: 'data-grid-pagination',
    dataGridPage: 'data-grid-page',
    dataSiblingProduct: 'data-sibling-product',
    dataSiblingIndex: 'data-sibling-index',
    dataSiblingFetchIndex: 'data-sibling-fetch-index',
    dataSiblingId: 'data-sibling-id',
    dataUpsell: 'data-upsell',
    dataUpsellHolder: 'data-upsell-holder',
    dataStopSlideshowMobile: 'data-stop-slideshow-mobile',
    dataPopup: 'data-popup-',
    styleWidth: '--width',
  };

  const classes$u = {
    active: 'is-active',
    fade: 'is-fade',
    slideshow: 'is-slideshow',
    mobile: 'is-mobile',
    siblingCurrent: 'siblings__link--current',
    pagination: 'product-grid-item__pagination',
    productGridItemImage: 'product-grid-item__image',
  };

  const times$2 = {
    timeout: 1500, //miliseconds
  };

  class ProductGridItem extends HTMLElement {
    constructor() {
      super();

      this.container = this;
      this.mobileStopSlideshow = this.container.getAttribute(selectors$I.dataStopSlideshowMobile) === 'true';
      this.imagesHolder = this.container.querySelector(`[${selectors$I.dataGridImages}]`);
      this.images = this.container.querySelectorAll(`[${selectors$I.dataGridImage}]`);
      this.links = this.container.querySelectorAll(selectors$I.productGridItemLink);
      this.siblingProducts = this.container.querySelectorAll(`[${selectors$I.dataSiblingProduct}]`);
      this.imagesLimit = this.imagesHolder && this.imagesHolder.hasAttribute(selectors$I.dataGridImages) ? parseInt(this.imagesHolder.getAttribute(selectors$I.dataGridImages)) : 5;
      this.timeout = times$2.timeout;
      this.interval = null;
      this.mobileStopProgress = false;
      this.pagingProgressPause = false;
      this.pagingProgressCounter = 0;
      this.siblingProductsArr = [];
      this.siblingsFetchCounter = 0;
      this.siblingLoadImageIndex = null;
    }

    connectedCallback() {
      if (this.images.length > 1) {
        // Create slider of PGI images if the images are more than 1
        this.createPaging();

        // Change the image if the swatch is clicked
        this.container.addEventListener('theme:swatch:change', (e) => {
          const id = e.detail.id;
          const target = this.container.querySelector(`[${selectors$I.dataGridImageTarget}="${id}"]`);
          if (target) {
            const index = target.getAttribute(selectors$I.dataGridImage);

            this.pagingProgressCounter = 0;
            this.changeImage(index);

            if (e.detail.stopSlideAnimation) {
              this.stopPaging();
            }
          }
        });
      }

      // Start/stop PGI images slider on hover (if the images are more than 1 or there are Sibling products)
      if (this.images.length > 1 || (this.siblingProducts.length && this.imagesHolder && this.imagesLimit > 1)) {
        if (this.mobileStopSlideshow) {
          this.checkMobile();
          document.addEventListener('theme:resize:width', () => this.checkMobile());
        }

        this.container.addEventListener('mouseenter', () => {
          this.pagingProgressPause = this.mobileStopProgress;
          this.progressPaging();
        });

        this.container.addEventListener('mouseleave', () => {
          this.pagingProgressPause = true;
          this.progressPaging();
        });
      }

      // Fetch sibling product images and add them instead default PGI images
      if (this.siblingProducts.length && this.imagesHolder) {
        this.siblingProducts.forEach((element) => {
          if (!element.hasAttribute(selectors$I.dataSiblingProduct)) return;

          this.siblingHoverEvent(element);

          this.siblingClickEvent(element);
        });
      }
    }

    checkMobile() {
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      this.mobileStopProgress = windowWidth < window.theme.sizes.medium ? true : false;
      this.container.classList.toggle(classes$u.mobile, this.mobileStopProgress);
    }

    siblingHoverEvent(element) {
      // Fetch the sibling product JSON on first hover and push it to array
      element.addEventListener('mouseenter', () => {
        if (!element.hasAttribute(selectors$I.dataSiblingFetchIndex)) {
          const handle = element.getAttribute(selectors$I.dataSiblingProduct);
          getProductJson(handle).then((product) => {
            element.setAttribute(selectors$I.dataSiblingFetchIndex, this.siblingsFetchCounter);
            this.siblingProductsArr.push(product);

            if (element.hasAttribute(selectors$I.dataSiblingIndex) && this.siblingLoadImageIndex === parseInt(element.getAttribute(selectors$I.dataSiblingIndex))) {
              // Add the sibling product images to default PGI if the click event is executed before mouseenter
              this.siblingImagesCreate(this.siblingProductsArr[this.siblingsFetchCounter]);
              this.imagesHolder.setAttribute(selectors$I.dataSiblingFetchIndex, this.siblingsFetchCounter);

              this.siblingLoadImageIndex = null;
            }

            this.siblingsFetchCounter++;
          });
        }
      });
    }

    siblingClickEvent(element) {
      // Add the sibling product images to default PGI
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const siblingActive = this.container.querySelector(`[${selectors$I.dataSiblingProduct}].${classes$u.siblingCurrent}`);
        if (siblingActive) {
          siblingActive.classList.remove(classes$u.siblingCurrent);
        }

        this.siblingLoadImageIndex = null;

        element.classList.add(classes$u.siblingCurrent);

        if (
          element.hasAttribute(selectors$I.dataSiblingFetchIndex) &&
          this.imagesHolder.hasAttribute(selectors$I.dataSiblingFetchIndex) &&
          element.getAttribute(selectors$I.dataSiblingFetchIndex) === this.imagesHolder.getAttribute(selectors$I.dataSiblingFetchIndex)
        ) {
          // Check if the sibling product images are added
          this.pagingProgressCounter = 0;
          this.changeImage(0);
          return;
        } else if (element.hasAttribute(selectors$I.dataSiblingFetchIndex) && this.siblingProductsArr.length) {
          // Check if the sibling product images are fetched and add them to default PGI images
          const fetchedIndex = parseInt(element.getAttribute(selectors$I.dataSiblingFetchIndex));
          this.imagesHolder.setAttribute(selectors$I.dataSiblingFetchIndex, fetchedIndex);
          this.siblingImagesCreate(this.siblingProductsArr[fetchedIndex]);
        } else if (element.hasAttribute(selectors$I.dataSiblingIndex)) {
          // Go to hover event if the sibling product images are not loaded on hover
          this.siblingLoadImageIndex = parseInt(element.getAttribute(selectors$I.dataSiblingIndex));
        }

        // Add sibling product link to default PGI link
        if (this.links.length) {
          this.links.forEach((link) => {
            link.href = element.href;
          });
        }

        // Change upsell/quickview product on sibling product click
        const upsell = this.container.querySelector(`[${selectors$I.dataUpsell}]`);
        const upsellHolder = this.container.querySelector(`[${selectors$I.dataUpsellHolder}]`);
        if (upsell && upsellHolder && element.hasAttribute(selectors$I.dataSiblingId) && element.hasAttribute(selectors$I.dataSiblingProduct)) {
          const siblingId = element.getAttribute(selectors$I.dataSiblingId);
          const upsellId = upsell.getAttribute(selectors$I.dataUpsell);
          const btnPopup = this.container.querySelector(`[${selectors$I.dataPopup}${upsellId}]`);
          upsellHolder.setAttribute(selectors$I.dataUpsellHolder, siblingId);
          if (btnPopup) {
            btnPopup.removeAttribute(`${selectors$I.dataPopup}${upsellId}`);
            btnPopup.setAttribute(`${selectors$I.dataPopup}${siblingId}`, element.getAttribute(selectors$I.dataSiblingProduct));
          }
          upsell.setAttribute(selectors$I.dataUpsell, siblingId);
        }
      });
    }

    siblingImagesCreate(product) {
      // Add siblings product images instead default PGI images
      if (!product) return;
      const mediaItems = product.media;
      let imagesHtml = '';
      if (mediaItems && mediaItems.length) {
        const ratio = window.devicePixelRatio || 1;
        const pixels = this.imagesHolder.offsetWidth * ratio;
        const widthRounded = Math.ceil(pixels / 180) * 180;
        for (const [index, media] of mediaItems.entries()) {
          const sizedImage = getSizedImageUrl(media.preview_image.src, `${widthRounded}x`);
          let activeClass = '';
          if (index === 0) {
            activeClass = ` ${classes$u.active}`;
          }
          imagesHtml += `<div class="${classes$u.productGridItemImage}${activeClass}" ${selectors$I.dataGridImage}="${index}" ${selectors$I.dataGridImageTarget}="${media.id}" ${selectors$I.dataGridImageTargetDefault}="${media.id}" style="background-color: #fff; background-image: url('${sizedImage}');">&nbsp;</div>`;

          if (index + 1 === this.imagesLimit) {
            break;
          }
        }
      }

      this.imagesHolder.innerHTML = imagesHtml;
      this.images = this.container.querySelectorAll(`[${selectors$I.dataGridImage}]`);

      this.container.classList.toggle(classes$u.slideshow, this.images.length > 1);

      // Add fade effect when the sibling product images are added
      this.imagesHolder.classList.add(classes$u.fade);
      const timeoutDelay = parseFloat(window.getComputedStyle(this.imagesHolder).getPropertyValue('animation-duration')) * 1000;

      setTimeout(() => {
        this.imagesHolder.classList.remove(classes$u.fade);
      }, timeoutDelay);

      // Start/stop sibling product images slider
      if (this.images.length > 1) {
        this.createPaging();
        this.pagingProgressCounter = 0;
        this.progressPaging();
      } else {
        this.stopPaging();
        this.removePaging();
      }
    }

    changeImage(index = null) {
      // Change the image of slider
      const currentImage = this.container.querySelector(`[${selectors$I.dataGridImage}].${classes$u.active}`);
      const changedImage = index !== null ? this.images[index] : currentImage.nextSibling ? currentImage.nextSibling : this.images[0];

      if (currentImage) {
        currentImage.classList.remove(classes$u.active);
      }

      if (changedImage) {
        const changedImageIdx = changedImage.hasAttribute(selectors$I.dataGridImage) ? changedImage.getAttribute(selectors$I.dataGridImage) : 0;
        changedImage.classList.add(classes$u.active);

        this.changePaging(changedImageIdx);
      }
    }

    changePaging(index = 0) {
      // Change active class on slider pagination
      const activePage = this.container.querySelector(`[${selectors$I.dataGridPage}].${classes$u.active}`);
      const currentPage = this.container.querySelector(`[${selectors$I.dataGridPage}="${index}"]`);

      if (activePage) {
        activePage.style.setProperty(selectors$I.styleWidth, '100%');
        activePage.classList.remove(classes$u.active);
      }

      if (currentPage) {
        currentPage.classList.add(classes$u.active);
        this.progressPaging();
      }
    }

    progressPaging() {
      // Play/pause the PGI images slider
      const element = this.container.querySelector(`[${selectors$I.dataGridPage}].${classes$u.active}`);
      if (!element || this.mobileStopProgress) return;

      this.stopPaging();

      if (this.pagingProgressCounter === 0) {
        element.style.setProperty(selectors$I.styleWidth, '0%');
      }

      this.interval = setInterval(() => {
        if (this.pagingProgressCounter >= 100 && !this.pagingProgressPause) {
          this.stopPaging();
          this.pagingProgressCounter = 0;
          this.changeImage();
        } else if (!this.pagingProgressPause) {
          this.pagingProgressCounter++;
          element.style.setProperty(selectors$I.styleWidth, `${this.pagingProgressCounter}%`);
        }
      }, this.timeout / 100);
    }

    stopPaging() {
      // Stop slider
      if (this.interval) {
        clearInterval(this.interval);
      }
    }

    createPaging() {
      // Create pagination of PGI images slider
      if (this.imagesHolder) {
        let pagination = '';

        for (let index = 0; index < this.images.length; index++) {
          let activeClass = '';
          if (index === 0) {
            activeClass = `class="${classes$u.active}"`;
          }
          pagination += `<span ${activeClass} ${selectors$I.dataGridPage}="${index}">${index + 1}</span>`;
        }

        if (pagination !== '') {
          let pagingContainer = this.container.querySelector(`[${selectors$I.dataGridPagination}]`);
          if (!pagingContainer) {
            pagingContainer = document.createElement('div');
            pagingContainer.className = classes$u.pagination;
            pagingContainer.setAttribute(selectors$I.dataGridPagination, '');
          }

          pagingContainer.innerHTML = pagination;
          this.imagesHolder.parentElement.prepend(pagingContainer);
        }
      }
    }

    removePaging() {
      // Remove the slider pagination holder
      const pagingContainer = this.container.querySelector(`[${selectors$I.dataGridPagination}]`);
      if (pagingContainer) {
        pagingContainer.remove();
      }
    }
  }

  const selectors$H = {
    popoutWrapper: '[data-popout]',
    popoutList: '[data-popout-list]',
    popoutListScroll: 'data-popout-list-scroll',
    popoutToggle: 'data-popout-toggle',
    popoutInput: '[data-popout-input]',
    popoutOptions: '[data-popout-option]',
    popoutPrevent: 'data-popout-prevent',
    popoutQuantity: 'data-quantity-field',
    dataValue: 'data-value',
    ariaExpanded: 'aria-expanded',
    ariaCurrent: 'aria-current',
  };

  const classes$t = {
    listVisible: 'popout-list--visible',
    currentSuffix: '--current',
  };

  class PopoutSelect extends HTMLElement {
    constructor() {
      super();

      this.container = this.querySelector(selectors$H.popoutWrapper);
      this.popoutList = this.container.querySelector(selectors$H.popoutList);
      this.popoutToggle = this.container.querySelector(`[${selectors$H.popoutToggle}]`);
      this.outsidePopupToggle = document.querySelector(`[${selectors$H.popoutToggle}="${this.popoutList.id}"]`);
      this.popoutInput = this.container.querySelector(selectors$H.popoutInput);
      this.popoutOptions = this.container.querySelectorAll(selectors$H.popoutOptions);
      this.popoutPrevent = this.container.getAttribute(selectors$H.popoutPrevent) === 'true';

      this._connectOptions();
      this._connectToggle();
      this._onFocusOut();
      this.popupListMaxWidth();

      if (this.popoutInput && this.popoutInput.hasAttribute(selectors$H.popoutQuantity)) {
        document.addEventListener('theme:popout:update', this.updatePopout.bind(this));
      }

      document.addEventListener('theme:resize', () => {
        this.popupListMaxWidth();
      });
    }

    unload() {
      if (this.popoutOptions.length) {
        this.popoutOptions.forEach((element) => {
          element.removeEventListener('theme:popout:click', this.popupOptionsClick.bind(this));
          element.removeEventListener('click', this._connectOptionsDispatch.bind(this));
        });
      }

      this.popoutToggle.removeEventListener('click', this.popupToggleClick.bind(this));

      this.popoutToggle.removeEventListener('focusout', this.popupToggleFocusout.bind(this));

      this.popoutList.removeEventListener('focusout', this.popupListFocusout.bind(this));

      this.container.removeEventListener('keyup', this.containerKeyup.bind(this));

      if (this.outsidePopupToggle) {
        this.outsidePopupToggle.removeEventListener('click', this.popupToggleClick.bind(this));

        this.outsidePopupToggle.removeEventListener('focusout', this.popupToggleFocusout.bind(this));
      }
    }

    popupToggleClick(evt) {
      const ariaExpanded = evt.currentTarget.getAttribute(selectors$H.ariaExpanded) === 'true';
      evt.currentTarget.setAttribute(selectors$H.ariaExpanded, !ariaExpanded);
      this.popoutList.classList.toggle(classes$t.listVisible);
      this.popupListMaxWidth();

      if (this.popoutList.hasAttribute(selectors$H.popoutListScroll)) {
        setTimeout(() => {
          this.popoutList.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
        }, 1);
      }
    }

    popupToggleFocusout(evt) {
      const popoutLostFocus = this.container.contains(evt.relatedTarget);

      if (!popoutLostFocus) {
        this._hideList();
      }
    }

    popupListFocusout(evt) {
      const childInFocus = evt.currentTarget.contains(evt.relatedTarget);
      const isVisible = this.popoutList.classList.contains(classes$t.listVisible);

      if (isVisible && !childInFocus) {
        this._hideList();
      }
    }

    popupListMaxWidth() {
      this.popoutList.style.maxWidth = `${parseInt(document.body.clientWidth - this.popoutList.getBoundingClientRect().left)}px`;
    }

    popupOptionsClick(evt) {
      const link = evt.target.closest(selectors$H.popoutOptions);
      if (link.attributes.href.value === '#') {
        evt.preventDefault();

        let attrValue = '';

        if (evt.currentTarget.getAttribute(selectors$H.dataValue)) {
          attrValue = evt.currentTarget.getAttribute(selectors$H.dataValue);
        }

        this.popoutInput.value = attrValue;

        if (this.popoutPrevent) {
          this.popoutInput.dispatchEvent(new Event('change'));

          if (!evt.detail.preventTrigger && this.popoutInput.hasAttribute(selectors$H.popoutQuantity)) {
            this.popoutInput.dispatchEvent(new Event('input'));
          }

          const currentElement = this.popoutList.querySelector(`[class*="${classes$t.currentSuffix}"]`);
          let targetClass = classes$t.currentSuffix;

          if (currentElement && currentElement.classList.length) {
            for (const currentElementClass of currentElement.classList) {
              if (currentElementClass.includes(classes$t.currentSuffix)) {
                targetClass = currentElementClass;
                break;
              }
            }
          }

          const listTargetElement = this.popoutList.querySelector(`.${targetClass}`);

          if (listTargetElement) {
            listTargetElement.classList.remove(`${targetClass}`);
            evt.currentTarget.parentElement.classList.add(`${targetClass}`);
          }

          const targetAttribute = this.popoutList.querySelector(`[${selectors$H.ariaCurrent}]`);

          if (targetAttribute && targetAttribute.hasAttribute(`${selectors$H.ariaCurrent}`)) {
            targetAttribute.removeAttribute(`${selectors$H.ariaCurrent}`);
            evt.currentTarget.setAttribute(`${selectors$H.ariaCurrent}`, 'true');
          }

          if (attrValue !== '') {
            this.popoutToggle.textContent = attrValue;

            if (this.outsidePopupToggle) {
              this.outsidePopupToggle.textContent = attrValue;
            }
          }

          this.popupToggleFocusout(evt);
          this.popupListFocusout(evt);
        } else {
          this._submitForm(attrValue);
        }
      }
    }

    updatePopout(evt) {
      const targetElement = this.popoutList.querySelector(`[${selectors$H.dataValue}="${this.popoutInput.value}"]`);
      if (targetElement) {
        targetElement.dispatchEvent(
          new CustomEvent('theme:popout:click', {
            cancelable: true,
            bubbles: true,
            detail: {
              preventTrigger: true,
            },
          })
        );
      }
    }

    containerKeyup(evt) {
      if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
        return;
      }
      this._hideList();
      this.popoutToggle.focus();
    }

    bodyClick(evt) {
      const isOption = this.container.contains(evt.target);
      const isVisible = this.popoutList.classList.contains(classes$t.listVisible);
      this.outsidePopupToggle === evt.target;

      if (isVisible && !isOption) {
        this._hideList();
      }
    }

    _connectToggle() {
      this.popoutToggle.addEventListener('click', this.popupToggleClick.bind(this));

      if (this.outsidePopupToggle) {
        this.outsidePopupToggle.addEventListener('click', this.popupToggleClick.bind(this));
      }
    }

    _connectOptions() {
      if (this.popoutOptions.length) {
        this.popoutOptions.forEach((element) => {
          element.addEventListener('theme:popout:click', this.popupOptionsClick.bind(this));
          element.addEventListener('click', this._connectOptionsDispatch.bind(this));
        });
      }
    }

    _connectOptionsDispatch(evt) {
      const event = new CustomEvent('theme:popout:click', {
        cancelable: true,
        bubbles: true,
        detail: {
          preventTrigger: false,
        },
      });

      if (!evt.target.dispatchEvent(event)) {
        evt.preventDefault();
      }
    }

    _onFocusOut() {
      this.popoutToggle.addEventListener('focusout', this.popupToggleFocusout.bind(this));

      if (this.outsidePopupToggle) {
        this.outsidePopupToggle.addEventListener('focusout', this.popupToggleFocusout.bind(this));
      }

      this.popoutList.addEventListener('focusout', this.popupListFocusout.bind(this));

      this.container.addEventListener('keyup', this.containerKeyup.bind(this));

      document.body.addEventListener('click', this.bodyClick.bind(this));
    }

    _submitForm(value) {
      const form = this.container.closest('form');
      if (form) {
        form.submit();
      }
    }

    _hideList() {
      this.popoutList.classList.remove(classes$t.listVisible);
      this.popoutToggle.setAttribute(selectors$H.ariaExpanded, false);
      if (this.outsidePopupToggle) {
        this.outsidePopupToggle.setAttribute(selectors$H.ariaExpanded, false);
      }
    }
  }

  const slideDown = (target, duration = 500, checkHidden = true) => {
    let display = window.getComputedStyle(target).display;
    if (checkHidden && display !== 'none') {
      return;
    }
    target.style.removeProperty('display');
    if (display === 'none') display = 'block';
    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transitionTimingFunction = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.style.removeProperty('transition-timing-function');
    }, duration);
  };

  const slideUp = (target, duration = 500) => {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionTimingFunction = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.style.display = 'none';
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.style.removeProperty('transition-timing-function');
    }, duration);
  };

  let sections$e = {};

  const selectors$G = {
    wrapper: '[data-add-action-wrapper]',
    addButton: '[data-add-to-cart]',
    errors: '[data-add-action-errors]',
    addVariantDetached: 'data-add-to-cart-variant',
    popdown: '[data-product-add-popdown-wrapper]',
    disabledAjax: '[data-ajax-disable="true"]',
    upsellModal: '[data-upsell-modal]',
    productForm: '[data-product-form]',
    formHolder: '[data-form-holder]',
    inputFile: '[type="file"]',
  };

  const classes$s = {
    loading: 'loading',
    success: 'has-success',
  };

  const times$1 = {
    durationAddButtonDisable: 3500,
    hideErrorTime: 5000,
  };

  class ProductAddButton {
    constructor(wrapper, isCartItem) {
      this.wrapper = wrapper;
      this.isCartItem = isCartItem ? isCartItem : false;
      this.button = this.wrapper.querySelector(selectors$G.addButton);
      this.errors = this.wrapper.querySelector(selectors$G.errors);
      this.popdown = document.querySelector(selectors$G.popdown);
      this.disabledAjax = document.querySelector(selectors$G.disabledAjax);

      if (this.button) {
        const isDetached = this.button.hasAttribute(selectors$G.addVariantDetached);
        if (isDetached) {
          this.initDetached();
        } else {
          this.initWithForm();
        }
      }
    }

    /**
     * Has multi variants
     */
    initWithForm() {
      this.button.addEventListener(
        'click',
        function (evt) {
          evt.preventDefault();
          // outerHolder will be a section if the button in product section
          // outerHolder will be a modal if the button in upsell modal, the upsell modal it is outside of product section and loading with AJAX
          const outerHolder = evt.target.closest(selectors$G.formHolder);
          const outerForm = outerHolder.querySelector(selectors$G.productForm);

          if (outerForm.querySelector(selectors$G.inputFile)) {
            return;
          }

          if (!this.disabledAjax) {
            evt.preventDefault();
          }

          this.button.setAttribute('disabled', true);
          this.button.classList.add(classes$s.loading);

          const formData = new FormData(outerForm);
          const formString = new URLSearchParams(formData).toString();

          this.addToCartAction(formString);
        }.bind(this)
      );
    }

    /**
     * Has only one variant
     * Usually use it for upsell
     */
    initDetached() {
      this.button.addEventListener(
        'click',
        function (evt) {
          if (!this.disabledAjax) {
            evt.preventDefault();
          }

          this.button.setAttribute('disabled', true);
          this.button.classList.add(classes$s.loading);

          const variant = this.button.getAttribute(selectors$G.addVariantDetached);
          const formString = `form_type=product&id=${variant}`;

          this.addToCartAction(formString);
        }.bind(this)
      );
    }

    addToCartAction(formData) {
      const url = `${window.theme.routes.cart}/add.js`;
      const instance = this;
      axios
        .post(url, formData, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then(function (response) {
          instance.onSuccess(response.data);
        })
        .catch(function (error) {
          console.warn(error);
          instance.onError(error.data);
        });
    }

    onSuccess(variant) {
      this.updateHeaderTotal();
      this.button.classList.remove(classes$s.loading);
      this.button.classList.add(classes$s.success);
      setTimeout(() => {
        this.button.classList.remove(classes$s.success);
        this.button.removeAttribute('disabled');
      }, times$1.durationAddButtonDisable);

      if (this.button.closest(selectors$G.upsellModal)) {
        this.button.closest(selectors$G.upsellModal).dispatchEvent(new CustomEvent('theme:upsell:close'));
      }

      if (this.isCartItem) {
        document.dispatchEvent(new CustomEvent('theme:cart:reload', {bubbles: true}));
      } else {
        this.popdown.dispatchEvent(
          new CustomEvent('theme:cart:popdown', {
            detail: {
              variant: variant,
            },
            bubbles: true,
          })
        );
      }

      if (this.disabledAjax) {
        window.location.reload();
      }
    }

    onError(data) {
      let text = 'Network error: please try again';
      if (data && data.description) {
        text = data.description;
      }
      const errorsHTML = `<div class="errors">${text}</div>`;

      this.button.classList.remove(classes$s.loading);
      this.button.removeAttribute('disabled');
      this.errors.innerHTML = errorsHTML;
      slideDown(this.errors);
      setTimeout(() => {
        slideUp(this.errors);
      }, times$1.hideErrorTime);
    }

    updateHeaderTotal() {
      axios
        .get(`${window.theme.routes.cart}.js`)
        .then((response) => {
          document.dispatchEvent(
            new CustomEvent('theme:cart:change', {
              detail: {
                cart: response.data,
              },
              bubbles: true,
            })
          );
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  const productAddSection = {
    onLoad() {
      sections$e[this.id] = [];
      const els = this.container.querySelectorAll(selectors$G.wrapper);
      els.forEach((el) => {
        sections$e[this.id].push(new ProductAddButton(el));
      });
    },
    onUnload: function () {
      sections$e[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const throttle = (fn, wait) => {
    let prev, next;
    return function invokeFn(...args) {
      const now = Date.now();
      next = clearTimeout(next);
      if (!prev || now - prev >= wait) {
        // eslint-disable-next-line prefer-spread
        fn.apply(null, args);
        prev = now;
      } else {
        next = setTimeout(invokeFn.bind(null, ...args), wait - (now - prev));
      }
    };
  };

  const selectors$F = {
    sizeButton: '[data-size-button]',
    mediaHolder: '[data-media-slide]',
  };

  const classes$r = {
    classExpanded: 'is-expanded',
  };

  class ImageCaption {
    constructor(container) {
      this.container = container;
      this.sizeButtons = this.container.querySelectorAll(selectors$F.sizeButton);

      if (this.sizeButtons.length > 0) {
        this.init();
      }
    }

    init() {
      this.sizeButtons.forEach((button) => {
        button.addEventListener('click', () => {
          button.classList.toggle(classes$r.classExpanded);
          button.closest(selectors$F.mediaHolder).classList.toggle(classes$r.classExpanded);
        });
      });
    }
  }

  const selectors$E = {
    dataUpsell: 'data-upsell',
    upsellHolder: 'data-upsell-holder',
    addButtonWrapper: '[data-add-action-wrapper]',
    modalContent: '[data-product-upsell-ajax]',
    upsellModal: '[data-upsell-modal]',
    upsellModalScrolls: '[data-drawer-scrolls]',
    upsellModalTemplate: '[data-upsell-modal-template]',
    upsellHead: '[data-upsell-head]',
    upsellFormArea: '[data-upsell-form-area]',
    toggleButton: '[data-toggle-button]',
    media: '[data-media-slide]',
    mediaId: '[data-media-id]',
    cartLineItems: '[data-line-items]',
    dataPopup: 'data-popup-',
    focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  const classes$q = {
    hide: 'hide',
    active: 'is-active',
    expanded: 'is-expanded',
    loading: 'loading',
  };

  const visibleParts = {
    minPart: 250,
    mediumPart: 400,
  };

  class UpsellProduct extends HTMLElement {
    constructor() {
      super();

      this.container = this;
    }

    static get observedAttributes() {
      return [selectors$E.dataUpsell];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue) {
        this.disconnectedCallback();
        this.connectedCallback();
      }
    }

    connectedCallback() {
      this.upsellHolder = this.container.querySelector(`[${selectors$E.upsellHolder}]`);
      this.modalCloseEvent = () => this.modalClose();
      this.clickUpsellEvent = (e) => this.clickUpsellButton(e);

      if (this.upsellHolder) {
        this.isCartItem = Boolean(this.upsellHolder.closest(selectors$E.cartLineItems));
        this.modalTemplate = this.upsellHolder.querySelector(selectors$E.upsellModalTemplate);
        this.modal = document.querySelector(selectors$E.upsellModal);
        this.modalID = this.upsellHolder.getAttribute(selectors$E.upsellHolder);
        this.modalContent = null;
        this.modalScroll = null;
        this.scrollLockEnable = true;
        this.windowH = window.innerHeight;
        this.triggerButton = this.upsellHolder.querySelector(`[${selectors$E.dataPopup}${this.modalID}]`);
        this.handle = this.triggerButton ? this.triggerButton.getAttribute(`${selectors$E.dataPopup}${this.modalID}`) : null;

        if (this.modalTemplate && !this.modal) {
          const modalTemplateInner = this.modalTemplate.innerHTML;
          const htmlObject = document.createElement('div');
          htmlObject.innerHTML = modalTemplateInner;
          this.modalHtml = htmlObject.querySelector(selectors$E.upsellModal);
          document.body.appendChild(this.modalHtml);
          this.modal = document.querySelector(selectors$E.upsellModal);
        }

        if (this.modalTemplate && this.triggerButton) {
          this.triggerButton.addEventListener('click', this.clickUpsellEvent);
        }

        if (this.isCartItem) {
          new ProductAddButton(this.upsellHolder, this.isCartItem);
        }
      }
    }

    clickUpsellButton(e) {
      e.preventDefault();

      if (this.modal && this.modalID) {
        this.modal.id = this.modalID;
      }

      if (document.documentElement.hasAttribute('data-scroll-locked')) {
        this.scrollLockEnable = false;
      }

      this.getUpsellHTML();
    }

    getUpsellHTML() {
      window
        .fetch(`${window.theme.routes.root_url}products/${this.handle}?section_id=api-product-upsell`)
        .then(this.handleErrors)
        .then((response) => {
          return response.text();
        })
        .then((response) => {
          const fresh = document.createElement('div');
          fresh.innerHTML = response;
          this.modalContent = this.modal.querySelector(selectors$E.modalContent);
          this.modalContent.innerHTML = fresh.querySelector('[data-api-content]').innerHTML;
          this.modalScroll = this.modal.querySelector(selectors$E.upsellModalScrolls);
          const images = this.modalContent.querySelector(selectors$E.mediaId);

          if (images) {
            const imagesHolder = document.createElement('div');
            imagesHolder.innerHTML = images.parentElement.innerHTML;
            this.upsellHolder.dispatchEvent(
              new CustomEvent('theme:upsell:media', {
                bubbles: true,
                detail: {
                  media: imagesHolder,
                },
              })
            );
          }

          this.modalCreate();
        });
    }

    modalCreate() {
      MicroModal.show(this.modalID, {
        onShow: (modal, el, event) => {
          this.upsellHead = modal.querySelector(selectors$E.upsellHead);
          this.upsellFormArea = modal.querySelector(selectors$E.upsellFormArea);
          this.toggleButton = modal.querySelector(selectors$E.toggleButton);

          this.toggleForm('loading');
          document.addEventListener(
            'theme:resize',
            throttle(() => {
              this.toggleForm('resize');
            }, 500)
          );

          this.clickEventToggleForm();

          const addButtonWrapper = modal.querySelector(selectors$E.addButtonWrapper);
          new ProductAddButton(addButtonWrapper, this.isCartItem);

          const firstFocus = modal.querySelector(selectors$E.focusable);
          trapFocus(modal, {elementToFocus: firstFocus});
          this.modal.addEventListener('theme:upsell:close', this.modalCloseEvent);

          document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true, detail: this.modalScroll}));

          new ImageCaption(this.modal);
        },
        onClose: (modal, el, event) => {
          const allMedia = modal.querySelectorAll(selectors$E.media);

          allMedia.forEach((media) => {
            media.dispatchEvent(new CustomEvent('pause'));
          });

          removeTrapFocus();
          el.focus();
          this.modal.removeEventListener('theme:upsell:close', this.modalCloseEvent);
          if (this.scrollLockEnable) {
            document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
          } else {
            this.scrollLockEnable = true;
          }
        },
      });
    }

    modalClose() {
      MicroModal.close(this.modalID);
    }

    handleErrors(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }

    toggleForm(event) {
      if (this.windowH === window.innerHeight && event === 'resize') {
        return;
      }

      if (!this.toggleButton.classList.contains(classes$q.hide)) {
        this.toggleButton.classList.add(classes$q.hide);
      }

      if (!this.upsellFormArea.classList.contains(classes$q.expanded)) {
        this.upsellFormArea.classList.add(classes$q.expanded);
      }

      if (event === 'resize') {
        this.upsellFormArea.classList.add(classes$q.expanded);
        this.toggleButton.classList.add(classes$q.hide);
        this.windowH = window.innerHeight;
      }

      setTimeout(() => {
        const imagesVisiblePartOfImages = window.innerHeight - this.upsellHead.offsetHeight - this.upsellFormArea.offsetHeight;
        const hasMediumVisiblePart = imagesVisiblePartOfImages < visibleParts.mediumPart && imagesVisiblePartOfImages > visibleParts.minPart;
        const missingVisiblePart = imagesVisiblePartOfImages < visibleParts.minPart;

        if (hasMediumVisiblePart || missingVisiblePart) {
          this.toggleButton.classList.remove(classes$q.hide);
          this.toggleButton.classList.add(classes$q.active);
        } else {
          this.toggleButton.classList.add(classes$q.hide);
        }

        if (missingVisiblePart) {
          if (event === 'loading') {
            this.upsellFormArea.classList.add(classes$q.loading);

            setTimeout(() => {
              this.upsellFormArea.classList.remove(classes$q.loading);
            }, 50);
          }

          this.upsellFormArea.classList.remove(classes$q.expanded);
          this.toggleButton.classList.remove(classes$q.active);
        } else {
          this.upsellFormArea.classList.add(classes$q.expanded);
        }
      }, 200);
    }

    clickEventToggleForm() {
      if (!this.toggleButton) return;

      this.toggleButton.addEventListener('click', () => {
        this.toggleButton.classList.toggle(classes$q.active);
        this.upsellFormArea.classList.toggle(classes$q.expanded);
      });
    }

    disconnectedCallback() {
      if (this.modalTemplate && this.triggerButton) {
        this.triggerButton.removeEventListener('click', this.clickUpsellEvent);
      }
    }
  }

  const selectors$D = {
    cartNote: '[data-cart-note]',
  };

  class CartNotes {
    constructor(element) {
      this.inputs = element.querySelectorAll(selectors$D.cartNote);
      this.initInputs();
    }

    initInputs() {
      this.inputs.forEach((input) => {
        input.addEventListener(
          'change',
          function (e) {
            const note = e.target.value.toString() || '';
            this.saveNotes(note);
          }.bind(this)
        );
      });
    }

    saveNotes(newNote) {
      window
        .fetch(`${window.theme.routes.cart}/update.js`, {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({note: newNote}),
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  const getUrlString = (params, keys = [], isArray = false) => {
    const p = Object.keys(params)
      .map((key) => {
        let val = params[key];

        if (Object.prototype.toString.call(val) === '[object Object]' || Array.isArray(val)) {
          if (Array.isArray(params)) {
            keys.push('');
          } else {
            keys.push(key);
          }
          return getUrlString(val, keys, Array.isArray(val));
        } else {
          let tKey = key;

          if (keys.length > 0) {
            const tKeys = isArray ? keys : [...keys, key];
            tKey = tKeys.reduce((str, k) => {
              return str === '' ? k : `${str}[${k}]`;
            }, '');
          }
          if (isArray) {
            return `${tKey}[]=${val}`;
          } else {
            return `${tKey}=${val}`;
          }
        }
      })
      .join('&');

    keys.pop();
    return p;
  };

  /**
   * Module to add a shipping rates calculator to cart page.
   *
   */

  const selectors$C = {
    html: 'html',
    submitButton: '[data-submit-shipping]',
    form: '[data-shipping-estimate-form]',
    template: '[data-response-template]',
    country: '#estimate_address_country',
    province: '#estimate_address_province',
    zip: '#estimate_address_zip',
    wrapper: '[data-response-wrapper]',
    defaultData: 'data-default-fullname',
    lang: 'lang',
    defaultData: 'data-default',
  };

  const classes$p = {
    success: 'shipping--success',
    error: 'errors',
    disable: 'disabled',
  };

  class ShippingCalculator {
    constructor(section) {
      this.button = section.container.querySelector(selectors$C.submitButton);
      this.template = section.container.querySelector(selectors$C.template).innerHTML;
      this.ratesWrapper = section.container.querySelector(selectors$C.wrapper);
      this.form = section.container.querySelector(selectors$C.form);
      this.country = section.container.querySelector(selectors$C.country);
      this.province = section.container.querySelector(selectors$C.province);
      this.zip = section.container.querySelector(selectors$C.zip);
      this.init();
    }

    enableButtons() {
      this.button.removeAttribute('disabled');
      this.button.classList.remove(classes$p.disable);
    }

    disableButtons() {
      this.button.setAttribute('disabled', 'disabled');
      this.button.classList.add(classes$p.disable);
    }

    render(rates) {
      if (this.template && this.ratesWrapper) {
        const rendered = Sqrl__namespace.render(this.template, rates);
        this.ratesWrapper.innerHTML = rendered;
      }
      this.enableButtons();
      this.ratesWrapper.style.removeProperty('display');
    }

    estimate(shipping_address) {
      const encodedShippingAddressData = encodeURI(
        getUrlString({
          shipping_address: shipping_address,
        })
      );
      const url = `${window.theme.routes.cart}/shipping_rates.json?${encodedShippingAddressData}`;
      const instance = this;
      axios
        .get(url)
        .then(function (response) {
          // handle success
          const items = instance.sanitize(response);
          instance.render(items);
          instance.enableButtons();
          instance.ratesWrapper.style.removeProperty('display');
        })
        .catch(function (error) {
          // handle errors
          const errors = instance.sanitizeErrors(error);
          instance.render(errors);
        });
    }

    sanitize(response) {
      const sanitized = {};
      sanitized.class = classes$p.success;
      sanitized.items = [];
      if (response.data.shipping_rates && response.data.shipping_rates.length > 0) {
        const rates = response.data.shipping_rates;
        rates.forEach((r) => {
          let item = {};
          item.title = r.presentment_name;
          item.value = themeCurrency.formatMoney(r.price, theme.moneyFormat);
          sanitized.items.push(item);
        });
      } else {
        sanitized.items[0] = {value: theme.strings.noShippingAvailable};
      }
      return sanitized;
    }

    sanitizeErrors(response) {
      const errors = {};
      errors.class = classes$p.error;
      errors.items = [];
      if (typeof response.data === 'object') {
        for (const [key, value] of Object.entries(response.data)) {
          let item = {};
          item.title = key.toString();
          item.value = value.toString();
          errors.items.push(item);
        }
      } else {
        errors.items[0] = {value: theme.strings.noShippingAvailable};
      }
      return errors;
    }

    init() {
      const htmlEl = document.querySelector(selectors$C.html);
      let locale = 'en';
      if (htmlEl.hasAttribute(selectors$C.lang) && htmlEl.getAttribute(selectors$C.lang) !== '') {
        locale = htmlEl.getAttribute(selectors$C.lang);
      }

      if (this.form) {
        themeAddresses.AddressForm(this.form, locale, {
          shippingCountriesOnly: true,
        });
      }

      if (this.country && this.country.hasAttribute(selectors$C.defaultData) && this.province && this.province.hasAttribute(selectors$C.defaultData)) {
        this.country.addEventListener('change', function () {
          this.country.removeAttribute(selectors$C.defaultData);
          this.province.removeAttribute(selectors$C.defaultData);
        });
      }

      if (this.button) {
        this.button.addEventListener(
          'click',
          function (e) {
            e.preventDefault();
            this.disableButtons();
            while (this.ratesWrapper.firstChild) this.ratesWrapper.removeChild(this.ratesWrapper.firstChild);
            this.ratesWrapper.style.display = 'none';
            const shippingAddress = {};
            let elemCountryVal = this.country.value;
            let elemProvinceVal = this.province.value;
            const elemCountryData = this.country.getAttribute(selectors$C.defaultData);
            if (elemCountryVal === '' && elemCountryData && elemCountryData !== '') {
              elemCountryVal = elemCountryData;
            }
            const elemProvinceData = this.province.getAttribute(selectors$C.defaultData);
            if (elemProvinceVal === '' && elemProvinceData && elemProvinceData !== '') {
              elemProvinceVal = elemProvinceData;
            }
            shippingAddress.zip = this.zip.value || '';
            shippingAddress.country = elemCountryVal || '';
            shippingAddress.province = elemProvinceVal || '';
            this.estimate(shippingAddress);
          }.bind(this)
        );
      }
    }
  }

  const selectors$B = {
    wrapper: '[data-quantity-selector]',
    increase: '[data-increase-quantity]',
    decrease: '[data-decrease-quantity]',
    input: '[data-quantity-input]',
  };

  class Quantity {
    constructor(wrapper) {
      this.wrapper = wrapper;
      this.increase = this.wrapper.querySelector(selectors$B.increase);
      this.decrease = this.wrapper.querySelector(selectors$B.decrease);
      this.input = this.wrapper.querySelector(selectors$B.input);
      this.min = parseInt(this.input.getAttribute('min'), 10);
      this.initButtons();
    }

    initButtons() {
      this.increase.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          let v = parseInt(this.input.value, 10);
          v = isNaN(v) ? 0 : v;
          v++;
          this.input.value = v;
          this.input.dispatchEvent(new Event('change'));
        }.bind(this)
      );
      this.decrease.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          let v = parseInt(this.input.value, 10);
          v = isNaN(v) ? 0 : v;
          v--;
          v = Math.max(this.min, v);
          this.input.value = v;
          this.input.dispatchEvent(new Event('change'));
        }.bind(this)
      );
    }
  }

  function initQtySection(container) {
    const quantityWrappers = container.querySelectorAll(selectors$B.wrapper);
    quantityWrappers.forEach((qty) => {
      new Quantity(qty);
    });
  }

  const selectors$A = {
    drawer: '[data-drawer="drawer-cart"]',
    shipping: '[data-shipping-estimate-form]',
    loader: '[data-cart-loading]',
    form: '[data-cart-form]',
    emptystate: '[data-cart-empty]',
    progress: '[data-cart-progress]',
    items: '[data-line-items]',
    subtotal: '[data-cart-subtotal]',
    bottom: '[data-cart-bottom]',
    quantity: '[data-quantity-selector]',
    errors: '[data-form-errors]',
    item: '[data-cart-item]',
    finalPrice: '[data-cart-final]',
    key: 'data-update-cart',
    remove: 'data-remove-key',
    upsellProduct: '[data-upsell-holder]',
    cartPage: '[data-section-type="cart"]',
    bar: '[data-cart-bar]',
    ship: '[data-cart-message]',
    itemLoadbar: '[data-item-loadbar]',
    cartMessageContainer: '[data-cart-message-container]',
    apiContent: '[data-api-content]',
  };

  const classes$o = {
    hidden: 'cart--hidden',
    loading: 'cart--loading',
  };

  class CartItems {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.cartMessages = document.querySelectorAll(selectors$A.cartMessageContainer);
      this.bar = this.container.querySelector(selectors$A.bar);
      this.ship = this.container.querySelector(selectors$A.ship);
      this.drawer = this.container.querySelector(selectors$A.drawer);
      this.form = this.container.querySelector(selectors$A.form);
      this.loader = this.container.querySelector(selectors$A.loader);
      this.bottom = this.container.querySelector(selectors$A.bottom);
      this.items = this.container.querySelector(selectors$A.items);
      this.subtotal = this.container.querySelector(selectors$A.subtotal);
      this.errors = this.container.querySelector(selectors$A.errors);
      this.finalPrice = this.container.querySelector(selectors$A.finalPrice);
      this.emptystate = this.container.querySelector(selectors$A.emptystate);
      this.progress = this.container.querySelector(selectors$A.progress);
      this.latestClick = null;
      this.cart = null;
      this.stale = true;
      this.cartPage = document.querySelector(selectors$A.cartPage);
      this.listen();
    }

    listen() {
      document.addEventListener(
        'theme:cart:change',
        function (event) {
          this.cart = event.detail.cart;
          this.stale = true;
        }.bind(this)
      );

      document.addEventListener(
        'theme:cart:init',
        function () {
          this.init();
        }.bind(this)
      );

      document.addEventListener(
        'theme:cart:reload',
        function () {
          this.stale = true;
          if (this.cart) {
            this.loadHTML();
          } else {
            this.init().then(() => this.loadHTML());
          }
        }.bind(this)
      );

      if (this.drawer) {
        this.drawer.addEventListener(
          'theme:drawer:open',
          function () {
            if (this.cart) {
              this.loadHTML();
            } else {
              this.init().then(() => this.loadHTML());
            }
          }.bind(this)
        );
      }

      new CartNotes(this.container);
      new CartShippingMessage(this.container);
    }

    init() {
      return window
        .fetch(`${window.theme.routes.cart}.js`)
        .then(this.handleErrors)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.cart = response;
          this.fireChange(response);
          return response;
        })
        .catch((e) => {
          console.error(e);
        });
    }

    loadHTML() {
      if (this.stale) {
        if (this.cart && this.cart.item_count > 0) {
          this.loadForm();
        } else {
          this.showEmpty();
          this.cartMessages.forEach((message) => {
            new CartShippingMessage(message);
          });
        }
      }
      this.stale = false;
    }

    initInputs() {
      this.inputs = this.container.querySelectorAll(`[${selectors$A.key}]`);
      this.inputs.forEach((input) => {
        const key = input.getAttribute(selectors$A.key);
        input.addEventListener(
          'change',
          function (e) {
            const quantity = parseInt(e.target.value, 10);
            this.latestClick = e.target.closest(selectors$A.item);
            this.lockState();
            this.updateCart(key, quantity);
          }.bind(this)
        );
      });
    }

    initRemove() {
      this.removers = this.container.querySelectorAll(`[${selectors$A.remove}]`);
      this.removers.forEach((remover) => {
        const key = remover.getAttribute(selectors$A.remove);
        remover.addEventListener(
          'click',
          function (e) {
            e.preventDefault();
            this.latestClick = e.target.closest(selectors$A.item);
            this.lockState();
            this.updateCart(key, 0);
          }.bind(this)
        );
      });
    }

    lockState() {
      this.latestClick.querySelector(selectors$A.itemLoadbar).style.display = 'block';
      this.loader.classList.add(classes$o.loading);
    }

    updateCart(clickedKey, newQuantity) {
      let oldCount = null;
      let newCount = null;
      let newItem = null;
      window
        .fetch(`${window.theme.routes.cart}.js`)
        .then(this.handleErrors)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          const matchKeys = (item) => item.key === clickedKey;
          const index = response.items.findIndex(matchKeys);
          oldCount = response.item_count;
          newItem = response.items[index].title;
          const data = {
            line: `${index + 1}`,
            quantity: newQuantity,
          };
          return window.fetch(`${window.theme.routes.cart}/change.js`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
          });
        })
        .then(this.handleErrors)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.cart = response;
          newCount = response.item_count;
          if (oldCount === newCount) {
            this.stockoutError(newItem);
            this.stale = true;
          } else {
            slideUp(this.errors);
            this.fireChange(response);
            this.stale = true;
          }

          this.loadHTML();
        })
        .catch((e) => {
          console.error(e);
          let heading = '';
          if (typeof e.status !== 'undefined') {
            heading = `<p>${e.status}</p>`;
          }
          let paragraph = e.json.description || '';
          this.showError(`${heading + paragraph}`);
          this.loadHTML();
        });
    }

    fireChange(newCart) {
      document.dispatchEvent(
        new CustomEvent('theme:cart:change', {
          detail: {
            cart: newCart,
          },
          bubbles: true,
        })
      );
    }

    updateTotal() {
      if (this.cart && this.cart.total_price) {
        const price = themeCurrency.formatMoney(this.cart.total_price, theme.moneyFormat);
        this.finalPrice.innerHTML = price + ` ${theme.currencyCode}`;
      }
      if (this.subtotal && this.cart) {
        window
          .fetch(`${window.theme.routes.root_url}?section_id=api-cart-subtotal`)
          .then(this.handleErrors)
          .then((response) => {
            return response.text();
          })
          .then((response) => {
            const fresh = document.createElement('div');
            fresh.innerHTML = response;
            this.subtotal.innerHTML = fresh.querySelector(selectors$A.apiContent).innerHTML;
          });
      }
    }

    showError(message) {
      slideUp(this.errors);
      this.errors.innerHTML = message;
      window.setTimeout(() => {
        slideDown(this.errors);
      }, 600);
    }

    stockoutError(itemTitle) {
      let heading = `<p><strong>${window.theme.strings.stockout}</strong></p>`;
      let paragraph = `<p>${itemTitle}</p>`;
      this.showError(`${heading + paragraph}`);
    }

    loadForm() {
      window
        .fetch(`${window.theme.routes.root_url}?section_id=api-cart-items`)
        .then(this.handleErrors)
        .then((response) => {
          return response.text();
        })
        .then((response) => {
          const fresh = document.createElement('div');
          fresh.innerHTML = response;
          this.items.innerHTML = fresh.querySelector(selectors$A.apiContent).innerHTML;

          this.showForm();
          this.initQuantity();
          this.initUpsell();
          this.updateTotal();
        });
    }

    initUpsell() {
      const upsellProduct = this.items.querySelector(selectors$A.upsellProduct);
      const oldUpsellProduct = this.bottom.querySelector(selectors$A.upsellProduct);

      if (oldUpsellProduct) {
        oldUpsellProduct.remove();
      }

      if (this.cartPage && upsellProduct) {
        this.bottom.insertBefore(upsellProduct, this.bottom.firstChild);
      }
    }

    initQuantity() {
      initQtySection(this.container);
      this.initInputs();
      this.initRemove();
    }

    showForm() {
      if (this.bar) {
        this.bar.classList.remove(classes$o.hidden);
      }
      if (this.ship) {
        this.ship.classList.remove(classes$o.hidden);
      }
      if (this.progress) {
        this.progress.classList.remove(classes$o.hidden);
      }
      this.form.classList.remove(classes$o.hidden);
      this.bottom.classList.remove(classes$o.hidden);
      this.loader.classList.remove(classes$o.loading);
      this.emptystate.classList.add(classes$o.hidden);
    }

    showEmpty() {
      if (this.bar) {
        this.bar.classList.add(classes$o.hidden);
      }
      if (this.ship) {
        this.ship.classList.add(classes$o.hidden);
      }
      if (this.progress) {
        this.progress.classList.add(classes$o.hidden);
      }
      this.emptystate.classList.remove(classes$o.hidden);
      this.loader.classList.remove(classes$o.loading);
      this.form.classList.add(classes$o.hidden);
      this.bottom.classList.add(classes$o.hidden);
    }

    handleErrors(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }
  }

  const cartDrawer = {
    onLoad() {
      const isDrawerCart = this.container.querySelector(selectors$A.drawer);
      if (isDrawerCart) {
        this.cart = new CartItems(this);
      }

      const hasShipping = this.container.querySelector(selectors$A.shipping);
      if (hasShipping) {
        new ShippingCalculator(this);
      }
    },
    onUnload: function () {
      if (this.cart && typeof this.cart.unload === 'function') {
        this.cart.unload();
      }
    },
  };

  const selectors$z = {
    accordionGroup: '[data-accordion-group]',
    accordionToggle: 'data-accordion-trigger',
    accordionBody: '[data-accordion-body]',
    accordionBodyMobile: 'data-accordion-body-mobile',
    rangeSlider: 'data-range-holder',
    section: '[data-section-id]',
  };

  const classes$n = {
    open: 'accordion-is-open',
  };

  let sections$d = {};

  class Accordion {
    constructor(el) {
      this.body = el;
      this.key = this.body.id;
      const btnSelector = `[${selectors$z.accordionToggle}='${this.key}']`;
      this.trigger = document.querySelector(btnSelector);

      this.toggleEvent = (e) => this.clickEvents(e);
      this.keyboardEvent = (e) => this.keyboardEvents(e);
      this.hideEvent = () => this.hideEvents();

      this.syncBodies = this.getSiblings();

      if (this.body.hasAttribute(selectors$z.accordionBodyMobile)) {
        this.mobileAccordions();
      } else {
        this.init();
      }
    }

    mobileAccordions() {
      if (window.innerWidth < window.theme.sizes.medium) {
        this.init();
        this.setDefaultState();
      } else {
        this.resetMobileAccordions();
        this.body.removeAttribute('style');
      }

      document.addEventListener('theme:resize', () => {
        if (window.innerWidth < window.theme.sizes.medium) {
          this.init();
          this.setDefaultState();
        } else {
          this.resetMobileAccordions();
          this.body.removeAttribute('style');
        }
      });
    }

    init() {
      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.setDefaultState();

      this.trigger.addEventListener('click', this.toggleEvent);
      this.body.addEventListener('keyup', this.keyboardEvent);
      this.body.addEventListener('theme:accordion:close', this.hideEvent);
    }

    hideEvents() {
      this.hideAccordion();
    }

    clickEvents(e) {
      e.preventDefault();
      this.toggleState();
    }

    keyboardEvents(e) {
      if (e.which !== window.theme.keyboardKeys.ESCAPE) {
        return;
      }
      this.hideAccordion();
      this.trigger.focus();
    }

    resetMobileAccordions() {
      this.trigger.removeEventListener('click', this.toggleEvent);
      this.body.removeEventListener('keyup', this.keyboardEvent);
      this.body.removeEventListener('theme:accordion:close', this.hideEvent);
    }

    setDefaultState() {
      if (this.trigger.classList.contains(classes$n.open)) {
        showElement(this.body);
      } else {
        this.hideAccordion();
      }
    }

    getSiblings() {
      const section = this.body.closest(selectors$z.section);
      const groupsArray = [...section.querySelectorAll(selectors$z.accordionGroup)];
      const syncWrapper = groupsArray.filter((el) => el.contains(this.body)).shift();
      if (syncWrapper) {
        const allChilden = [...syncWrapper.querySelectorAll(selectors$z.accordionBody)];
        const onlySiblings = allChilden.filter((el) => !el.contains(this.body));
        return onlySiblings;
      } else return [];
    }

    closeSiblings() {
      this.syncBodies.forEach((accordionBody) => {
        accordionBody.dispatchEvent(new CustomEvent('theme:accordion:close', {bubbles: false}));
      });
    }

    toggleState() {
      if (this.trigger.classList.contains(classes$n.open)) {
        this.hideAccordion();
      } else {
        this.showAccordion();
        this.closeSiblings();

        // Collection filters
        // Accordion with range slider custom event to reload
        if (this.body.hasAttribute(selectors$z.rangeSlider)) {
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('theme:price-range:reset', {bubbles: false}));
          }, 400);
        }
      }
    }

    hideAccordion() {
      this.trigger.classList.remove(classes$n.open);
      slideUp(this.body);
    }

    showAccordion() {
      this.trigger.classList.add(classes$n.open);
      slideDown(this.body);

      setTimeout(() => {
        this.checkInViewportAndScrollTo();
      }, 600);
    }

    checkInViewportAndScrollTo() {
      const rect = this.trigger.getBoundingClientRect();
      const windowScrollY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
      const inViewport =
        rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);

      if (!inViewport) {
        window.scrollTo({
          top: windowScrollY + rect.top,
          left: 0,
          behavior: 'smooth',
        });
      }
    }

    onBlockSelect(evt) {
      if (this.body.contains(evt.target)) {
        this.showAccordion();
      }
    }

    onBlockDeselect(evt) {
      if (this.body.contains(evt.target)) {
        this.hideAccordion();
      }
    }
  }

  const accordion = {
    onLoad() {
      sections$d[this.id] = [];
      const els = this.container.querySelectorAll(selectors$z.accordionBody);
      els.forEach((el) => {
        sections$d[this.id].push(new Accordion(el));
      });
    },
    onUnload: function () {
      sections$d[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
    onSelect: function () {
      if (this.type === 'accordion-single') {
        this.container.querySelector(`[${selectors$z.accordionToggle}]`).click();
      }
    },
    onDeselect: function () {
      if (this.type === 'accordion-single') {
        this.container.querySelector(`[${selectors$z.accordionToggle}]`).click();
      }
    },
    onBlockSelect(evt) {
      sections$d[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(evt);
        }
      });
    },
    onBlockDeselect(evt) {
      sections$d[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockDeselect(evt);
        }
      });
    },
  };

  const selectors$y = {
    saleClass: 'on-sale',
    soldClass: 'sold-out',
  };

  function formatPrices(product) {
    // Apprend classes for on sale and sold out
    const on_sale = product.price < product.compare_at_price_min;
    let classes = on_sale ? selectors$y.saleClass : '';
    classes += product.available ? '' : selectors$y.soldClass;
    // Add 'from' before min price if price varies
    product.price = theme.settings.currency_code_enable ? themeCurrency.formatMoney(product.price, theme.moneyFormat) + ` ${theme.currencyCode}` : themeCurrency.formatMoney(product.price, theme.moneyFormat);
    if (product.price_min !== product.price_max) {
      let min = theme.settings.currency_code_enable ? themeCurrency.formatMoney(product.price_min, theme.moneyFormat) + ` ${theme.currencyCode}` : themeCurrency.formatMoney(product.price_min, theme.moneyFormat);
      product.price = `${window.theme.strings.from} ${min}`;
    }

    const formatted = {
      ...product,
      classes,
      on_sale,
      sold_out: !product.available,
      sold_out_translation: window.theme.strings.soldOut,
      compare_at_price: theme.settings.currency_code_enable
        ? themeCurrency.formatMoney(product.compare_at_price_min, theme.moneyFormat) + ` ${theme.currencyCode}`
        : themeCurrency.formatMoney(product.compare_at_price_min, theme.moneyFormat),
      compare_at_price_max: theme.settings.currency_code_enable
        ? themeCurrency.formatMoney(product.compare_at_price_max, theme.moneyFormat) + ` ${theme.currencyCode}`
        : themeCurrency.formatMoney(product.compare_at_price_max, theme.moneyFormat),
      compare_at_price_min: theme.settings.currency_code_enable
        ? themeCurrency.formatMoney(product.compare_at_price_min, theme.moneyFormat) + ` ${theme.currencyCode}`
        : themeCurrency.formatMoney(product.compare_at_price_min, theme.moneyFormat),
      price_max: theme.settings.currency_code_enable ? themeCurrency.formatMoney(product.price_max, theme.moneyFormat) + ` ${theme.currencyCode}` : themeCurrency.formatMoney(product.price_max, theme.moneyFormat),
      price_min: theme.settings.currency_code_enable ? themeCurrency.formatMoney(product.price_min, theme.moneyFormat) + ` ${theme.currencyCode}` : themeCurrency.formatMoney(product.price_min, theme.moneyFormat),
    };
    return formatted;
  }

  const selectors$x = {
    wrapper: '[data-search-popdown-wrap]',
    results: '[data-predictive-search-results]',
    input: '[data-predictive-search-input]',
    productTemplate: '[data-search-product-template]',
    otherTemplate: '[data-search-other-template]',
    titleTemplate: '[data-predictive-search-title-template]',
    ariaTemplate: '[data-predictive-search-aria-template]',
    productTitleWrapper: '[data-product-title-wrap]',
    productWrapper: '[data-product-wrap]',
    collectionWrapper: '[data-collection-wrap]',
    articleWrapper: '[data-article-wrap]',
    pageWrapper: '[data-page-wrap]',
    ariaWrapper: '[data-predictive-search-aria]',
    outerWrapper: '[data-popdown-outer]',
    loader: '[data-loading-indicator]',
  };

  const classes$m = {
    dirtyClass: 'dirty',
    noResults: 'search--empty',
  };

  let sections$c = {};

  Sqrl__namespace.filters.define('animationDelay', function (index) {
    return index * 90 + 10;
  });

  class SearchPredictive {
    constructor(wrapper) {
      this.wrapper = wrapper;
      this.input = this.wrapper.querySelector(selectors$x.input);
      this.loader = this.wrapper.querySelector(selectors$x.loader);
      this.results = this.wrapper.querySelector(selectors$x.results);
      this.outer = this.input.closest(selectors$x.outerWrapper);

      this.productTemplate = this.wrapper.querySelector(selectors$x.productTemplate).innerHTML;
      this.otherTemplate = this.wrapper.querySelector(selectors$x.otherTemplate).innerHTML;
      this.titleTemplate = this.wrapper.querySelector(selectors$x.titleTemplate).innerHTML;
      this.ariaTemplate = this.wrapper.querySelector(selectors$x.ariaTemplate).innerHTML;

      this.productTitleWrapper = this.results.querySelector(selectors$x.productTitleWrapper);
      this.productWrapper = this.results.querySelector(selectors$x.productWrapper);
      this.collectionWrapper = this.results.querySelector(selectors$x.collectionWrapper);
      this.articleWrapper = this.results.querySelector(selectors$x.articleWrapper);
      this.pageWrapper = this.results.querySelector(selectors$x.pageWrapper);
      this.ariaWrapper = this.results.querySelector(selectors$x.ariaWrapper);

      this.initSearch();
    }

    initSearch() {
      this.input.addEventListener(
        'input',
        debounce(
          function (event) {
            const val = event.target.value;
            if (val && val.length > 1) {
              this.loader.style.display = 'block';
              this.render(val);
            } else {
              this.resetTemplates();
              this.outer.classList.remove(classes$m.dirtyClass);
            }
          }.bind(this),
          300
        )
      );
      this.input.addEventListener('theme:search:clear', this.reset.bind(this));
    }

    render(terms) {
      let resources = '';
      resources += window.theme.settings.search_products ? 'product,' : '';
      resources += window.theme.settings.search_collections ? 'collection,' : '';
      resources += window.theme.settings.search_articles ? 'article,' : '';
      resources += window.theme.settings.search_pages ? 'page,' : '';
      resources = resources.slice(0, -1);
      const serialized = `/search/suggest.json?q=${terms}&resources[type]=${resources}&resources[options][unavailable_products]=last`;
      fetch(serialized)
        .then(this.handleErrors)
        .then((response) => response.json())
        .then((response) => {
          this.resetTemplates();
          this.outer.classList.add(classes$m.dirtyClass);
          const results = response.resources.results;
          const combined = [];
          for (const key in results) {
            if ({}.hasOwnProperty.call(results, key)) {
              combined.push(...results[key]);
            }
          }
          if (combined.length) {
            this.outer.classList.remove(classes$m.noResults);
            this.injectOther(results);
            this.injectProduct(results.products);
          } else {
            this.noResults(terms);
          }
          this.injectAria(terms, combined);
          trapFocus(this.outer, {elementToFocus: this.input});
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.loader.style.display = 'none';
        });
    }

    injectAria(terms, combined) {
      let title = window.theme.strings.noResultsFor;
      let count = null;
      if (combined.length) {
        count = combined.length;
        title = window.theme.strings.resultsFor;
      }
      this.ariaWrapper.innerHTML = Sqrl__namespace.render(this.ariaTemplate, {
        count: count,
        title: title,
        query: terms,
      });
    }

    noResults() {
      this.resetTemplates();
      this.outer.classList.add(classes$m.dirtyClass);
      this.outer.classList.add(classes$m.noResults);
    }

    resetTemplates() {
      this.productTitleWrapper.innerHTML = '';
      this.collectionWrapper.innerHTML = '';
      this.articleWrapper.innerHTML = '';
      this.productWrapper.innerHTML = '';
      this.pageWrapper.innerHTML = '';
      this.ariaWrapper.innerHTML = '';
    }

    reset() {
      this.resetTemplates();
      this.outer.classList.remove(classes$m.dirtyClass);
      this.outer.classList.remove(classes$m.noResults);
      this.input.val = '';
    }

    injectOther(results) {
      const collections = results.collections;

      this.productTitleWrapper.innerHTML += Sqrl__namespace.render(this.titleTemplate, {
        title: window.theme.strings.products,
        count: results.products.length,
      });

      if (collections && collections.length) {
        for (let index = collections.length - 1; index >= 0; index--) {
          const collection = collections[index];

          theme.settings.excluded_collections_strict.forEach((excludedCollectionStrict) => {
            if (excludedCollectionStrict.trim() == collection.handle) {
              collections.splice(index, 1);
            }
          });

          theme.settings.excluded_collections.forEach((excludedCollection) => {
            if (collection.handle.includes(excludedCollection.trim())) {
              collections.splice(index, 1);
            }
          });
        }

        this.collectionWrapper.innerHTML += Sqrl__namespace.render(this.titleTemplate, {
          title: window.theme.strings.collections,
          count: collections.length,
        });
        this.collectionWrapper.innerHTML += Sqrl__namespace.render(this.otherTemplate, collections);
      }
      if (results.pages && results.pages.length) {
        this.pageWrapper.innerHTML += Sqrl__namespace.render(this.titleTemplate, {
          title: window.theme.strings.pages,
          count: results.pages.length,
        });
        this.pageWrapper.innerHTML += Sqrl__namespace.render(this.otherTemplate, results.pages);
      }
      if (results.articles && results.articles.length) {
        this.articleWrapper.innerHTML += Sqrl__namespace.render(this.titleTemplate, {
          title: window.theme.strings.articles,
          count: results.articles.length,
        });
        this.articleWrapper.innerHTML += Sqrl__namespace.render(this.otherTemplate, results.articles);
      }
    }

    injectProduct(products) {
      let formatted = [];
      products.forEach((p) => {
        let product = p;
        product = formatPrices(product);
        product.image = null;
        if (product.featured_image) {
          product.thumb = getSizedImageUrl(product.featured_image.url, '360x360');
        }
        formatted.push(product);
      });
      const productHTML = Sqrl__namespace.render(this.productTemplate, formatted);
      this.productWrapper.innerHTML += productHTML;
    }

    handleErrors(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }
  }

  const searchResultsGlobal = {
    onLoad() {
      sections$c[this.id] = [];
      const els = document.querySelectorAll(selectors$x.wrapper);
      els.forEach((el) => {
        sections$c[this.id].push(new SearchPredictive(el));
      });
    },
    onUnload: function () {
      sections$c[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const selectors$w = {
    outer: '[data-drawer-search]',
    wrapper: '[data-search-popdown-wrap]',
    input: '[data-predictive-search-input]',
    clear: '[data-clear-input]',
  };

  class SearchDrawer {
    constructor(section) {
      this.outer = section.container.querySelector(selectors$w.outer);
      if (this.outer) {
        this.wrapper = this.outer.querySelector(selectors$w.wrapper);
        this.input = this.outer.querySelector(selectors$w.input);
        this.clear = this.outer.querySelector(selectors$w.clear);
        this.init();
      }
    }

    init() {
      this.clear.addEventListener(
        'click',
        function (evt) {
          evt.preventDefault();
          this.clearInput();
        }.bind(this)
      );
    }

    clearInput() {
      this.input.value = '';
      this.input.dispatchEvent(new CustomEvent('theme:search:clear', {bubbles: false}));
      this.input.focus();
    }
  }

  const searchDrawer = {
    onLoad() {
      this.searchDrawer = new SearchDrawer(this);
    },
    onUnload: function () {
      if (this.searchDrawer && typeof this.searchDrawer.unload === 'function') {
        this.searchDrawer.unload();
      }
    },
  };

  const selectors$v = {
    drawer: 'data-drawer-scrolls',
    slideruleOpen: 'data-sliderule-open',
    slideruleClose: 'data-sliderule-close',
    sliderulePane: 'data-sliderule-pane',
    slideruleWrappper: '[data-sliderule]',
    dataAnimates: 'data-animates',
    children: `:scope > [data-animates],
             :scope > * > [data-animates],
             :scope > * > * >[data-animates],
             :scope .sliderule-grid  > *`,
  };

  const classes$l = {
    isVisible: 'is-visible',
    isHiding: 'is-hiding',
    isHidden: 'is-hidden',
  };

  let sections$b = {};

  class HeaderMobileSliderule {
    constructor(el) {
      this.sliderule = el;
      this.wrapper = el.closest(selectors$v.wrapper);
      this.key = this.sliderule.id;
      const btnSelector = `[${selectors$v.slideruleOpen}='${this.key}']`;
      const exitSelector = `[${selectors$v.slideruleClose}='${this.key}']`;
      this.trigger = document.querySelector(btnSelector);
      this.drawer = document.querySelector(`[${selectors$v.drawer}]`);
      this.exit = document.querySelectorAll(exitSelector);
      this.pane = document.querySelector(`[${selectors$v.sliderulePane}]`);
      this.children = this.sliderule.querySelectorAll(selectors$v.children);

      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.clickEvents();
      this.staggerChildAnimations();

      document.addEventListener('theme:sliderule:close', this.closeSliderule.bind(this));
    }

    clickEvents() {
      this.trigger.addEventListener(
        'click',
        function () {
          this.showSliderule();
        }.bind(this)
      );
      this.exit.forEach((element) => {
        element.addEventListener(
          'click',
          function () {
            this.hideSliderule();
          }.bind(this)
        );
      });
    }

    keyboardEvents() {
      this.trigger.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.SPACE) {
            return;
          }
          this.showSliderule();
        }.bind(this)
      );
      this.sliderule.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideSliderule();
          this.buttons[0].focus();
        }.bind(this)
      );
    }

    staggerChildAnimations(reverse = false) {
      const childrenArr = reverse ? Array.prototype.slice.call(this.children).slice().reverse() : this.children;

      childrenArr.forEach((child, index) => {
        child.style.transitionDelay = index * 50 + 10 + 'ms';
      });
    }

    hideSliderule(close = false) {
      const paneStyle = window.getComputedStyle(this.pane);
      const paneTransitionDuration = parseFloat(paneStyle.getPropertyValue('transition-duration')) * 1000;
      const children = close ? this.pane.querySelectorAll(`.${classes$l.isVisible}`) : this.children;
      this.pane.style.setProperty('--sliderule-height', 'auto');
      this.staggerChildAnimations(true);
      this.pane.classList.add(classes$l.isHiding);
      this.sliderule.classList.add(classes$l.isHiding);
      this.sliderule.classList.remove(classes$l.isVisible);
      children.forEach((el) => {
        el.classList.remove(classes$l.isVisible);
      });
      const newPosition = parseInt(this.pane.dataset.sliderulePane, 10) - 1;
      this.pane.setAttribute(selectors$v.sliderulePane, newPosition);
      const hidedSelector = close ? `[${selectors$v.dataAnimates}].${classes$l.isHidden}` : `[${selectors$v.dataAnimates}="${newPosition}"].${classes$l.isHidden}`;
      const hidedItems = this.pane.querySelectorAll(hidedSelector);
      if (hidedItems.length) {
        hidedItems.forEach((element) => {
          element.classList.remove(classes$l.isHidden);
        });
      }

      setTimeout(() => {
        this.pane.classList.remove(classes$l.isHiding);
        this.sliderule.classList.remove(classes$l.isHiding);
        this.staggerChildAnimations();
      }, paneTransitionDuration);
    }

    showSliderule() {
      this.pane.style.setProperty('--sliderule-height', 'auto');
      this.sliderule.classList.add(classes$l.isVisible);
      this.children.forEach((el) => {
        el.classList.add(classes$l.isVisible);
      });
      const oldPosition = parseInt(this.pane.dataset.sliderulePane, 10);
      const newPosition = oldPosition + 1;
      this.pane.setAttribute(selectors$v.sliderulePane, newPosition);
      const hidedItems = this.pane.querySelectorAll(`[${selectors$v.dataAnimates}="${oldPosition}"]`);
      if (hidedItems.length) {
        const hidedItemsTransition = parseFloat(window.getComputedStyle(hidedItems[0]).getPropertyValue('transition-duration')) * 1000;
        setTimeout(() => {
          hidedItems.forEach((element) => {
            element.classList.add(classes$l.isHidden);
          });
        }, hidedItemsTransition);
      }

      const newHeight = parseInt(this.trigger.nextElementSibling.offsetHeight);
      this.pane.style.setProperty('--sliderule-height', `${newHeight}px`);

      const drawerScrollY = this.drawer.scrollTop;
      const scrollToElement = this.pane.offsetTop;
      const enableScrollTo = scrollToElement < drawerScrollY && this.pane.offsetHeight >= this.drawer.offsetHeight;

      if (enableScrollTo) {
        this.drawer.scrollTo({
          top: scrollToElement,
          left: 0,
          behavior: 'smooth',
        });
      }
    }

    closeSliderule() {
      if (this.pane && this.pane.hasAttribute(selectors$v.sliderulePane) && parseInt(this.pane.getAttribute(selectors$v.sliderulePane)) > 0) {
        this.hideSliderule(true);
        if (parseInt(this.pane.getAttribute(selectors$v.sliderulePane)) > 0) {
          this.pane.setAttribute(selectors$v.sliderulePane, 0);
        }
      }
    }
  }

  const headerMobileSliderule = {
    onLoad() {
      sections$b[this.id] = [];
      const els = this.container.querySelectorAll(selectors$v.slideruleWrappper);
      els.forEach((el) => {
        sections$b[this.id].push(new HeaderMobileSliderule(el));
      });
    },
  };

  const selectors$u = {
    wrapper: '[data-product-add-popdown-wrapper]',
    closeDrawer: '[data-close-popdown]',
    apiContent: '[data-api-content]',
    cartSectionAjax: '[data-ajax-disable="false"]',
    ajaxDisabled: '[data-ajax-disable="true"]',
    cartToggleButton: '[data-drawer-toggle="drawer-cart"]',
    cartDrawer: '[data-drawer="drawer-cart"]',
  };

  const classes$k = {
    visible: 'is-visible',
  };

  let globalTimer;

  class CartPopdown {
    constructor() {
      this.drawer = document.querySelector(selectors$u.wrapper);
      this.cartSectionAjax = document.querySelector(selectors$u.cartSectionAjax);
      this.ajaxDisabled = document.querySelector(selectors$u.ajaxDisabled);
      document.addEventListener('theme:cart:popdown', (e) => {
        if (this.cartSectionAjax) {
          // if we are on the cart page, refresh the cart without popdown
          this.cartSectionAjax.dispatchEvent(new CustomEvent('theme:cart:reload', {bubbles: true}));
        } else if (this.ajaxDisabled) {
          // ajax is disabled, refresh the whole page
          window.location.reload();
        } else {
          this.renderPopdown(e);
        }
      });
    }

    renderPopdown(event) {
      const variant = event.detail.variant;
      const url = `${window.theme.routes.root_url}variants/${variant.id}/?section_id=api-product-popdown`;
      const instance = this;
      axios
        .get(url)
        .then(function (response) {
          // handle success
          const fresh = document.createElement('div');
          fresh.innerHTML = response.data;
          instance.drawer.innerHTML = fresh.querySelector(selectors$u.apiContent).innerHTML;
          instance.connectCartButton();
          instance.connectCloseButton();
        })
        .catch(function (error) {
          console.warn(error);
        });
    }

    connectCloseButton() {
      // Enable close button
      this.drawer.classList.add(classes$k.visible);
      const closer = this.drawer.querySelector(selectors$u.closeDrawer);
      closer.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          this.drawer.classList.remove(classes$k.visible);
        }.bind(this)
      );
      this.popdownTimer();
    }

    connectCartButton() {
      // Hook into cart drawer
      const cartButton = this.drawer.querySelector(selectors$u.cartToggleButton);
      const cartDrawer = document.querySelector(selectors$u.cartDrawer);

      if (cartDrawer) {
        cartButton.addEventListener(
          'click',
          function (e) {
            e.preventDefault();
            this.drawer.classList.remove(classes$k.visible);
            cartDrawer.dispatchEvent(
              new CustomEvent('theme:drawer:open', {
                bubbles: false,
              })
            );
          }.bind(this)
        );
      }
    }

    popdownTimer() {
      clearTimeout(globalTimer);
      globalTimer = setTimeout(() => {
        this.drawer.classList.remove(classes$k.visible);
      }, 5000);
    }
  }

  const cartPopdown = {
    onLoad() {
      new CartPopdown(this);
    },
  };

  const selectors$t = {
    widthContent: '[data-takes-space]',
    desktop: '[data-header-desktop]',
    cloneClass: 'js__header__clone',
    showMobileClass: 'js__show__mobile',
    backfill: '[data-header-backfill]',
    transparent: 'data-header-transparent',
    overrideBorder: 'header-override-border',
    firstSectionHasImage: '.main-content > .shopify-section:first-child [data-overlay-header]',
    preventTransparentHeader: '.main-content > .shopify-section:first-child [data-prevent-transparent-header]',
    deadLink: '.navlink[href="#"]',
  };

  const classes$j = {
    hasOverlay: 'has-overlay',
  };

  let sections$a = {};

  class Header {
    constructor(el) {
      this.wrapper = el;
      this.style = this.wrapper.dataset.style;
      this.desktop = this.wrapper.querySelector(selectors$t.desktop);
      this.transparent = this.wrapper.getAttribute(selectors$t.transparent) !== 'false';
      this.overlayedImages = document.querySelectorAll(selectors$t.firstSectionHasImage);
      this.deadLinks = document.querySelectorAll(selectors$t.deadLink);

      this.killDeadLinks();
      if (this.style !== 'drawer' && this.desktop) {
        this.minWidth = this.getMinWidth();
        this.listenWidth();
      }
      this.checkForImage();
      window.dispatchEvent(new Event('resize'));
      document.addEventListener('theme:header:check', this.checkForImage.bind(this));
    }

    unload() {
      document.removeEventListener('theme:resize', this.checkWidth);
    }

    checkForImage() {
      this.overlayedImages = document.querySelectorAll(selectors$t.firstSectionHasImage);
      let preventTransparentHeader = document.querySelectorAll(selectors$t.preventTransparentHeader).length;

      if (this.overlayedImages.length && !preventTransparentHeader && this.transparent) {
        // is transparent and has image, overlay the image
        document.querySelector(selectors$t.backfill).style.display = 'none';
        this.listenOverlay();
      } else {
        this.wrapper.setAttribute(selectors$t.transparent, false);
      }

      if (this.overlayedImages.length && !preventTransparentHeader && !this.transparent) {
        // Have image but not transparent, remove border bottom
        this.wrapper.classList.add(selectors$t.overrideBorder);
        this.subtractHeaderHeight();
      }
    }

    listenOverlay() {
      document.addEventListener('theme:resize', this.checkWidth.bind(this));
      this.subtractAnnouncementHeight();
    }

    listenWidth() {
      document.addEventListener('theme:resize', this.checkWidth.bind(this));
      this.checkWidth();
    }

    killDeadLinks() {
      this.deadLinks.forEach((el) => {
        el.onclick = (e) => {
          e.preventDefault();
        };
      });
    }

    subtractAnnouncementHeight() {
      const {windowHeight, announcementHeight} = readHeights();
      this.overlayedImages.forEach((el) => {
        el.style.setProperty('--full-screen', `${windowHeight - announcementHeight}px`);
        el.classList.add(classes$j.hasOverlay);
      });
    }

    subtractHeaderHeight() {
      const {windowHeight, headerHeight} = readHeights();
      this.overlayedImages.forEach((el) => {
        el.style.setProperty('--full-screen', `${windowHeight - headerHeight}px`);
      });
    }

    checkWidth() {
      if (document.body.clientWidth < this.minWidth) {
        this.wrapper.classList.add(selectors$t.showMobileClass);
      } else {
        this.wrapper.classList.remove(selectors$t.showMobileClass);
      }
    }

    getMinWidth() {
      const comparitor = this.wrapper.cloneNode(true);
      comparitor.classList.add(selectors$t.cloneClass);
      document.body.appendChild(comparitor);
      const wideElements = comparitor.querySelectorAll(selectors$t.widthContent);
      let minWidth = 0;
      if (wideElements.length === 3) {
        minWidth = _sumSplitWidths(wideElements);
      } else {
        minWidth = _sumWidths(wideElements);
      }
      document.body.removeChild(comparitor);
      return minWidth + wideElements.length * 20;
    }
  }

  function _sumSplitWidths(nodes) {
    let arr = [];
    nodes.forEach((el) => {
      arr.push(el.clientWidth);
    });
    if (arr[0] > arr[2]) {
      arr[2] = arr[0];
    } else {
      arr[0] = arr[2];
    }
    const width = arr.reduce((a, b) => a + b);
    return width;
  }
  function _sumWidths(nodes) {
    let width = 0;
    nodes.forEach((el) => {
      width += el.clientWidth;
    });
    return width;
  }

  const header = {
    onLoad() {
      sections$a = new Header(this.container);
    },
    onUnload: function () {
      if (typeof sections$a.unload === 'function') {
        sections$a.unload();
      }
    },
  };

  register('header', [
    header,
    drawer,
    headerMobileSliderule,
    stickyHeader,
    hoverDisclosure,
    hoverUnderline,
    headerTotals,
    searchPopdown,
    searchResultsGlobal,
    searchDrawer,
    swatchGridSection,
    cartDrawer,
    cartPopdown,
    accordion,
    ticker,
  ]);

  if (!customElements.get('popout-select')) {
    customElements.define('popout-select', PopoutSelect);
  }

  if (!customElements.get('upsell-product')) {
    customElements.define('upsell-product', UpsellProduct);
  }

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  if (!customElements.get('product-grid-item')) {
    customElements.define('product-grid-item', ProductGridItem);
  }

  const selectors$s = {
    newsletterForm: '[data-newsletter-form]',
  };

  const classes$i = {
    success: 'has-success',
    error: 'has-error',
  };

  const sections$9 = {};

  class NewsletterCheckForResult {
    constructor(newsletter) {
      this.sessionStorage = window.sessionStorage;
      this.newsletter = newsletter;

      this.stopSubmit = true;
      this.isChallengePage = false;
      this.formID = null;

      this.checkForChallengePage();

      this.newsletterSubmit = (e) => this.newsletterSubmitEvent(e);

      if (!this.isChallengePage) {
        this.init();
      }
    }

    init() {
      this.newsletter.addEventListener('submit', this.newsletterSubmit);

      this.showMessage();
    }

    newsletterSubmitEvent(e) {
      if (this.stopSubmit) {
        e.preventDefault();

        this.removeStorage();
        this.writeStorage();
        this.stopSubmit = false;
        this.newsletter.submit();
      }
    }

    checkForChallengePage() {
      this.isChallengePage = window.location.pathname === '/challenge';
    }

    writeStorage() {
      if (this.sessionStorage !== undefined) {
        this.sessionStorage.setItem('newsletter_form_id', this.newsletter.id);
      }
    }

    readStorage() {
      this.formID = this.sessionStorage.getItem('newsletter_form_id');
    }

    removeStorage() {
      this.sessionStorage.removeItem('newsletter_form_id');
    }

    showMessage() {
      this.readStorage();

      if (this.newsletter.id === this.formID) {
        const newsletter = document.getElementById(this.formID);

        if (window.location.search.indexOf('?customer_posted=true') !== -1) {
          newsletter.classList.remove(classes$i.error);
          newsletter.classList.add(classes$i.success);
        } else if (window.location.search.indexOf('accepts_marketing') !== -1) {
          newsletter.classList.remove(classes$i.success);
          newsletter.classList.add(classes$i.error);
        }

        this.scrollToForm(newsletter);
      }
    }

    scrollToForm(newsletter) {
      const rect = newsletter.getBoundingClientRect();
      const isVisible =
        rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);

      if (!isVisible) {
        setTimeout(() => {
          window.scroll({
            top: rect.top,
            left: 0,
            behavior: 'smooth',
          });
        }, 400);
      }
    }

    unload() {
      this.newsletter.removeEventListener('submit', this.newsletterSubmit);
    }
  }

  const newsletterCheckForResultSection = {
    onLoad() {
      sections$9[this.id] = [];
      const newsletters = this.container.querySelectorAll(selectors$s.newsletterForm);
      newsletters.forEach((form) => {
        sections$9[this.id].push(new NewsletterCheckForResult(form));
      });
    },
    onUnload() {
      sections$9[this.id].forEach((form) => {
        if (typeof form.unload === 'function') {
          form.unload();
        }
      });
    },
  };

  register('footer', [accordion, newsletterCheckForResultSection]);

  if (!customElements.get('popout-select')) {
    customElements.define('popout-select', PopoutSelect);
  }

  function isTouch() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    document.documentElement.classList.toggle('supports-touch', isTouch);

    return isTouch;
  }

  isTouch();

  const defaultOptions$1 = {
    cc_load_policy: 1,
    iv_load_policy: 3,
    modestbranding: 1,
    playsinline: 1,
    controls: 1,
    showinfo: 0,
    ecver: 2,
    fs: 1,
    rel: 0,
  };

  const selectors$r = {
    player: 'iframe, [data-replace]',
    videoId: 'data-video-id',
  };

  function embedYoutube(uniqueKey, options) {
    const playerOptions = {
      ...defaultOptions$1,
      ...options,
    };
    const playerWrapper = document.querySelector(`[data-player="${uniqueKey}"]`);
    const playerElement = playerWrapper.querySelector(selectors$r.player);
    const youtubeKey = playerWrapper.querySelector(`[${selectors$r.videoId}]`).getAttribute(selectors$r.videoId);
    loadScript({url: 'https://www.youtube.com/iframe_api'});
    const playerPromise = window.youtubeLoaderPromise
      .then(function () {
        let player = new window.YT.Player(playerElement, {
          videoId: youtubeKey,
          playerVars: {
            ...playerOptions,
          },
        });
        playerWrapper.addEventListener('pause', function () {
          try {
            if (player.pauseVideo) {
              player.pauseVideo();
            }
          } catch (e) {
            console.warn(e);
          }
        });
        playerWrapper.addEventListener('theme:media:play-desktop', function () {
          if (!isTouch()) {
            playerWrapper.dispatchEvent(new Event('play'));
          }
        });
        playerWrapper.addEventListener('play', function () {
          try {
            if (player.playVideo) {
              player.playVideo();
            } else {
              player.addEventListener('onReady', function (event) {
                event.target.playVideo();
              });
            }
          } catch (e) {
            console.warn(e);
          }
        });
        playerWrapper.addEventListener('destroy', function () {
          try {
            if (player.destroy) {
              player.destroy();
            }
          } catch (e) {
            console.warn(e);
          }
        });
        return player;
      })
      .catch(function (err) {
        console.error(err);
      });
    return playerPromise;
  }

  window.youtubeLoaderPromise = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = function () {
      resolve();
    };
  });

  const defaultOptions = {
    autoplay: true,
    loop: true,
    controls: true,
    muted: false,
    playsinline: true,
  };

  const selectors$q = {
    player: 'iframe, [data-replace]',
    videoId: 'data-video-id',
  };

  function embedVimeo(uniqueKey, options) {
    const playerOptions = {
      ...defaultOptions,
      ...options,
    };
    const playerWrapper = document.querySelector(`[data-player="${uniqueKey}"]`);
    const playerElement = playerWrapper.querySelector(selectors$q.player);
    const vimeoKey = playerWrapper.querySelector(`[${selectors$q.videoId}]`).getAttribute(selectors$q.videoId);
    const loadedPromise = loadScript({url: 'https://player.vimeo.com/api/player.js'});
    const vimeoSelector = `select-${uniqueKey}`;
    playerElement.setAttribute('id', vimeoSelector);
    const returnPlayer = loadedPromise
      .then(function () {
        const player = new window.Vimeo.Player(vimeoSelector, {
          ...playerOptions,
          id: vimeoKey,
        });
        playerWrapper.addEventListener('pause', function () {
          try {
            if (player.pause) {
              player.pause();
            }
          } catch (e) {
            console.warn(e);
          }
        });
        playerWrapper.addEventListener('theme:media:play-desktop', function () {
          if (!isTouch()) {
            playerWrapper.dispatchEvent(new Event('play'));
          }
        });
        playerWrapper.addEventListener('play', function () {
          if (player.play) {
            player.play();
          }
        });
        playerWrapper.addEventListener('destroy', function () {
          try {
            if (player.destroy) {
              player.destroy();
            }
          } catch (e) {
            console.log(e);
          }
        });
        return player;
      })
      .catch(function (err) {
        console.error(err);
      });
    return returnPlayer;
  }

  const selectors$p = {
    videoPopup: '[data-video-popup]',
    videoAutoplay: '[data-video-autoplay]',
    attrUnique: 'data-unique',
    attrVideoId: 'data-video-id',
    attrVideoType: 'data-video-type',
    attrPlayer: 'data-player',
  };

  class PopupVideo {
    constructor(section) {
      this.container = section.container;
      this.triggers = this.container.querySelectorAll(selectors$p.videoPopup);
      this.backgroundVideo = this.container.querySelector(selectors$p.videoAutoplay);

      this.init();
    }

    init() {
      this.triggers.forEach((trigger) => {
        const unique = trigger.getAttribute(selectors$p.attrUnique);
        const video = trigger.getAttribute(selectors$p.attrVideoId);
        const type = trigger.getAttribute(selectors$p.attrVideoType);

        // Find the modal body, which has been moved to the document root
        // and append a unique ID for youtube and vimeo to init players.
        const uniqueKey = `${video}-${unique}`;
        const player = document.querySelector(`[${selectors$p.attrPlayer}="${uniqueKey}"]`);

        // Modal Event Logic:
        // When a modal opens it creates and plays the video
        // When a modal opens it pauses background videos in this section
        // --
        // When a modal closes it destroys the player
        // When a modal closes it plays background videos anywhere on the page
        MicroModal.init({
          onShow: () => {
            if (this.backgroundVideo && typeof this.backgroundVideo.pause === 'function') {
              this.backgroundVideo.pause();
            }
            let playerPromise = {};
            if (type === 'youtube') {
              playerPromise = embedYoutube(uniqueKey);
            } else if (type === 'vimeo') {
              playerPromise = embedVimeo(uniqueKey);
            }
            playerPromise.then(() => {
              player.dispatchEvent(new CustomEvent('play'));
            });
          },
          onClose: (modal, el, event) => {
            event.preventDefault();
            player.dispatchEvent(new CustomEvent('destroy'));
            if (this.backgroundVideo && typeof this.backgroundVideo.play === 'function') {
              this.backgroundVideo.play();
            }
          },
          openTrigger: `data-trigger-${video}-${unique}`,
        });
      });
    }
  }

  const popupVideoSection = {
    onLoad() {
      new PopupVideo(this);
    },
  };

  const selectors$o = {
    button: '[data-scroll-down]',
  };

  class ScrollButton {
    constructor(el) {
      this.wrapper = el;
      this.init();
    }

    init() {
      const buttons = this.wrapper.querySelectorAll(selectors$o.button);
      if (buttons) {
        buttons.forEach((btn) => {
          btn.addEventListener('click', this.scroll.bind(this));
        });
      }
    }

    scroll() {
      const bottom = this.wrapper.offsetTop + this.wrapper.clientHeight;
      window.scroll({
        top: bottom,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  const scrollButton = {
    onLoad() {
      this.scrollButton = new ScrollButton(this.container);
    },
    onUnload: function () {
      delete this.scrollButton;
    },
  };

  register('video', [parallaxImage, scrollButton, popupVideoSection]);

  register('page-faq', accordion);

  register('hero', [parallaxImage, scrollButton, customScrollbar]);

  const selectors$n = {
    slider: '[data-slider]',
    photo: '[data-grid-slide]',
    wrapper: '[data-wrapper]',
    carouselCustomScrollbar: 'data-custom-scrollbar-items',
  };

  const attributes = {
    showDots: 'data-show-dots',
  };

  const classes$h = {
    wrapper: 'wrapper',
    wrapperModifier: 'wrapper--full',
    hide: 'hide',
  };

  const offsets = {
    scrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
    additionalOffsetWrapper: 112,
  };

  const sections$8 = {};

  class Slider {
    constructor(container, el) {
      this.container = container;
      this.slideshow = el;

      this.wrapper = this.container.closest(selectors$n.wrapper);
      this.wrapperWidth = Number(getComputedStyle(document.documentElement).getPropertyValue('--LAYOUT-WIDTH').replace('px', ''));
      this.wrapperWidthWithGutter = this.wrapperWidth + offsets.additionalOffsetWrapper + offsets.scrollbarWidth;

      this.pageDots = this.slideshow.getAttribute(attributes.showDots) === 'true';
      this.firstPhoto = this.container.querySelector(selectors$n.photo);

      if (this.firstPhoto) {
        const buttonOffset = this.firstPhoto.offsetHeight / 2;
        this.slideshow.style.setProperty('--buttons-top', `${buttonOffset}px`);
      }

      if (!this.slideshow) return;

      this.flkty = null;

      this.init();
    }

    init() {
      const instance = this;
      const sliderOptions = {
        initialIndex: 0,
        accessibility: true,
        autoPlay: false,
        contain: true,
        pageDots: this.pageDots,
        adaptiveHeight: false,
        wrapAround: false,
        groupCells: false,
        cellAlign: 'left',
        freeScroll: true,
        prevNextButtons: true,
        draggable: true,
        rightToLeft: window.isRTL,
        watchCSS: true,
        arrowShape: {
          x0: 10,
          x1: 60,
          y1: 50,
          x2: 65,
          y2: 45,
          x3: 20,
        },
        on: {
          ready: function () {
            instance.removeIncorrectAria();
          },
        },
      };
      this.flkty = new Flickity(this.slideshow, sliderOptions);

      this.container.addEventListener('theme:tab:change', () => {
        this.flkty.resize();
      });

      this.toggleWrapperModifier();
      document.addEventListener('theme:resize:width', this.toggleWrapperModifier.bind(this));

      if (this.slideshow.hasAttribute(selectors$n.carouselCustomScrollbar)) {
        new CustomScrollbar(this.container);
      }

      new Siblings(this.container);
    }

    toggleWrapperModifier() {
      if (!this.wrapper.classList.contains(classes$h.wrapper)) {
        return;
      }

      this.wrapper.classList.toggle(classes$h.wrapperModifier, this.wrapperWidthWithGutter >= window.innerWidth);
    }

    removeIncorrectAria() {
      const slidesHidden = this.slideshow.querySelectorAll('[aria-hidden="true"]');
      slidesHidden.forEach((el) => el.removeAttribute('aria-hidden'));
    }

    onUnload() {
      if (this.slideshow && this.flkty) {
        this.flkty.options.watchCSS = false;
        this.flkty.destroy();
      }
    }
  }

  const productSliderSection = {
    onLoad() {
      sections$8[this.id] = [];
      const els = this.container.querySelectorAll(selectors$n.slider);
      els.forEach((el) => {
        sections$8[this.id].push(new Slider(this.container, el));
      });
    },
    onUnload(e) {
      sections$8[this.id].forEach((el) => {
        if (typeof el.onUnload === 'function') {
          el.onUnload(e);
        }
      });
    },
  };

  register('custom-content', [parallaxImage, popupVideoSection, swatchGridSection, productSliderSection]);

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  if (!customElements.get('product-grid-item')) {
    customElements.define('product-grid-item', ProductGridItem);
  }

  if (!customElements.get('upsell-product')) {
    customElements.define('upsell-product', UpsellProduct);
  }

  const sections$7 = [];
  const selectors$m = {
    wrapper: '[data-slideshow-wrapper]',
    speed: 'data-slideshow-speed',
    autoplay: 'data-slideshow-autoplay',
    slideCount: 'data-slideshow-slides',
    prevButton: '[data-slide-custom-prev]',
    nextButton: '[data-slide-custom-next]',
    slideshoIndex: 'data-slideshow-index',
  };

  const classes$g = {
    isEnable: 'flickity-enabled',
  };

  class Slideshow {
    constructor(section) {
      this.container = section.container;
      this.wrapper = section.container.querySelector(selectors$m.wrapper);
      this.speed = this.wrapper.getAttribute(selectors$m.speed);
      this.autoplay = this.wrapper.getAttribute(selectors$m.autoplay) === 'true';
      this.slideCount = parseInt(this.wrapper.getAttribute(selectors$m.slideCount), 10);
      this.prevButtons = this.wrapper.querySelectorAll(selectors$m.prevButton);
      this.nextButtons = this.wrapper.querySelectorAll(selectors$m.nextButton);
      this.flkty = null;
      this.scrollEvent = () => this.scrollEvents();
      this.init();
    }

    init() {
      const settings = {
        autoPlay: this.autoplay && this.speed ? parseInt(this.speed) : false,
        contain: false,
        pageDots: true,
        adaptiveHeight: true,
        accessibility: true,
        wrapAround: this.slideCount !== 2,
        prevNextButtons: false,
        draggable: true,
        fade: true,
        rightToLeft: window.isRTL,
      };
      this.flkty = new FlickityFade(this.wrapper, settings);

      if (this.prevButtons.length) {
        this.prevButtons.forEach((e) => {
          e.onclick = () => {
            this.flkty.previous(true, false);
          };
        });
      }
      if (this.nextButtons.length) {
        this.nextButtons.forEach((e) => {
          e.onclick = () => {
            this.flkty.next(true, false);
          };
        });
      }

      document.addEventListener('theme:scroll', this.scrollEvent);
    }

    scrollEvents() {
      if (this.flkty && this.autoplay && this.speed) {
        const slideshow = this.flkty.element;
        const slideshowBottomPosition = slideshow.getBoundingClientRect().top + window.scrollY + slideshow.offsetHeight;
        if (window.pageYOffset > slideshowBottomPosition) {
          if (this.flkty.player.state === 'playing') {
            this.flkty.pausePlayer();
          }
        } else if (this.flkty.player.state === 'paused') {
          this.flkty.playPlayer();
        }
      }
    }

    unload() {
      document.removeEventListener('theme:scroll', this.scrollEvent);
      if (this.flkty && this.wrapper && this.wrapper.classList.contains(classes$g.isEnable)) {
        this.flkty.destroy();
      }
    }

    onBlockSelect(evt) {
      const indexEl = evt.target.closest(`[${selectors$m.slideshoIndex}]`);
      const slideIndex = indexEl.getAttribute(selectors$m.slideshoIndex);
      const select = parseInt(slideIndex);
      this.flkty.selectCell(select);
      this.flkty.stopPlayer();
    }

    onBlockDeselect() {
      if (this.autoplay) {
        this.flkty.playPlayer();
      }
    }
  }

  const slideshowSection = {
    onLoad() {
      sections$7[this.id] = new Slideshow(this);
    },
    onUnload() {
      if (typeof sections$7[this.id].unload === 'function') {
        sections$7[this.id].unload();
      }
    },
    onBlockSelect(evt) {
      if (typeof sections$7[this.id].onBlockSelect === 'function') {
        sections$7[this.id].onBlockSelect(evt);
      }
    },
    onBlockDeselect(evt) {
      if (typeof sections$7[this.id].onBlockSelect === 'function') {
        sections$7[this.id].onBlockDeselect(evt);
      }
    },
  };

  register('slideshow', [slideshowSection, parallaxImage, scrollButton]);

  const selectors$l = {
    rangeSlider: '[data-range-slider]',
    rangeDotLeft: '[data-range-left]',
    rangeDotRight: '[data-range-right]',
    rangeLine: '[data-range-line]',
    rangeHolder: '[data-range-holder]',
    dataMin: 'data-se-min',
    dataMax: 'data-se-max',
    dataMinValue: 'data-se-min-value',
    dataMaxValue: 'data-se-max-value',
    dataStep: 'data-se-step',
    dataFilterUpdate: 'data-range-filter-update',
    priceMin: '[data-field-price-min]',
    priceMax: '[data-field-price-max]',
  };

  const classes$f = {
    isInitialized: 'is-initialized',
  };

  class RangeSlider {
    constructor(section) {
      this.container = section.container;
      this.slider = section.querySelector(selectors$l.rangeSlider);

      if (this.slider) {
        this.onMoveEvent = (event) => this.onMove(event);
        this.onStopEvent = (event) => this.onStop(event);
        this.onStartEvent = (event) => this.onStart(event);
        this.startX = 0;
        this.x = 0;

        // retrieve touch button
        this.touchLeft = this.slider.querySelector(selectors$l.rangeDotLeft);
        this.touchRight = this.slider.querySelector(selectors$l.rangeDotRight);
        this.lineSpan = this.slider.querySelector(selectors$l.rangeLine);

        // get some properties
        this.min = parseFloat(this.slider.getAttribute(selectors$l.dataMin));
        this.max = parseFloat(this.slider.getAttribute(selectors$l.dataMax));

        this.step = 0.0;

        // normalize flag
        this.normalizeFact = 26;

        this.init();

        document.addEventListener('theme:price-range:reset', () => {
          this.setDefaultValues();
        });
      }
    }

    init() {
      this.setDefaultValues();

      // link events
      this.touchLeft.addEventListener('mousedown', this.onStartEvent);
      this.touchRight.addEventListener('mousedown', this.onStartEvent);
      this.touchLeft.addEventListener('touchstart', this.onStartEvent);
      this.touchRight.addEventListener('touchstart', this.onStartEvent);

      // initialize
      this.slider.classList.add(classes$f.isInitialized);
    }

    setDefaultValues() {
      // retrieve default values
      let defaultMinValue = this.min;
      if (this.slider.hasAttribute(selectors$l.dataMinValue)) {
        defaultMinValue = parseFloat(this.slider.getAttribute(selectors$l.dataMinValue));
      }
      let defaultMaxValue = this.max;

      if (this.slider.hasAttribute(selectors$l.dataMaxValue)) {
        defaultMaxValue = parseFloat(this.slider.getAttribute(selectors$l.dataMaxValue));
      }

      // check values are correct
      if (defaultMinValue < this.min) {
        defaultMinValue = this.min;
      }

      if (defaultMaxValue > this.max) {
        defaultMaxValue = this.max;
      }

      if (defaultMinValue > defaultMaxValue) {
        defaultMinValue = defaultMaxValue;
      }

      if (this.slider.getAttribute(selectors$l.dataStep)) {
        this.step = Math.abs(parseFloat(this.slider.getAttribute(selectors$l.dataStep)));
      }

      // initial reset
      this.reset();

      // usefull values, min, max, normalize fact is the width of both touch buttons
      this.maxX = this.slider.offsetWidth - this.touchRight.offsetWidth;
      this.selectedTouch = null;
      this.initialValue = this.lineSpan.offsetWidth - this.normalizeFact;

      // set defualt values
      this.setMinValue(defaultMinValue);
      this.setMaxValue(defaultMaxValue);
    }

    reset() {
      this.touchLeft.style.left = '0px';
      this.touchRight.style.left = this.slider.offsetWidth - this.touchLeft.offsetWidth + 'px';
      this.lineSpan.style.marginLeft = '0px';
      this.lineSpan.style.width = this.slider.offsetWidth - this.touchLeft.offsetWidth + 'px';
      this.startX = 0;
      this.x = 0;
    }

    setMinValue(minValue) {
      const ratio = (minValue - this.min) / (this.max - this.min);
      this.touchLeft.style.left = Math.ceil(ratio * (this.slider.offsetWidth - (this.touchLeft.offsetWidth + this.normalizeFact))) + 'px';
      this.lineSpan.style.marginLeft = this.touchLeft.offsetLeft + 'px';
      this.lineSpan.style.width = this.touchRight.offsetLeft - this.touchLeft.offsetLeft + 'px';
      this.slider.setAttribute(selectors$l.dataMinValue, minValue);
    }

    setMaxValue(maxValue) {
      const ratio = (maxValue - this.min) / (this.max - this.min);
      this.touchRight.style.left = Math.ceil(ratio * (this.slider.offsetWidth - (this.touchLeft.offsetWidth + this.normalizeFact)) + this.normalizeFact) + 'px';
      this.lineSpan.style.marginLeft = this.touchLeft.offsetLeft + 'px';
      this.lineSpan.style.width = this.touchRight.offsetLeft - this.touchLeft.offsetLeft + 'px';
      this.slider.setAttribute(selectors$l.dataMaxValue, maxValue);
    }

    onStart(event) {
      // Prevent default dragging of selected content
      event.preventDefault();
      let eventTouch = event;

      if (event.touches) {
        eventTouch = event.touches[0];
      }

      if (event.currentTarget === this.touchLeft) {
        this.x = this.touchLeft.offsetLeft;
      } else if (event.currentTarget === this.touchRight) {
        this.x = this.touchRight.offsetLeft;
      }

      this.startX = eventTouch.pageX - this.x;
      this.selectedTouch = event.currentTarget;
      document.addEventListener('mousemove', this.onMoveEvent);
      document.addEventListener('mouseup', this.onStopEvent);
      document.addEventListener('touchmove', this.onMoveEvent);
      document.addEventListener('touchend', this.onStopEvent);
    }

    onMove(event) {
      let eventTouch = event;

      if (event.touches) {
        eventTouch = event.touches[0];
      }

      this.x = eventTouch.pageX - this.startX;

      if (this.selectedTouch === this.touchLeft) {
        if (this.x > this.touchRight.offsetLeft - this.selectedTouch.offsetWidth + 10) {
          this.x = this.touchRight.offsetLeft - this.selectedTouch.offsetWidth + 10;
        } else if (this.x < 0) {
          this.x = 0;
        }

        this.selectedTouch.style.left = this.x + 'px';
      } else if (this.selectedTouch === this.touchRight) {
        if (this.x < this.touchLeft.offsetLeft + this.touchLeft.offsetWidth - 10) {
          this.x = this.touchLeft.offsetLeft + this.touchLeft.offsetWidth - 10;
        } else if (this.x > this.maxX) {
          this.x = this.maxX;
        }
        this.selectedTouch.style.left = this.x + 'px';
      }

      // update line span
      this.lineSpan.style.marginLeft = this.touchLeft.offsetLeft + 'px';
      this.lineSpan.style.width = this.touchRight.offsetLeft - this.touchLeft.offsetLeft + 'px';

      // write new value
      this.calculateValue();

      // call on change
      if (this.slider.getAttribute('on-change')) {
        const fn = new Function('min, max', this.slider.getAttribute('on-change'));
        fn(this.slider.getAttribute(selectors$l.dataMinValue), this.slider.getAttribute(selectors$l.dataMaxValue));
      }

      this.onChange(this.slider.getAttribute(selectors$l.dataMinValue), this.slider.getAttribute(selectors$l.dataMaxValue));
    }

    onStop(event) {
      document.removeEventListener('mousemove', this.onMoveEvent);
      document.removeEventListener('mouseup', this.onStopEvent);
      document.removeEventListener('touchmove', this.onMoveEvent);
      document.removeEventListener('touchend', this.onStopEvent);

      this.selectedTouch = null;

      // write new value
      this.calculateValue();

      // call did changed
      this.onChanged(this.slider.getAttribute(selectors$l.dataMinValue), this.slider.getAttribute(selectors$l.dataMaxValue));
    }

    onChange(min, max) {
      const rangeHolder = this.slider.closest(selectors$l.rangeHolder);
      if (rangeHolder) {
        const priceMin = rangeHolder.querySelector(selectors$l.priceMin);
        const priceMax = rangeHolder.querySelector(selectors$l.priceMax);

        if (priceMin && priceMax) {
          priceMin.value = min;
          priceMax.value = max;
        }
      }
    }

    onChanged(min, max) {
      if (this.slider.hasAttribute(selectors$l.dataFilterUpdate)) {
        this.slider.dispatchEvent(new CustomEvent('theme:range:update', {bubbles: true}));
      }
    }

    calculateValue() {
      const newValue = (this.lineSpan.offsetWidth - this.normalizeFact) / this.initialValue;
      let minValue = this.lineSpan.offsetLeft / this.initialValue;
      let maxValue = minValue + newValue;

      minValue = minValue * (this.max - this.min) + this.min;
      maxValue = maxValue * (this.max - this.min) + this.min;

      if (this.step !== 0.0) {
        let multi = Math.floor(minValue / this.step);
        minValue = this.step * multi;

        multi = Math.floor(maxValue / this.step);
        maxValue = this.step * multi;
      }

      if (this.selectedTouch === this.touchLeft) {
        this.slider.setAttribute(selectors$l.dataMinValue, minValue);
      }

      if (this.selectedTouch === this.touchRight) {
        this.slider.setAttribute(selectors$l.dataMaxValue, maxValue);
      }
    }
  }

  const selectors$k = {
    filtersWrappper: 'data-filters',
    underlay: '[data-filters-underlay]',
    filtersHideDesktop: 'data-default-hide',
    filtersToggle: 'data-filters-toggle',
    focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    groupHeading: 'data-group-heading',
    showMore: 'data-show-more',
  };

  const classes$e = {
    show: 'drawer--visible',
    defaultVisible: 'filters--default-visible',
    hide: 'hidden',
    expand: 'is-expanded',
    hidden: 'is-hidden',
    focusEnable: 'focus-enabled',
  };

  const sections$6 = {};

  class Filters {
    constructor(filters, refresh = false) {
      this.container = filters;
      this.underlay = this.container.querySelector(selectors$k.underlay);
      this.groupHeadings = this.container.querySelectorAll(`[${selectors$k.groupHeading}]`);
      this.showMoreButtons = this.container.querySelectorAll(`[${selectors$k.showMore}]`);
      this.triggerKey = this.container.getAttribute(selectors$k.filtersWrappper);
      this.selector = `[${selectors$k.filtersToggle}='${this.triggerKey}']`;
      this.filtersToggleButtons = document.querySelectorAll(this.selector);

      this.connectToggleMemory = (evt) => this.connectToggleFunction(evt);
      this.connectShowHiddenOptions = (evt) => this.showHiddenOptions(evt);

      this.connectToggle(refresh);
      this.onFocusOut();
      this.expandingEvents();

      if (this.getShowOnLoad()) {
        this.showFilters();
      } else {
        this.hideFilters();
      }
    }

    unload() {
      if (this.filtersToggleButtons.length) {
        this.filtersToggleButtons.forEach((element) => {
          element.removeEventListener('click', this.connectToggleMemory);
        });
      }

      if (this.showMoreButtons.length) {
        this.showMoreButtons.forEach((button) => {
          button.removeEventListener('click', this.connectShowHiddenOptions);
        });
      }
    }

    expandingEvents() {
      if (this.showMoreButtons.length) {
        this.showMoreButtons.forEach((button) => {
          button.addEventListener('click', throttle(this.connectShowHiddenOptions, 500));
        });
      }
    }

    showHiddenOptions(evt) {
      const element = evt.target.hasAttribute(selectors$k.showMore) ? evt.target : evt.target.closest(`[${selectors$k.showMore}]`);

      element.classList.add(classes$e.hidden);

      element.previousElementSibling.querySelectorAll(`.${classes$e.hidden}`).forEach((option) => {
        option.classList.remove(classes$e.hidden);
      });
    }

    connectToggle(refresh = false) {
      this.filtersToggleButtons.forEach((button) => {
        const isDynamic = button.closest(`[${selectors$k.filtersWrappper}]`) !== null;

        if ((isDynamic && refresh) || (isDynamic && !refresh) || (!isDynamic && !refresh)) {
          button.addEventListener('click', this.connectToggleMemory.bind(this));
        }
      });
    }

    connectToggleFunction(evt) {
      const ariaExpanded = evt.currentTarget.getAttribute('aria-expanded') === 'true';
      if (ariaExpanded) {
        this.hideFilters();
      } else {
        this.showFilters();
      }
    }

    onFocusOut() {
      this.container.addEventListener(
        'focusout',
        function (evt) {
          if (window.innerWidth >= window.theme.sizes.medium) {
            return;
          }
          const childInFocus = evt.currentTarget.contains(evt.relatedTarget);
          const isVisible = this.container.classList.contains(classes$e.show);
          const isFocusEnabled = document.body.classList.contains(classes$e.focusEnable);
          if (isFocusEnabled && isVisible && !childInFocus) {
            this.hideFilters();
          }
        }.bind(this)
      );

      this.container.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideFilters();
          this.filtersToggleButtons[0].focus();
        }.bind(this)
      );

      this.underlay.addEventListener(
        'click',
        function () {
          this.hideFilters();
        }.bind(this)
      );
    }

    getShowOnLoad() {
      const selector = `[${selectors$k.filtersHideDesktop}='false']`;
      const showOnDesktop = document.querySelector(selector);
      const isDesktop = window.innerWidth >= window.theme.sizes.medium;
      if (showOnDesktop && isDesktop) {
        return true;
      } else {
        return false;
      }
    }

    showFilters() {
      this.filtersToggleButtons = document.querySelectorAll(this.selector);
      this.container.classList.remove(classes$e.hide);
      // animates after display none is removed
      setTimeout(() => {
        this.filtersToggleButtons.forEach((btn) => btn.setAttribute('aria-expanded', true));
        this.filtersToggleButtons.forEach((btn) => btn.classList.add(classes$e.show));
        this.container.classList.add(classes$e.show);
        this.container.querySelector(selectors$k.focusable).focus();
      }, 1);
    }

    hideFilters() {
      this.filtersToggleButtons = document.querySelectorAll(this.selector);
      this.filtersToggleButtons.forEach((btn) => btn.setAttribute('aria-expanded', false));
      this.container.classList.remove(classes$e.show);
      this.container.classList.remove(classes$e.defaultVisible);
      this.filtersToggleButtons.forEach((btn) => btn.classList.remove(classes$e.show));
      this.filtersToggleButtons.forEach((btn) => btn.classList.remove(classes$e.defaultVisible));
      // adds display none after animations
      setTimeout(() => {
        if (!this.container.classList.contains(classes$e.show)) {
          this.container.classList.add(classes$e.hide);
        }
      }, 800);
    }
  }

  const collectionFiltersSidebar = {
    onLoad() {
      sections$6[this.id] = [];
      const wrappers = this.container.querySelectorAll(`[${selectors$k.filtersWrappper}]`);
      wrappers.forEach((wrapper) => {
        sections$6[this.id].push(new Filters(wrapper));
      });
    },
    onUnload: function () {
      sections$6[this.id].forEach((filters) => {
        if (typeof filters.unload === 'function') {
          filters.unload();
        }
      });
    },
  };

  const selectors$j = {
    collectionSidebar: '[data-collection-sidebar]',
    form: '[data-sidebar-filter-form]',
    inputs: 'input, select, label, textarea',
    priceMin: 'data-field-price-min',
    priceMax: 'data-field-price-max',
    rangeMin: 'data-se-min-value',
    rangeMax: 'data-se-max-value',
    rangeMinDefault: 'data-se-min',
    rangeMaxDefault: 'data-se-max',
    productsContainer: '[data-products-grid]',
    filterUpdateUrlButton: '[data-filter-update-url]',
    activeFiltersHolder: '[data-active-filters]',
    activeFiltersCount: '[data-active-filters-count]',
    productsCount: '[data-products-count]',
    dataSort: 'data-sort-enabled',
    collectionTools: '[data-collection-tools]',
    filtersWrappper: '[data-filters]',
    headerSticky: '[data-header-sticky="sticky"]',
    headerHeight: '[data-header-height]',
    gridLarge: 'data-grid-large',
    gridSmall: 'data-grid-small',
    accordionBody: '[data-accordion-body]',
    checkedOption: 'input:checked',
    optionHolder: '[data-option-holder]',
  };

  const classes$d = {
    classHidden: 'is-hidden',
    classLoading: 'is-loading',
  };

  const times = {
    loadingDelay: 1000,
    scrollTime: 1000,
  };

  class FiltersForm {
    constructor(section) {
      this.section = section;
      this.container = this.section.container;
      this.sidebar = this.container.querySelector(selectors$j.collectionSidebar);
      this.form = section.container.querySelector(selectors$j.form);
      this.sort = this.container.querySelector(`[${selectors$j.dataSort}]`);
      this.productsContainer = this.container.querySelector(selectors$j.productsContainer);
      this.activeFiltersHolder = this.container.querySelector(selectors$j.activeFiltersHolder);
      this.activeFiltersCount = this.container.querySelector(selectors$j.activeFiltersCount);
      this.productsCount = this.container.querySelector(selectors$j.productsCount);
      this.headerIsSticky = document.querySelector(selectors$j.headerSticky) !== null;
      this.layoutLarge = this.container.querySelector(`[${selectors$j.gridLarge}]`);
      this.layoutSmall = this.container.querySelector(`[${selectors$j.gridSmall}]`);

      if (this.productsContainer && this.sidebar) {
        this.init();
      }

      if (this.sort) {
        this.container.addEventListener('theme:form:filter', (e) => this.filtering(e));
      }

      if (this.sidebar || this.sort) {
        window.addEventListener('popstate', (e) => this.filtering(e));
      }
    }

    init() {
      this.showAllOptions();

      if (this.form) {
        new RangeSlider(this.form);

        this.sidebar.addEventListener(
          'input',
          debounce((e) => {
            const type = e.type;
            const target = e.target;

            if (!selectors$j.inputs.includes(type) || !this.form || typeof this.form.submit !== 'function') {
              return;
            }

            const priceMin = this.form.querySelector(`[${selectors$j.priceMin}]`);
            const priceMax = this.form.querySelector(`[${selectors$j.priceMax}]`);

            if (target.hasAttribute(selectors$j.priceMin) || target.hasAttribute(selectors$j.priceMax)) {
              const rangeMin = this.form.querySelector(`[${selectors$j.rangeMin}]`);
              const rangeMax = this.form.querySelector(`[${selectors$j.rangeMax}]`);
              parseInt(rangeMin.getAttribute(selectors$j.rangeMinDefault));
              const rangeMaxDefault = parseInt(rangeMax.getAttribute(selectors$j.rangeMaxDefault));

              if (priceMin.value && !priceMax.value) {
                priceMax.value = rangeMaxDefault;
              }

              if (priceMax.value && !priceMin.value) {
                priceMin.value = rangeMinDefault;
              }

              if (priceMin.value <= rangeMinDefault && priceMax.value >= rangeMaxDefault) {
                priceMin.placeholder = rangeMinDefault;
                priceMax.placeholder = rangeMaxDefault;
                priceMin.value = '';
                priceMax.value = '';
              }
            }

            this.filtering(e);
          }, 1500)
        );

        this.form.addEventListener('theme:range:update', (e) => this.updateRange(e));
      }

      if (this.sidebar) {
        this.sidebar.addEventListener('click', (e) => this.updateFilterFromUrl(e));
      }

      if (this.activeFiltersHolder) {
        this.activeFiltersHolder.addEventListener('click', (e) => this.updateFilterFromUrl(e));
      }

      if (this.productsContainer) {
        this.productsContainer.addEventListener('click', (e) => this.updateFilterFromUrl(e));
      }

      // Color swatches tooltips
      makeSwappers(this.sidebar);
    }

    /**
     * Update range slider (price money)
     * @param {Object} e
     */
    updateRange(e) {
      if (this.form && typeof this.form.submit === 'function') {
        const rangeMin = this.form.querySelector(`[${selectors$j.rangeMin}]`);
        const rangeMax = this.form.querySelector(`[${selectors$j.rangeMax}]`);
        const priceMin = this.form.querySelector(`[${selectors$j.priceMin}]`);
        const priceMax = this.form.querySelector(`[${selectors$j.priceMax}]`);
        const checkElements = rangeMin && rangeMax && priceMin && priceMax;

        if (checkElements && rangeMin.hasAttribute(selectors$j.rangeMin) && rangeMax.hasAttribute(selectors$j.rangeMax)) {
          const priceMinValue = parseInt(priceMin.placeholder);
          const priceMaxValue = parseInt(priceMax.placeholder);
          const rangeMinValue = parseInt(rangeMin.getAttribute(selectors$j.rangeMin));
          const rangeMaxValue = parseInt(rangeMax.getAttribute(selectors$j.rangeMax));

          if (priceMinValue !== rangeMinValue || priceMaxValue !== rangeMaxValue) {
            priceMin.value = rangeMinValue;
            priceMax.value = rangeMaxValue;

            this.filtering(e);
          }
        }
      }
    }

    /**
     * Update filter on last clicked element
     * @param {Object} e
     */
    updateFilterFromUrl(e) {
      const target = e.target;
      if (target.matches(selectors$j.filterUpdateUrlButton) || (target.closest(selectors$j.filterUpdateUrlButton) && target)) {
        e.preventDefault();
        const button = target.matches(selectors$j.filterUpdateUrlButton) ? target : target.closest(selectors$j.filterUpdateUrlButton);
        this.filtering(e, button.getAttribute('href'));
      }
    }

    /**
     * Add filters to history api
     *
     * @param {Object} e
     * @param {String} replaceHref
     */
    addToHistory(e, replaceHref = '') {
      const sortValue = this.sort ? this.sort.getAttribute(selectors$j.dataSort) : '';

      if (!e || (e && e.type !== 'popstate')) {
        if (replaceHref === '') {
          const searchParams = new window.URL(window.location.href).searchParams;
          const filterUrlParams = Object.fromEntries(searchParams);
          const filterUrlRemoveString = searchParams.toString();

          if (filterUrlRemoveString.includes('filter.') || filterUrlRemoveString.includes('sort_by') || filterUrlRemoveString.includes('page')) {
            for (const key in filterUrlParams) {
              if (key.includes('filter.') || key.includes('sort_by') || key.includes('page')) {
                searchParams.delete(key);
              }
            }
          }

          if (this.form) {
            const formParams = new URLSearchParams(new FormData(this.form));

            for (let [key, val] of formParams.entries()) {
              if (key.includes('filter.') && val) {
                searchParams.append(key, val);
              }
            }

            // if submitted price equal to price range min and max remove price parameters
            const rangeMin = this.form.querySelector(`[${selectors$j.rangeMin}]`);
            const rangeMax = this.form.querySelector(`[${selectors$j.rangeMax}]`);
            const priceMin = this.form.querySelector(`[${selectors$j.priceMin}]`);
            const priceMax = this.form.querySelector(`[${selectors$j.priceMax}]`);
            const checkElements = rangeMin && rangeMax && priceMin && priceMax;

            if (checkElements && rangeMin.hasAttribute(selectors$j.rangeMinDefault) && rangeMax.hasAttribute(selectors$j.rangeMaxDefault)) {
              const rangeMinDefault = parseFloat(rangeMin.getAttribute(selectors$j.rangeMinDefault), 10);
              const rangeMaxDefault = parseFloat(rangeMax.getAttribute(selectors$j.rangeMaxDefault), 10);
              const priceMinValue = priceMin.value === '' ? parseFloat(priceMin.placeholder, 10) : parseFloat(priceMin.value, 10);
              const priceMaxValue = priceMax.value === '' ? parseFloat(priceMax.placeholder, 10) : parseFloat(priceMax.value, 10);

              if (priceMinValue <= rangeMinDefault && priceMaxValue >= rangeMaxDefault) {
                searchParams.delete('filter.v.price.gte');
                searchParams.delete('filter.v.price.lte');
              }
            }
          }

          if (sortValue || (e && e.detail && e.detail.href)) {
            const sortString = sortValue ? sortValue : e.detail.params;
            searchParams.set('sort_by', sortString);
          }

          const filterUrlString = searchParams.toString();
          const filterNewParams = filterUrlString ? `?${filterUrlString}` : location.pathname;
          window.history.pushState(null, '', filterNewParams);

          return;
        }

        window.history.pushState(null, '', replaceHref);
      }
    }

    /**
     * Get filter result and append them to their holders
     */
    getFilterResult() {
      this.productsContainer.classList.add(classes$d.classLoading);
      this.getGridValues();

      fetch(`${window.location.pathname}${window.location.search}`)
        .then((response) => response.text())
        .then((response) => {
          const responseHolder = document.createElement('div');
          responseHolder.innerHTML = response;

          if (this.sidebar) {
            this.sidebar.innerHTML = responseHolder.querySelector(selectors$j.collectionSidebar).innerHTML;
          }

          if (this.activeFiltersCount) {
            this.activeFiltersCount.innerHTML = responseHolder.querySelector(selectors$j.activeFiltersCount).innerHTML;
          }

          this.productsContainer.innerHTML = responseHolder.querySelector(selectors$j.productsContainer).innerHTML;

          // Show active filters holder
          this.activeFiltersHolder.innerHTML = responseHolder.querySelector(selectors$j.activeFiltersHolder).innerHTML;
          this.activeFiltersHolder.parentNode.classList.toggle(classes$d.classHidden, this.activeFiltersHolder.innerHTML === '');

          if (this.productsCount) {
            this.productsCount.innerHTML = responseHolder.querySelector(selectors$j.productsCount).innerHTML;
          }

          this.setGridValues();
          this.refreshFunctionalities();

          setTimeout(() => {
            this.productsContainer.classList.remove(classes$d.classLoading);
          }, times.loadingDelay);
        });
    }

    /**
     * Refresh functionalities
     */
    refreshFunctionalities() {
      // Init range slider
      this.form = this.container.querySelector(selectors$j.form);
      if (this.form) {
        new RangeSlider(this.form);
        this.form.addEventListener('theme:range:update', (e) => this.updateRange(e));
      }

      // Init filters
      const filters = this.container.querySelectorAll(selectors$j.filtersWrappper);
      filters.forEach((filter) => {
        new Filters(filter, true);
      });

      // Init accordions
      const accordions = this.container.querySelectorAll(selectors$j.accordionBody);
      accordions.forEach((accordion) => {
        new Accordion(accordion);
      });

      // Init siblings
      new Siblings(this.container);

      // Color swatches tooltips
      if (this.sidebar) {
        makeSwappers(this.sidebar);
      }

      // Init product swatches
      makeGridSwatches(this.container);

      this.showAllOptions();
    }

    // Get grid values
    getGridValues() {
      if (this.layoutLarge) {
        this.layoutLargeValue = this.layoutLarge.getAttribute(selectors$j.gridLarge);
      }

      if (this.layoutSmall) {
        this.layoutSmallValue = this.layoutSmall.getAttribute(selectors$j.gridSmall);
      }
    }

    // Set grid values on AJAX
    setGridValues() {
      if (this.layoutLarge) {
        this.layoutLarge = this.container.querySelector(`[${selectors$j.gridLarge}]`);
        this.layoutLarge.setAttribute(selectors$j.gridLarge, this.layoutLargeValue);
      }

      if (this.layoutSmall) {
        this.layoutSmall = this.container.querySelector(`[${selectors$j.gridSmall}]`);
        this.layoutSmall.setAttribute(selectors$j.gridSmall, this.layoutSmallValue);
      }
    }

    // Show all options if in the filter have selected option but it is hidden
    showAllOptions() {
      const checkedOptions = this.container.querySelectorAll(selectors$j.checkedOption);

      checkedOptions.forEach((option) => {
        if (option.closest(selectors$j.optionHolder) && option.closest(selectors$j.optionHolder).classList.contains(classes$d.classHidden)) {
          const button = option.closest(selectors$j.accordionBody).nextElementSibling;

          if (!button.classList.contains(selectors$j.classHidden)) {
            button.dispatchEvent(new Event('click'));
          }
        }
      });
    }

    /**
     * Filtering method and scroll at the top on the section
     * @param {Object} e
     * @param {String} replaceHref
     */
    filtering(e, replaceHref = '') {
      // Scroll to filter tools
      const windowScrollY = window.scrollY || window.pageYOffset;
      const headerH = this.headerIsSticky ? document.querySelector(selectors$j.headerHeight).getBoundingClientRect().height : 0;
      const collectionTools = this.container.querySelector(selectors$j.collectionTools);
      const scrollToElement = collectionTools.offsetTop - headerH;
      const enableScrollTo = collectionTools.offsetTop + collectionTools.getBoundingClientRect().height < windowScrollY - headerH;

      if (enableScrollTo) {
        window.scrollTo({
          top: scrollToElement,
          left: 0,
          behavior: 'smooth',
        });
      }

      setTimeout(
        () => {
          this.addToHistory(e, replaceHref);
          this.getFilterResult();
        },
        enableScrollTo ? times.scrollTime : 10
      );
    }
  }

  const collectionFiltersForm = {
    onLoad() {
      this.filterForm = new FiltersForm(this);
    },
    onUnload() {
      if (this.filterForm && typeof this.filterForm.unload === 'function') {
        this.filterForm.unload();
      }
    },
  };

  register('search-page', [collectionFiltersSidebar, collectionFiltersForm, swatchGridSection, accordion]);

  if (!customElements.get('popout-select')) {
    customElements.define('popout-select', PopoutSelect);
  }

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  if (!customElements.get('product-grid-item')) {
    customElements.define('product-grid-item', ProductGridItem);
  }

  if (!customElements.get('upsell-product')) {
    customElements.define('upsell-product', UpsellProduct);
  }

  const selectors$i = {
    zoomImage: '[data-image-zoom]',
    modalContainer: '[data-modal-container]',
    attrUnique: 'data-unique',
    image: 'data-src',
  };

  class GalleryZoom {
    constructor(container) {
      this.container = container;
      this.triggers = this.container.querySelectorAll(selectors$i.zoomImage);
      this.modalContainer = document.querySelector(selectors$i.modalContainer);

      this.init();
    }

    init() {
      this.triggers.forEach((trigger) => {
        const unique = trigger.getAttribute(selectors$i.attrUnique);
        const modalIsAdded = this.modalContainer.querySelector(`#zoom-${unique}`);

        if (modalIsAdded) {
          const newModal = this.container.querySelector(`#zoom-${unique}`);

          if (newModal) {
            modalIsAdded.parentNode.removeChild(modalIsAdded);
            this.modalContainer.appendChild(newModal);
          }
        }

        MicroModal.init({
          disableScroll: true,
          openTrigger: `data-popup-${unique}`,
          onShow: (modal) => {
            var images = modal.querySelectorAll(`[${selectors$i.image}]`, modal);
            images.forEach((image) => {
              if (image.getAttribute('src') === null) {
                const bigImage = image.getAttribute(selectors$i.image);
                image.setAttribute('src', bigImage);
              }
            });
          },
          onClose: (modal, el, event) => {
            event.preventDefault();
          },
        });
      });
    }
  }

  const galleryZoomSection = {
    onLoad() {
      new GalleryZoom(this.container);
    },
  };

  register('gallery', [galleryZoomSection, popupVideoSection, customScrollbar]);

  const tokensReducer = (acc, token) => {
    const {el, elStyle, elHeight, rowsLimit, rowsWrapped, options} = acc;
    let oldBuffer = acc.buffer;
    let newBuffer = oldBuffer;

    if (rowsWrapped === rowsLimit + 1) {
      return {...acc};
    }
    const textBeforeWrap = oldBuffer;
    let newRowsWrapped = rowsWrapped;
    let newHeight = elHeight;
    el.innerHTML = newBuffer = oldBuffer.length ? `${oldBuffer}${options.delimiter}${token}${options.replaceStr}` : `${token}${options.replaceStr}`;

    if (parseFloat(elStyle.height) > parseFloat(elHeight)) {
      newRowsWrapped++;
      newHeight = elStyle.height;

      if (newRowsWrapped === rowsLimit + 1) {
        el.innerHTML = newBuffer = textBeforeWrap[textBeforeWrap.length - 1] === '.' && options.replaceStr === '...' ? `${textBeforeWrap}..` : `${textBeforeWrap}${options.replaceStr}`;

        return {...acc, elHeight: newHeight, rowsWrapped: newRowsWrapped};
      }
    }

    el.innerHTML = newBuffer = textBeforeWrap.length ? `${textBeforeWrap}${options.delimiter}${token}` : `${token}`;

    return {...acc, buffer: newBuffer, elHeight: newHeight, rowsWrapped: newRowsWrapped};
  };

  const ellipsis = (selector = '', rows = 1, options = {}) => {
    const defaultOptions = {
      replaceStr: '...',
      debounceDelay: 250,
      delimiter: ' ',
    };

    const opts = {...defaultOptions, ...options};

    const elements =
      selector &&
      (selector instanceof NodeList
        ? selector
        : selector.nodeType === 1 // if node type is Node.ELEMENT_NODE
        ? [selector] // wrap it in (NodeList) if it is a single node
        : document.querySelectorAll(selector));

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const elementHtml = el.innerHTML;
      const commentRegex = /<!--[\s\S]*?-->/g;
      const htmlWithoutComments = elementHtml.replace(commentRegex, '');
      const splittedText = htmlWithoutComments.split(opts.delimiter);

      el.innerHTML = '';
      const elStyle = window.getComputedStyle(el);

      splittedText.reduce(tokensReducer, {
        el,
        buffer: el.innerHTML,
        elStyle,
        elHeight: 0,
        rowsLimit: rows,
        rowsWrapped: 0,
        options: opts,
      });
    }
  };

  let modelJsonSections = {};
  let models = {};
  let xrButtons = {};

  const selectors$h = {
    productSlideshow: '[data-product-slideshow]',
    productXr: '[data-shopify-xr]',
    dataMediaId: 'data-media-id',
    dataModelId: 'data-model-id',
    modelViewer: 'model-viewer',
    dataModel3d: 'data-shopify-model3d-id',
    modelJson: '#ModelJson-',
  };

  function initSectionModels(modelViewerContainer, sectionId) {
    modelJsonSections[sectionId] = {
      loaded: false,
    };

    const mediaId = modelViewerContainer.getAttribute(selectors$h.dataMediaId);
    const modelViewerElement = modelViewerContainer.querySelector(selectors$h.modelViewer);
    const modelId = modelViewerElement.getAttribute(selectors$h.dataModelId);

    if (modelViewerContainer.closest(selectors$h.productSlideshow) !== null) {
      const xrButton = modelViewerContainer.closest(selectors$h.productSlideshow).parentElement.querySelector(selectors$h.productXr);

      xrButtons[sectionId] = {
        $element: xrButton,
        defaultId: modelId,
      };
    }

    models[mediaId] = {
      modelId: modelId,
      mediaId: mediaId,
      sectionId: sectionId,
      $container: modelViewerContainer,
      $element: modelViewerElement,
    };

    window.Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: setupShopifyXr,
      },
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: setupModelViewerUi,
      },
    ]);
  }

  function setupShopifyXr(errors) {
    if (errors) {
      console.warn(errors);
      return;
    }
    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', function () {
        setupShopifyXr();
      });
      return;
    }

    for (const sectionId in modelJsonSections) {
      if (modelJsonSections.hasOwnProperty(sectionId)) {
        const modelSection = modelJsonSections[sectionId];
        if (modelSection.loaded) continue;

        const modelJson = document.querySelector(`${selectors$h.modelJson}${sectionId}`);
        if (modelJson) {
          window.ShopifyXR.addModels(JSON.parse(modelJson.innerHTML));
          modelSection.loaded = true;
        }
      }
    }
    window.ShopifyXR.setupXRElements();
  }

  function setupModelViewerUi(errors) {
    if (errors) {
      console.warn(errors);
      return;
    }

    for (const key in models) {
      if (models.hasOwnProperty(key)) {
        const model = models[key];
        if (!model.modelViewerUi) {
          model.modelViewerUi = new Shopify.ModelViewerUI(model.$element);
        }
        setupModelViewerListeners(model);
      }
    }
  }

  function setupModelViewerListeners(model) {
    const xrButton = xrButtons[model.sectionId];

    model.$container.addEventListener('pause', function () {
      if (model.modelViewerUi.pause) {
        model.modelViewerUi.pause();
      }
    });
    model.$container.addEventListener('theme:media:play-desktop', function () {
      if (model.modelViewerUi.play && !isTouch()) {
        model.modelViewerUi.play();
      }
      if (xrButton && xrButton.$element && model && model.modelId && selectors$h.dataModel3d) {
        xrButton.$element.setAttribute(selectors$h.dataModel3d, model.modelId);
      }
    });
    model.$container.addEventListener('play', function () {
      if (model.modelViewerUi.play) {
        model.modelViewerUi.play();
      }
    });
  }

  async function productNativeVideo(uniqueKey) {
    const playerElement = document.querySelector(`[data-player="${uniqueKey}"]`);
    const videoElement = playerElement.querySelector('video');
    const videoLoad = {
      name: 'video-ui',
      version: '1.0',
    };
    await loadScript(videoLoad);

    const player = new window.Shopify.Plyr(videoElement);
    playerElement.addEventListener('pause', function () {
      if (player.pause) {
        player.pause();
      }
    });
    playerElement.addEventListener('theme:media:play-desktop', function () {
      if (player.play && !isTouch()) {
        playerElement.dispatchEvent(new CustomEvent('play'));
      }
    });
    playerElement.addEventListener('play', function () {
      try {
        if (player.play) {
          player.play();
        } else {
          player.addEventListener('onReady', function (event) {
            event.target.play();
          });
        }
      } catch (e) {
        console.warn(e);
      }
    });
    playerElement.addEventListener('destroy', function () {
      try {
        if (player.destroy) {
          player.destroy();
        }
      } catch (e) {
        console.warn(e);
      }
    });
    return player;
  }

  const selectors$g = {
    productSlideshow: '[data-product-slideshow]',
    slideshowMobileStyle: 'data-slideshow-mobile-style',
    slideshowDesktopStyle: 'data-slideshow-desktop-style',
    productThumbs: '[data-product-thumbs]',
    leftThumbsHolder: '[data-thumbs-holder]',
    thumbImage: '[data-slideshow-thumbnail]',
    mediaSlide: '[data-media-slide]',
    dataMediaId: 'data-media-id',
    dataMediaSelect: 'data-media-select',
    mediaType: 'data-type',
    videoPlayerExternal: '[data-type="external_video"]',
    videoPlayerNative: '[data-type="video"]',
    modelViewer: '[data-type="model"]',
    allPlayers: '[data-player]',
    loopVideo: 'data-enable-video-looping',
    verticalAlignment: '[data-thumbnails-left]',
    arrowPrev: '[data-thumbs-arrow-prev]',
    arrowNext: '[data-thumbs-arrow-next]',
    aspectRatio: 'data-aspect-ratio',
    flickitylockHeight: 'flickity-lock-height',
  };

  const classes$c = {
    flickityDisableClass: 'flickity-disabled-mobile',
    flickityEnabled: 'flickity-enabled',
    selected: 'is-selected',
    active: 'is-activated',
    show: 'show',
  };

  class Media {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.slideshow = this.container.querySelector(selectors$g.productSlideshow);
      this.mobileStyle = this.slideshow.getAttribute(selectors$g.slideshowMobileStyle);
      this.desktopStyle = this.slideshow.getAttribute(selectors$g.slideshowDesktopStyle);
      this.arrowPrev = this.container.querySelector(selectors$g.arrowPrev);
      this.arrowNext = this.container.querySelector(selectors$g.arrowNext);
      this.leftThumbsHolder = this.container.querySelector(selectors$g.leftThumbsHolder);
      this.thumbWrapper = this.container.querySelector(selectors$g.productThumbs);
      this.thumbImages = this.container.querySelectorAll(selectors$g.thumbImage);
      this.loopVideo = this.container.getAttribute(selectors$g.loopVideo) === 'true';
      this.verticalAlignment = this.container.querySelector(selectors$g.verticalAlignment) ? true : false;

      this.flkty = null;
      this.thumbs = this.container.querySelector(selectors$g.productThumbs);
      this.currentSlide = null;

      this.init();
    }

    init() {
      this.storeEvents();
      this.connectSliderMediaEvents();
      this.detectVideo();
      this.detectYouTube();
      this.detect3d();
      this.scrollThumbs();

      document.addEventListener('theme:resize:width', () => {
        this.scrollThumbs();
      });
    }

    connectSliderMediaEvents() {
      const isMobile = `(max-width: ${window.theme.sizes.medium}px)`;
      const isMobileMQL = window.matchMedia(isMobile);

      isMobileMQL.addEventListener('change', (event) => {
        event.matches ? this.createMobileSlider() : this.createDesktopSlider();
      });
      isMobileMQL.matches ? this.createMobileSlider() : this.createDesktopSlider();
    }

    createMobileSlider() {
      if (this.flkty) {
        this.destroySlider();
      }

      // defaults to "thumbs" option
      const mobileOptions = {
        autoPlay: false,
        prevNextButtons: false,
        pageDots: false,
        adaptiveHeight: true,
        accessibility: true,
        watchCSS: false,
        wrapAround: true,
        rightToLeft: window.isRTL,
        dragThreshold: 80,
        contain: true,
        fade: true,
      };
      if (this.mobileStyle == 'carousel') {
        mobileOptions.contain = false;
        mobileOptions.dragThreshold = 10;
        mobileOptions.fade = false;
      }
      if (this.mobileStyle == 'slideshow') {
        mobileOptions.pageDots = true;
        mobileOptions.fade = false;
        mobileOptions.dragThreshold = 10;
      }
      this.createSlider(mobileOptions);
    }

    createDesktopSlider() {
      if (this.flkty) {
        this.destroySlider();
      }
      if (this.desktopStyle == 'none') {
        return;
      }
      const desktopOptions = {
        autoPlay: false,
        prevNextButtons: false,
        pageDots: false,
        adaptiveHeight: true,
        accessibility: true,
        watchCSS: false,
        wrapAround: true,
        rightToLeft: window.isRTL,
        dragThreshold: 80,
        contain: true,
        fade: true,
      };
      this.createSlider(desktopOptions);
    }

    createSlider(options) {
      this.flkty = new Flickity(this.slideshow, options);

      this.flkty.resize();

      this.currentSlide = this.slideshow.querySelectorAll(selectors$g.mediaSlide)[0];

      this.setDraggable();
      this.addEventListeners();
    }

    destroySlider() {
      this.removeEventListeners();
      this.flkty.destroy();
    }

    storeEvents() {
      this.storeFlktyChange = (e) => this.doFlktyChange(e);
      this.storeFlktySettle = (e) => this.doFlktySettle(e);
      this.storeImageChange = (e) => this.doImageChange(e);
      this.storeArrowPrevClick = (e) => this.doArrowPrevClick(e);
      this.storeArrowNextClick = (e) => this.doArrowNextClick(e);
      this.storeThumbClick = (e) => this.doThumbClick(e);
      this.storeThumbContainerScroll = (e) => this.doThumbContainerScroll(e);
    }
    addEventListeners() {
      this.flkty.on('change', this.storeFlktyChange);
      this.flkty.on('settle', this.storeFlktySettle);

      this.slideshow.addEventListener('theme:image:change', this.storeImageChange);

      this.arrowPrev?.addEventListener('click', this.storeArrowPrevClick);
      this.arrowNext?.addEventListener('click', this.storeArrowNextClick);

      this.thumbs?.addEventListener('scroll', this.storeThumbContainerScroll);
      this.thumbImages.forEach((thumb) => {
        thumb.addEventListener('click', this.storeThumbClick);
      });
    }
    removeEventListeners() {
      this.flkty.on('change', this.storeFlktyChange);
      this.flkty.on('settle', this.storeFlktySettle);

      this.slideshow.removeEventListener('theme:image:change', this.storeImageChange);

      this.arrowPrev?.removeEventListener('click', this.storeArrowPrevClick);
      this.arrowNext?.removeEventListener('click', this.storeArrowNextClick);

      this.thumbs?.removeEventListener('scroll', this.storeThumbContainerScroll);
      this.thumbImages.forEach((thumb) => {
        thumb.removeEventListener('click', this.storeThumbClick);
      });
    }

    doFlktyChange(index) {
      this.currentSlide.dispatchEvent(new CustomEvent('pause'));
      this.currentSlide = this.flkty.cells[index].element;
      this.slideshow.classList.remove(selectors$g.flickitylockHeight);
      const id = this.currentSlide.getAttribute(selectors$g.dataMediaId);
      const currentThumb = this.thumbWrapper?.querySelector(`[${selectors$g.dataMediaSelect}="${id}"]`);

      this.thumbWrapper?.querySelector(`.${classes$c.active}`).classList.remove(classes$c.active);
      currentThumb?.classList.add(classes$c.active);

      this.scrollThumbs();
    }

    doFlktySettle(index) {
      this.allSlides = this.flkty.cells;
      this.currentSlide = this.flkty.cells[index].element;

      this.setDraggable();

      this.currentSlide.dispatchEvent(new CustomEvent('theme:media:play-desktop'));
      const isFocusEnabled = document.body.classList.contains(selectors$g.focusEnabled);
      if (isFocusEnabled) this.currentSlide.dispatchEvent(new Event('focus'));
      this.scrollThumbs();
    }

    doImageChange(event) {
      var mediaId = event.detail.id;
      const mediaIdString = `[${selectors$g.dataMediaId}="${mediaId}"]`;

      const matchesMedia = (cell) => {
        return cell.element.matches(mediaIdString);
      };
      const index = this.flkty.cells.findIndex(matchesMedia);

      this.flkty.select(index);
      this.scrollThumbs();
    }

    doThumbContainerScroll() {
      this.scrollThumbs('scroll');
    }

    doArrowPrevClick() {
      this.scrollThumbs('clickPrev');
    }

    doArrowNextClick() {
      this.scrollThumbs('clickNext');
    }

    doThumbClick(event) {
      const id = event.currentTarget.getAttribute(selectors$g.dataMediaSelect);
      this.slideshow.dispatchEvent(
        new CustomEvent('theme:image:change', {
          detail: {
            id: id,
          },
        })
      );
    }

    setDraggable() {
      if (this.currentSlide) {
        const mediaType = this.currentSlide.getAttribute(selectors$g.mediaType);

        if (mediaType === 'model' || mediaType === 'video' || mediaType === 'external_video') {
          // fisrt boolean sets value, second option false to prevent refresh
          this.flkty.options.draggable = false;
          this.flkty.updateDraggable();
        } else {
          this.flkty.options.draggable = true;
          this.flkty.updateDraggable();
        }
      }
    }

    detect3d() {
      const modelViewerElements = this.container.querySelectorAll(selectors$g.modelViewer);

      if (modelViewerElements) {
        modelViewerElements.forEach((element) => {
          initSectionModels(element, this.section.id);
        });
        document.addEventListener(
          'shopify_xr_launch',
          function () {
            this.container.querySelectorAll(selectors$g.allPlayers).forEach((player) => {
              player.dispatchEvent(new CustomEvent('pause'));
            });
          }.bind(this)
        );
      }
    }

    detectVideo() {
      const playerElements = this.section.container.querySelectorAll(selectors$g.videoPlayerNative);
      for (var player of playerElements) {
        const uniqueKey = player.dataset.player;
        const nativePlayerPromise = productNativeVideo(uniqueKey);
        if (this.loopVideo === true) {
          nativePlayerPromise
            .then((nativePlayer) => {
              nativePlayer.loop = true;
              return nativePlayer;
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    }

    detectYouTube() {
      const playerElements = this.section.container.querySelectorAll(selectors$g.videoPlayerExternal);
      for (var player of playerElements) {
        const uniqueKey = player.dataset.player;
        const youtubePlayerPromise = embedYoutube(uniqueKey);
        if (this.loopVideo === true) {
          youtubePlayerPromise
            .then((youtubePlayer) => {
              return _setToLoop(youtubePlayer);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    }

    pauseAllMedia() {
      const all = this.container.querySelector(selectors$g.mediaSlide);
      all.dispatchEvent(new CustomEvent('pause'));
    }

    pauseOtherMedia(uniqueKey) {
      const otherMedia = this.container.querySelector(`${selectors$g.mediaSlide}:not([data-player="${uniqueKey}"])`);
      otherMedia.dispatchEvent(new CustomEvent('pause'));
    }

    destroy() {
      this.container.querySelectorAll(selectors$g.allPlayers).forEach((player) => {
        player.dispatchEvent(new CustomEvent('destroy'));
      });
    }

    scrollThumbs(event) {
      this.thumbs = this.container.querySelector(selectors$g.productThumbs);

      if (this.thumbs) {
        this.thumb = this.thumbs.querySelector(`.${classes$c.active}`);
        this.thumbItems = this.container.querySelectorAll(selectors$g.thumbImage);
        this.lastThumb = this.thumbItems[this.thumbItems.length - 1];

        if (!this.thumb) return;
        this.thumbsScrollTop = this.thumbs.scrollTop;
        this.thumbsScrollLeft = this.thumbs.scrollLeft;
        this.thumbsWidth = this.thumbs.offsetWidth;
        this.thumbsHeight = this.slideshow.offsetWidth / this.thumb.getAttribute(selectors$g.aspectRatio);
        this.thumbsPositionBottom = this.thumbsScrollTop + this.thumbsHeight;
        this.thumbsPositionRight = this.thumbsScrollLeft + this.thumbsWidth;

        this.checkThumbPositions();
        this.toggleToActiveThumb(event);
        this.toggleArrows();
      }
    }

    checkThumbPositions() {
      this.thumbWidth = this.thumb.offsetWidth;
      this.thumbHeight = this.thumb.offsetHeight;
      this.thumbPosTop = this.thumb.offsetTop;
      this.thumbPosLeft = this.thumb.offsetLeft;
      this.lastThumbRightPos = this.lastThumb.offsetLeft + this.thumbWidth;
      this.lastThumbBottomPos = this.lastThumb.offsetTop + this.thumbHeight;
      this.scrollTopPosition = this.thumbPosTop + this.thumbHeight / 2 - this.thumbsHeight / 2;
      this.scrollLeftPosition = this.thumbPosLeft + this.thumbWidth / 2 - this.thumbsWidth / 2;

      this.topCheck = this.thumbsScrollTop > 0;
      this.bottomCheck = this.thumbsPositionBottom < this.lastThumbBottomPos;
      this.leftCheck = this.thumbsScrollLeft > 0;
      this.rightCheck = this.thumbsPositionRight < this.lastThumbRightPos;
      this.verticalCheck = this.bottomCheck || this.topCheck;
      this.horizontalCheck = this.rightCheck || this.leftCheck;
    }

    toggleToActiveThumb(event) {
      if (event !== 'scroll') {
        if (event == 'clickPrev') {
          if (this.verticalCheck) {
            this.scrollTopPosition = this.thumbsScrollTop - this.thumbsHeight;
            this.scrollLeftPosition = 0;
          } else {
            this.scrollTopPosition = 0;
            this.scrollLeftPosition = this.thumbsScrollLeft - this.thumbsWidth;
          }
        }
        if (event == 'clickNext') {
          if (this.verticalCheck) {
            this.scrollTopPosition = this.thumbsScrollTop + this.thumbsHeight;
            this.scrollLeftPosition = 0;
          } else {
            this.scrollTopPosition = 0;
            this.scrollLeftPosition = this.thumbsScrollLeft + this.thumbsWidth;
          }
        }

        this.thumbs.scrollTo({
          top: this.scrollTopPosition,
          left: this.scrollLeftPosition,
          behavior: 'smooth',
        });
      }
    }

    toggleArrows() {
      if (this.verticalCheck || (this.verticalAlignment && !this.verticalCheck)) {
        this.arrowPrev.classList.toggle(classes$c.show, this.topCheck);
        this.arrowNext.classList.toggle(classes$c.show, this.bottomCheck);
      }

      if (this.horizontalCheck || (!this.verticalAlignment && !this.horizontalCheck)) {
        this.arrowPrev.classList.toggle(classes$c.show, this.leftCheck);
        this.arrowNext.classList.toggle(classes$c.show, this.rightCheck);
      }
    }
  }

  function _setToLoop(youtubePlayer) {
    youtubePlayer.addEventListener('onStateChange', function (event) {
      if (event.data === 0) {
        // video is over, replay
        event.target.playVideo();
      }
    });
    return youtubePlayer;
  }

  const selectors$f = {
    pickupContainer: 'data-store-availability-container',
    shopifySection: '[data-api-content]',
    drawer: '[data-pickup-drawer]',
    drawerOpen: '[data-pickup-drawer-open]',
    drawerClose: '[data-pickup-drawer-close]',
    drawerBody: '[data-pickup-body]',
  };

  const classes$b = {
    isVisible: 'drawer--visible',
    isHidden: 'hide',
    isPickupVisible: 'is-pickup-visible',
  };

  let sections$5 = {};

  class PickupAvailability {
    constructor(section) {
      this.container = section.container;
      this.drawer = null;
      this.buttonDrawerOpen = null;
      this.buttonDrawerClose = null;
      this.drawerBody = null;

      this.fetchPickupAvailability();

      this.container.addEventListener('theme:variant:change', (event) => this.fetchPickupAvailability(event));
    }

    fetchPickupAvailability(event) {
      const container = this.container.querySelector(`[${selectors$f.pickupContainer}]`);
      if (!container) return;
      const variantID = event && event.detail.variant ? event.detail.variant.id : container.getAttribute(selectors$f.pickupContainer);
      if (event && !event.detail.variant) {
        container.classList.add(classes$b.isHidden);
        return;
      }

      if (variantID) {
        fetch(`${window.theme.routes.root_url}variants/${variantID}/?section_id=api-pickup-availability`)
          .then(this.handleErrors)
          .then((response) => response.text())
          .then((text) => {
            const pickupAvailabilityHTML = new DOMParser().parseFromString(text, 'text/html').querySelector(selectors$f.shopifySection).innerHTML;
            container.innerHTML = pickupAvailabilityHTML;
            container.classList.remove(classes$b.isHidden);

            this.drawer = this.container.querySelector(selectors$f.drawer);
            this.buttonDrawerOpen = this.container.querySelector(selectors$f.drawerOpen);
            this.buttonDrawerClose = this.container.querySelectorAll(selectors$f.drawerClose);
            this.drawerBody = this.container.querySelector(selectors$f.drawerBody);

            if (this.buttonDrawerOpen) {
              this.buttonDrawerOpen.addEventListener('click', () => this.openDrawer());
            }

            if (this.buttonDrawerClose.length) {
              this.buttonDrawerClose.forEach((element) => {
                element.addEventListener('click', () => this.closeDrawer());
              });
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }

    openDrawer() {
      if (this.drawer) {
        document.body.classList.add(classes$b.isPickupVisible);
        this.drawer.classList.add(classes$b.isVisible);
        this.drawer.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
        this.drawerBody.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
      }
    }

    closeDrawer() {
      if (this.drawer) {
        document.body.classList.remove(classes$b.isPickupVisible);
        this.drawer.classList.remove(classes$b.isVisible);
        this.drawer.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
        this.drawerBody.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
      }
    }

    handleErrors(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }
  }

  const pickupAvailability = {
    onLoad() {
      sections$5[this.id] = new PickupAvailability(this);
    },
  };

  const hideElement = (elem) => {
    if (elem) {
      elem.style.display = 'none';
    }
  };

  const selectors$e = {
    form: '[data-product-form]',
    optionPosition: 'data-option-position',
    optionInput: '[name^="options"], [data-popout-option]',
    selectOptionValue: 'data-value',
  };

  const classes$a = {
    soldOut: 'sold-out',
    unavailable: 'unavailable',
  };

  /**
   * Variant Sellout Precrime Click Preview
   * I think of this like the precrime machine in Minority report.  It gives a preview
   * of every possible click action, given the current form state.  The logic is:
   *
   * for each clickable name=options[] variant selection element
   * find the value of the form if the element were clicked
   * lookup the variant with those value in the product json
   * clear the classes, add .unavailable if it's not found,
   * and add .sold-out if it is out of stock
   *
   * Caveat: we rely on the option position so we don't need
   * to keep a complex map of keys and values.
   */

  class SelloutVariants {
    constructor(section, productJSON) {
      this.container = section;
      this.productJSON = productJSON;
      this.form = this.container.querySelector(selectors$e.form);
      this.formData = new FormData(this.form);
      this.optionElements = this.container.querySelectorAll(selectors$e.optionInput);

      if (this.productJSON && this.form) {
        this.init();
      }
    }

    init() {
      this.update();
    }

    update() {
      this.getCurrentState();

      this.optionElements.forEach((el) => {
        const val = el.value || el.getAttribute(selectors$e.selectOptionValue);
        const positionString = el.closest(`[${selectors$e.optionPosition}]`).getAttribute(selectors$e.optionPosition);
        // subtract one because option.position in liquid does not count form zero, but JS arrays do
        const position = parseInt(positionString, 10) - 1;

        let newVals = [...this.selections];
        newVals[position] = val;

        const found = this.productJSON.variants.find((element) => {
          // only return true if every option matches our hypothetical selection
          let perfectMatch = true;
          for (let index = 0; index < newVals.length; index++) {
            if (element.options[index] !== newVals[index]) {
              perfectMatch = false;
            }
          }
          return perfectMatch;
        });

        el.classList.remove(classes$a.soldOut, classes$a.unavailable);
        if (typeof found === 'undefined') {
          el.classList.add(classes$a.unavailable);
        } else if (found && found.available === false) {
          el.classList.add(classes$a.soldOut);
        }
      });
    }

    getCurrentState() {
      this.formData = new FormData(this.form);
      this.selections = [];
      for (var value of this.formData.entries()) {
        if (value[0].includes('options[')) {
          // push the current state of the form, dont worry about the group name
          // we will be using the array position instead of the name to match values
          this.selections.push(value[1]);
        }
      }
    }
  }

  const selectors$d = {
    outerSection: '[data-section-id]',
    upsellModal: '[data-upsell-modal]',
    productForm: '[data-product-form]',
    productSlideshow: '[data-product-slideshow]',
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    buttonsWrapper: '[data-buttons-wrapper]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    priceButton: '[data-button-price]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    unitPrice: '[data-product-unit-price]',
    unitBase: '[data-product-base]',
    unitWrapper: '[data-product-unit]',
    dataEnableHistoryState: 'data-enable-history-state',
    optionPosition: 'data-option-position',
    optionValue: '[data-option-value]',
    subPrices: '[data-subscription-watch-price]',
    subSelectors: '[data-subscription-selectors]',
    priceOffWrap: '[data-price-off]',
    priceOffType: '[data-price-off-type]',
    priceOffAmount: '[data-price-off-amount]',
    subsToggle: '[data-toggles-group]',
    subsChild: 'data-group-toggle',
    subDescription: '[data-plan-description]',
    remainingCount: '[data-remaining-count]',
    remainingMax: 'data-remaining-max',
    remainingWrapper: '[data-remaining-wrapper]',
    remainingJSON: '[data-product-remaining-json]',
    isPreOrder: '[data-product-preorder]',
    idInput: '[name="id"]',
  };

  const classes$9 = {
    hide: 'hide',
    variantSoldOut: 'variant--soldout',
    variantUnavailable: 'variant--unavailable',
    productPriceSale: 'product__price--sale',
    remainingLow: 'count-is-low',
    remainingIn: 'count-is-in',
    remainingOut: 'count-is-out',
    remainingUnavailable: 'count-is-unavailable',
  };

  class ProductForm extends HTMLElement {
    constructor() {
      super();
      this.container = this;
    }

    connectedCallback() {
      this.outerSection = this.container.closest(selectors$d.outerSection);
      this.upsell = this.container.closest(selectors$d.upsellModal);
      this.outerWrapper = this.upsell ? this.upsell : this.outerSection;

      this.productForm = this.container.querySelector(selectors$d.productForm);
      this.slideshow = this.outerWrapper.querySelector(selectors$d.productSlideshow);
      this.enableHistoryState =
        this.outerSection && this.outerSection.hasAttribute(selectors$d.dataEnableHistoryState) ? this.outerSection.getAttribute(selectors$d.dataEnableHistoryState) === 'true' : false;
      this.hasUnitPricing = this.outerWrapper.querySelector(selectors$d.unitWrapper);
      this.subSelectors = this.outerWrapper.querySelector(selectors$d.subSelectors);
      this.subPrices = this.outerWrapper.querySelector(selectors$d.subPrices);

      this.priceOffWrap = this.outerWrapper.querySelector(selectors$d.priceOffWrap);
      this.priceOffAmount = this.outerWrapper.querySelector(selectors$d.priceOffAmount);
      this.priceOffType = this.outerWrapper.querySelector(selectors$d.priceOffType);
      this.planDecription = this.outerWrapper.querySelector(selectors$d.subDescription);
      this.isPreOrder = this.container.querySelector(selectors$d.isPreOrder);

      this.remainingWrapper = this.outerWrapper.querySelector(selectors$d.remainingWrapper);
      const remainingMaxWrap = this.outerWrapper.querySelector(`[${selectors$d.remainingMax}]`);

      this.sellout = null;

      if (this.remainingWrapper && remainingMaxWrap) {
        this.remainingMaxInt = parseInt(remainingMaxWrap.getAttribute(selectors$d.remainingMax), 10);
        this.remainingCount = this.outerWrapper.querySelector(selectors$d.remainingCount);
        this.remainingJSONWrapper = this.outerWrapper.querySelector(selectors$d.remainingJSON);
        this.remainingJSON = null;
        if (this.remainingJSONWrapper && this.remainingJSONWrapper.innerHTML !== '') {
          this.remainingJSON = JSON.parse(this.remainingJSONWrapper.innerHTML);
        } else {
          console.warn('Missing product quantity JSON');
        }
      }

      initQtySection(this.outerWrapper);

      let productJSONText = null;
      this.productJSON = null;
      const productElemJSON = this.outerWrapper.querySelector(selectors$d.productJson);

      if (productElemJSON) {
        productJSONText = productElemJSON.innerHTML;
      }
      if (productJSONText && this.productForm) {
        this.productJSON = JSON.parse(productJSONText);
        this.sellout = new SelloutVariants(this.outerWrapper, this.productJSON);
        this.linkForm();
      } else {
        console.warn('Missing product form or product JSON');
      }

      // Add cookie for recent products
      if (this.productJSON) {
        new RecordRecentlyViewed(this.productJSON.handle);
      }
    }

    destroy() {
      this.productForm.destroy();
    }

    linkForm() {
      this.productForm = new ProductFormReader(this.outerWrapper, this.productJSON, {
        onOptionChange: this.onOptionChange.bind(this),
        onPlanChange: this.onPlanChange.bind(this),
        onQuantityChange: this.onQuantityChange.bind(this),
      });
      this.pushState(this.productForm.getFormState());
      this.subsToggleListeners();
    }

    onOptionChange(evt) {
      this.pushState(evt.dataset);
    }

    onPlanChange(evt) {
      if (this.subPrices) {
        this.pushState(evt.dataset);
      }
    }

    onQuantityChange(evt) {
      const formState = evt.dataset;
      this.productState = this.setProductState(formState);
      this.updateButtonPrices(formState);
    }

    pushState(formState) {
      this.productState = this.setProductState(formState);
      this.updateProductImage(formState);
      this.updateAddToCartState(formState);
      this.updateProductPrices(formState);
      this.updateSaleText(formState);
      this.updateSubscriptionText(formState);
      this.updateLegend(formState);
      this.updateRemaining(formState);
      this.fireHookEvent(formState);
      if (this.sellout) {
        this.sellout.update(formState);
      }
      if (this.enableHistoryState) {
        this.updateHistoryState(formState);
      }
    }

    updateAddToCartState(formState) {
      const variant = formState.variant;
      let addText = theme.strings.addToCart;
      const priceWrapper = this.outerWrapper.querySelectorAll(selectors$d.priceWrapper);
      const buttonsWrapper = this.outerWrapper.querySelector(selectors$d.buttonsWrapper);
      const addToCart = buttonsWrapper.querySelectorAll(selectors$d.addToCart);
      const addToCartText = buttonsWrapper.querySelectorAll(selectors$d.addToCartText);

      if (this.isPreOrder) {
        addText = theme.strings.preOrder;
      }

      if (priceWrapper.length && variant) {
        priceWrapper.forEach((element) => {
          element.classList.remove(classes$9.hide);
        });
      }

      if (addToCart.length) {
        addToCart.forEach((element) => {
          if (variant) {
            if (variant.available) {
              element.disabled = false;
            } else {
              element.disabled = true;
            }
          } else {
            element.disabled = true;
          }
        });
      }

      if (addToCartText.length) {
        addToCartText.forEach((element) => {
          if (variant) {
            if (variant.available) {
              element.innerHTML = addText;
            } else {
              element.innerHTML = theme.strings.soldOut;
            }
          } else {
            element.innerHTML = theme.strings.unavailable;
          }
        });
      }

      if (buttonsWrapper) {
        if (variant) {
          if (variant.available) {
            buttonsWrapper.classList.remove(classes$9.variantSoldOut, classes$9.variantUnavailable);
          } else {
            buttonsWrapper.classList.add(classes$9.variantSoldOut);
            buttonsWrapper.classList.remove(classes$9.variantUnavailable);
          }
          const formSelect = buttonsWrapper.querySelector(selectors$d.originalSelectorId);
          if (formSelect) {
            formSelect.value = variant.id;
          }
        } else {
          buttonsWrapper.classList.add(classes$9.variantUnavailable);
          buttonsWrapper.classList.remove(classes$9.variantSoldOut);
        }
      }
    }

    updateLegend(formState) {
      const variant = formState.variant;
      if (variant) {
        const vals = this.container.parentNode.querySelectorAll(selectors$d.optionValue);
        vals.forEach((val) => {
          const wrapper = val.closest(`[${selectors$d.optionPosition}]`);
          if (wrapper) {
            const position = wrapper.getAttribute(selectors$d.optionPosition);
            const index = parseInt(position, 10) - 1;
            this.newValue = variant.options[index];
            val.innerHTML = this.newValue;
          }
        });
      }
    }

    updateHistoryState(formState) {
      const variant = formState.variant;
      const plan = formState.plan;
      const location = window.location.href;
      if (variant && location.includes('/product')) {
        const url = new window.URL(location);
        const params = url.searchParams;
        params.set('variant', variant.id);
        if (plan && plan.detail && plan.detail.id && this.productState.hasPlan) {
          params.set('selling_plan', plan.detail.id);
        } else {
          params.delete('selling_plan');
        }
        url.search = params.toString();
        const urlString = url.toString();
        window.history.replaceState({path: urlString}, '', urlString);
      }
    }

    updateRemaining(formState) {
      const variant = formState.variant;
      if (variant && this.remainingWrapper && this.remainingJSON && this.remainingCount) {
        const newQuantity = this.remainingJSON[variant.id];
        if (newQuantity && newQuantity <= this.remainingMaxInt && newQuantity > 0) {
          this.remainingWrapper.classList.remove(classes$9.remainingIn, classes$9.remainingOut, classes$9.remainingUnavailable);
          this.remainingWrapper.classList.add(classes$9.remainingLow);
          this.remainingCount.innerHTML = newQuantity;
        } else if (this.productState.soldOut) {
          this.remainingWrapper.classList.remove(classes$9.remainingLow, classes$9.remainingIn, classes$9.remainingUnavailable);
          this.remainingWrapper.classList.add(classes$9.remainingOut);
        } else if (this.productState.available) {
          this.remainingWrapper.classList.remove(classes$9.remainingLow, classes$9.remainingOut, classes$9.remainingUnavailable);
          this.remainingWrapper.classList.add(classes$9.remainingIn);
        }
      } else if (this.remainingWrapper) {
        this.remainingWrapper.classList.remove(classes$9.remainingIn, classes$9.remainingOut, classes$9.remainingLow);
        this.remainingWrapper.classList.add(classes$9.remainingUnavailable);
      }
    }

    getBaseUnit(variant) {
      return variant.unit_price_measurement.reference_value === 1
        ? variant.unit_price_measurement.reference_unit
        : variant.unit_price_measurement.reference_value + variant.unit_price_measurement.reference_unit;
    }

    subsToggleListeners() {
      const toggles = this.outerWrapper.querySelectorAll(selectors$d.subsToggle);

      toggles.forEach((toggle) => {
        toggle.addEventListener(
          'change',
          function (e) {
            const val = e.target.value.toString();
            const selected = this.outerWrapper.querySelector(`[${selectors$d.subsChild}="${val}"]`);
            const groups = this.outerWrapper.querySelectorAll(`[${selectors$d.subsChild}]`);
            if (selected) {
              selected.classList.remove(classes$9.hide);
              const first = selected.querySelector(`[name="selling_plan"]`);
              first.checked = true;
              first.dispatchEvent(new Event('change'));
            }
            groups.forEach((group) => {
              if (group !== selected) {
                group.classList.add(classes$9.hide);
                const plans = group.querySelectorAll(`[name="selling_plan"]`);
                plans.forEach((plan) => {
                  plan.checked = false;
                  plan.dispatchEvent(new Event('change'));
                });
              }
            });
          }.bind(this)
        );
      });
    }

    updateSaleText(formState) {
      if (this.productState.planSale) {
        this.updateSaleTextSubscription(formState);
      } else if (this.productState.onSale) {
        this.updateSaleTextStandard(formState);
      } else if (this.priceOffWrap) {
        this.priceOffWrap.classList.add(classes$9.hide);
      }
    }

    updateSaleTextStandard(formState) {
      if (!this.priceOffType) return;
      this.priceOffType.innerHTML = window.theme.strings.sale || 'sale';
      const variant = formState.variant;
      if (window.theme.settings.badge_sale_type && window.theme.settings.badge_sale_type === 'percentage') {
        const discountFloat = (variant.compare_at_price - variant.price) / variant.compare_at_price;
        const discountInt = Math.floor(discountFloat * 100);
        this.priceOffAmount.innerHTML = `${discountInt}%`;
      } else {
        const discount = variant.compare_at_price - variant.price;
        this.priceOffAmount.innerHTML = this.formattingMoney(discount);
      }
      this.priceOffWrap.classList.remove(classes$9.hide);
    }

    updateSaleTextSubscription(formState) {
      this.priceOffType.innerHTML = window.theme.strings.subscription || 'subscripton';
      const variant = formState.variant;
      const adjustment = formState.plan.detail.price_adjustments[0];
      const discount = adjustment.value;
      if (adjustment && adjustment.value_type === 'percentage') {
        this.priceOffAmount.innerHTML = `${discount}%`;
      } else if (adjustment && adjustment.value_type === 'price') {
        this.priceOffAmount.innerHTML = this.formattingMoney(variant.price - adjustment.value);
      } else {
        this.priceOffAmount.innerHTML = this.formattingMoney(discount);
      }
      this.priceOffWrap.classList.remove(classes$9.hide);
    }

    updateSubscriptionText(formState) {
      if (formState.plan && this.planDecription && formState.plan.detail.description !== null) {
        this.planDecription.innerHTML = formState.plan.detail.description;
        this.planDecription.classList.remove(classes$9.hide);
      } else if (this.planDecription) {
        this.planDecription.classList.add(classes$9.hide);
      }
    }

    getPrices(formState) {
      const variant = formState.variant;
      const plan = formState.plan;
      let comparePrice = '';
      let price = '';

      if (this.productState.available) {
        comparePrice = variant.compare_at_price;
        price = variant.price;
      }

      if (this.productState.hasPlan) {
        price = plan.allocation.price;
      }

      if (this.productState.planSale) {
        comparePrice = plan.allocation.compare_at_price;
        price = plan.allocation.price;
      }
      return {
        price: price,
        comparePrice: comparePrice,
      };
    }

    updateButtonPrices(formState) {
      const priceButtons = this.outerWrapper.querySelectorAll(selectors$d.priceButton);
      const {price} = this.getPrices(formState);

      if (priceButtons.length) {
        priceButtons.forEach((btn) => {
          const btnPrice = formState.quantity * price;
          btn.innerHTML = this.formattingMoney(btnPrice);
        });
      }
    }

    updateProductPrices(formState) {
      const variant = formState.variant;
      const priceWrappers = this.outerWrapper.querySelectorAll(selectors$d.priceWrapper);
      const priceButtons = this.outerWrapper.querySelectorAll(selectors$d.priceButton);

      const {price, comparePrice} = this.getPrices(formState);

      priceWrappers.forEach((wrap) => {
        const comparePriceEl = wrap.querySelector(selectors$d.comparePrice);
        const productPriceEl = wrap.querySelector(selectors$d.productPrice);
        const comparePriceText = wrap.querySelector(selectors$d.comparePriceText);

        if (comparePriceEl) {
          if (this.productState.onSale || this.productState.planSale) {
            comparePriceEl.classList.remove(classes$9.hide);
            comparePriceText.classList.remove(classes$9.hide);
            productPriceEl.classList.add(classes$9.productPriceSale);
          } else {
            comparePriceEl.classList.add(classes$9.hide);
            comparePriceText.classList.add(classes$9.hide);
            productPriceEl.classList.remove(classes$9.productPriceSale);
          }
          comparePriceEl.innerHTML = this.formattingMoney(comparePrice);
        }
        if (productPriceEl) {
          if (variant) {
            productPriceEl.innerHTML = this.formattingMoney(price);
          } else {
            productPriceEl.innerHTML = '&nbsp;';
          }
        }
      });

      if (priceButtons.length) {
        priceButtons.forEach((btn) => {
          const btnPrice = formState.quantity * price;
          btn.innerHTML = this.formattingMoney(btnPrice);
        });
      }

      if (this.hasUnitPricing) {
        this.updateProductUnits(formState);
      }
    }

    updateProductUnits(formState) {
      const variant = formState.variant;
      const plan = formState.plan;
      let unitPrice = null;

      if (variant && variant.unit_price) {
        unitPrice = variant.unit_price;
      }
      if (plan && plan.allocation && plan.allocation.unit_price) {
        unitPrice = plan.allocation.unit_price;
      }

      if (unitPrice) {
        const base = this.getBaseUnit(variant);
        this.outerWrapper.querySelector(selectors$d.unitPrice).innerHTML = this.formattingMoney(unitPrice);
        this.outerWrapper.querySelector(selectors$d.unitBase).innerHTML = base;
        showElement(this.outerWrapper.querySelector(selectors$d.unitWrapper));
      } else {
        hideElement(this.outerWrapper.querySelector(selectors$d.unitWrapper));
      }
    }

    fireHookEvent(formState) {
      const variant = formState.variant;
      this.container.dispatchEvent(
        new CustomEvent('theme:variant:change', {
          detail: {
            variant: variant,
          },
          bubbles: true,
        })
      );
    }

    /**
     * Tracks aspects of the product state that are relevant to UI updates
     * @param {object} evt - variant change event
     * @return {object} productState - represents state of variant + plans
     *  productState.available - current variant and selling plan options result in valid offer
     *  productState.soldOut - variant is sold out
     *  productState.onSale - variant is on sale
     *  productState.showUnitPrice - variant has unit price
     *  productState.requiresPlan - all the product variants requires a selling plan
     *  productState.hasPlan - there is a valid selling plan
     *  productState.planSale - plan has a discount to show next to price
     *  productState.planPerDelivery - plan price does not equal per_delivery_price - a prepaid subscribtion
     */
    setProductState(dataset) {
      const variant = dataset.variant;
      const plan = dataset.plan;

      const productState = {
        available: true,
        soldOut: false,
        onSale: false,
        showUnitPrice: false,
        requiresPlan: false,
        hasPlan: false,
        planPerDelivery: false,
        planSale: false,
      };

      if (!variant || (variant.requires_selling_plan && !plan)) {
        productState.available = false;
      } else {
        if (!variant.available) {
          productState.soldOut = true;
        }

        if (variant.compare_at_price > variant.price) {
          productState.onSale = true;
        }

        if (variant.unit_price) {
          productState.showUnitPrice = true;
        }

        if (this.productJSON && this.productJSON.requires_selling_plan) {
          productState.requiresPlan = true;
        }

        if (plan && this.subPrices) {
          productState.hasPlan = true;
          if (plan.allocation.per_delivery_price !== plan.allocation.price) {
            productState.planPerDelivery = true;
          }
          if (variant.price > plan.allocation.price) {
            productState.planSale = true;
          }
        }
      }
      return productState;
    }

    updateProductImage(formState) {
      const variant = formState.variant;
      if (variant) {
        if (this.slideshow && variant.featured_media && variant.featured_media.id) {
          // Update variant image, if one is set
          this.slideshow.dispatchEvent(
            new CustomEvent('theme:image:change', {
              detail: {
                id: variant.featured_media.id,
              },
            })
          );
        }
      }
    }

    formattingMoney(money) {
      if (theme.settings.currency_code_enable) {
        return themeCurrency.formatMoney(money, theme.moneyFormat) + ` ${theme.currencyCode}`;
      } else {
        return themeCurrency.formatMoney(money, theme.moneyFormat);
      }
    }
  }

  const selectors$c = {
    slideshow: '[data-product-slideshow]',
    singeImage: '[data-product-image]',
    zoomButton: '[data-zoom-button]',
    zoomWrapper: '[data-zoom-wrapper]',
    mediaId: 'data-media-id',
  };

  function productPhotoswipeZoom(container, json) {
    const loadedPromise = loadScript({url: window.theme.assets.photoswipe});
    const returnZoom = loadedPromise
      .then(() => {
        const PhotoSwipe = window.themePhotoswipe.PhotoSwipe.default;
        const PhotoSwipeUI = window.themePhotoswipe.PhotoSwipeUI.default;

        const triggers = container.querySelectorAll(selectors$c.zoomButton);
        triggers.forEach((trigger) => {
          trigger.addEventListener('click', (event) => {
            const el = container.querySelector(selectors$c.zoomWrapper);
            const dataId = event.target.closest(`[${selectors$c.mediaId}]`).getAttribute(selectors$c.mediaId).toString();
            const items = [];
            for (let i = 0; i < json.media.length; i++) {
              if (json.media[i].media_type === 'image') {
                items[items.length] = {
                  src: json.media[i].src,
                  w: json.media[i].width,
                  h: json.media[i].height,
                  id: json.media[i].id,
                };
              }
            }
            const findImage = (element) => element.id.toString() === dataId;
            const index = items.findIndex(findImage);
            const options = {
              index,
              showHideOpacity: true,
              showAnimationDuration: 150,
              hideAnimationDuration: 250,
              bgOpacity: 1,
              spacing: 0,
              allowPanToNext: false,
              maxSpreadZoom: 3,
              history: false,
              loop: true,
              pinchToClose: false,
              modal: false,
              closeOnScroll: false,
              closeOnVerticalDrag: true,
              getDoubleTapZoom: function getDoubleTapZoom(isMouseClick, item) {
                if (isMouseClick) {
                  return 1.67;
                } else {
                  return item.initialZoomLevel < 0.7 ? 1 : 1.3;
                }
              },
              getThumbBoundsFn: function getThumbBoundsFn() {
                let imageLocation = container.querySelector(selectors$c.slideshow);
                if (!imageLocation) {
                  imageLocation = container.querySelector(selectors$c.singeImage);
                }
                const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                const rect = imageLocation.getBoundingClientRect();
                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
              },
            };
            el.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
            // Initializes and opens PhotoSwipe
            const gallery = new PhotoSwipe(el, PhotoSwipeUI, items, options);
            gallery.init();
            gallery.listen('close', function () {
              document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
            });
          });
        });
      })
      .catch((e) => console.error(e));
    return returnZoom;
  }

  const selectors$b = {
    body: 'body',
    dataRelatedSectionElem: '[data-related-section]',
    dataTabsHolder: '[data-tabs-holder]',
    dataTab: 'data-tab',
    dataTabIndex: 'data-tab-index',
    blockId: 'data-block-id',
    tabsLi: '.tabs > button',
    tabLink: '.tab-link',
    tabLinkRecent: '.tab-link__recent',
    tabContent: '.tab-content',
    scrollbarHolder: '[data-scrollbar]',
    scrollbarArrowPrev: '[data-scrollbar-arrow-prev]',
    scrollbarArrowNext: '[data-scrollbar-arrow-next]',
    firstElement: 'a:first-child, input:first-child',
  };

  const classes$8 = {
    classCurrent: 'current',
    classHide: 'hide',
    classAlt: 'alt',
    isFocused: 'is-focused',
  };

  const sections$4 = {};

  class GlobalTabs {
    constructor(holder) {
      this.container = holder;
      this.body = document.querySelector(selectors$b.body);
      this.accessibility = window.accessibility;

      if (this.container) {
        this.scrollbarHolder = this.container.querySelectorAll(selectors$b.scrollbarHolder);

        this.init();

        // Init native scrollbar
        this.initNativeScrollbar();
      }
    }

    init() {
      const ctx = this.container;
      const tabsNavList = ctx.querySelectorAll(selectors$b.tabsLi);
      const firstTabLink = ctx.querySelector(`${selectors$b.tabLink}-0`);
      const firstTabContent = ctx.querySelector(`${selectors$b.tabContent}-0`);

      if (firstTabContent) {
        firstTabContent.classList.add(classes$8.classCurrent);
      }

      if (firstTabLink) {
        firstTabLink.classList.add(classes$8.classCurrent);
      }

      this.checkVisibleTabLinks();
      this.container.addEventListener('theme:tabs:check', () => this.checkRecentTab());
      this.container.addEventListener('theme:tabs:hide', () => this.hideRelatedTab());

      if (tabsNavList.length) {
        tabsNavList.forEach((element) => {
          const tabId = parseInt(element.getAttribute(selectors$b.dataTab));
          const tab = ctx.querySelector(`${selectors$b.tabContent}-${tabId}`);

          element.addEventListener('click', () => {
            this.tabChange(element, tab);
          });

          element.addEventListener('keyup', (event) => {
            if ((event.which === window.theme.keyboardKeys.SPACE || event.which === window.theme.keyboardKeys.ENTER) && this.body.classList.contains(classes$8.isFocused)) {
              this.tabChange(element, tab);

              if (tab.querySelector('a, input')) {
                this.accessibility.lastFocused = element;

                this.accessibility.a11y.trapFocus(tab, {
                  elementToFocus: tab.querySelector(selectors$b.firstElement),
                });
              }
            }
          });
        });
      }
    }

    tabChange(element, tab) {
      this.container.querySelector(`${selectors$b.tabsLi}.${classes$8.classCurrent}`).classList.remove(classes$8.classCurrent);
      this.container.querySelector(`${selectors$b.tabContent}.${classes$8.classCurrent}`).classList.remove(classes$8.classCurrent);

      element.classList.add(classes$8.classCurrent);
      tab.classList.add(classes$8.classCurrent);

      if (element.classList.contains(classes$8.classHide)) {
        tab.classList.add(classes$8.classHide);
      }

      this.checkVisibleTabLinks();

      this.container.dispatchEvent(new CustomEvent('theme:tab:change'));
    }

    initNativeScrollbar() {
      if (this.scrollbarHolder.length) {
        this.scrollbarHolder.forEach((scrollbar) => {
          new NativeScrollbar(scrollbar);
        });
      }
    }

    checkVisibleTabLinks() {
      const tabsNavList = this.container.querySelectorAll(selectors$b.tabsLi);
      const tabsNavListHided = this.container.querySelectorAll(`${selectors$b.tabLink}.${classes$8.classHide}`);
      const difference = tabsNavList.length - tabsNavListHided.length;

      if (difference < 2) {
        this.container.classList.add(classes$8.classAlt);
      } else {
        this.container.classList.remove(classes$8.classAlt);
      }
    }

    checkRecentTab() {
      const tabLink = this.container.querySelector(selectors$b.tabLinkRecent);

      if (tabLink) {
        tabLink.classList.remove(classes$8.classHide);
        const tabLinkIdx = parseInt(tabLink.getAttribute(selectors$b.dataTab));
        const tabContent = this.container.querySelector(`${selectors$b.tabContent}[${selectors$b.dataTabIndex}="${tabLinkIdx}"]`);

        if (tabContent) {
          tabContent.classList.remove(classes$8.classHide);
        }

        this.checkVisibleTabLinks();

        this.initNativeScrollbar();
      }
    }

    hideRelatedTab() {
      const relatedSection = this.container.querySelector(selectors$b.dataRelatedSectionElem);
      if (!relatedSection) {
        return;
      }

      const parentTabContent = relatedSection.closest(`${selectors$b.tabContent}.${classes$8.classCurrent}`);
      if (!parentTabContent) {
        return;
      }
      const parentTabContentIdx = parseInt(parentTabContent.getAttribute(selectors$b.dataTabIndex));
      const tabsNavList = this.container.querySelectorAll(selectors$b.tabsLi);

      if (tabsNavList.length > parentTabContentIdx) {
        const nextTabsNavLink = tabsNavList[parentTabContentIdx].nextSibling;

        if (nextTabsNavLink) {
          tabsNavList[parentTabContentIdx].classList.add(classes$8.classHide);
          nextTabsNavLink.dispatchEvent(new Event('click'));
          this.initNativeScrollbar();
        }
      }
    }

    onBlockSelect(evt) {
      const element = this.container.querySelector(`${selectors$b.tabLink}[${selectors$b.blockId}="${evt.detail.blockId}"]`);
      if (element) {
        element.dispatchEvent(new Event('click'));

        element.parentNode.scrollTo({
          top: 0,
          left: element.offsetLeft - element.clientWidth,
          behavior: 'smooth',
        });
      }
    }
  }

  const tabs = {
    onLoad() {
      sections$4[this.id] = [];
      const tabHolders = this.container.querySelectorAll(selectors$b.dataTabsHolder);

      tabHolders.forEach((holder) => {
        sections$4[this.id].push(new GlobalTabs(holder));
      });
    },
    onBlockSelect(e) {
      sections$4[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(e);
        }
      });
    },
  };

  const selectors$a = {
    urlInput: '[data-share-url]',
    section: 'data-section-type',
    shareDetails: '[data-share-details]',
    shareSummary: '[data-share-summary]',
    shareCopy: '[data-share-copy]',
    shareButton: '[data-share-button]',
    closeButton: '[data-close-button]',
    successMessage: '[data-success-message]',
    shareHolder: '[data-share-holder]',
  };

  const classes$7 = {
    hidden: 'is-hidden',
  };

  class ShareButton extends HTMLElement {
    constructor() {
      super();

      this.container = this.closest(`[${selectors$a.section}]`);
      this.mainDetailsToggle = this.querySelector(selectors$a.shareDetails);
      this.shareButton = this.querySelector(selectors$a.shareButton);
      this.shareCopy = this.querySelector(selectors$a.shareCopy);
      this.shareSummary = this.querySelector(selectors$a.shareSummary);
      this.closeButton = this.querySelector(selectors$a.closeButton);
      this.successMessage = this.querySelector(selectors$a.successMessage);
      this.shareHolder = this.querySelector(selectors$a.shareHolder);
      this.urlInput = this.querySelector(selectors$a.urlInput);

      this.urlToShare = this.urlInput ? this.urlInput.value : document.location.href;

      this.init();
      this.updateShareLink();
    }

    init() {
      if (navigator.share) {
        this.mainDetailsToggle.classList.add(classes$7.hidden);
        this.shareButton.classList.remove(classes$7.hidden);
        this.shareButton.addEventListener('click', () => {
          navigator.share({url: this.urlToShare, title: document.title});
        });
      } else {
        this.mainDetailsToggle.addEventListener('toggle', this.toggleDetails.bind(this));
        this.mainDetailsToggle.addEventListener('focusout', () => {
          setTimeout(() => {
            if (!this.contains(document.activeElement)) {
              this.close();
            }
          });
        });
        this.shareCopy.addEventListener('click', this.copyToClipboard.bind(this));
        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('keyup', this.keyboardEvents.bind(this));
      }
    }

    updateShareLink() {
      if (this.container.getAttribute(selectors$a.section) == 'product') {
        this.container.addEventListener('theme:variant:change', (event) => {
          if (event.detail.variant) {
            this.urlToShare = `${this.urlToShare.split('?')[0]}?variant=${event.detail.variant.id}`;
            if (this.urlInput) {
              this.urlInput.value = `${this.urlToShare.split('?')[0]}?variant=${event.detail.variant.id}`;
            }
          }
        });
      }
    }

    toggleDetails() {
      if (!this.mainDetailsToggle.open) {
        this.successMessage.classList.add(classes$7.hidden);
        this.successMessage.textContent = '';
        this.closeButton.classList.add(classes$7.hidden);
        this.shareCopy.focus();
      }
    }

    copyToClipboard() {
      navigator.clipboard.writeText(this.urlInput.value).then(() => {
        this.successMessage.classList.remove(classes$7.hidden);
        this.successMessage.textContent = theme.strings.successMessage;
        this.closeButton.classList.remove(classes$7.hidden);
        this.closeButton.focus();
      });
    }

    close() {
      this.mainDetailsToggle.removeAttribute('open');
      this.shareSummary.setAttribute('aria-expanded', false);
    }

    keyboardEvents(e) {
      if (e.which !== window.theme.keyboardKeys.ESCAPE) {
        return;
      }
      this.mainDetailsToggle.focus();
      this.close();
    }
  }

  const selectors$9 = {
    groupImage: 'data-image-filter',
    slider: '[data-product-slideshow]',
    thumbSlider: '[data-product-thumbs]',
    thumbs: '[data-slideshow-thumbnail]',
    slides: '[data-media-slide]',
  };

  const classes$6 = {
    hide: 'hide',
    flickityEnable: 'flickity-enabled',
  };

  class GroupVariantImages {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.slider = this.container.querySelector(selectors$9.slider);
      this.thumbSlider = this.container.querySelector(selectors$9.thumbSlider);
      this.thumbs = this.container.querySelectorAll(selectors$9.thumbs);
      this.slides = this.container.querySelectorAll(selectors$9.slides);
      this.variantImage = null;

      this.listen();
    }

    listen() {
      this.container.addEventListener('theme:variant:change', (event) => {
        if (event.detail.variant) {
          this.variantImage = event.detail.variant.featured_image;
          this.filterImages();
        }
      });
    }

    filterImages() {
      if (this.variantImage !== null && this.variantImage.alt !== null) {
        this.variantImageAlt = this.variantImage.alt.split('#')[1];
        this.showImages();
      } else {
        this.resetImages();
      }

      this.refreshSliders();
    }

    resetImages() {
      this.thumbs.forEach((thumb) => thumb.classList.remove(classes$6.hide));
      this.slides.forEach((slide) => slide.classList.remove(classes$6.hide));
    }

    showImages() {
      this.thumbs.forEach((thumb) => {
        if (thumb.getAttribute(selectors$9.groupImage) === '' || thumb.getAttribute(selectors$9.groupImage) === this.variantImageAlt) {
          thumb.classList.remove(classes$6.hide);
        } else {
          thumb.classList.add(classes$6.hide);
        }
      });

      this.slides.forEach((slide) => {
        if (slide.getAttribute(selectors$9.groupImage) === '' || slide.getAttribute(selectors$9.groupImage) === this.variantImageAlt) {
          slide.classList.remove(classes$6.hide);
        } else {
          slide.classList.add(classes$6.hide);
        }
      });
    }

    refreshSliders() {
      if (this.slider !== null) {
        if (this.slider.classList.contains(classes$6.flickityEnable)) {
          const slider = FlickityFade.data(this.slider);
          if (typeof slider !== 'undefined') {
            slider.reloadCells();
          }
        }
      }

      if (this.thumbSlider !== null) {
        if (this.thumbSlider.classList.contains(classes$6.flickityEnable)) {
          const thumbSlider = FlickitySync.data(this.thumbSlider);
          if (typeof thumbSlider !== 'undefined') {
            thumbSlider.reloadCells();
          }
        }
      }
    }
  }

  const selectors$8 = {
    productJson: '[data-product-json]',
    zoomButton: '[data-zoom-button]',
    toggleTruncateHolder: '[data-truncated-holder]',
    toggleTruncateButton: '[data-truncated-button]',
    toggleTruncateContent: 'data-truncated-content',
  };

  const classes$5 = {
    classExpanded: 'is-expanded',
    classVisible: 'is-visible',
  };

  const sections$3 = [];

  class ProductTemplate {
    constructor(section) {
      this.section = section;
      this.id = section.id;
      this.container = section.container;
      this.settings = section.settings;

      modal(this.id);
      this.media = new Media(section);
      new GroupVariantImages(section);

      const productJSON = this.container.querySelector(selectors$8.productJson);
      if (productJSON && productJSON.innerHTML !== '') {
        this.product = JSON.parse(productJSON.innerHTML);
      } else {
        console.error('Missing product JSON');
        return;
      }

      this.truncateElementHolder = this.container.querySelector(selectors$8.toggleTruncateHolder);
      this.truncateElement = this.container.querySelector(`[${selectors$8.toggleTruncateContent}]`);
      this.resizeEventTruncate = () => this.truncateText();

      this.init();
    }

    init() {
      this.zoomEnabled = this.container.querySelector(selectors$8.zoomButton) !== null;
      if (this.zoomEnabled) {
        productPhotoswipeZoom(this.container, this.product);
      }

      if (this.truncateElementHolder && this.truncateElement) {
        setTimeout(this.resizeEventTruncate, 50);
        document.addEventListener('theme:resize', this.resizeEventTruncate);
      }

      new ImageCaption(this.container);
    }

    truncateText() {
      if (this.truncateElementHolder.classList.contains(classes$5.classVisible)) return;
      const styles = this.truncateElement.querySelectorAll('style');
      if (styles.length) {
        styles.forEach((style) => {
          this.truncateElementHolder.prepend(style);
        });
      }

      const truncateElementCloned = this.truncateElement.cloneNode(true);
      const truncateElementClass = this.truncateElement.getAttribute(selectors$8.toggleTruncateContent);
      const truncateNextElement = this.truncateElement.nextElementSibling;
      if (truncateNextElement) {
        truncateNextElement.remove();
      }

      this.truncateElement.parentElement.append(truncateElementCloned);

      const truncateAppendedElement = this.truncateElement.nextElementSibling;
      truncateAppendedElement.classList.add(truncateElementClass);
      truncateAppendedElement.removeAttribute(selectors$8.toggleTruncateContent);

      showElement(truncateAppendedElement);

      ellipsis(truncateAppendedElement, 5, {
        replaceStr: '',
        delimiter: ' ',
      });

      hideElement(truncateAppendedElement);

      if (this.truncateElement.innerHTML !== truncateAppendedElement.innerHTML) {
        this.truncateElementHolder.classList.add(classes$5.classExpanded);
      } else {
        truncateAppendedElement.remove();
        this.truncateElementHolder.classList.remove(classes$5.classExpanded);
      }

      this.toggleTruncatedContent(this.truncateElementHolder);
    }

    toggleTruncatedContent(holder) {
      const toggleButton = holder.querySelector(selectors$8.toggleTruncateButton);
      if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
          e.preventDefault();
          holder.classList.remove(classes$5.classExpanded);
          holder.classList.add(classes$5.classVisible);
        });
      }
    }

    onBlockSelect(event) {
      const block = this.container.querySelector(`[data-block-id="${event.detail.blockId}"]`);
      if (block) {
        block.dispatchEvent(new Event('click'));
      }
    }

    onBlockDeselect(event) {
      const block = this.container.querySelector(`[data-block-id="${event.detail.blockId}"]`);
      if (block) {
        block.dispatchEvent(new Event('click'));
      }
    }

    onUnload() {
      this.media.destroy();
      if (this.truncateElementHolder && this.truncateElement) {
        document.removeEventListener('theme:resize', this.resizeEventTruncate);
      }
    }
  }

  const productSection = {
    onLoad() {
      sections$3[this.id] = new ProductTemplate(this);
    },
    onUnload() {
      if (typeof sections$3[this.id].unload === 'function') {
        sections$3[this.id].unload();
      }
    },
    onBlockSelect(evt) {
      if (typeof sections$3[this.id].onBlockSelect === 'function') {
        sections$3[this.id].onBlockSelect(evt);
      }
    },
    onBlockDeselect(evt) {
      if (typeof sections$3[this.id].onBlockDeselect === 'function') {
        sections$3[this.id].onBlockDeselect(evt);
      }
    },
  };

  register('product', [productSection, pickupAvailability, productAddSection, accordion, tabs, swapperSection]);

  if (!customElements.get('product-form')) {
    customElements.define('product-form', ProductForm);
  }

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  if (!customElements.get('popout-select')) {
    customElements.define('popout-select', PopoutSelect);
  }

  if (!customElements.get('upsell-product')) {
    customElements.define('upsell-product', UpsellProduct);
  }

  if (!customElements.get('share-button')) {
    customElements.define('share-button', ShareButton);
  }

  const selectors$7 = {
    toggle: 'data-toggle-grid',
    large: 'data-grid-large',
    small: 'data-grid-small',
  };

  const classes$4 = {
    active: 'is-active',
  };

  const options = {
    breakpoint: window.theme.sizes.small,
  };

  var sections$2 = {};

  class Toggle {
    constructor(toggle, container) {
      this.container = container || document;
      this.toggle = toggle;
      this.value = this.toggle.getAttribute(selectors$7.toggle);
      this.toggleFunction = (evt) => this.toggleEvent(evt);

      this.init();
    }

    init() {
      this.toggle.addEventListener('click', this.toggleFunction);
      document.addEventListener('theme:resize:width', this.toggleFunction);
      this.toggleEvent(false);
    }

    unload() {
      this.toggle.removeEventListener('click', this.toggleFunction);
      document.removeEventListener('theme:resize:width', this.toggleFunction);
    }

    toggleEvent(evt = true) {
      const clickEvent = evt && evt.type === 'click';
      const isLarge = window.innerWidth >= options.breakpoint;
      const selector = isLarge ? selectors$7.large : selectors$7.small;
      const grid = this.container.querySelector(`[${selector}]`);
      const gridNumber = grid.getAttribute(selector);
      const activeToggle = this.toggle.parentElement.querySelector(`[${selectors$7.toggle}].${classes$4.active}`);
      let currentToggle = this.toggle.parentElement.querySelector(`[${selectors$7.toggle}="${gridNumber}"]`);

      if (clickEvent) {
        currentToggle = this.toggle;

        grid.setAttribute(selector, this.value);

        if (window.lazySizes) {
          window.lazySizes.autoSizer.checkElems();
        }
      }

      if (activeToggle) {
        activeToggle.classList.remove(classes$4.active);
      }

      if (currentToggle) {
        currentToggle.classList.add(classes$4.active);
      }
    }
  }

  const toggleSection = {
    onLoad() {
      sections$2[this.id] = [];
      const buttons = this.container.querySelectorAll(`[${selectors$7.toggle}]`);
      buttons.forEach((button) => {
        sections$2[this.id].push(new Toggle(button, this.container));
      });
    },
    onUnload: function () {
      sections$2[this.id].forEach((toggle) => {
        if (typeof toggle.unload === 'function') {
          toggle.unload();
        }
      });
    },
  };

  const selectors$6 = {
    sort: 'data-sort-enabled',
    sortLinks: '[data-sort-link]',
    sortButtonText: '[data-sort-button-text]',
    sortValue: 'data-value',
  };

  const classes$3 = {
    active: 'popout-list__item--current',
  };

  class Sort {
    constructor(section) {
      this.container = section.container;
      this.sort = this.container.querySelector(`[${selectors$6.sort}]`);
      this.sortLinks = this.container.querySelectorAll(selectors$6.sortLinks);
      this.sortButtonText = this.container.querySelector(selectors$6.sortButtonText);

      if (this.sort) {
        this.init();
      }
    }

    init() {
      this.sortLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.sortingResults(e);
        });
      });
    }

    sortingResults(e) {
      const link = e.currentTarget;
      const sort = link.getAttribute(selectors$6.sortValue);
      const text = link.innerText;

      this.sortButtonText.innerText = text;
      this.sortButtonText.parentNode.dispatchEvent(new Event('click'));

      this.sort.querySelector(`.${classes$3.active}`).classList.remove(classes$3.active);
      link.parentNode.classList.add(classes$3.active);

      this.sort.setAttribute(selectors$6.sort, sort);

      this.container.dispatchEvent(
        new CustomEvent('theme:form:filter', {
          bubbles: true,
          detail: {
            params: sort,
          },
        })
      );
    }
  }

  var selectors$5 = {
    collectionNavGrouped: '[data-tag-group]',
    linkAdd: '.link--add',
    linkRemove: '.link--remove',
    swatch: 'data-swatch',
  };

  class Collection {
    constructor(section) {
      this.section = section;
      this.container = this.section.container;
      this.swatches = this.container.querySelectorAll(`[${selectors$5.swatch}]`);
      this.init();
    }

    init() {
      new Sort(this.section);
      this.removeUnusableFilters();
    }

    removeUnusableFilters() {
      // temp tag filters
      const collectionNavGrouped = this.container.querySelectorAll(selectors$5.collectionNavGrouped);
      if (collectionNavGrouped.length > 0) {
        collectionNavGrouped.forEach((element) => {
          const linkAdd = element.querySelector(selectors$5.linkAdd);
          const linkRemove = element.querySelector(selectors$5.linkRemove);

          if (!linkAdd && !linkRemove) {
            hideElement(element);
          }
        });
      }
    }
  }

  const collectionSection = {
    onLoad() {
      this.collection = new Collection(this);
    },
  };

  register('collection', [collectionSection, collectionFiltersSidebar, collectionFiltersForm, toggleSection, swatchGridSection, accordion, siblings]);

  if (!customElements.get('popout-select')) {
    customElements.define('popout-select', PopoutSelect);
  }

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  if (!customElements.get('product-grid-item')) {
    customElements.define('product-grid-item', ProductGridItem);
  }

  if (!customElements.get('upsell-product')) {
    customElements.define('upsell-product', UpsellProduct);
  }

  register('collection-row', [swatchGridSection, siblings, customScrollbar]);

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  if (!customElements.get('product-grid-item')) {
    customElements.define('product-grid-item', ProductGridItem);
  }

  if (!customElements.get('upsell-product')) {
    customElements.define('upsell-product', UpsellProduct);
  }

  register('collection-tabs', [tabs, productSliderSection, swatchGridSection]);

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  if (!customElements.get('product-grid-item')) {
    customElements.define('product-grid-item', ProductGridItem);
  }

  if (!customElements.get('upsell-product')) {
    customElements.define('upsell-product', UpsellProduct);
  }

  var styles = {};
  styles.basic = [];
  /* eslint-disable */
  styles.light = [
    {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'on'}, {lightness: '64'}, {hue: '#ff0000'}]},
    {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#bdbdbd'}]},
    {featureType: 'administrative', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f0f0f0'}, {visibility: 'simplified'}]},
    {featureType: 'landscape.natural.landcover', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape.natural.terrain', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'geometry.fill', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'labels', stylers: [{lightness: '100'}]},
    {featureType: 'poi.park', elementType: 'all', stylers: [{visibility: 'on'}]},
    {featureType: 'poi.park', elementType: 'geometry', stylers: [{saturation: '-41'}, {color: '#e8ede7'}]},
    {featureType: 'poi.park', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road', elementType: 'all', stylers: [{saturation: '-100'}]},
    {featureType: 'road', elementType: 'labels', stylers: [{lightness: '25'}, {gamma: '1.06'}, {saturation: '-100'}]},
    {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{gamma: '10.00'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}, {visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.01'}]},
    {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'road.local', elementType: 'geometry.fill', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{gamma: '10.00'}, {lightness: '100'}, {weight: '0.4'}]},
    {featureType: 'road.local', elementType: 'labels', stylers: [{visibility: 'simplified'}, {weight: '0.01'}, {lightness: '39'}]},
    {featureType: 'road.local', elementType: 'labels.text.stroke', stylers: [{weight: '0.50'}, {gamma: '10.00'}, {lightness: '100'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'all', stylers: [{color: '#cfe5ee'}, {visibility: 'on'}]},
  ];

  styles.light_blank = [
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'off'}, {lightness: '64'}, {hue: '#ff0000'}]},
    {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#bdbdbd'}]},
    {featureType: 'administrative', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f0f0f0'}, {visibility: 'simplified'}]},
    {featureType: 'landscape.natural.landcover', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape.natural.terrain', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'geometry.fill', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'labels', stylers: [{lightness: '100'}]},
    {featureType: 'poi.park', elementType: 'all', stylers: [{visibility: 'on'}]},
    {featureType: 'poi.park', elementType: 'geometry', stylers: [{saturation: '-41'}, {color: '#e8ede7'}]},
    {featureType: 'poi.park', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road', elementType: 'all', stylers: [{saturation: '-100'}]},
    {featureType: 'road', elementType: 'labels', stylers: [{lightness: '25'}, {gamma: '1.06'}, {saturation: '-100'}, {visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{gamma: '10.00'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}, {visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.01'}]},
    {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'road.local', elementType: 'geometry.fill', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{gamma: '10.00'}, {lightness: '100'}, {weight: '0.4'}]},
    {featureType: 'road.local', elementType: 'labels', stylers: [{visibility: 'off'}, {weight: '0.01'}, {lightness: '39'}]},
    {featureType: 'road.local', elementType: 'labels.text.stroke', stylers: [{weight: '0.50'}, {gamma: '10.00'}, {lightness: '100'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'all', stylers: [{color: '#cfe5ee'}, {visibility: 'on'}]},
  ];

  styles.white_blank = [
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#444444'}]},
    {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f2f2f2'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'road', elementType: 'all', stylers: [{saturation: -100}, {lightness: 45}]},
    {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0'}]},
    {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'all', stylers: [{color: '#e4e4e4'}, {visibility: 'on'}]},
  ];

  styles.white_label = [
    {featureType: 'all', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'simplified'}]},
    {featureType: 'administrative', elementType: 'labels', stylers: [{gamma: '3.86'}, {lightness: '100'}]},
    {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#cccccc'}]},
    {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f2f2f2'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'road', elementType: 'all', stylers: [{saturation: -100}, {lightness: 45}]},
    {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0'}]},
    {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'labels.text', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'all', stylers: [{color: '#e4e4e4'}, {visibility: 'on'}]},
  ];

  styles.dark_blank = [
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'all', elementType: 'labels.text.fill', stylers: [{saturation: 36}, {color: '#000000'}, {lightness: 40}]},
    {featureType: 'all', elementType: 'labels.text.stroke', stylers: [{visibility: 'on'}, {color: '#000000'}, {lightness: 16}]},
    {featureType: 'all', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 20}]},
    {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 17}, {weight: 1.2}]},
    {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 20}]},
    {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 21}]},
    {featureType: 'road', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 17}, {weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 29}, {weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 18}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 16}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 19}]},
    {featureType: 'water', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 17}]},
  ];

  styles.dark_label = [
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'all', elementType: 'labels.text.fill', stylers: [{saturation: 36}, {color: '#000000'}, {lightness: 40}]},
    {featureType: 'all', elementType: 'labels.text.stroke', stylers: [{visibility: 'on'}, {color: '#000000'}, {lightness: 16}]},
    {featureType: 'all', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 20}]},
    {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 17}, {weight: 1.2}]},
    {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'simplified'}, {lightness: '-82'}]},
    {featureType: 'administrative', elementType: 'labels.text.stroke', stylers: [{invert_lightness: true}, {weight: '7.15'}]},
    {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 20}]},
    {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 21}]},
    {featureType: 'road', elementType: 'labels', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 17}, {weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 29}, {weight: '0.01'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.arterial', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 18}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 16}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 19}]},
    {featureType: 'water', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 17}]},
  ];
  /* eslint-enable */

  function mapStyle(key) {
    return styles[key];
  }

  window.theme.allMaps = window.theme.allMaps || {};
  let allMaps = window.theme.allMaps;

  const selectors$4 = {
    mapContainer: '[data-map-container]',
    style: 'data-style',
    apiKey: 'data-api-key',
    zoom: 'data-zoom',
    address: 'data-address',
    latLongCorrection: 'data-latlong-correction',
    lat: 'data-lat',
    long: 'data-long',
  };

  class Map {
    constructor(section) {
      this.container = section.container;
      this.mapWrap = this.container.querySelector(selectors$4.mapContainer);
      this.styleString = this.container.getAttribute(selectors$4.style) || '';
      this.key = this.container.getAttribute(selectors$4.apiKey);
      this.zoomString = this.container.getAttribute(selectors$4.zoom) || 14;
      this.address = this.container.getAttribute(selectors$4.address);
      this.enableCorrection = this.container.getAttribute(selectors$4.latLongCorrection);
      this.lat = this.container.getAttribute(selectors$4.lat);
      this.long = this.container.getAttribute(selectors$4.long);
      if (this.key) {
        this.initMaps();
      }
    }

    initMaps() {
      const urlKey = `https://maps.googleapis.com/maps/api/js?key=${this.key}`;
      loadScript({url: urlKey})
        .then(() => {
          return this.enableCorrection === 'true' && this.lat !== '' && this.long !== '' ? new window.google.maps.LatLng(this.lat, this.long) : geocodeAddressPromise(this.address);
        })
        .then((center) => {
          var zoom = parseInt(this.zoomString, 10);
          const styles = mapStyle(this.styleString);
          var mapOptions = {
            zoom,
            styles,
            center,
            draggable: true,
            clickableIcons: false,
            scrollwheel: false,
            zoomControl: false,
            disableDefaultUI: true,
          };
          const map = createMap(this.mapWrap, mapOptions);
          return map;
        })
        .then((map) => {
          this.map = map;
          allMaps[this.id] = map;
        })
        .catch((e) => {
          console.log('Failed to load Google Map');
          console.log(e);
        });
    }

    onUnload() {
      if (typeof window.google !== 'undefined') {
        window.google.maps.event.clearListeners(this.map, 'resize');
      }
    }
  }

  function createMap(container, options) {
    var map = new window.google.maps.Map(container, options);
    var center = map.getCenter();

    new window.google.maps.Marker({
      map: map,
      position: center,
    });

    window.google.maps.event.addDomListener(window, 'resize', function () {
      window.google.maps.event.trigger(map, 'resize');
      map.setCenter(center);
    });
    return map;
  }

  function geocodeAddressPromise(address) {
    return new Promise((resolve, reject) => {
      var geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({address: address}, function (results, status) {
        if (status == 'OK') {
          var latLong = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          resolve(latLong);
        } else {
          reject(status);
        }
      });
    });
  }

  const mapSection = {
    onLoad() {
      allMaps[this.id] = new Map(this);
    },
    onUnload() {
      if (typeof allMaps[this.id].unload === 'function') {
        allMaps[this.id].unload();
      }
    },
  };

  register('section-map', mapSection);

  register('section-columns', [popupVideoSection, customScrollbar]);

  const selectors$3 = {
    dataRelatedSectionElem: '[data-related-section]',
    dataRelatedProduct: '[data-grid-item]',
    carousel: '[data-carousel]',
    dataLimit: 'data-limit',
    dataMinimum: 'data-minimum',
    dataLargeLayout: 'data-layout-desktop',
    dataMediumLayout: 'data-layout-tablet',
    dataSmallLayout: 'data-layout-mobile',
    recentlyViewed: '[data-recent-wrapper]',
    recentlyViewedWrapper: '[data-recently-viewed-wrapper]',
    productId: 'data-product-id',
  };

  class Related {
    constructor(section) {
      this.section = section;
      this.container = section.container;

      this.init();

      this.container.addEventListener('theme:recent-products:added', () => {
        this.recent();
      });
    }

    init() {
      const relatedSection = this.container.querySelector(selectors$3.dataRelatedSectionElem);

      if (!relatedSection) {
        return;
      }

      const productId = relatedSection.getAttribute(selectors$3.productId);
      const limit = relatedSection.getAttribute(selectors$3.dataLimit);
      const layoutLarge = relatedSection.getAttribute(selectors$3.dataLargeLayout);
      const layoutMedium = relatedSection.getAttribute(selectors$3.dataMediumLayout);
      const layoutSmall = relatedSection.getAttribute(selectors$3.dataSmallLayout);
      const route = window.theme.routes.product_recommendations_url || '/recommendations/products/';
      const requestUrl = `${route}?section_id=related&limit=${limit}&product_id=${productId}`;

      axios
        .get(requestUrl)
        .then((response) => {
          const fresh = document.createElement('div');
          fresh.innerHTML = response.data;

          const inner = fresh.querySelector(selectors$3.dataRelatedSectionElem);

          if (inner.querySelector(selectors$3.dataRelatedProduct)) {
            const innerHtml = inner.innerHTML;
            relatedSection.innerHTML = innerHtml;
            relatedSection.querySelector(selectors$3.carousel).style.setProperty('--grid-large-items', layoutLarge);
            relatedSection.querySelector(selectors$3.carousel).style.setProperty('--grid-medium-items', layoutMedium);
            relatedSection.querySelector(selectors$3.carousel).style.setProperty('--grid-small-items', layoutSmall);
            relatedSection.dispatchEvent(new CustomEvent('theme:related-products:added', {bubbles: true}));
          } else {
            relatedSection.dispatchEvent(
              new CustomEvent('theme:tabs:hide', {
                bubbles: true,
              })
            );
          }
        })
        .catch(function (error) {
          console.warn(error);
        });
    }

    recent() {
      const recentlyViewedHolder = this.container.querySelector(selectors$3.recentlyViewed);
      const recentlyViewedWrapper = this.container.querySelector(selectors$3.recentlyViewedWrapper);
      const recentProducts = this.container.querySelectorAll(selectors$3.dataRelatedProduct);

      const minimumNumberProducts = recentlyViewedHolder.hasAttribute(selectors$3.dataMinimum) ? parseInt(recentlyViewedHolder.getAttribute(selectors$3.dataMinimum)) : 4;
      const checkRecentInRelated = !recentlyViewedWrapper && recentProducts.length > 0;
      const checkRecentOutsideRelated = recentlyViewedWrapper && recentProducts.length >= minimumNumberProducts;

      if (checkRecentInRelated || checkRecentOutsideRelated) {
        recentlyViewedHolder.dispatchEvent(
          new CustomEvent('theme:tabs:check', {
            bubbles: true,
          })
        );
      }
    }
  }

  const relatedSection = {
    onLoad() {
      this.section = new Related(this);
    },
  };

  register('related', [relatedSection, tabs, recentProducts]);

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  if (!customElements.get('product-grid-item')) {
    customElements.define('product-grid-item', ProductGridItem);
  }

  if (!customElements.get('upsell-product')) {
    customElements.define('upsell-product', UpsellProduct);
  }

  const selectors$2 = {
    ajaxDisable: 'data-ajax-disable',
    shipping: '[data-shipping-estimate-form]',
    input: '[data-update-cart]',
    update: '[data-update-button]',
    bottom: '[data-cart-bottom]',
    upsellProduct: '[data-upsell-holder]',
    upsellButton: '[data-add-action-wrapper]',
  };

  const classes$2 = {
    dirty: 'cart--dirty',
    heartBeat: 'heart-beat',
  };

  const cartSection = {
    onLoad() {
      const hasShipping = this.container.querySelector(selectors$2.shipping);
      if (hasShipping) {
        new ShippingCalculator(this);
      }

      this.disabled = this.container.getAttribute(selectors$2.ajaxDisable) == 'true';
      if (this.disabled) {
        this.cart = new DisabledCart(this);
        return;
      }

      this.cart = new CartItems(this);
      const initPromise = this.cart.init();
      initPromise.then(() => {
        this.cart.loadHTML();
      });
    },
  };

  class DisabledCart {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.inputs = this.container.querySelectorAll(selectors$2.input);
      this.quantityWrappers = this.container.querySelectorAll(selectors$2.qty);
      this.updateBtn = this.container.querySelector(selectors$2.update);
      this.upsellProduct = this.container.querySelector(selectors$2.upsellProduct);
      this.initQuantity();
      this.initInputs();
      if (this.upsellProduct) {
        this.moveUpsell();
      }
    }

    initQuantity() {
      initQtySection(this.container);
    }

    moveUpsell() {
      const bottom = this.container.querySelector(selectors$2.bottom);
      bottom.insertBefore(this.upsellProduct, bottom.firstChild);
    }

    initInputs() {
      this.inputs.forEach((input) => {
        input.addEventListener(
          'change',
          function () {
            this.updateBtn.classList.add(classes$2.dirty);
            this.updateBtn.classList.add(classes$2.heartBeat);
            setTimeout(
              function () {
                this.updateBtn.classList.remove(classes$2.heartBeat);
              }.bind(this),
              1300
            );
          }.bind(this)
        );
      });
    }
  }

  register('cart', [cartSection, accordion]);

  if (!customElements.get('upsell-product')) {
    customElements.define('upsell-product', UpsellProduct);
  }

  register('accordion-single', accordion);

  const fadeIn = (el, display, callback = null) => {
    el.style.opacity = 0;
    el.style.display = display || 'block';

    (function fade() {
      let val = parseFloat(el.style.opacity);
      if (!((val += 0.1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }

      if (val === 1 && typeof callback === 'function') {
        callback();
      }
    })();
  };

  const fadeOut = (el, callback = null) => {
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }

      if (parseFloat(el.style.opacity) === 0 && typeof callback === 'function') {
        callback();
      }
    })();
  };

  const selectors$1 = {
    tracking: '[data-tracking-consent]',
    trackingAccept: '[data-confirm-cookies]',
    close: '[data-close-modal]',
    popupInner: '[data-popup-inner]',
    newsletterPopup: '[data-newsletter]',
    newsletterPopupHolder: '[data-newsletter-holder]',
    newsletterField: '[data-newsletter-field]',
    newsletterForm: '[data-newsletter-form]',
    promoPopup: '[data-promo-text]',
    delayAttribite: 'data-popup-delay',
    cookieNameAttribute: 'data-cookie-name',
    dataTargetReferrer: 'data-target-referrer',
  };

  const classes$1 = {
    hide: 'hide',
    hasValue: 'has-value',
    success: 'has-success',
    desktop: 'desktop',
    mobile: 'mobile',
  };

  let sections$1 = {};

  class PopupCookie {
    constructor(name, value) {
      this.configuration = {
        expires: null, // session cookie
        path: '/',
        domain: window.location.hostname,
      };
      this.name = name;
      this.value = value;
    }

    write() {
      const hasCookie = document.cookie.indexOf('; ') !== -1 && !document.cookie.split('; ').find((row) => row.startsWith(this.name));
      if (hasCookie || document.cookie.indexOf('; ') === -1) {
        document.cookie = `${this.name}=${this.value}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
      }
    }

    read() {
      if (document.cookie.indexOf('; ') !== -1 && document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
        const returnCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith(this.name))
          .split('=')[1];

        return returnCookie;
      } else return false;
    }

    destroy() {
      if (document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
        document.cookie = `${this.name}=null; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
      }
    }
  }

  class DelayShow {
    constructor(holder, element) {
      this.element = element;
      this.delay = holder.getAttribute(selectors$1.delayAttribite);

      if (this.delay === 'always') {
        this.always();
      }

      if (this.delay === 'delayed') {
        this.delayed();
      }

      if (this.delay === 'bottom') {
        this.bottom();
      }

      if (this.delay === 'idle') {
        this.idle();
      }
    }

    always() {
      fadeIn(this.element);
    }

    delayed() {
      // Show popup after 10s
      setTimeout(() => {
        fadeIn(this.element);
      }, 10000);
    }

    // Scroll to the bottom of the page
    bottom() {
      window.addEventListener('scroll', () => {
        if (window.scrollY + window.innerHeight >= document.body.clientHeight) {
          fadeIn(this.element);
        }
      });
    }

    // Idle for 1 min
    idle() {
      let timer = 0;
      let idleTime = 60000;
      const documentEvents = ['mousemove', 'mousedown', 'click', 'touchmove', 'touchstart', 'touchend', 'keydown', 'keypress'];
      const windowEvents = ['load', 'resize', 'scroll'];

      const startTimer = () => {
        timer = setTimeout(() => {
          timer = 0;
          fadeIn(this.element);
        }, idleTime);

        documentEvents.forEach((eventType) => {
          document.addEventListener(eventType, resetTimer);
        });

        windowEvents.forEach((eventType) => {
          window.addEventListener(eventType, resetTimer);
        });
      };

      const resetTimer = () => {
        if (timer) {
          clearTimeout(timer);
        }

        documentEvents.forEach((eventType) => {
          document.removeEventListener(eventType, resetTimer);
        });

        windowEvents.forEach((eventType) => {
          window.removeEventListener(eventType, resetTimer);
        });

        startTimer();
      };

      startTimer();
    }
  }

  class TargetReferrer {
    constructor(el) {
      this.el = el;
      this.locationPath = location.href;

      if (!this.el.hasAttribute(selectors$1.dataTargetReferrer)) {
        return;
      }

      this.init();
    }

    init() {
      if (this.locationPath.indexOf(this.el.getAttribute(selectors$1.dataTargetReferrer)) === -1 && !window.Shopify.designMode) {
        this.el.parentNode.removeChild(this.el);
      }
    }
  }

  class Tracking {
    constructor(el) {
      this.popup = el;
      this.modal = document.querySelector(selectors$1.tracking);
      this.modalInner = this.popup.querySelector(selectors$1.popupInner);
      this.close = this.modal.querySelector(selectors$1.close);
      this.acceptButton = this.modal.querySelector(selectors$1.trackingAccept);
      this.enable = this.modal.getAttribute('data-enable') === 'true';
      this.showPopup = false;

      window.Shopify.loadFeatures(
        [
          {
            name: 'consent-tracking-api',
            version: '0.1',
          },
        ],
        (error) => {
          if (error) {
            throw error;
          }

          const userCanBeTracked = window.Shopify.customerPrivacy.userCanBeTracked();
          const userTrackingConsent = window.Shopify.customerPrivacy.getTrackingConsent();

          this.showPopup = !userCanBeTracked && userTrackingConsent === 'no_interaction' && this.enable;

          if (window.Shopify.designMode) {
            this.showPopup = true;
          }

          this.init();
        }
      );
    }

    init() {
      if (this.showPopup) {
        fadeIn(this.modalInner);
      }

      this.clickEvents();
    }

    clickEvents() {
      this.close.addEventListener('click', (event) => {
        event.preventDefault();

        window.Shopify.customerPrivacy.setTrackingConsent(false, () => fadeOut(this.modalInner));
      });

      this.acceptButton.addEventListener('click', (event) => {
        event.preventDefault();

        window.Shopify.customerPrivacy.setTrackingConsent(true, () => fadeOut(this.modalInner));
      });

      document.addEventListener('trackingConsentAccepted', function () {
        console.log('trackingConsentAccepted event fired');
      });
    }

    onBlockSelect(evt) {
      if (this.popup.contains(evt.target) && this.showPopup) {
        fadeIn(this.modalInner);
      }
    }

    onBlockDeselect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeOut(this.modalInner);
      }
    }
  }

  class PromoText {
    constructor(el) {
      this.popup = el;
      this.popupInner = this.popup.querySelector(selectors$1.popupInner);
      this.close = this.popup.querySelector(selectors$1.close);
      this.cookie = new PopupCookie(this.popup.getAttribute(selectors$1.cookieNameAttribute), 'user_has_closed');
      this.isTargeted = new TargetReferrer(this.popup);
      this.hasDeviceClass = '';

      this.init();
    }

    init() {
      const cookieExists = this.cookie.read() !== false;

      if (!cookieExists || window.Shopify.designMode) {
        if (!window.Shopify.designMode) {
          new DelayShow(this.popup, this.popupInner);
        } else {
          fadeIn(this.popupInner);
        }

        this.clickEvents();
      }
    }

    clickEvents() {
      this.close.addEventListener('click', (event) => {
        event.preventDefault();

        fadeOut(this.popupInner);
        this.cookie.write();
      });
    }

    onBlockSelect(evt) {
      if (this.popup.classList.contains(classes$1.mobile)) {
        this.hasDeviceClass = classes$1.mobile;
      }

      if (this.popup.classList.contains(classes$1.desktop)) {
        this.hasDeviceClass = classes$1.desktop;
      }

      if (this.hasDeviceClass !== '') {
        this.popup.classList.remove(this.hasDeviceClass);
      }

      if (this.popup.contains(evt.target)) {
        fadeIn(this.popupInner);
      }
    }

    onBlockDeselect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeOut(this.popupInner);
      }

      if (this.hasDeviceClass !== '') {
        this.popup.classList.add(this.hasDeviceClass);
      }
    }
  }

  class NewsletterPopup {
    constructor(el) {
      this.popup = el;
      this.popupInner = this.popup.querySelector(selectors$1.popupInner);
      this.holder = this.popup.querySelector(selectors$1.newsletterPopupHolder);
      this.close = this.popup.querySelector(selectors$1.close);
      this.newsletterField = this.popup.querySelector(selectors$1.newsletterField);
      this.cookie = new PopupCookie(this.popup.getAttribute(selectors$1.cookieNameAttribute), 'newsletter_is_closed');
      this.form = this.popup.querySelector(selectors$1.newsletterForm);
      this.isTargeted = new TargetReferrer(this.popup);

      this.init();
    }

    init() {
      const cookieExists = this.cookie.read() !== false;

      if (!cookieExists || window.Shopify.designMode) {
        this.show();

        if (this.form.classList.contains(classes$1.success)) {
          this.checkForSuccess();
        }
      }
    }

    show() {
      if (!window.Shopify.designMode) {
        new DelayShow(this.popup, this.popupInner);
      } else {
        fadeIn(this.popupInner);
      }

      this.inputField();
      this.closePopup();
    }

    checkForSuccess() {
      fadeIn(this.popupInner);
      this.cookie.write();
    }

    closePopup() {
      this.close.addEventListener('click', (event) => {
        event.preventDefault();

        fadeOut(this.popupInner);
        this.cookie.write();
      });
    }

    inputField() {
      this.newsletterField.addEventListener('input', () => {
        if (this.newsletterField.value !== '') {
          this.holder.classList.add(classes$1.hasValue, this.newsletterField.value !== '');
        }
      });

      this.newsletterField.addEventListener('focus', () => {
        if (this.newsletterField.value !== '') {
          this.holder.classList.add(classes$1.hasValue, this.newsletterField.value !== '');
        }
      });

      this.newsletterField.addEventListener('focusout', () => {
        setTimeout(() => {
          this.holder.classList.remove(classes$1.hasValue);
        }, 2000);
      });
    }

    onBlockSelect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeIn(this.popupInner);
      }
    }

    onBlockDeselect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeOut(this.popupInner);
      }
    }
  }

  const popupSection = {
    onLoad() {
      sections$1[this.id] = [];

      const tracking = this.container.querySelectorAll(selectors$1.tracking);
      tracking.forEach((el) => {
        sections$1[this.id].push(new Tracking(el));
      });

      const newsletterPopup = this.container.querySelectorAll(selectors$1.newsletterPopup);
      newsletterPopup.forEach((el) => {
        sections$1[this.id].push(new NewsletterPopup(el));
      });

      const promoPopup = this.container.querySelectorAll(selectors$1.promoPopup);
      promoPopup.forEach((el) => {
        sections$1[this.id].push(new PromoText(el));
      });
    },
    onBlockSelect(evt) {
      sections$1[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(evt);
        }
      });
    },
    onBlockDeselect(evt) {
      sections$1[this.id].forEach((el) => {
        if (typeof el.onBlockDeselect === 'function') {
          el.onBlockDeselect(evt);
        }
      });
    },
  };

  register('popups', [popupSection, newsletterCheckForResultSection]);

  register('tabs', tabs);

  const selectors = {
    dot: 'data-look-dot',
    productsHolder: 'data-products-holder',
    slider: '[data-carousel]',
    buttonClose: '[data-button-close-holder]',
    slideIndex: 'data-carousel-index',
    blockId: 'data-block-id',
    focusable: 'button',
  };

  const classes = {
    active: 'is-active',
    expand: 'is-expanded',
  };

  const sections = {};

  class Look {
    constructor(section) {
      this.section = section;
      this.container = this.section.container;
      this.dots = this.container.querySelectorAll(`[${selectors.dot}]`);
      this.productsHolder = this.container.querySelector(`[${selectors.productsHolder}]`);
      this.slider = this.container.querySelector(selectors.slider);
      this.buttonClose = this.container.querySelector(selectors.buttonClose);
      this.currentDot = this.container.querySelector(`[${selectors.dot}].${classes.active}`);
      this.hasDefaultOpen = this.currentDot ? true : false;

      this.init();
    }

    init() {
      this.keyEvents = (e) => this.keyboardEventShowProductHolder(e);
      this.keyCloseEvent = (e) => this.hideProductsHolder(e);
      this.clickEventsDot = (e) => this.clickEventShowProductsHolder(e);
      this.clickEventToClose = (e) => this.clickEventCloseProductsHolder(e);
      this.toggleOnResize = (e) => debounce(this.onResize(e), 200);

      this.initSlider();
      this.addEvents();
    }

    /**
     * Init slider and add event for select slide
     */
    initSlider() {
      if (!this.slider) {
        return;
      }

      this.carousel = Flickity.data(this.slider);
      this.carousel.options.wrapAround = true;
      this.carousel.options.freeScroll = false;
      this.carousel.resize();

      this.carousel.on('change', (index) => {
        this.currentDot = this.container.querySelector(`[${selectors.dot}="${index}"]`);

        this.currentDot.classList.add(classes.active);
        this.removeClassOnSiblingDots();
      });
    }

    /**
     * Add events
     */
    addEvents() {
      this.dots.forEach((dot) => {
        dot.addEventListener('click', this.clickEventsDot);
        dot.addEventListener('keyup', this.keyEvents);
      });

      document.addEventListener('keyup', this.keyCloseEvent);
      document.addEventListener('theme:resize', this.toggleOnResize);

      if (this.buttonClose) {
        this.buttonClose.addEventListener('click', this.clickEventToClose);
      }
    }

    /**
     * Show products holder
     */
    showProductsHolder() {
      const selectCellAnimate = this.productsHolder.classList.contains(classes.expand) ? false : true;
      this.currentDot.classList.toggle(classes.active);
      this.productsHolder.classList.toggle(classes.expand, this.currentDot.classList.contains(classes.active));

      if (this.currentDot.classList.contains(classes.active)) {
        this.hasDefaultOpen = true;
        this.carousel.selectCell(Number(this.currentDot.getAttribute(selectors.dot)), true, selectCellAnimate);
      }

      this.removeClassOnSiblingDots();
    }

    /**
     * Hide products holder on keypress button 'escape'
     * @param {Object} e
     * @returns
     */
    hideProductsHolder(e) {
      if (e.which !== window.theme.keyboardKeys.ESCAPE) {
        return;
      }

      this.removeClasses();
      removeTrapFocus();
      this.currentDot.focus();
    }

    /**
     * Remove classes on productsHolder and currentDot
     */
    removeClasses() {
      this.productsHolder.classList.remove(classes.expand);
      this.currentDot.classList.remove(classes.active);
      this.hasDefaultOpen = false;
    }

    /**
     * Click event method for show products holder
     * @param {Object} e
     */
    clickEventShowProductsHolder(e) {
      this.currentDot = e.currentTarget;
      this.showProductsHolder();
    }

    /**
     * Click event method for hide products holder
     */
    clickEventCloseProductsHolder() {
      this.removeClasses();
    }

    /**
     * Keyboard event method for show products holder and active trapfocus
     * @param {Object} e
     * @returns
     */
    keyboardEventShowProductHolder(e) {
      if (e.which !== window.theme.keyboardKeys.ENTER && e.which !== window.theme.keyboardKeys.SPACE) {
        return;
      }

      setTimeout(() => {
        const firstFocus = this.productsHolder.querySelector(selectors.focusable);
        trapFocus(this.productsHolder, {elementToFocus: firstFocus});
      }, 400);
    }

    /**
     * Hide default expanded for mobile devices and show if exists for larger devices
     */
    onResize() {
      if (this.currentDot) {
        if (window.innerWidth < window.theme.sizes.medium) {
          this.currentDot.classList.remove(classes.active);
          this.productsHolder.classList.remove(classes.expand);
        } else if (this.hasDefaultOpen) {
          this.currentDot.classList.add(classes.active);
          this.productsHolder.classList.add(classes.expand);
        }
      }
    }

    /**
     * Remove events
     */
    removeEvents() {
      this.dots.forEach((dot) => {
        dot.removeEventListener('click', this.clickEventsDot);
        dot.removeEventListener('keyup', this.keyEvents);
      });

      document.removeEventListener('keyup', this.keyCloseEvent);
      document.removeEventListener('theme:resize', this.toggleOnResize);

      if (this.buttonClose) {
        this.buttonClose.removeEventListener('click', this.clickEventToClose);
      }
    }

    /**
     * Remove active class on sibling dots
     */
    removeClassOnSiblingDots() {
      for (let sibling of this.currentDot.parentNode.children) {
        if (sibling !== this.currentDot) {
          sibling.classList.remove(classes.active);
        }
      }
    }

    onUnload() {
      if (this.slider && this.carousel) {
        this.carousel.destroy();
      }

      this.removeEvents();
    }

    onBlockSelect(e) {
      if (this.slider && this.carousel) {
        const slide = this.container.querySelector(`[${selectors.blockId}="${e.detail.blockId}"]`);
        this.productsHolder.classList.add(classes.expand);
        this.carousel.selectCell(Number(slide.getAttribute(selectors.slideIndex)), true, true);
      }
    }

    onBlockDeselect() {
      if (window.innerWidth < window.theme.sizes.medium) {
        this.productsHolder.classList.remove(classes.expand);
        this.currentDot.classList.remove(classes.active);
      }
    }
  }

  const lookSection = {
    onLoad() {
      sections[this.id] = [];
      sections[this.id].push(new Look(this));
    },
    onUnload() {
      sections[this.id].forEach((el) => {
        if (typeof el.onUnload === 'function') {
          el.onUnload();
        }
      });
    },
    onBlockSelect(e) {
      sections[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(e);
        }
      });
    },
    onBlockDeselect(e) {
      sections[this.id].forEach((el) => {
        if (typeof el.onBlockDeselect === 'function') {
          el.onBlockDeselect(e);
        }
      });
    },
  };

  register('look', [lookSection]);

  const wrap = (toWrap, wrapperClass = '', wrapper) => {
    wrapper = wrapper || document.createElement('div');
    wrapper.classList.add(wrapperClass);
    toWrap.parentNode.insertBefore(wrapper, toWrap);
    return wrapper.appendChild(toWrap);
  };

  // Animate on scroll
  if (window.theme.settings.animate_scroll) {
    AOS.init({once: true});
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Detect menu height early to prevent CLS
    const menuEl = document.querySelector('[data-header-height]');
    if (menuEl) {
      const menuHeight = menuEl.clientHeight || 0;
      document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`);
    }

    // Load all registered sections on the page.
    load('*');

    // Animate on hover
    if (window.theme.settings.animate_hover) {
      document.body.classList.add('theme-animate-hover');
    }

    // When images load, clear the background color
    document.addEventListener('lazyloaded', function (event) {
      const lazyImage = event.target.parentNode;
      if (lazyImage.classList.contains('lazy-image')) {
        lazyImage.style.backgroundImage = 'none';
      }
    });

    // Target tables to make them scrollable
    const tableSelectors = '.rte table';
    const tables = document.querySelectorAll(tableSelectors);
    tables.forEach((table) => {
      wrap(table, 'rte__table-wrapper');
    });

    // Target iframes to make them responsive
    const iframeSelectors = '.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"], .rte iframe#admin_bar_iframe';
    const frames = document.querySelectorAll(iframeSelectors);
    frames.forEach((frame) => {
      wrap(frame, 'rte__video-wrapper');
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('focus-enabled');
    });
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 9) {
        document.body.classList.add('focus-enabled');
      }
    });

    // Apply a specific class to the html element for browser support of cookies.
    if (window.navigator.cookieEnabled) {
      document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
    }

    // Common a11y fixes
    focusHash();
    bindInPageLinks();

    let hasNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    if (!hasNativeSmoothScroll) {
      loadScript({url: window.theme.assets.smoothscroll});
    }
  });

})(themeVendor.FlickityFade, themeVendor.BodyScrollLock, themeVendor.AOS, themeVendor.Flickity, themeVendor.Sqrl, themeVendor.MicroModal, themeVendor.Rellax, themeVendor.themeCurrency, themeVendor.axios, themeVendor.themeAddresses, themeVendor.FlickitySync);
