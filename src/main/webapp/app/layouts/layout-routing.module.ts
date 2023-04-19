import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute } from './error/error.route';
import { ErrorComponent } from './error/error.component';

const LAYOUT_ROUTES = [...errorRoute];

@NgModule({
  imports: [RouterModule.forChild(LAYOUT_ROUTES)],
  declarations: [ErrorComponent],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutRoutingModule {}
