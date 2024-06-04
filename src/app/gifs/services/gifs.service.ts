import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';


@Injectable({
  providedIn: 'root'
})
export class GifsService {
  public gifList:Gif[]=[];
  private _tagsHistory: string[]=[];
  private apiKey:string="LpHZXuusEh84PLZxiWzxxKZdyAWStfpc";
  private serviceUrl:string = "https://api.giphy.com/v1/gifs";
  constructor( private http: HttpClient) {

this.readLocalStorage();

   }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  private organizeHistory(tag:string):void{
    tag=tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter( (oldTag=> oldTag !== tag ) )
    }

    this._tagsHistory.unshift(tag);


    if(this._tagsHistory.length > 10){
      this._tagsHistory.pop();
    };

    // if(tag === "nier" || "a2" || "2b" || "saber" || "ranni" || "elden ring" || "malenia"){
    //   alert("Oscar, eres un perro, deja de buscar eso");
    // }

    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem("history", JSON.stringify(this._tagsHistory));

  }

  private readLocalStorage():void{
    if(!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem("history")! );
    if(this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  searchTag(tag:string):void{
    if(tag.length === 0 ) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', tag)
      .set('limit', 10)


    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
    .subscribe( (resp) => {
      this.gifList = resp.data;
    })
  }
}
