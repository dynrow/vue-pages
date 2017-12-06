import Vue from 'vue';

import PdfViewTemplate from './pdfview.vue';
import jcmp from '@/libs/jcmp.js';

const PdfViewConstructor = Vue.extend(PdfViewTemplate);

class PdfView{
    constructor(option){
        this.opt = Object.assign({} ,option);
        this.init();
    }

    init(){
        this.instance = new PdfViewConstructor({
            el: document.createElement('div')
        });
        document.body.appendChild(this.instance.$el);
    }

    show(url){
        this.instance.show(jcmp.convertResourceUrl(url));
    }

    hide(){
        this.instance.hide();
    }

    isShow(){
        return this.instance.visible;
    }

    remove(){
        if(this.instance){
            let el = this.instance.$el;
            this.instance.$destroy();
            el.parentNode.removeChild(el);
            this.instance = null;
        }
    }
}

export default PdfView;