"use strict";

(function (self, document) {

    var api = self.api = {};
    
    if (self.location.hash === '#!') {
        return self.location = self.location.href.slice(0,-2);
    }

    const root_uri = 'https://accounts.google.com/o/oauth2/auth';
    const client_id = '263620315741-c4t4ngtiikfff7cfkth34mgedhgv0c6k.apps.googleusercontent.com';
    const redirect_uri = self.location.href;
    const response_type = 'token';
    const scope = 'https://www.googleapis.com/auth/youtube.readonly';

    function authenticate() {
        self.location = `${root_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`
    };

    const oauth_uri = 'https://www.googleapis.com/oauth2/v1/tokeninfo';

    var access_token = self.location.hash.slice('#access_token='.length);
    access_token = ~access_token.indexOf("&") ? access_token.split("&")[0] : access_token;


    if (!access_token)
        authenticate();
    else
        self.location.hash = '!';


    function jsonify(res) { return res.json() };
    function itemize(res) { return res.items }

    const playlist_uri = 'https://www.googleapis.com/youtube/v3/playlists';
    const snippet_args = '?part=snippet&mine=true&fields=items(id, snippet/title)';

    api.authorize = function () {
        return fetch(`${oauth_uri}?access_token=${access_token}`)
            .then(jsonify)
            .then(function (res) {
                if (res.error)
                    throw res.error;
            }).then(request);
    };

    const authHead = {
        headers: new Headers()
    };
    authHead.headers.set('Authorization', `Bearer ${access_token}`);

    function request() {
        return fetch(playlist_uri + snippet_args, authHead)
            .then(jsonify)
            .then(itemize);
    };

    const playlist_items_uri = 'https://www.googleapis.com/youtube/v3/playlistItems?';
    const playlist_items_args = 'part=contentDetails&fields=nextPageToken,items(contentDetails/videoId)&maxResults=50';

    function getPlaylistItems(id, pageToken) {
        var uri = `${playlist_items_uri + playlist_items_args}&playlistId=${id}`;
        if (pageToken) uri += `&pageToken=${pageToken}`;

        return fetch(uri, authHead)
            .then(jsonify)
            .then(function (videos) {
                return videos;
            });
    }
    
    const flatten = api.flatten = function(array) {
        return array.reduce(function (i, j) {
            if (Array.isArray(j))
                j = flatten(j);

            return i.concat(j);
        }, []);
    };
    
    function getAllItems(id, pageToken) {
        var items = [];
        
        return getPlaylistItems(id, pageToken)
            .then(function (res) {
                items.push(flatten(res.items));
                if (res.nextPageToken)
                    items.push(getAllItems(id, res.nextPageToken));
                return Promise.all(items);
            });
    }

    api.items = function (ids) {
        
        return Promise.all(ids.map(function (id) {
            return getAllItems(id);
        })).then(function (items) {
            items = flatten(items).map(function (item) {
                return item.contentDetails.videoId
            });
            return items;
        });
    }
    
    const video_uri = 'https://www.googleapis.com/youtube/v3/videos';
    const video_args = '?part=snippet&fields=items(snippet/title)';
    
    api.videoInfo = function (ids) {
        return fetch(`${video_uri + video_args}&id=${escape(ids.toString())}`, authHead)
            .then(jsonify)
            .then(itemize)
        
    }

})(this, this.document);