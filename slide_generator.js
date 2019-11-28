class SliderLogistic {
    constructor(slideList, leftButton, rightButton, sizeSlide, positionX = 0) {
        this.slideList = slideList;
        this.leftButton = leftButton;
        this.rightButton = rightButton;
        this.sizeSlide = sizeSlide;
        this.positionX = positionX;

        if (window.getEventListeners(this.leftButton))
            this.leftButton.removeEventListener('click', () => this.shiftSlide(this.sizeSlide));
        if (window.getEventListeners(this.rightButton))
            this.rightButton.removeEventListener('click', () => this.shiftSlide(-this.sizeSlide));
        this.addEvently();
    }

    addEvently() {
        this.leftButton.addEventListener('click', () => this.shiftSlide(this.sizeSlide));
        this.rightButton.addEventListener('click', () => this.shiftSlide(-this.sizeSlide));
    }

    shiftSlide(shift) {
        this.positionX += shift;

        if (this.positionX > 0)
            this.positionX = -(this.sizeSlide * this.slideList.children.length - this.sizeSlide);
        else if (this.positionX < -(this.sizeSlide * this.slideList.children.length - this.sizeSlide))
            this.positionX = 0;
        
        this.slideList.style.left = `${this.positionX}px`;
    }
}

class ModalGenerator {
    static start = (message) => {
        ModalGenerator.message = message;
        ModalGenerator.createModal();
        ModalGenerator.showModal();
    }

    static createModal = () => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            left: 50px;
            top: 10px;
            width: 150px;
            border-radius: 4px;
            background-color: #ff3131a8;
            z-index: 9999;
            transition: .5s;
            color: white;
            text-align: center;
            display: inline-block;
            box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.5);
            padding: 10px;
        `;

        modal.animate([
                { opacity: '0' }, 
                { opacity: '1' }
            ], { 
            duration: 500,
            iterations: 1
        });

        modal.innerText = ModalGenerator.message;

        ModalGenerator.modal = modal;
    }

    static showModal = () => {
        document.querySelector('body').appendChild(ModalGenerator.modal);
        setTimeout(() => {
            document.querySelector('body').removeChild(ModalGenerator.modal);
        }, 2000);
    }
}

class SliderGenerator {
    constructor(id, propsSlides = { className: '' }, propsButtons = { className: '' }) {
        this.id = id;
        this.container = document.querySelector(id);
        this.children = this.container.children;
        this.propsSlides = propsSlides;
        this.propsButtons = propsButtons;
        if (this.children.length) this.wrapperSlides();
        else ModalGenerator.start('Cannot be 0 slides!');
    }

    removeChildren() {
        this.container.innerHTML = '';
    }

    wrapperSlides() {
        const slideList = document.createElement('div');
        slideList.style.cssText = `
            width: ${this.children.length * this.container.offsetWidth + 'px'};
            height: 100%;
            position: relative;
            display: flex;
            left: 0px;
            transition: .5s;
        `;

        this.render(slideList);
    }

    appendChilds(slideList) {
        Array.from(this.children).forEach(child => {
            const slide = document.createElement('div');
            slide.style.width = `${this.container.offsetWidth}px`;
            slide.className = this.propsSlides.className;
            slide.appendChild(child);
            slideList.appendChild(slide);
        });
    }

    render(slideList) {
        const stylesButton = {
            'position': 'absolute',
            'background-color': 'rgba(0,0,0, 0.4)',
            'color': '#fff',
            'font-size': '35px',
            'outline': 'none',
            'cursor': 'pointer',
            'height': '100%',
            'top': 0,
            'border': 'none'
        };

        this.leftButton = document.createElement('button');
        this.rightButton = document.createElement('button');
        
        Object.assign(this.leftButton.style, { ...stylesButton, left: 0 });
        Object.assign(this.rightButton.style, { ...stylesButton, right: 0 });

        this.leftButton.className = this.propsButtons.className;
        this.leftButton.innerText = '‹';

        this.rightButton.className = this.propsButtons.className;
        this.rightButton.innerText = '›';

        this.appendChilds(slideList);

        this.removeChildren();
        this.container.style.position = 'relative';
        this.container.appendChild(slideList);
        this.container.appendChild(this.leftButton);
        this.container.appendChild(this.rightButton);
        this.resizeEvent();
        this.addEvently(slideList);
    }

    addEvently(slideList) {
        new SliderLogistic(slideList, this.leftButton, this.rightButton, this.container.offsetWidth);
    }

    resizeEvent() {
        window.addEventListener('resize', () => {
            this.container = document.querySelector(this.id);
            const slideList = this.container.children[0];
            this.children = slideList.children;
            slideList.style.width = this.children.length * this.container.offsetWidth + 'px';
            Array.from(this.children).forEach(child => child.style.width = `${this.container.offsetWidth}px`);
            this.addEvently(slideList);
        });
    }
}