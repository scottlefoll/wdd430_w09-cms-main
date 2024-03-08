import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ContactService } from '../contact.service';
import { Contact } from '../contact.model';
@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})

export class ContactDetailComponent {
  contact: Contact;
  id: string;

  constructor(private contactService: ContactService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.contact = this.contactService.getContact(this.id);
        }
      );
  }

  onCreate() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onUpdate() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDelete() {
    if (confirm('Are you sure you want to delete the contact for ' + this.contact.name +
      '? All messages associated with this contact will be deleted as well.')) {
      this.contactService.deleteContact(this.contact);
      this.router.navigate(['/contacts']);
    } else {;
      return;
    }
  }

}
