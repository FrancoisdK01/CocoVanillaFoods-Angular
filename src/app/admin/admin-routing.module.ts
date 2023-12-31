import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory/inventory.component';
import { EventComponent } from './event/event.component';
import { FaqComponent } from './faq/faq.component';
import { SupplierComponent } from './supplier/supplier.component';
import { BlacklistComponent } from './blacklist/blacklist.component';
import { VatComponent } from './vat/vat.component';
import { EmployeeComponent } from './employee/employee.component';
import { VarietalComponent } from './varietal/varietal.component';
import { TypeComponent } from './type/type.component';
import { DiscountComponent } from './discount/discount.component';
import { EarlyBirdComponent } from './early-bird/early-bird.component';
import { EventTypeComponent } from './event-type/event-type.component';
import { EventPriceComponent } from './event-price/event-price.component';
import { WineComponent } from './wine/wine.component';
import { Routes } from '@angular/router';
import { SystemprivilegesComponent } from './systemprivileges/systemprivileges.component';
import { SuperuserComponent } from './superuser/superuser.component';
import { CustomersComponent } from './customers/customers.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SupplierOrderComponent } from './supplier-order/supplier-order.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { WriteoffComponent } from './writeoff/writeoff.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { ScanTicketComponent } from './scan-ticket/scan-ticket.component';
import { HelpResourcesComponent } from './help-resources/help-resources.component';
import { RefundRequestComponent } from './refund-request/refund-request.component';
import { CalendarComponent } from './calendar/calendar.component';
import { BackupComponent } from './backup/backup.component';
import { EventDamageComponent } from './event-damage/event-damage.component';

const routes: Routes = [
  { path: '', redirectTo: '/wine', pathMatch: 'full' },
  { path: 'wine', component: WineComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'event', component: EventComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'writeoff', component: WriteoffComponent},
  { path: 'blacklist', component: BlacklistComponent },
  { path: 'vat', component: VatComponent},
  { path: 'employees', component: EmployeeComponent},
  { path: 'varietal', component: VarietalComponent},
  { path: 'type', component: TypeComponent},
  { path: 'discount', component: DiscountComponent},
  { path: 'earlybird', component: EarlyBirdComponent},
  { path: 'eventtype', component:EventTypeComponent},
  { path: 'eventprice', component: EventPriceComponent},
  { path: 'systemprivileges', component: SystemprivilegesComponent},
  { path: 'superuser', component: SuperuserComponent},
  { path: 'customers', component: CustomersComponent},
  { path: 'users', component: UserManagementComponent},
  { path: 'supplierOrder', component: SupplierOrderComponent},
  { path: 'refundrequest', component: RefundRequestComponent},
  { path: 'adminOrder', component: AdminOrdersComponent},
  { path: 'auditlogs', component: AuditLogsComponent},
  { path: 'help', component: HelpResourcesComponent},
  { path: 'Tickets/Scan/:token', component: ScanTicketComponent },
  { path: 'calendar', component: CalendarComponent},
  { path: 'backup', component: BackupComponent},
  { path: 'eventDamage', component: EventDamageComponent}


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
