/**
 * width-modifier
 * by Thomas
 * MIT Licensed
 *
 * See Philip Walton's Responsive Components: a Solution to the Container Queries Problem
 * https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/
 *
 * Implementation based on https://github.com/pinkhominid/wc-responsive-container
 *
 * How to use
 * Any elements with the class width-modifier will be evaluated
 * Add the custom property --width-modifier on the format
 * --width-modifier: class1 0 200, class2 200 500, class3 500;
 * To have width-modifer set class1 when the element is >= 0 and < 200,
 * class2 when >= 200 and < 500 and class3 when >= 500
 * It is also possible to use custom properties as values like
 * --width-modifier: class 0 var(--max);
 */

(function(document) {

/*
 * Keeps track of references to vidth-modifier nodes style object to minimize calls to getComputedStyle
 */
const nodesStyle = new WeakMap();

/**
 * Keep a list of width-modifier nodes with resize changes since last updateClasses
 */
const nodesWithResize = new WeakMap();

/*
 * Keep trach of all width-modifier nodes in the viewport at any given time
 */
const nodesInViewPort = new WeakMap();

/*
 * Keeps track of recently changed nodes to prevent loops
 */
const recentChanges = new WeakMap();

/*
 *
 */
const mo = new MutationObserver(changes => {
  changes.forEach(change => {
    change.addedNodes.forEach(node => {
      if(node.nodeType != 1) {
        return;
      }

      const elements = node.getElementsByClassName('width-modifier');
      for (var i = 0; i < elements.length; i++) {
        trackNode(elements[i]);
      }

      if(!node.classList.contains('width-modifier')) {
        return;
      }
      trackNode(node);
    });
    change.removedNodes.forEach(node => {
      if(node.nodeType != 1) {
        return;
      }
      if(!node.classList.contains('width-modifier')) {
        return;
      }
      untrackNode(node);
    });
  });
}).observe(document, {childList: true, subtree: true});

// Create a single observer for all responsive elements
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      nodesInViewPort.set(entry.target, true);
      if(nodesWithResize.has(entry.target)) {
        updateClasses(entry.target, nodesWithResize.get(entry.target));
        nodesWithResize.delete(entry.target);
      }
    } else {
      nodesInViewPort.delete(entry.target);
    }
  });
}, { rootMargin: '400px' });

// Create a single observer for all responsive elements
const ro = new ResizeObserver(entries => {
  entries.forEach(entry => {
    if(nodesInViewPort.has(entry.target)) {
      updateClasses(entry.target, entry.contentRect);
    } else {
      // Added node to be processed when in viewport
      nodesWithResize.set(entry.target, entry.contentRect);
    }
  });
});

function trackNode(node) {
  nodesStyle.set(node, getComputedStyle(node));
  io.observe(node);
  ro.observe(node);
}

function untrackNode(node) {
  ro.unobserve(node);
  io.unobserve(node);
  nodesStyle.delete(node); 
}

function updateClasses(node, contentRect) {
  if(recentChanges.has(node)) {
    //return; // This prevents nested width-modifiers to apply correctly on load, TODO: investigate
  }

  const breakpoints = nodesStyle.get(node).getPropertyValue('--width-modifier');

  if(!breakpoints) {
    return;
  }

  // Update the matching breakpoints on the observed element.
  breakpoints.trim().split(',').map(breakpoint => {
    return breakpoint.replace(/  */g, ' ').trim().split(' ');
  }).forEach(breakpoint => {
    const className = breakpoint[0];
    const minWidth = breakpoint.length > 1 ? parseFloat(breakpoint[1]) : 0;
    const maxWidth = breakpoint.length > 2 ? parseFloat(breakpoint[2]) : 99999;
    if (contentRect.width >= minWidth && contentRect.width < maxWidth) {
      if(!node.classList.contains(className)) {
        recentChanges.set(node, setTimeout(() => {recentChanges.delete(node);}, 50));
        node.classList.add(className);
      }
    } else {
      if(node.classList.contains(className)) {
        recentChanges.set(node, setTimeout(() => {recentChanges.delete(node);}, 50));
        node.classList.remove(className);
      }
    }
  });
}

/*
 * Parse over the current element tree to handle any pre-existing matching nodes
 */
const elements = document.getElementsByClassName('width-modifier');
for (var i = 0; i < elements.length; i++) {
  trackNode(elements[i]);
}

})(document);
