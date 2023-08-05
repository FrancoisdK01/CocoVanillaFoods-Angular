import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { Employee } from 'src/app/Model/employee';
import { ToastrService } from 'ngx-toastr';
import { Register } from 'src/app/Model/register';
import { EmployeeRegistrationViewModel } from 'src/app/Model/employeeRegisterViewModel';
import { EmployeeViewModel } from 'src/app/Model/employeeViewModel';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  employees: Employee[] = [];
  currentEmployee: Employee = new Employee();
  showEmployeeModal: boolean = false;
  editingEmployee: boolean = false;
  showDeleteEmployeeModal = false;
  employeeToDeleteDetails: any;
  employeeToDelete: any = null;
  maxDate!: string;

  constructor(private employeeService: EmployeeService, private toastr : ToastrService){ }

  ngOnInit(): void { 
    this.getEmployees();
    const today = new Date();
    this.maxDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getEmployees(){
    this.employeeService.GetEmployees().subscribe(
      (result: Employee[]) => {
        this.employees = result;
        console.log(this.employees);
      },
      (error: any) => {
        console.error(error);
        this.toastr.error("Unable to load employee data");
      }
    );
  }

  openAddEmployeeModal() {
    this.editingEmployee = false;
    this.currentEmployee = new Employee();
    this.showEmployeeModal = true;
  }

  openEditEmployeeModal(id: string) {
    console.log('Opening edit employee modal for ID:', id);
    this.editingEmployee = true;
    // Find the original Employee object
    const originalEmployee = this.employees.find(employee => employee.id === id);
    if (originalEmployee) {
      // Clone the original Employee object and assign it to currentEmployee
      this.currentEmployee = {...originalEmployee};
    }
    this.showEmployeeModal = true;
  }

  closeEmployeeModal() {
    this.showEmployeeModal = false;
  }

  openDeleteEmployeeModal(employee: any): void {
    this.employeeToDelete = employee.id;
    console.log("Employee ID to delete: ", this.employeeToDelete)
    this.employeeToDeleteDetails = employee;
    this.showDeleteEmployeeModal = true;
  }

  closeDeleteEmployeeModal(): void {
    this.showDeleteEmployeeModal = false;
  }

  async submitEmployeeForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingEmployee flag:', this.editingEmployee);
    if (form.valid) {
      try {
        if (this.editingEmployee) {
          this.employeeService.UpdateEmployee(this.currentEmployee.id!, this.currentEmployee).subscribe(
            (data: Employee) => {
              const index = this.employees.findIndex(employee => employee.id === this.currentEmployee.id);
              if (index !== -1) {
                // Update the original Employee object with the changes made to the clone
                this.employees[index] = data;
                this.toastr.success("Employee updated.", "Update employee");
              }
              this.closeEmployeeModal();
            },
            (error: any) => {
              console.error(error);
              this.toastr.error("Failed to update superuser.", "Update Superuser");
            }
          );
        } else {
          const regEmp: EmployeeRegistrationViewModel = new EmployeeRegistrationViewModel();
          
          const empModel: EmployeeViewModel = new EmployeeViewModel();
          empModel.firstName = this.currentEmployee.first_Name;
          empModel.lastName = this.currentEmployee.last_Name;
          empModel.phoneNumber = this.currentEmployee.phoneNumber;
          empModel.idNumber = this.currentEmployee.iD_Number;

          const regModel: Register = new Register();
          regModel.Title = this.currentEmployee.title;
          regModel.FirstName = this.currentEmployee.first_Name;
          regModel.LastName = this.currentEmployee.last_Name;
          regModel.PhoneNumber = this.currentEmployee.phoneNumber;
          regModel.IDNumber = this.currentEmployee.iD_Number;
          regModel.Gender = this.currentEmployee.gender;
          regModel.DisplayName = this.currentEmployee.username;
          regModel.Email = this.currentEmployee.email;
          regModel.Password = "AutoGenerated@API123"
          regModel.EnableTwoFactorAuth = true;

          regEmp.EmployeeModel = empModel;
          regEmp.RegisterModel = regModel;

          console.log(regEmp);

          this.employeeService.AddEmployee(regEmp).subscribe(data => {
            console.log(data);
            this.employees.push(data);
            this.toastr.success("A new employee has been added to the system.", "Add Employee");
            form.resetForm();
          }, error => {
            console.error(error);
            this.toastr.error("Adding a new employee failed, please try again later.", "Employee add failed");
          });
        }
        this.closeEmployeeModal();
        if (!this.editingEmployee) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
        this.toastr.error("Adding a new employee failed, please try again later.", "Add Employee")
      }
    }
  }

  async deleteEmployee(): Promise<void> {
    if (this.employeeToDelete != null) {
      try {
        this.employeeService.DeleteEmployee(this.employeeToDelete).subscribe((result: any) => {

        });
        console.log(this.employeeToDelete);
        this.employees = this.employees.filter(employee => employee.id !== this.employeeToDelete);
        this.toastr.success("The employee has been deleted.", "Delete Employee");
      } catch (error) {
        console.error('Error deleting employee:', error);
        this.toastr.error("Deleting the selected employee account failed, please try again later.", "Delete Employee");
      }
      this.closeDeleteEmployeeModal();
    }
  }
}
