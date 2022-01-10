import {clearElement, createElement, toggle} from "./Utils.js";

export default class DropDown {
    constructor(container, onEnter, mnemonicWords) {
        this.container = container;
        this.onEnter = onEnter;
        this.mnemonicWords = mnemonicWords
    }

    show(input, text) {
        clearElement(this.container);

        const onMouseDown = e => {
            input.value = e.target.innerText;
            input.classList.remove('error');
            this.hide();
            e.preventDefault();
            this.onEnter(input);
        };

        this.mnemonicWords
            .filter(w => w.indexOf(text) === 0)
            .forEach(w => {
                const item = createElement({tag: 'div', clazz: 'words-popup-item', text: w});
                item.addEventListener('mousedown', onMouseDown);
                this.container.appendChild(item);
            });

        this.selectedI = -1;
        if (this.container.children.length > 0) this.select(0);

        this.container.style.left = input.offsetLeft + 'px';
        this.container.style.top = (input.offsetTop + input.offsetHeight) + 'px';
        toggle(this.container, true);
    };

    hide() {
        toggle(this.container, false);
        clearElement(this.container);
        this.selectedI = -1;
    }

    select(i) {
        if (this.selectedI > -1) {
            this.container.children[this.selectedI].classList.remove('selected');
        }
        this.selectedI = i;
        if (this.selectedI > -1) {
            this.container.children[this.selectedI].classList.add('selected');
            const ITEM_HEIGHT = 30;
            this.container.scrollTo(0, ITEM_HEIGHT * this.selectedI);
        }
    }

    getSelectedText() {
        if (this.selectedI === -1) return null;
        return this.container.children[this.selectedI].innerText;
    }

    up() {
        if (this.selectedI === -1) return;

        if (this.selectedI > 0) {
            this.select(this.selectedI - 1);
        }
    }

    down() {
        if (this.selectedI === -1) return;

        if (this.selectedI < this.container.children.length - 1) {
            this.select(this.selectedI + 1);
        }
    }
}