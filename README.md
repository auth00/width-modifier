# width-modifier

See Philip Walton's Responsive Components: a Solution to the Container Queries Problem
https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/

Implementation based on https://github.com/pinkhominid/wc-responsive-container

How to use

Any elements with the class width-modifier will be evaluated

Add the custom property --width-modifier on the format
`--width-modifier: class1 0 200, class2 200 500, class3 500;`

To have width-modifer set class1 when the element is >= 0 and < 200, class2 when >= 200 and < 500 and class3 when >= 500

It is also possible to use custom properties as values
`--width-modifier: class 0 var(--max);`
