import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { Inventory } from 'src/app/Model/inventory';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { Event } from 'src/app/Model/event';
import { Content } from 'pdfmake/interfaces';
import { SupplierOrder } from 'src/app/Model/supplierOrder';
import { Blacklist } from 'src/app/Model/blacklist';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  user: any;
  blacklistData: any;

  constructor(private userService: DataServiceService) {
    var tokenUser = this.userService.getUserFromToken();
    this.userService.getUser(tokenUser!.email).subscribe((result: any) => {
      this.user = result.user;
    })
  }

  generatePdf(inventoryData: Inventory[], currentDate: string): void {
    // let documentDefinition: any;

    // if (inventoryData.length > 0) {
    //   documentDefinition = {
    //     content: [
    //       { text: 'Inventory Report', style: 'header' },
    //       { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' },
    //       { text: `Date: ${currentDate}`, style: 'subheader' },
    //       '\n',
    //       {
    //         table: {
    //           headerRows: 1,
    //           widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
    //           body: [
    //             ['No.', 'Name', 'Varietal', 'Type', 'Price', 'Stock Limit', 'Quantity on Hand'],
    //             ...inventoryData.map((item, index) => [index + 1, item.wineName, item.wineVarietal, item.wineType, item.winePrice, item.stockLimit, item.quantityOnHand])
    //           ]
    //         }
    //       }
    //     ],
    //     styles: {
    //       header: {
    //         fontSize: 16,
    //         bold: true,
    //         margin: [0, 10, 0, 10]
    //       },
    //       subheader: {
    //         fontSize: 12,
    //         italics: true,
    //         margin: [0, 5, 0, 5]
    //       }
    //     }
    //   };
    // } else {
    //   documentDefinition = {
    //     content: [
    //       { text: 'Inventory Report', style: 'header' },
    //       { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' },
    //       { text: `Date: ${currentDate}`, style: 'subheader' },
    //       '\n',
    //       {
    //         table: {
    //           headerRows: 1,
    //           widths: ['auto'],
    //           body: [
    //             ["There is nothing stored in Inventory at the moment."]
    //           ]
    //         }
    //       }
    //     ],
    //     styles: {
    //       header: {
    //         fontSize: 16,
    //         bold: true,
    //         margin: [0, 10, 0, 10]
    //       },
    //       subheader: {
    //         fontSize: 12,
    //         italics: true,
    //         margin: [0, 5, 0, 5]
    //       }
    //     }
    //   };
    // }

    // pdfMake.createPdf(documentDefinition).download('inventory_report.pdf');
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
                ...refundData.map((item, index) => {
                  let status = 'Pending'; // Status for each row
                  if (item.status == 0) {
                    status = "In Progress";
                  } else if (item.status == 1) {
                    status = "Approved";
                  } else if (item.status == 2) {
                    status = "Not Approved";
                  }

                return [index, item.wineId, item.orderId, item.orderRefNum, item.requestedOn, item.description, item.email, status];
                })
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

  generateSupplierOrdersPdf(supplierOrderData: SupplierOrder[]): void {
    console.log(supplierOrderData);
  
    let generatedDate = Date.now();
  
    let content: any[] = [
      { text: 'Supplier Order Report', style: 'header' },
      { text: `Generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' },
      { text: `Generated On: ${new Date(generatedDate).toLocaleDateString()}`, style: 'subheader' },
      { text: '', style: 'spaceStyle' },
      { text: '', style: 'spaceStyle' }
    ];
  
    supplierOrderData.forEach((order, index) => {
      let status = "Pending";
      let statusStyle = 'statusPending'; // default style

      if (order.received) {
        status = "Received";
        statusStyle = 'statusReceived';
      } else if (order.paid) {
        status = "Paid";
        statusStyle = 'statusPaid';
      } else if (order.ordered) {
        status = "Ordered";
        statusStyle = 'statusOrdered';
      }
  
      const vat = (order.orderTotal ?? 0) * 0.15;
      const totalWithVat = (order.orderTotal ?? 0) + vat;
  
      content.push(
        { text: `Supplier Order # ${index + 1}`, style: 'orderTitle' },
        { text: `Order Date: ${order.dateOrdered}`, style: 'orderDetail' },
        { text: `Status: ${status}`, style: [ 'orderDetail', statusStyle ] },
        {
          table: {
            headerRows: 1,
            widths: ['10%', '20%', '30%', '20%', '20%'],
            body: [
              ['#', 'SupplierID', 'WineName', 'Quantity Ordered', 'Sub-total'],
              [index + 1, order.supplierID, order.wineName, order.quantity_Ordered, "R " + (order.orderTotal ?? 0).toFixed(2)],
              [{}, {}, {}, 'VAT (15%)', `R ${vat.toFixed(2)}`],
              [{}, {}, {}, 'TOTAL', `R ${totalWithVat.toFixed(2)}`]
            ]
          }
        },
        { text: '*********** Order finished ***********', style: 'orderSeparator' },
        { text: '', style: 'spaceStyle' }
      );
    });
  
    content.push({ text: '*********** Report End ***********', style: 'reportEnd' });
  
    type Alignment = 'left' | 'right' | 'center' | 'justify';

    const documentDefinition = {
      content: content,
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 10, 0] as [number, number, number, number] // top, right, bottom, left
        },
        subheader: {
          fontSize: 12,
          margin: [0, 0, 6, 0] as [number, number, number, number],
          alignment: 'left' as Alignment
        },
        orderTitle: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 10, 0] as [number, number, number, number]
        },
        orderDetail: {
          fontSize: 12,
          margin: [0, 0, 6, 0] as [number, number, number, number]
        },
        orderSeparator: {
          margin: [0, 0, 10, 0] as [number, number, number, number],
          alignment: 'center' as Alignment
        },
        reportEnd: {
          margin: [0, 0, 10, 0] as [number, number, number, number],
          alignment: 'center' as Alignment,
          bold: true
        },
        spaceStyle: {
            margin: [0, 20, 0, 0] as [number, number, number, number]
        },
        statusPending: {
          background: 'lightgray'
        },
        statusOrdered: {
          background: 'red',
          color: 'white' // changing the text color to white for better visibility against the red background
        },
        statusPaid: {
          background: 'blue',
          color: 'white' 
        },
        statusReceived: {
          background: 'green',
          color: 'white' 
        }
      },
      
      pageOrientation: 'portrait' as const
    };
  
    pdfMake.createPdf(documentDefinition).download(`supplier_order_report_${generatedDate}.pdf`);
  }

  generateBlacklistPdf(blacklistData: Blacklist[], currentDate: string): void {
    let documentDefinition: any;

    if (blacklistData.length > 0) {
      documentDefinition = {
        content: [
          { text: 'Blacklist Report', style: 'header' },
          { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' },
          { text: `Date: ${currentDate}`, style: 'subheader' },
          
          '\n',
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto'],
              body: [
                ['No.', 'Email', 'Reason'],
                ...blacklistData.map((entry, index) => [

                  index + 1,
                  entry.email,
                  entry.reason,
                ]),
              ],
            },
          },
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 10],
          },
        },
      };
    } else {
      documentDefinition = {
        content: [
          { text: 'Blacklist Report', style: 'header' },
          {
            table: {
              headerRows: 1,
              widths: ['auto'],
              body: [['No blacklist entries found.']],
            },
          },
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 10],
          },
        },
      };
    }

    pdfMake.createPdf(documentDefinition).download(`blacklist_report.pdf`);
  }
}
