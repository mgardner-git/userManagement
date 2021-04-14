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

export interface User {
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

  selectedGroup: Group | null = null;

  assignedUsers: User[] = [];
  selectedGUser: User|null = null;

  selectGroup($event: Event) {
      this.updateUsersFromSelectedGroup();

  }

  updateUsersFromSelectedGroup() {
    if (this.selectedGroup != null) {
      this.groupService.getUsersNotInGroup(this.selectedGroup.id)
          .subscribe((outUsers) => {
              if (this.selectedGroup != null) {
                console.log("B");
                this.groupService.getUsersInGroup(this.selectedGroup.id)
                .subscribe((inUsers) => {
                    this.zone.run(() => {
                        this.availableUsers = outUsers;
                        this.assignedUsers = inUsers;
                    });
                });
              }
          });
    } else {
      throw new Error('Error no selected group');
    }
  }

  addUser($event: Event) {
    if (this.selectedUser && this.selectedGroup) {
      this.groupService.addUserToGroup(this.selectedUser.id, this.selectedGroup.id)
      .subscribe((data) => {
          // don't need to do anything with the response, but we do need to update the user lists
          this.updateUsersFromSelectedGroup();
      });
    } else {
      throw new Error('Error no selected user or no selected group');
    }
  }

  removeUser($event: Event) {
    if (this.selectedGUser && this.selectedGroup) {
      this.groupService.removeUserFromGroup(this.selectedGUser.id, this.selectedGroup.id)
      .subscribe((data) => {
          // don't need to do anything with the response, but we do need to update the user lists
          this.updateUsersFromSelectedGroup();
      });
    } else {
      throw new Error('Error no selected user or no selected group');
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
    /*
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
    */
    this.loadGroups();
  }
}
