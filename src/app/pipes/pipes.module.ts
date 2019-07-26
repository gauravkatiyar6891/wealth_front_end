import { AgePipe } from './age.pipe';
import { NgModule } from '@angular/core';
import { NullToNaPipe } from './null-to-na.pipe';
import { IncomeSlabPipe } from './income-slab.pipe';
import { InrCurrencyPipe } from './inr-currency.pipe';
import { TruncateBlogPipe } from './truncate-blog.pipe';

@NgModule({
  imports: [],
  declarations: [AgePipe, InrCurrencyPipe, IncomeSlabPipe, NullToNaPipe, TruncateBlogPipe],
  exports: [AgePipe, InrCurrencyPipe, IncomeSlabPipe, NullToNaPipe, TruncateBlogPipe]
})
export class PipesModule { }
