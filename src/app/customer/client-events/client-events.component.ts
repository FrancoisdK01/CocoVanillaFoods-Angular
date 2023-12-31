import { Component, TemplateRef, ViewChild } from '@angular/core';
import { EarlyBirdService } from 'src/app/admin/services/earlybird.service';
import { EventService } from 'src/app/admin/services/event.service';
import { EarlyBird } from 'src/app/Model/earlybird';
import { Event } from 'src/app/Model/event';
import { PaymentService } from '../services/payment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DataServiceService } from '../services/data-service.service';
import { TicketPurchase } from 'src/app/Model/TicketPurchase';
import { BlacklistService } from 'src/app/admin/services/blacklist.service';
import { TicketPurchaseDto } from 'src/app/Model/TicketPurchaseDTO';

@Component({
  selector: 'app-client-events',
  templateUrl: './client-events.component.html',
  styleUrls: ['./client-events.component.css']
})

export class ClientEventsComponent {

  events: Event[] = [];
  earlyBirds: EarlyBird[] = [];
  purchasedEvents: string[] = [];
  displayableEvents: Event[] = [];
  searchEventTerm: string = '';

  @ViewChild('noEventsMessage', { static: true }) noEventsMessage!: TemplateRef<any>;

  constructor(private eventService: EventService, private earlyBirdService: EarlyBirdService, private paymentService: PaymentService, private toastr: ToastrService, private loginService: DataServiceService, private blacklistService: BlacklistService) { }

  get filteredEvents(): Event[] {
    if (!this.searchEventTerm) {
      return this.displayableEvents;
    }
  
    const term = this.searchEventTerm.toLowerCase();
    
    return this.displayableEvents.filter(event => {
      const nameMatch = event.name.toLowerCase().includes(term);
      const priceMatch = event.price.toString().includes(term);
      const dateMatch = new Date(event.eventDate).toLocaleDateString().toLowerCase().includes(term);
  
      return nameMatch || priceMatch || dateMatch;
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.loadEventData();
      await this.loadEarlyBirdData();

      // Check if the user is logged in
      if (this.loginService.userValue?.email) {
        this.purchasedEvents = (await this.paymentService.getUserPurchases(this.loginService.userValue.email).toPromise()) ?? [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async loadEventData(): Promise<void> {
    try {
      this.events = await this.eventService.getEvents();
      this.displayableEvents = this.events.filter(event => event.displayItem);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      this.events = [];
      this.displayableEvents = [];
    }
  }
  
  getEarlyBirdDiscount(event: Event): number {
    return event.earlyBird?.percentage ?? 0;
  }




  isPurchased(eventId: string): boolean {
    return this.purchasedEvents.includes(eventId);
  }

  formatDate(eventDate: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return eventDate.toLocaleDateString('en-US', options);
  }

  async loadEarlyBirdData(): Promise<void> {
    this.earlyBirds = await this.earlyBirdService.getEarlyBirds();

    // associate Early Bird data with Event data
    this.events.forEach(event => {
      event.earlyBird = this.earlyBirds.find(earlyBird => earlyBird.earlyBirdID === event.earlyBirdID) || new EarlyBird();
    });
  }



  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  async onBuyTicket(event: Event) {
    // Get current user
    const isUserLoggedIn = this.loginService.isUserLoggedIn();

    // If there is no user, show toastr notification and return
    if (!isUserLoggedIn) {
      this.toastr.warning('Please log in to purchase a ticket.', 'Warning');
      return;
    }

    // Check ticket availability and calculate the price
    try {
      const purchaseResponse = await this.eventService.purchaseTicket(event.eventID);
      if (!purchaseResponse.success) {
        this.toastr.error(purchaseResponse.message, 'Purchase');
        return;
      }

      // If Early Bird exists and conditions are met, apply discount
      if (event.earlyBird
        && typeof event.earlyBird.limit !== 'undefined'
        && event.tickets_Sold < event.earlyBird.limit
        && typeof event.earlyBird.percentage !== 'undefined') {

        // Apply early bird discount
        event.price = purchaseResponse.price * (1 - event.earlyBird.percentage / 100);
        // Add Toastr notification for early bird discount
        this.toastr.success(`Congrats! You qualify for an EarlyBird discount of ${event.earlyBird.percentage}%`, 'Discount');
      } else {
        // Regular price
        event.price = purchaseResponse.price;
      }
    } catch (error) {
      console.error(error);
      this.toastr.error('An error occurred, please try again.', 'Purchase');
      return;
    }

    // // Start the payment process with the final price
    // const ticketPurchase: TicketPurchase = {
    //   userEmail: this.loginService.userValue?.email ?? '',
    //   eventId: event.eventID,
    //   eventDate: event.eventDate,
    //   purchaseDate: new Date(),
    //   ticketPrice: event.price,
    //   eventName: event.name,
    //   description: event.description,
    //   ticketPurchasedStatus: {  // Nested TicketPurchasedStatus object
    //     eventDeleted: false,
    //     isScanned: false,
    //     scannedAt: null,
    //     scanningToken: ""
    //   }
    // };

    // console.log("Ticket Purchase Payload:", ticketPurchase);

             

    this.paymentService.initiatePayment(event).subscribe(
      (payfastRequest: any) => {
        // Create a form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://sandbox.payfast.co.za/eng/process';
        form.target = '_self';

        // Add the form fields
        for (const key in payfastRequest) {
          if (payfastRequest.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = payfastRequest[key];
            form.appendChild(hiddenField);
          }
        }

        // Add the form to the page and submit it
        document.body.appendChild(form);
        form.submit();

      },
      (error: HttpErrorResponse) => {
        // It's better to handle "User is not logged in" error in payment service
        // But if for some reason it comes here, then show toastr notification as well
        if (error.error === 'User is not logged in') {
          this.toastr.warning('Please log in to purchase a ticket.', 'Warning');
          console.error('User is not logged in');
        } else {
          console.error(error);
        }
      }
    );
  }
  
    
        saveTicketPurchase(event: Event) {
      const ticketPurchaseDto: TicketPurchaseDto = {
        UserEmail: this.loginService.userValue?.email ?? '',
        EventId: event.eventID
      };

      console.log(ticketPurchaseDto)
      
      // Assuming saveTicketPurchaseDto exists in your service
      this.paymentService.saveTicketPurchaseDto(ticketPurchaseDto).subscribe(
        (response) => {
          console.log(response);
          this.toastr.success('You will be redirected shortly', 'Redirecting...');
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.toastr.error(error.error.message, 'Purchase');
        }
      );
    }
    




  async purchaseTicket(eventID: number): Promise<void> {
    try {
      const response = await this.eventService.purchaseTicket(eventID);
      if (response.success) {
        this.toastr.success('Ticket purchased successfully.', 'Purchase');
      } else {
        this.toastr.error(response.message, 'Purchase');
      }
    } catch (error) {
      console.error(error);
      this.toastr.error('An error occurred, please try again.', 'Purchase');
    }
  }


  async handleTicketPurchase(event: Event) {
    const isUserLoggedIn = this.loginService.isUserLoggedIn();

    // If there is no user, show toastr notification and return
    if (!isUserLoggedIn) {
      this.toastr.warning('Please log in to purchase a ticket.', 'Warning');
      return;
    }

    const userEmail = this.loginService.userValue?.email ?? '';

    // Check if user is on the blacklist
    const isBlacklisted = await this.blacklistService.checkBlacklist(userEmail);
    if (isBlacklisted) {
      this.toastr.error('You are on the Blacklist and cannot attend events.', 'Purchase');
      return;
    }

    try {
      await this.onBuyTicket(event);  // Buying ticket process
     
      this.toastr.info('Redirecting URL...', 'Purchasing ticket');
      return this.saveTicketPurchase(event);

    } catch (error: unknown) {
      console.error(error);
      const e = error as { error: { message: string } };
      if (e.error && e.error.message === 'Email not sent.') {
        this.toastr.warning('Ticket Email could not be sent', 'Purchase');
        console.log('Ticket Email could not be sent');
      } else {
        this.toastr.error('An error occurred, please try again.', 'Purchase');
      }
      return;
    }
  }    


}
function Guid(): string {
  throw new Error('Function not implemented.');
}

