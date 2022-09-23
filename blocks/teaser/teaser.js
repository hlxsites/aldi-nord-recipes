export default function decorate(block) {
  // get image and caption divs
  let imageDiv = block.children[0].children[0];
  let captionDiv = block.children[0].children[1];  
  // check if left or right
  if (imageDiv.children[0].tagName !== "PICTURE"){
    console.log(imageDiv.children[0].tagName)
    const tmp = imageDiv;
    imageDiv = captionDiv;
    captionDiv = tmp;
    captionDiv.setAttribute('class', 'teaser-caption-right');
  } else {
    captionDiv.setAttribute('class', 'teaser-caption-left');
  }

  imageDiv.setAttribute('class', 'teaser-image');

  // grap the caption elements
  const title = captionDiv.querySelector('h2');
  const text = captionDiv.querySelector('p:not(.button-container)');

  // ... and place text inside additional div
  if (text !== null) {
    const headDiv = document.createElement('div');
    headDiv.setAttribute('class', 'subhead');
    headDiv.append(text);
    title.after(headDiv);
  }
}

