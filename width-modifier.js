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

const CLASS = 'width-modifier';

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
      
      if(!node.classList.contains(CLASS)) {
        return;
      }
      ns.set(node, getComputedStyle(node));
      ro.observe(node);
    });
    change.removedNodes.forEach(node => {
      if(node.nodeType != 1) {
        return;
      }
      if(!node.classList.contains(CLASS)) {
        return;
      }
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

function updateClasses(node) {
  contentRect = node.getBoundingClientRect();

  breakpoints = ns.get(node).getPropertyValue('--' + CLASS);

  if(!breakpoints) {
    return;
  }

  // Update the matching breakpoints on the observed element.
  breakpoints.trim().split(' ').map(breakpoint => {
    return breakpoint.split('|');
  }).forEach(breakpoint => {
    const className = breakpoint[0];
    const minWidth = breakpoint.length > 1 ? parseFloat(breakpoint[1]) : 0;
    const maxWidth = breakpoint.length > 2 ? parseFloat(breakpoint[2]) : 99999;
    if (contentRect.width >= minWidth && contentRect.width < maxWidth) {
      node.classList.add(className);
    } else {
      node.classList.remove(className);
    }
  });
}

/*
 * Parse over the current element tree to handle any pre-existing matching nodes
 */
const elements = document.getElementsByClassName(CLASS);
for (var i = 0; i < elements.length; i++) {
  ns.set(elements[i], getComputedStyle(elements[i]));
  ro.observe(elements[i]);
}

})(document);
