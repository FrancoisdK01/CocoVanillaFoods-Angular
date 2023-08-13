import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { Inventory } from 'src/app/Model/inventory';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { Event } from 'src/app/Model/event';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  user: any;

  constructor(private userService: DataServiceService) {
    var tokenUser = this.userService.getUserFromToken();
    this.userService.getUser(tokenUser!.email).subscribe((result: any) => {
      this.user = result.user;
    })
  }

  generatePdf(inventoryData: Inventory[], currentDate: string): void {
    let documentDefinition: any;

    if (inventoryData.length > 0) {
      documentDefinition = {
        content: [
          { text: 'Inventory Report', style: 'header' },
          { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' },
          { text: `Date: ${currentDate}`, style: 'subheader' },
          '\n',
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                ['No.', 'Name', 'Varietal', 'Type', 'Price', 'Stock Limit', 'Quantity on Hand'],
                ...inventoryData.map((item, index) => [index + 1, item.wineName, item.wineVarietal, item.wineType, item.winePrice, item.stockLimit, item.quantityOnHand])
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 10]
          },
          subheader: {
            fontSize: 12,
            italics: true,
            margin: [0, 5, 0, 5]
          }
        }
      };
    } else {
      documentDefinition = {
        content: [
          { text: 'Inventory Report', style: 'header' },
          { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' },
          { text: `Date: ${currentDate}`, style: 'subheader' },
          '\n',
          {
            table: {
              headerRows: 1,
              widths: ['auto'],
              body: [
                ["There is nothing stored in Inventory at the moment."]
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 10]
          },
          subheader: {
            fontSize: 12,
            italics: true,
            margin: [0, 5, 0, 5]
          }
        }
      };
    }

    pdfMake.createPdf(documentDefinition).download('inventory_report.pdf');
  }

  generateRefundsPdf(refundData: RefundRequest[], beginDate: Date, endDate: Date): void {
    let beginDate2 = new Date(beginDate);
    let endDate2 = new Date(endDate);

    let formattedBeginDate = `${beginDate2.getDate()}-${beginDate2.getMonth() + 1}-${beginDate2.getFullYear()}`;
    let formattedEndDate = `${endDate2.getDate()}-${endDate2.getMonth() + 1}-${endDate2.getFullYear()}`;

    let documentDefinition: any;

    if (refundData.length > 0) {
      documentDefinition = {
        content: [
          { text: 'Refunds Report', style: 'header' },
          { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' },
          { text: `From: ${formattedBeginDate} To: ${formattedEndDate}`, style: 'subheader' },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                ['No.', 'WineId', 'OrderId', 'Reference Number', 'Requested On', 'Description', 'Email', 'Status'],
                ...refundData.map((item, index) => [index, item.wineId, item.orderId, item.orderRefNum, item.requestedOn, item.description, item.email, item.status])
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [0, 10]
          },
          subheader: {
            fontSize: 12,
            margin: [0, 6]
          }
        },
        pageOrientation: 'landscape'
      };
    } else {
      documentDefinition = {
        content: [
          { text: 'Refunds Report', style: 'header' },
          { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' },
          { text: `From: ${formattedBeginDate} To: ${formattedEndDate}`, style: 'subheader' },
          {
            table: {
              headerRows: 1,
              widths: ['auto'],
              body: [
                ["There were no refunds between the selected dates."]
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [0, 10]
          },
          subheader: {
            fontSize: 12,
            margin: [0, 6]
          }
        },
        pageOrientation: 'landscape'
      };
    }

    pdfMake.createPdf(documentDefinition).download(`refunds_report_${formattedBeginDate}_${formattedEndDate}.pdf`);
  }

  generateEventsPdf(eventData: Event[], beginDate: Date, endDate: Date): void {
    let formattedBeginDate = new Date(beginDate).toLocaleDateString();
    let formattedEndDate = new Date(endDate).toLocaleDateString();


    let documentDefinition: any;

    if (eventData.length > 0) {
      documentDefinition = {
        content: [
          { text: 'Events Report', style: 'header' },
          { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' },
          { text: `From: ${formattedBeginDate} To: ${formattedEndDate}`, style: 'subheader' },
          '\n',
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'], // Adjusted widths based on Event model fields
              body: [
                ['No.', 'Event Name', 'Event Date', 'Tickets Available', 'Tickets Sold', 'Price', 'Revenue'],
                ...eventData.map((event, index) => [
                  index + 1,
                  event.eventName,
                  new Date(event.eventDate).toLocaleDateString(),
                  event.tickets_Available,
                  event.tickets_Sold,
                  `R${event.eventPrice}`,
                  `R${event.tickets_Sold * event.eventPrice}` // Added Revenue calculation
                ])


              ]
            }

          }
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 10]
          },
          subheader: {
            fontSize: 12,
            italics: true,
            margin: [0, 5, 0, 5]
          }
        }
      };
    } else {
      documentDefinition = {
        content: [
          { text: 'Events Report', style: 'header' },
          { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' },
          { text: `From: ${formattedBeginDate} To: ${formattedEndDate}`, style: 'subheader' },
          '\n',
          {
            table: {
              headerRows: 1,
              widths: ['auto'],
              body: [
                ["There are no events between the specified dates."]
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 10]
          },
          subheader: {
            fontSize: 12,
            italics: true,
            margin: [0, 5, 0, 5]
          }
        }
      };
    }

    pdfMake.createPdf(documentDefinition).download(`events_report_${formattedBeginDate}_${formattedEndDate}.pdf`);
  }


}
