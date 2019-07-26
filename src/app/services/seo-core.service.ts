import { Injectable } from '@angular/core';
 
@Injectable()
export class SeoCoreService {
    private _document: any;
 
    private headElement: any;//HTMLElement;
 
    private ogTitle: HTMLElement;
 
    private ogType: HTMLElement;
 
    private ogUrl: HTMLElement;
 
    private ogKeyword: HTMLElement;
 
    private ogDescription: HTMLElement;
 
 
    constructor() {
        //super();
        this._document = document;
        this.headElement = this._document.head;
 
        this.ogTitle = this.getOrCreateMetaElement('og:title', 'property');
        this.ogType = this.getOrCreateMetaElement('og:type', 'property');
        this.ogUrl = this.getOrCreateMetaElement('og:url', 'property');
        this.ogKeyword = this.getOrCreateMetaElement('og:keyword', 'property');
        this.ogDescription = this.getOrCreateMetaElement('og:description', 'property');
 
    }
 
    public setTitle(siteTitle = '', pageTitle = '', separator = ' / ') {
        let title = siteTitle;
        if (pageTitle != '') title += separator + pageTitle;
        this._document.title = title;
        return this;
    }
 
 
    public setOgTitle(value: string) {
        this.ogTitle.setAttribute('content', value);
        return this;
    }
 
    public setOgType(value: string) {
        this.ogType.setAttribute('content', value);
        return this;
    }
 
    public setOgUrl(value: string) {
        this.ogUrl.setAttribute('content', value);
        return this;
    }
 
    public setOgKeyword(value: string) {
        this.ogKeyword.setAttribute('content', value);
        return this;
    }
 
    public setOgDescription(value: string) {
        this.ogDescription.setAttribute('content', value);
        return this;
    }
 
 
    private getOrCreateMetaElement(name: string, attr: string) {
 
        let ogmetatag = this._document.createElement('meta');
        ogmetatag.setAttribute(attr, name);
        document.head.appendChild(ogmetatag);
        return ogmetatag
    }
 
    clear() {
        this.setTitle('').setOgDescription('')
            .setOgKeyword('')
            .setOgUrl('')
            .setOgTitle('');
        return this;
    }
}