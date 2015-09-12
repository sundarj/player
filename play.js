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

const youtube_uri = 'https://youtube.com/v/';
const embed_uri = 'https://youtube.com/embed/';

function parseDuration(duration) {
    duration = duration.replace('PT', '').split(/[HMS]/g).filter(function (i) { return !!i });
    var hours = 0, minutes = 0, seconds = 0;
    
    switch (duration.length) {
        case 1:
            seconds = +duration[0];
            break;
        case 2:
            seconds = +duration[1];
            minutes = +duration[0];
            break;
        case 3:
            seconds = +duration[2];
            minutes = +duration[1];
            hours = +duration[0];
            break;
        default:
            break;
    }
    
    seconds *= 1000;
    minutes *= 60 * 1000;
    hours *= 60 * 60 * 1000;
    
    return seconds + minutes + hours;
};

var lastTimeout;

function reveal(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    document.querySelector('.is-playing').querySelector('iframe').classList.toggle('revealed');
}

HTMLDivElement.prototype.play = function (durations, index) {
    var playing = document.querySelector('.is-playing');
    playing && playing.stop();
    
    var iframe = this.querySelector('iframe');
    iframe.src = iframe.dataset['src'] + '?autoplay=1';
    this.classList.add('is-playing');
    
    var title = this.querySelector('h2');
    document.title = title.textContent;
    var arrow = elt('span').prop('innerHTML', '▾').node;
    arrow.onclick = reveal;
    title.appendChild(arrow);
    
    var self = this;
    
    lastTimeout = setTimeout(function () {
        self.nextElementSibling.play(durations, index + 1);
    }, parseDuration(durations[index]));
};

HTMLDivElement.prototype.stop = function () {
    this.classList.remove('is-playing');
    this.querySelector('iframe').removeAttribute('src');
    this.querySelector('span').innerHTML = '';
    
    if (lastTimeout)
        clearTimeout(lastTimeout);
}

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

function chunk(array, csize) {
    var len = array.length,out = [], i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / csize--);
        out.push(array.slice(i, i += size));
    }
    return out;
}

function grouped(array, size) {
    return array.map(function (item, index) {
        return index % size === 0 ? array.slice(index, index + size) : null;
    }).filter(function (item) {
        return !!item;
    });
}

function startTheMusic(ids) {
    var container = ui.main; //ui.playlist.cloneNode(true);
    
    api.items(ids).then(function (videoIDs) {

        videoIDs = shuffle(videoIDs);

        videoIDs.forEach(function (id) {
            var wrapper = elt('div').attr('class', 'video-item').node;
            var link = elt('a').attr('href', youtube_uri + id).node;
            var iframe = elt('iframe').attr('data-src', embed_uri + id).node;

            wrapper.appendChild(link);
            wrapper.appendChild(iframe);
            container.appendChild(wrapper);
        });

        var groups = grouped(videoIDs, 50);
        return Promise.all(groups.map(api.videoInfo));
    }).then(function (videos) {
        videos = api.flatten(videos);
        
        var titles = [], durations = [];
        videos.filter(function (video) {
            return video.contentDetails;
        }).forEach(function (video) {
            titles.push(video.snippet.title);
            durations.push(video.contentDetails.duration);
        });
        
        var wrappers = container.querySelectorAll('a');
        titles.forEach(function (title, index) {
            var videoTitle = elt('h2').prop('innerHTML', title).node;
            wrappers[index].appendChild(videoTitle);
        });
        
        //ui.main.appendChild(container);
        container.querySelector('div').play(durations, 0);
        document.querySelector('form').classList.remove('loading');
        
        window.addEventListener('click', function (evt) {
            var self = evt.target;
            if (self.nodeName === 'H2') {
                if (~[0, 1].indexOf(evt.button)) {
                    evt.preventDefault();
                    evt.stopPropagation();

                    if (evt.button === 0) {
                        var parent = self.parentNode.parentNode;
                        parent.play(durations, Array.from(ui.main.children).indexOf(parent));
                    } else if (evt.button === 1) {
                        window.open(self.parentNode.href, '_blank');
                    }
                }

            }
        }, true);
        
    });
}