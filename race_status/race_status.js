const timeRaceFormat = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: 'numeric'
}).format;

relativeTimeFormat = (mseconds) => `${mseconds < 0 ? '-' : ''}${new Date(Math.abs(mseconds)).toLocaleTimeString('en-GB', {
    timeZone: 'UTC',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
})}`;


class Race {
    #status = 'expecting';
    constructor(data) {
        this.sc = data.sc;
        console.debug(`New race ${data.sc}`);
        this.lastSeen = { api: new Date(), stream: new Date() };
        this.P = false;
        this.start = new Date(data.date_formatted);
        this.$container = $('<li>').addClass('race').attr('sc', data.sc).data('time', this.start);
        this.$time = $('<div>').addClass('time').text(timeRaceFormat(this.start));
        this.$name = $('<div>').addClass('name').text(`${data.venue} - ${data.distance.replace(/(^|\s)0[mfy]/g, '')}${data.obstacle == 'Flat' ? ' - Flat' : ''}`);
        this.$country = $('<div>').addClass(`country fi fi-${data.country.toLowerCase()}`).attr('title', data.country);
        this.$progress = $('<div>').addClass('progress').text('');
        this.$status = $('<div>').addClass('status').text(this.status);
        this.$container.append(this.$time, this.$country, this.$name, this.$progress, this.$status);
        this.update(data);
    }

    get status() { return this.#status }
    set status(val) {
        if (this.#status != val) {
            this.#status = val;
            console.log(`Race ${this.sc} status ${this.#status}`)
        }
    }

    delete() {
        console.log(`Deleting race ${this.sc}`);
        this.$container.removeClass('appearing').addClass('deleting');
        window.setTimeout((() => {
            this.$container.remove();
        }), 1000)
    }

    update(d) {
        if (Object.hasOwn(d, 'sc_estimated') && (this.status == 'expecting' || ((new Date()).getTime() - this.lastSeen.stream.getTime() > 5000))) {
            this.lastSeen.api = new Date();
            if ((new Date()).getTime() - this.start?.getTime() > 60 * 1000) {
                this.status = 'finished';
            } else if (d.sc_estimated == 0) {
                this.status = 'waiting';
            } else if (d.r1_mtp && d.r1_mtp < 30) {
                this.status = 'canceled';
            }
        }

        if (Object.hasOwn(d, 'R')) {
            this.lastSeen.stream = new Date();
            let perc = 0;//Math.round(Math.random() * 100);
            let text = '';
            if (!this.P) {
                this.P = d.P;
            }
            if ((d.P != false && d.P == 0) || d.RS == 'RF') {
                this.status = 'finished';
            } else if (d.R > 0 || d.RS == 'IP') {
                this.status = 'running';
                perc = Math.round(100 - 100 * (d.P / this.P));
                text = relativeTimeFormat(d.R * 1000);
            } else if (d.LD != false) {
                this.status = 'loading';
                perc = parseInt(d.LD);
                text = `${perc}%`;
            } else {
                this.status = 'live';
                text = relativeTimeFormat(this.start?.getTime() - (new Date()).getTime());
            }
            this.$progress.text(text).css('--perc', `${perc}%`);
        }
        this.$container.attr('status', this.status);
        this.$status.text(this.status);
    }
}

class RacesStatus {
    static API_URL = "/json-rpc/v2";
    static DEBUG = window.location.host.match(/stg/);
    static WS_URL = `wss://stream.tpd.zone/streaming_server`;
    static WS_ZONE = 'zone_1_4';
    static VERSION = `2024.04.18${RacesStatus.DEBUG ? '-dev' : ''}`;
    races = {};

    constructor($o) {
        console.log(`Races Status v.${RacesStatus.VERSION}`);
        this.$container = $('<ul>').attr('id', 'races');
        $o.append(this.$container);
        this.update();
        this.interval = window.setInterval(this.update.bind(this), 60 * 1000);
        this.startWS();
    }

    startWS() {
        console.log('Connecting to WS');
        if (!this.ws) {
            this.ws = new WebSocket(RacesStatus.WS_URL);
            this.ws.onopen = (event) => {
                console.log('Connected to WS');
                this.ws.send(JSON.stringify([RacesStatus.WS_ZONE]));
            }
            this.ws.onclose = (event) => {
                console.log('WS closed');
                this.ws = null
                setTimeout(() => {
                    this.startWS();
                }, 3000);
            }
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data) ?? { [RacesStatus.WS_ZONE]: {} };
                $.each(data[RacesStatus.WS_ZONE], (sc, d) => {
                    const race = this.races[sc];
                    if (race) {
                        race.update(d);
                    }
                })
            }
        }
    }

    sortRaces() {
        this.$container.append(Object.values(this.races).sort((a, b) => +a.$container.data('time').getTime() - b.$container.data('time').getTime()).map(i => i.$container));
    }

    delete(r) {
        r.delete();
        delete this.races[r.sc];
    }

    async update() {
        try {
            const response = await fetch(`${RacesStatus.API_URL}/status/?date=true`);
            if (response.status == 200) {
                const data = await response.json();
                console.log(`Got ${data.races?.length} races`);
                (data?.races ?? []).forEach(i => {
                    if (!this.races[i.sc]) {
                        const race = new Race(i);
                        this.races[i.sc] = race;
                        if (race.status != 'finished') {
                            this.$container.append(race.$container);
                        }
                    }
                    this.races[i.sc].update(i);
                });
                const now = new Date().getTime();
                Object.values(this.races).forEach(r => {
                    if (r.status == 'finished' || now - r.lastSeen.api.getTime() > 60 * 1000) {
                        //this.delete(r);
                    }
                })
                this.sortRaces();
            } else {
                console.error(response.statusText);
            }
        } catch (err) {
            console.error(err.message);
        }
    }
}