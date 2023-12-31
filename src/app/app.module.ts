import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WineComponent } from './admin/wine/wine.component';
import { EventComponent } from './admin/event/event.component';
import { InventoryComponent } from './admin/inventory/inventory.component';
import { FaqComponent } from './admin/faq/faq.component';
import { SupplierComponent } from './admin/supplier/supplier.component';
import { BlacklistComponent } from './admin/blacklist/blacklist.component';

//Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidenavComponent } from './admin/sidenav/sidenav.component';
import { VatComponent } from './admin/vat/vat.component';

//ClientModule
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SystemprivilegesComponent } from './admin/systemprivileges/systemprivileges.component';
import { EmployeeComponent } from './admin/employee/employee.component';

//Successfull and error message popups
import { ToastrModule } from 'ngx-toastr';

//Error Interceptor
import { ErrorInterceptor } from './error.interceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VarietalComponent } from './admin/varietal/varietal.component';
import { TypeComponent } from './admin/type/type.component';
import { DiscountComponent } from './admin/discount/discount.component';
import { EarlyBirdComponent } from './admin/early-bird/early-bird.component';
import { EventTypeComponent } from './admin/event-type/event-type.component';
import { EventPriceComponent } from './admin/event-price/event-price.component';
import { SpinnerComponent } from './admin/spinner/spinner.component';
import { HttpInterceptorInterceptor } from './admin/http.interceptor';
import { SpinnerService } from './admin/services/spinner.service';
import { ClientHomeComponent } from './customer/client-home/client-home.component';
import { ClientProductsComponent } from './customer/client-products/client-products.component';
import { ClientEventsComponent } from './customer/client-events/client-events.component';
import { UserInformationComponent } from './customer/user-information/user-information.component';
import { UsernameAndPasswordComponent } from './customer/username-and-password/username-and-password.component';
import { OrdersComponent } from './customer/orders/orders.component';
import { TicketsComponent } from './customer/tickets/tickets.component';
import { RefundRequestComponent } from './admin/refund-request/refund-request.component';
import { MyRefundsComponent } from './customer/my-refunds/my-refunds.component';
import { WishlistComponent } from './customer/wishlist/wishlist.component';
import { NavbarComponent } from './customer/navbar/navbar.component';
import { CustomerSidenavComponent } from './customer/customer-sidenav/customer-sidenav.component';
import { CartComponent } from './customer/cart/cart.component';
import { CustomerFaqComponent } from './customer/customer-faq/customer-faq.component';
import { SuperuserComponent } from './admin/superuser/superuser.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { SupplierOrderComponent } from './admin/supplier-order/supplier-order.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { ClientAboutComponent } from './customer/client-about/client-about.component';
import { ClientContactComponent } from './customer/client-contact/client-contact.component';
import { UserRefundsComponent } from './customer/user-refunds/user-refunds.component';
import { WriteoffComponent } from './admin/writeoff/writeoff.component';
import { ChatbotComponent } from './customer/chatbot/chatbot.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuditLogsComponent } from './admin/audit-logs/audit-logs.component';
import { ChartsComponent } from './admin/charts/charts.component';
import { ScanTicketComponent } from './admin/scan-ticket/scan-ticket.component';
import { HelpResourcesComponent } from './admin/help-resources/help-resources.component';
import { AccessRestrictedComponent } from './admin/access-restricted/access-restricted.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DonationsComponent } from './customer/donations/donations.component';
import { CalendarComponent } from './admin/calendar/calendar.component';
import { BackupComponent } from './admin/backup/backup.component';
import { PaginationComponent } from './admin/pagination/pagination.component';
import { EventDamageComponent } from './admin/event-damage/event-damage.component';



@NgModule({
  declarations: [
    AppComponent,
    WineComponent,
    EventComponent,
    InventoryComponent,
    FaqComponent,
    SupplierComponent,
    BlacklistComponent,
    SidenavComponent,
    VatComponent,
    SystemprivilegesComponent,
    EmployeeComponent,
    VarietalComponent,
    TypeComponent,
    DiscountComponent,
    EarlyBirdComponent,
    EventTypeComponent,
    EventPriceComponent,
    SpinnerComponent,
    ClientHomeComponent,
    ClientProductsComponent,
    ClientEventsComponent,
    UserInformationComponent,
    UsernameAndPasswordComponent,
    OrdersComponent,
    TicketsComponent,
    RefundRequestComponent,
    MyRefundsComponent,
    WishlistComponent,
    NavbarComponent,
    CustomerSidenavComponent,
    CartComponent,
    CustomerFaqComponent,
    SuperuserComponent,
    CustomersComponent,
    UserManagementComponent,
    SupplierOrderComponent,
    AdminOrdersComponent,
    ClientAboutComponent,
    ClientContactComponent,
    UserRefundsComponent,
    WriteoffComponent,
    ChatbotComponent,
    AuditLogsComponent,
    ChartsComponent,
    ScanTicketComponent,
    HelpResourcesComponent,
    AccessRestrictedComponent,
    DonationsComponent,
    CalendarComponent,
    BackupComponent,
    PaginationComponent,
    EventDamageComponent,
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({ // ToastrModule options
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,}),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    SpinnerService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpInterceptorInterceptor,
        multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
