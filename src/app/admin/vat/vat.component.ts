import { Component, OnInit } from '@angular/core';
import { VAT } from 'src/app/Model/vat';
import { VatService } from '../services/vat.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';



@Component({
  selector: 'app-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['./vat.component.css']
})
export class VatComponent implements OnInit {
  minDate!: string;
  vats: VAT[] = [];
  showModal: boolean = false;
  editingVat: boolean = false;
  currentVat: VAT = new VAT();
  datePipe: DatePipe = new DatePipe('en-US');

  
  constructor(private vatService: VatService, private router: Router, private toastr: ToastrService
    , private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService) {}

  //When the page is called these methods are automatically called
  ngOnInit(): void {
    this.loadVATs();
    const today = new Date();
    this.minDate = this.formatDate(today);
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
  }

  //This method formats the date to the format that the HTML input element expects (yyyy-MM-dd).
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  //retrieves all the information in the VAT table from the database and stores it in the vats array.
  loadVATs(): void {
    this.vatService.getVATs().subscribe({
      next: (data: VAT[]) => this.vats = data,
      error: (error: any) => {
        console.error(error);
        this.toastr.error('Error, please try again', 'VAT Table');
      }
    });
  }

  isDuplicateVAT(vat: VAT): boolean {
    return this.vats.some(item => item.percentage === vat.percentage && item.date === vat.date);
  }

  // The openAddVatModal() function is called when the "Add VAT" button is clicked, 
  //which opens a modal window for adding a new VAT record.
  openAddVatModal() {
    this.editingVat = false;
    this.currentVat = new VAT();
    this.showModal = true;
  }

  //The openEditVatModal() function is called when the user clicks the "Edit" button in the table. 
  //This function opens the modal window with the selected VAT record's details and allows the user to edit the record.
  openEditVatModal(id: number) {
    this.editingVat = true;

    const originalSupplier = this.vats.find(x => x.vatid === id);
    if (originalSupplier) {
      // Clone the original Customer Details object and assign it to currentBlacklistC
      this.currentVat = {...originalSupplier};
    }
    this.showModal = true;
  }
//The closeVatModal() function is called when the user clicks the "Close" button in the modal window. 
//This function simply closes the modal window.
  closeVatModal() {
    this.showModal = false;
  }

  //The submitVatForm() function is called when the user submits the form in the modal window. This function saves the 
  //new or edited VAT record to an array of VAT records and closes the modal window.
  submitVatForm(form: NgForm): void {
    // Format the date before using it
    const formattedDate = this.datePipe.transform(this.currentVat.date, 'yyyy-MM-dd');
  
    if (form.valid) {
      if (this.editingVat) {
        // Update VAT
        this.vatService.updateVAT(this.currentVat.vatid!, this.currentVat).subscribe({
          next: () => {
            const index = this.vats.findIndex(vat => vat.vatid === this.currentVat.vatid);
            if (index !== -1) {
              this.vats[index] = this.currentVat;
            }
            this.closeVatModal();
            this.toastr.success('Successfully updated', 'Update');
          },
          error: (error: any) => {
            console.error(error);
            this.toastr.error('Error, please try again', 'Update');
          }
        });
      } else {
        // Check for duplicate VAT entries before adding
        if (this.isDuplicateVAT(this.currentVat)) {
          this.toastr.error('VAT with the same percentage and date already exists!', 'Error');
        } else {
          this.vatService.addVAT(this.currentVat).subscribe({
            next: (data: VAT) => {
              this.vats.push(data);
              this.closeVatModal();
              form.resetForm();
              this.toastr.success('Successfully added', 'Add');
            },
            error: (error: any) => {
              console.error(error);
              this.toastr.error('Error, please try again', 'Add');
            }
          });
        }
      }
    }
  }

  deleteVAT(id: number): void {
    this.vatService.deleteVAT(id).subscribe({
      next: () => {
        this.vats = this.vats.filter(vat => vat.vatid !== id);
        this.toastr.success('Successfully deleted', 'Delete');
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error('Error, please try again', 'Delete');
      }
    });
  }

  AuditTrail: AuditTrail[] = [];
  currentAudit: AuditTrail = new AuditTrail();
  user: Customer | undefined;
  userDetails: any;

  loadUserData() {
    const userEmail = this.userDetails?.email;

    if (userEmail != null) {
      this.customerService.GetCustomer(userEmail).subscribe(
        (result: any) => {
          console.log(result);
          // Access the user object within the result
          this.user = result.user; // Assign the user data to the variable
        },
        (error: any) => {
          console.log(error);
          this.toastr.error('Failed to load user data.');
        }
      );
    }
  }

  async AddAuditLog(button: string): Promise<void> {
    this.loadUserData();
    this.currentAudit.buttonPressed = button;
    this.currentAudit.userName = this.user?.first_Name;
    this.currentAudit.userEmail = this.user?.email;
    console.log(this.currentAudit);
    const data = await this.auditLogService.addAuditLog(this.currentAudit);
    this.AuditTrail.push(data);
  }

  onSubmitClick() {
    const auditLogMessage =
      'VAT: ' + (this.editingVat ? 'Updated' : 'Added');
    this.AddAuditLog(auditLogMessage);
  }
}
