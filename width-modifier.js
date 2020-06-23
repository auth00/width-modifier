/**
 * width-modifier
 * by Thomas
 * MIT Licensed
 *
 * See Philip Walton's Responsive Components: a Solution to the Container Queries Problem
 * https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/
 *
 * Implementation basd on https://github.com/pinkhominid/wc-responsive-container
 */

(function(document) {

const PROP = 'width-modifier';

/*
 * Keeps track of references to nodes style object to minimize calls to getComputedStyle
 */
const ns = new WeakMap();

/*
 *
 */
const mo = new MutationObserver(changes => {
  changes.forEach(change => {
    change.addedNodes.forEach(node => {
      if(node.nodeType != 1) {
        return;
      }
      if(!node.hasAttribute(PROP)) {
        return;
      }
      ro.observe(node);
      ns.set(node, getComputedStyle(node));
    });
    change.removedNodes.forEach(node => {
      ro.unobserve(node);
      ns.delete(node); 
    });
  });
}).observe(document, {childList: true, subtree: true});

// Create a single observer for all responsive elements
const ro = new ResizeObserver(entries => {
  entries.forEach(entry => {
    updateClasses(entry.target);
  });
});

function updateClasses(node, contentRect) {
  if(typeof contentRect == 'undefined') {
    contentRect = node.getBoundingClientRect();
  }

  breakpoints = ns.get(node).getPropertyValue('--' + PROP);

  if(!breakpoints) {
    return;
  }

  // Update the matching breakpoints on the observed element.
  breakpoints.trim().split(' ').map(breakpoint => {
    return breakpoint.split(':');
  }).forEach(breakpoint => {
    const className = breakpoint[0];
    const minWidth = breakpoint[1];
    if (contentRect.width >= minWidth) {
      node.classList.add(className);
    } else {
      node.classList.remove(className);
    }
  });
}

})(document);
