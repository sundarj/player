var ui = {};

window.onload = function () {
    ui.main = document.querySelector('main');
    ui.select = document.getElementById('select-template').querySelector('form');
    ui.playlist = document.getElementById('playlist-template').querySelector('div');
    ui.header = document.querySelector('.page-head');
    
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
    var previousSelection = JSON.parse(localStorage['player.previousSelection']);
    
    playlists.forEach(function (playlist) {
        var snippet = playlist.snippet;

        var checkbox = elt('input').attr({
            type: 'checkbox',
            id: playlist.id,
            name: playlist.id
        }).prop('checked', ~previousSelection.indexOf(playlist.id)).node;
        var label = elt('label').prop({
            innerHTML: `<span>${snippet.title}</span>`,
            htmlFor: playlist.id
        }).node;

        form.appendChild(label).appendChild(checkbox);
    });

    form.appendChild(elt('button')
        .attr('type', 'submit')
        .prop('innerHTML', '&#9658;').node);
    ui.header.appendChild(form);

    form.onsubmit = function (e) {
        e.preventDefault();
        
        this.querySelector('button').disabled = true;
        this.classList.add('loading');
    

        var selected = Array.from(this.querySelectorAll('input')).filter(function (check) {
            return check.checked;
        }).map(function (check) {
            return check.name;
        });
        
        localStorage['player.previousSelection'] = JSON.stringify(selected);

        startTheMusic(selected);
    };
};

const youtube_uri = 'https://youtube.com/watch?v=';
const embed_uri = 'https://youtube.com/embed/';

function shuffle(array) {
    var counter = array.length, temp, index;

    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
};

function grouped(array, size) {
    return array.map(function (item, index) {
        return index % size === 0 ? array.slice(index, index + size) : null;
    }).filter(function (item) {
        return !!item;
    });
}

var player;

function ytStateChange(evt, next) {
    if (evt.data !== YT.PlayerState.ENDED)
        return

    var playing = document.querySelector('.is-playing');

    playing.querySelector('span').remove();

    playing.querySelector('.video-wrapper')
        .classList.remove('revealed');

    next = next || document.querySelector('.is-playing')
    .nextElementSibling;

    var wrapper = next.querySelector('.video-wrapper');
    var iframe = document.getElementById('player');
    wrapper.appendChild(iframe);
    
    iframe.src = iframe.src.replace(
        playing.querySelector('.video-wrapper').dataset.id,
        wrapper.dataset.id);

    player = new YT.Player('player', {
        events: {
            onReady: ytReady,
            onStateChange: ytStateChange
        }
    });
};

function revealPlayer(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    document.querySelector('.is-playing')
        .querySelector('.video-wrapper')
        .classList.toggle('revealed');
}

function ytReady(evt) {
    var playing = document.querySelector('.is-playing');
    playing && playing.classList.remove('is-playing');
    
    var item = evt.target.f.parentNode.parentNode;
    item.classList.add('is-playing');
    
    var title = item.querySelector('h2');
    document.title = title.textContent;
    var arrow = elt('span').prop('innerHTML', '▾').node;
    arrow.onclick = revealPlayer;
    title.appendChild(arrow);
    
    evt.target.playVideo();
    
}

function startTheMusic(ids) {
    var container = ui.main; //ui.playlist.cloneNode(true);
    
    api.items(ids).then(function (videoIDs) {

        videoIDs = shuffle(videoIDs);

        videoIDs.forEach(function (id) {
            var wrapper = elt('div').attr('class', 'video-item').node;
            var link = elt('a').attr('href', youtube_uri + id).node;
            
            var videoWrap = elt('div').attr({
                'class': 'video-wrapper',
                'data-id': id
            }).node;

            wrapper.appendChild(link);
            wrapper.appendChild(videoWrap);
            container.appendChild(wrapper);
        });

        var groups = grouped(videoIDs, 50);
        return Promise.all(groups.map(api.videoInfo));
    }).then(function (videos) {
        videos = api.flatten(videos);
        
        var titles = [];
        videos.filter(function (video) {
            return video.snippet;
        }).forEach(function (video) {
            titles.push(video.snippet.title);
        });
        
        var wrappers = container.querySelectorAll('a');
        titles.forEach(function (title, index) {
            var videoTitle = elt('h2').prop('innerHTML', title).node;
            wrappers[index].appendChild(videoTitle);
        });
        
        //ui.main.appendChild(container);
        
        var wrapper = document.querySelector('.video-wrapper');
        wrapper.appendChild(document.getElementById('player'));
        
        player = new YT.Player('player', {
            videoId: wrapper.dataset['id'],
            events: {
                onReady: ytReady,
                onStateChange: ytStateChange
            }
        });
        
        document.querySelector('form').classList.remove('loading');
        
        window.addEventListener('click', function (evt) {
            if (evt.target.parentNode.parentNode == document.querySelector('is-playing'))
                return;
            
            var self = evt.target;
            if (self.nodeName === 'H2') {
                if (~[0, 1].indexOf(evt.button)) {
                    evt.preventDefault();
                    evt.stopPropagation();

                    if (evt.button === 0) {
                        ytStateChange({ data: YT.PlayerState.ENDED }, self.parentNode.parentNode);
                    } else if (evt.button === 1) {
                        window.open(self.parentNode.href, '_blank');
                    }
                }

            }
        }, true);
        
    });
}