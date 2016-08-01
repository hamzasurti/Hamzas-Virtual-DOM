/** @jsx nodeToVD */

// converts jsx to js obj with babel transpilation
function nodeToVD(type,props,...children) {
  return { type, props: props || {}, children };}

// recursivey goes through virtual DOM and creates actual DOM elements
function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);
  setProps($el, node.props);
  node.children
    .map(createElement)
    .forEach($el.appendChild.bind($el));
  return $el;
}

function setProps($target, props) {
  Object.keys(props).forEach(name => {
    setProp($target, name, props[name]);
  });
}

function setBooleanProp($target, name, value) {
  if (value) {
    $target.setAttribute(name, value);
    $target[name] = true;
  } else {
    $target[name] = false;
  }
}

function isCustomProp(name) {
  return false;
}

function setProp($target, name, value) {
  if (isCustomProp(name)) {
    return;
  } else if (name === ‘className’) {
    $target.setAttribute(‘class’, value);
  } else if (typeof value === ‘boolean’) {
    setBooleanProp($target, name, value);
  } else {
    $target.setAttribute(name, value);
  }
}

function updateElement($parent, newNode, oldNode, index = 0) {
  if (!oldNode) {
    $parent.appendChild(
      createElement(newNode)
    );
  } else if (!newNode) {
    $parent.removeChild(
      $parent.childNodes[index]
    );
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(
      createElement(newNode),
      $parent.childNodes[index]
    );
  } else if (newNode.type) {
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      );
    }
  }
}
