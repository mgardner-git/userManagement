import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Group} from 'src/app/app.component';
import {User} from 'src/app/app.component';


@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private http: HttpClient) {}
  // TODO: Configure this via environment files or something
  url = 'http://localhost:8081';
  getGroups() {

    return this.http.get<Group[]>(`${this.url}/api/groups`);
  }

  getUsersNotInGroup(groupId: number) {
    return this.http.get<User[]>(this.url + '/api/usersNotInGroup?groupId=' + groupId);
  }

  getUsersInGroup(groupId: number) {
    return this.http.get<User[]>(this.url + '/api/usersInGroup?groupId=' +  groupId);
  }
  removeUserFromGroup(userId: string, groupId: number) {
    return this.http.put<string>(this.url + '/api/removeUserFromGroup?groupId=' + groupId + '&userId=' + userId, {});
  }
  addUserToGroup(userId: string, groupId: number) {
    return this.http.put<string>(this.url + '/api/addUserToGroup?groupId=' + groupId + '&userId=' + userId, {});
  }
}
