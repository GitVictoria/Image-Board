# Image-Board
Visual mood board built as a single page application using Vue.js

The image-board was build in Javascript using: 
* Vue.js
* Node.js
* Amazon s3 
* Hashes (url fragments)

The idea of the project is to digitalise the use of mood-boards for personal use. Using Vue.js I created a single page application,
that allows for hassle-free adding, deleting of the visual content, creating an environment to review individual images and make thoughtful 
remarks about them as a  `'comments'` feature. 

![](https://github.com/GitVictoria/Image-Board/blob/master/public/demo.gif)


Vue instance mounts and makes an ajax request to get the data for the images. Once the data is loaded, the HTML template loops 
through them and renders each one. 
