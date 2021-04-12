import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Group} from 'src/app/app.component';


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

}
