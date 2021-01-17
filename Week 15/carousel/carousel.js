import { createElement, Component } from "./framework.js";

class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }

  setAttribute (name, value) {
    this.attributes[name] = value;
  }

  render () {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    let i = 0;

    for (const src of this.attributes.src) {
      let child = document.createElement("div");
      child.appendChild(document.createTextNode(++i));
      child.style.backgroundImage = `url('${src}')`;
      this.root.appendChild(child);
    }

    const children = this.root.children;
    let position = 0;

    const onMouseDown = (event) => {
      const startX = event.clientX;

      const onMouseMove = (event) => {
        const x = event.clientX - startX;
        let current = position - (x - (x % 400)) / 400;

        for (const offset of [-2, -1, 0, 1, -2]) {
          let pos = offset + current;
          pos = (pos + children.length) % children.length;
          children[pos].style.transition = "none";
          children[pos].style.transform = `translateX(${-pos * 400 + offset * 400 + (x % 400)}px)`;
        }
      };

      const onMouseUp = (event) => {
        const x = event.clientX - startX;
        position = position - Math.round(x / 400);

        for (const offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
          let pos = offset + position;
          pos = (pos + children.length) % children.length;
          children[pos].style.transition = "";
          children[pos].style.transform = `translateX(${-pos * 400 + offset * 400}px)`;
        }

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    this.root.addEventListener("mousedown", onMouseDown);

    return this.root;
  }

  mountTo (parent) {
    parent.appendChild(this.render());
  }
}
export default Carousel;
