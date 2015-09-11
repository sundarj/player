var ui = {};

window.onload = function () {
    ui.main = document.querySelector('main');
    ui.select = document.getElementById('select-template').querySelector('form');
    ui.playlist = document.getElementById('playlist-template').querySelector('div');

    api.authorize().then(letsParty);
}

function elt(name) {
    if (!(this instanceof elt)) return new elt(name);
    this.node = document.createElement(name);
};

elt.prototype.attr = function (attributes, value) {
    if (value) {
        this.node.setAttribute(attributes, value);
    } else {
        for (var attrName in attributes) {
            this.node.setAttribute(attrName, attributes[attrName]);
        }
    }

    return this;
};

elt.prototype.prop = function (properties, value) {
    if (value) {
        this.node[properties] = value;
    } else {
        for (var propName in properties) {
            this.node[propName] = properties[propName];
        }
    }

    return this;
}

function letsParty(playlists) {
    var form = ui.select.cloneNode(true);
    playlists.forEach(function (playlist) {
        var snippet = playlist.snippet;

        var checkbox = elt('input').attr({
            type: 'checkbox',
            id: playlist.id,
            name: playlist.id
        }).node;
        var label = elt('label').prop({
            innerHTML: snippet.title,
            htmlFor: playlist.id
        }).node;

        form.appendChild(label).appendChild(checkbox);
    });

    form.appendChild(elt('button').attr('type', 'submit').prop('innerHTML', '&#10004;').node);
    ui.main.appendChild(form);

    form.onsubmit = function (e) {
        e.preventDefault();

        var selected = Array.from(this.querySelectorAll('input')).filter(function (check) {
            return check.checked;
        }).map(function (check) {
            return check.name;
        });

        startTheMusic(selected);
    };
};

const youtube_uri = 'https://youtube.com/v/';
const embed_uri = 'https://youtube.com/embed/';

HTMLDivElement.prototype.play = function () {
    var iframe = this.querySelector('iframe');
    iframe.src = iframe.dataset['src'] + '?autoplay=1';
    
}

function startTheMusic(ids) {
    api.items(ids).then(function (videos) {
        var container = ui.playlist.cloneNode(true);
        
        videos.forEach(function (video) {
            api.videoSnippet(video).then(function (items) {
                var videoTitle = items[0].snippet.title;
                
                var wrapper = elt('div').attr('class', 'video-item').node;
                
                var link = elt('a').attr('href', youtube_uri+video).node;
                var title = elt('h2').prop('innerHTML', videoTitle).node;
                var iframe = elt('iframe').attr('data-src', embed_uri+video).node;
                
                link.appendChild(title);

                wrapper.appendChild(link);
                wrapper.appendChild(iframe);
                
                container.appendChild(wrapper);
            });
        });

        ui.main.appendChild(container);
    });
}