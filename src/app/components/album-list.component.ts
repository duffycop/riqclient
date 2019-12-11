import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
  selector: 'album-list',
  templateUrl: '../views/album-list.html',
  providers: [UserService, ArtistService, AlbumService]
})

export class AlbumListComponent implements OnInit{
  public titulo: string;
  public artist: Artist;
  public album: Album;
  public albums: Album[];
  public identity;
  public token;
  public url: string;
  public alertMessage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _albumService: AlbumService
  ){
    this.titulo = "Todos los albumes"
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    console.log('album-list.component.ts cargado');
    this.listAlbums();
    // Llamar al metodo del api para sacar un artista en base a su id getArtist

  }

  listAlbums(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

            //Sacar los albums del artista
            this._albumService.getAlbums(this.token).subscribe(
              response => {
                if(!response.albums){
                  this.alertMessage = 'No hay albums';
                }else{
                  this.albums = response.albums;
                }
              },
              error => {
                var errorMessage = <any>error;
                if(errorMessage != null){
                  var body = JSON.parse(error._body);
                  //this.alertMessage = body.message;
                  console.log(error);
                }
              }
            );
        });

  }

  public confirmado = null;
  onDeleteConfirm(id){
    this.confirmado = id;
  }

  onCancelAlbum(){
    this.confirmado = null;
  }

  onDeleteAlbum(id){
    this._albumService.deleteAlbum(this.token, id).subscribe(
    response => {

          if(!response.album){
            alert('Error en el servidor');
          }

          this.listAlbums();
        },
        error => {
          var errorMessage = <any>error;
          if(errorMessage != null){
            var body = JSON.parse(error._body);
            //this.alertMessage = body.message;
            console.log(error);
          }
        }
    );
    this.confirmado = null;
  }

}
