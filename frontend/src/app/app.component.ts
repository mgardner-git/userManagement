import { Component, OnInit, NgZone } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {FormsModule} from '@angular/forms';

import gql from 'graphql-tag';
import { GroupsService } from './groups.service';

interface UsersQueryResponse {
  users: {
    id: string;
    username: string;
  }[];
}

export interface Group {
  id: number;
  name: string;
}

interface User {
  id: string;
  username: string;
  groups: Group[];
}




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private apollo: Apollo,
              private groupService: GroupsService,
              private zone: NgZone) {
      groupService.getGroups();

  }


  availableUsers: User[] = [];

  selectedUser: User|null = this.availableUsers[0];

  groups: Group[] = [];

  selectedGroup: Group | null = this.groups[0];

  assignedUsers: User[] = [
    {
      id : '3',
      username: 'Danny'
    }
  ];
  selectedGUser: User|null = this.assignedUsers[0];

  addUser($event: Event) {
    if (this.selectedUser) {
      this.assignedUsers.push(this.selectedUser);
      const removeIndex: number = this.availableUsers.indexOf(this.selectedUser);
      this.availableUsers.splice(removeIndex, 1);
      this.selectedUser = null;
    }
  }

  removeUser($event: Event) {
    if (this.selectedGUser) {
      this.availableUsers.push(this.selectedGUser);
      const removeIndex: number = this.assignedUsers.indexOf(this.selectedGUser);
      this.assignedUsers.splice(removeIndex, 1);
      this.selectedGUser = null;
    }
  }

  loadGroups() {
    
    this.groupService.getGroups()
      .subscribe((data) => {    
          // https://stackoverflow.com/questions/36919399/angular-2-view-not-updating-after-model-changes
          this.zone.run(() => { // <== added
            // note that the return type indicated by the call to httpClient.get in groups.service.ts is Group[],
            // as is the type of this.groups
            this.groups = data;
          });
      });


  }

  ngOnInit(): void {
    this.apollo.watchQuery<UsersQueryResponse>({
      query: gql`
        {
          users {
            id
            username
          }
        }
      `
    })
    .valueChanges
    .subscribe(result => {
      console.log('GraphQL Query Result', result);
    });

    this.loadGroups();
  }
}
