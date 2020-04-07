import { Component, Input } from '@angular/core';

@Component({
  selector: 'invoice-tool-invoice-article',
  templateUrl: './invoice-article.component.html',
})
export class InvoiceArticle {

  @Input() datearticle: Date;
  @Input() articlename: string;
  @Input() nbarticle: number;

}